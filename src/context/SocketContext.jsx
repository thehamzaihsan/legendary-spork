import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

// Create a safer version of the Peer constructor that handles bundling issues
function createSafePeer(options) {
  try {
    return new Peer(options);
  } catch (error) {
    console.error('❌ [PEER] Error creating peer:', error);

    // Better error handling for production
    if (error.message.includes('call') || error.message.includes('undefined')) {
      console.warn('⚠️ [PEER] Detected common production error with simple-peer');

      // Try alternative approaches
      try {
        // Try using the global window.SimplePeer if available (from CDN as fallback)
        if (window.SimplePeer) {
          console.log('🔄 [PEER] Using global SimplePeer');
          return new window.SimplePeer(options);
        }
        // Throw with more helpful message
        throw new Error('Failed to create WebRTC peer connection. SimplePeer not available.');
      } catch (fallbackError) {
        console.error('❌ [PEER] All fallback methods failed:', fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
}

// Helper to create a black video stream if camera is not available
function createBlackVideoStream(width = 1280, height = 720) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  // 15 FPS is a reasonable default
  const stream = canvas.captureStream(15);
  return stream;
}

// Get ICE servers configuration using environment variables and API
async function getIceServers() {
  try {
    // Create a base set of STUN servers
    let iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ];
    // Get TURN configuration from environment
    const turnServer = import.meta.env.VITE_TURN_SERVER;
    const turnUsername = import.meta.env.VITE_TURN_USERNAME;
    const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

    // Add primary TURN server from environment variables
    if (turnServer && turnUsername && turnCredential) {
      console.log('✅ [TURN] Using primary TURN server from environment');
      iceServers.push({
        urls: turnServer,
        username: turnUsername,
        credential: turnCredential
      });
    }

    // Add fallback TURN servers
    if (!turnServer) {
      console.log('ℹ️ [TURN] Using fallback TURN servers');
      iceServers.push(
        {
          urls: 'turn:freestun.net:3478',
          username: 'free',
          credential: 'free'
        },
        {
          urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
          username: 'webrtc',
          credential: 'webrtc'
        }
      );
    }

    console.log(`🧊 [ICE] Configured with ${iceServers.length} ICE servers`);
    return {
      iceServers,
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all'
    };
  } catch (error) {
    console.error('❌ [ICE] Error in ICE server configuration:', error);
    // Return basic configuration if there's an error
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:freestun.net:3478', username: 'free', credential: 'free' }
      ],
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all'
    };
  }
}

const SocketContext = createContext();
export default SocketContext;

// const SOCKET_SERVER_URL = "https://voodo-api.zoomerrangz.com/"

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL ||
  (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app')
    ? 'https://voodo-backend.onrender.com'
    : 'http://localhost:5000');

// Log configuration for debugging
console.log('🔌 [CONFIG] Using socket server:', SOCKET_SERVER_URL);
console.log('🔌 [CONFIG] TURN server:', import.meta.env.VITE_TURN_SERVER ? 'Configured ✓' : 'Missing ✗');
console.log('🔌 [CONFIG] TURN username:', import.meta.env.VITE_TURN_USERNAME ? 'Configured ✓' : 'Missing ✗');
console.log('🔌 [CONFIG] TURN credential:', import.meta.env.VITE_TURN_CREDENTIAL ? 'Present ✓' : 'Missing ✗');
console.log('🔌 [CONFIG] STUN server:', import.meta.env.VITE_STUN_SERVER ? 'Configured ✓' : 'Using default');

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isTextChatConnected, setIsTextChatConnected] = useState(false);
  const [currentPartnerId, setCurrentPartnerId] = useState(null);
  // Initialize with stored count from previous session if available
  const [onlineUsers, setOnlineUsers] = useState(() => {
    try {
      const storedCount = localStorage.getItem('lastKnownUserCount');
      return storedCount ? parseInt(storedCount, 10) : 0;
    } catch (_) {
      // Silent catch - just return default count if localStorage access fails
      return 0;
    }
  });
  // Track active connections
  const userConnections = useRef(new Map());

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const partnerToCall = useRef(null);
  const shouldRetryCall = useRef(false);
  const callAcceptedSignal = useRef(null);
  const isSearchingPartner = useRef(false);
  const searchTimeout = useRef(null);
  const isDisconnecting = useRef(false);

  useEffect(() => {
    // Enhanced socket connection options
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      timeout: 8000,
      autoConnect: true,
      forceNew: true,
      withCredentials: false // Important for cross-domain
    });

    socketInstance.on('connect', () => {
      console.log('✅ [SOCKET] Connected:', socketInstance.id);
      setSocket(socketInstance);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ [SOCKET] Connect error:', err);
      // Try to reconnect with polling if websocket fails
      if (socketInstance.io.opts.transports.indexOf('polling') === -1) {
        console.log('🔄 [SOCKET] Falling back to polling transport');
        socketInstance.io.opts.transports = ['polling', 'websocket'];
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.warn('⚠️ [SOCKET] Disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        // Reconnect manually if server or client disconnected
        socketInstance.connect();
      }
    });

    socketInstance.on('error', (error) =>
      console.error('❌ [SOCKET] General error:', error)
    );

    return () => {
      socketInstance.disconnect();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const getMedia = async () => {
      try {
        // First check if we already have a valid stream
        if (stream && stream.getTracks().length > 0) {
          console.log('✅ [MEDIA] Already have valid stream:', {
            video: stream.getVideoTracks().length > 0,
            audio: stream.getAudioTracks().length > 0
          });
          return;
        }

        console.log('🎥 [MEDIA] Requesting media permissions...');
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          },
          audio: true
        });

        if (!currentStream || !currentStream.getTracks().length) {
          console.error('❌ [MEDIA] Stream is empty!');
          return;
        }

        // Verify we got both audio and video
        const videoTrack = currentStream.getVideoTracks()[0];
        const audioTrack = currentStream.getAudioTracks()[0];
        console.log('✅ [MEDIA] Media stream obtained:', {
          totalTracks: currentStream.getTracks().length,
          hasVideo: !!videoTrack,
          hasAudio: !!audioTrack,
          videoLabel: videoTrack?.label || 'No video',
          audioLabel: audioTrack?.label || 'No audio'
        });

        setStream(currentStream);
      } catch (err) {
        console.error('❌ [MEDIA] Access error:', {
          name: err.name,
          message: err.message,
          constraint: err.constraint
        });

        // Try to get audio only
        let audioStream = null;
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch (audioErr) {
          // No audio either
        }

        // Create black video stream
        const blackStream = createBlackVideoStream();
        if (audioStream && audioStream.getAudioTracks().length > 0) {
          blackStream.addTrack(audioStream.getAudioTracks()[0]);
        }
        setStream(blackStream);

        // Optionally, inform the user
        alert('No camera found. You will join with a black screen.' + (audioStream ? '' : ' No microphone detected either.'));
      }
    };

    getMedia();
    // Cleanup function to stop all tracks when component unmounts
    return () => {
      if (stream) {
        console.log('🧹 [CLEANUP] Stopping all media tracks');
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('callUser', ({ from, signal, name }) => {
      console.log('📞 [SOCKET] Incoming call from:', from);
      setIncomingCall({ isReceivingCall: true, from, signal, name });
    });

    socket.on('partnerFound', async ({ partnerId, initiator }) => {
      console.log('🎯 [MATCH] Partner found! Setting partnerToCall =', partnerId, 'Initiator:', initiator);

      // Ensure initiator is a boolean to prevent type issues
      const isInitiator = initiator === true || initiator === "true";

      // Wait for stream to be ready if it's not
      if (!stream || !stream.getTracks().length) {
        console.log('⏳ [MATCH] Waiting for media stream to be ready...');
        try {
          const currentStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setStream(currentStream);
        } catch (err) {
          console.error('❌ [MEDIA] Could not get media stream:', err);
          alert('Cannot access camera/microphone. Please ensure they are connected and permissions are granted.');
          return;
        }
      }
      // Log environment info to help with debugging
      console.log('🔍 [MATCH] Environment info:', {
        production: import.meta.env.PROD,
        dev: import.meta.env.DEV,
        url: window.location.hostname,
        socketId: socket?.id,
        partnerId,
        streamReady: !!stream?.getTracks().length,
        hasVideo: stream?.getVideoTracks().length > 0,
        hasAudio: stream?.getAudioTracks().length > 0,
        originalInitiator: initiator,
        parsedInitiator: isInitiator
      });

      setCurrentPartnerId(partnerId);
      setIsTextChatConnected(false);
      
      // Reset search flag since we found a partner
      isSearchingPartner.current = false;
      isDisconnecting.current = false; // Reset disconnection guard for new connection
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
      }
      
      partnerToCall.current = { id: partnerId, initiator: isInitiator };
      shouldRetryCall.current = true;

      // Track connection in userConnections map
      if (socket?.id) {
        userConnections.current.set(socket.id, partnerId);
        userConnections.current.set(partnerId, socket.id);
      }

      // First initiate video call, then set up text chat with same partner
      await tryInitiateCall();
    });

    socket.on('callAccepted', (signal) => {
      console.log('✅ [SOCKET] callAccepted received');
      callAcceptedSignal.current = signal;
      setCallAccepted(true);
      
      if (connectionRef.current) {
        // Immediate signaling for fastest connection
        connectionRef.current?.signal(signal);
      }
      
      // Connect text chat to same partner after video call is accepted
      if (currentPartnerId && socket.connected) {
        // Immediate text chat connection
        socket.emit('connectTextChatToPartner', { partnerId: currentPartnerId });
      }
    });
    // Text chat event listeners
    socket.on('receiveMessage', (data) => {
      console.log('📩 [SOCKET] Text message received:', data);
      // The TextChat component will handle displaying the message
    });
    socket.on('typing', () => {
      console.log('⌨️ [SOCKET] Partner is typing');
      // The TextChat component will handle showing the typing indicator
    });
    socket.on('chatConnected', () => {
      console.log('🔄 [CHAT] Text chat connected with partner');
      setIsTextChatConnected(true);
    });

    socket.on('chatDisconnected', () => {
      console.log('❌ [CHAT] Text chat partner disconnected');
      setIsTextChatConnected(false);
    });

    socket.on('partnerDisconnected', () => {
      // Prevent double-disconnection from multiple events
      if (isDisconnecting.current) {
        console.log('⏭️ [GUARD] Already disconnecting, ignoring duplicate partnerDisconnected');
        return;
      }
      
      isDisconnecting.current = true;
      console.log('❌ [PARTNER] Partner disconnected - cleaning up both video and text');
      
      // Immediately clean up both video and text chat states
      setCallEnded(true);
      setCallAccepted(false);
      setIsTextChatConnected(false);
      setCurrentPartnerId(null);
      
      // Clean up peer connection
      if (connectionRef.current) {
        try {
          if (!connectionRef.current.destroyed) {
            connectionRef.current.destroy();
          }
        } catch (err) {
          console.error('❌ [PEER] Error destroying connection on partner disconnect:', err);
        }
        connectionRef.current = null;
      }
      
      // Reset call state
      setIncomingCall({});
      setRemoteStream(null);
      callAcceptedSignal.current = null;
      
      // Notify server of disconnection
      if (socket?.connected) {
        try {
          socket.emit('endCall');
          socket.emit('disconnectTextChat');
        } catch (err) {
          console.error('❌ [SOCKET] Error emitting disconnect events:', err);
        }
      }
      
      // Reset search flag in case it was set
      isSearchingPartner.current = false;
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
      }
      
      // Automatically start searching for new partner (no manual skip required)
      console.log('🔄 [AUTO] Auto-searching for new partner after disconnect');
      setTimeout(() => {
        isDisconnecting.current = false; // Reset disconnection guard
        findNewPartner();
      }, 500); // Small delay to ensure cleanup completes
    });

    // Listen for emoji reactions
    socket.on('receiveEmojiReaction', (emojiData) => {
      console.log('🎉 [EMOJI] Received emoji reaction:', emojiData);
      // The TextChat component will handle displaying the emoji reaction
    });

    // Listen for updates to online user count and ensure we get the latest count
    socket.on('updateUserCount', (count) => {
      console.log('👥 [USERS] Online users count updated:', count);

      // Validate the count is a reasonable number to prevent display issues
      if (typeof count === 'number' && !isNaN(count) && count >= 0) {
        setOnlineUsers(count);

        // Store last known good count in localStorage for persistence
        try {
          localStorage.setItem('lastKnownUserCount', count.toString());
        } catch (storageErr) {
          console.warn('⚠️ [STORAGE] Failed to save user count:', storageErr);
        }
      } else {
        console.warn('⚠️ [USERS] Invalid user count received:', count);
      }
    });
    // Request user count on connection and periodically
    const requestUserCountInterval = setInterval(() => {
      if (socket && socket.connected) {
        socket.emit('requestUserCount');
      }
    }, 30000); // Every 30 seconds
    // Initialize the user and request current user count
    socket.emit('initializeUser');
    socket.emit('requestUserCount');

    return () => {
      socket.off('callUser');
      socket.off('partnerFound');
      socket.off('callAccepted');
      socket.off('updateUserCount');
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('chatConnected');
      socket.off('chatDisconnected');
      socket.off('partnerDisconnected');
      socket.off('receiveEmojiReaction');
      
      // Clear the interval
      clearInterval(requestUserCountInterval);
    };
  }, [socket]);

  useEffect(() => {
    if (stream) tryInitiateCall();
  }, [stream]);

  const tryInitiateCall = async () => {
    if (!stream) {
      console.log('⏳ [WAIT] No media stream, attempting to get it...');
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);
        return; // Will retry via useEffect when stream is set
      } catch (err) {
        console.error('❌ [MEDIA] Could not get media stream:', err);
        return;
      }
    }

    const hasValidStream = stream && stream.getTracks && stream.getTracks().length > 0;
    const hasValidVideo = stream?.getVideoTracks().length > 0;
    const hasValidAudio = stream?.getAudioTracks().length > 0;

    if (!partnerToCall.current || !hasValidStream) {
      console.log('⏳ [WAIT] Not ready to call yet', {
        socketReady: !!socket,
        streamReady: !!stream,
        hasVideo: hasValidVideo,
        hasAudio: hasValidAudio,
        streamFromState: !!stream,
        streamFromRef: !!stream?.getTracks?.length,
        partnerToCall: partnerToCall.current,
      });
      return;
    }

    const { id, initiator } = partnerToCall.current || {};
    if (!id) {
      console.warn('❌ [CALL] No partner ID available');
      return;
    }
    // Log detailed diagnostics for debugging connection issues
    console.log('📊 [CALL] Connection diagnostics:', {
      socketConnected: socket?.connected,
      socketId: socket?.id,
      streamAvailable: !!stream,
      streamTracks: stream?.getTracks().length,
      partnerId: id,
      initiatorFlag: initiator,
      browser: navigator.userAgent,
      existingConnection: !!connectionRef.current,
      environment: import.meta.env.MODE,
      url: window.location.hostname,
    });

    // Force one side to initiate based on socket ID comparison if both are non-initiators
    // This ensures a connection is made even if there's an issue with the initiator flag
    const forceInitiate = !initiator && socket?.id && id && socket.id < id;
    if (initiator || forceInitiate) {
      if (forceInitiate) {
        console.log('� [FORCE] Both sides are non-initiators. Forcing call as socket ID is smaller.');
      }
      console.log('�📞 [SAFE] Calling partner:', id);
      callUser(id);
      shouldRetryCall.current = false;
    } else {
      console.log('📞 [IMMEDIATE] Non-initiator forcing immediate call to prevent delays');
      // Force immediate call instead of waiting - eliminates connection delays
      callUser(id);
    }
  };

  useEffect(() => {
    if (incomingCall?.isReceivingCall && stream) {
      console.log('✅ [AUTO] Answering call...');
      answerCall();
    }
  }, [incomingCall, stream]);

  const answerCall = async () => {
    if (!incomingCall?.isReceivingCall) {
      console.warn('⚠️ [CALL] Not receiving a call, cannot answer');
      return;
    }
    if (!socket || !socket.connected) {
      console.error('❌ [CALL] Socket not available or not connected, cannot answer call');
      return;
    }
    if (!stream || !stream.getTracks || stream.getTracks().length === 0) {
      console.error('❌ [CALL] No media stream available, cannot answer call');
      return;
    }
    try {
      // Get ICE servers using our utility function
      const iceServers = await getIceServers();

      if (connectionRef.current) {
        console.log('♻️ [PEER] Cleaning up old connection before answering');
        try {
          connectionRef.current.destroy();
        } catch (err) {
          console.error('❌ [PEER] Error destroying previous connection:', err);
        }
        connectionRef.current = null;
      }

      // Use safer peer creation with error handling
      const peerOptions = {
        initiator: false,
        trickle: false,
        stream,
        config: {
          iceServers: iceServers.iceServers,
          iceCandidatePoolSize: 10,
          sdpSemantics: 'unified-plan'
        },
      };
      let peer;
      try {
        peer = createSafePeer(peerOptions);
      } catch (peerCreateError) {
        console.error('❌ [PEER] Failed to create peer in answerCall:', peerCreateError);
        // Try again with minimal config as fallback
        try {
          console.log('🔄 [PEER] Trying fallback with minimal config');
          peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
          });
        } catch (fallbackError) {
          console.error('❌ [PEER] Fallback also failed:', fallbackError);
          throw new Error('Could not establish WebRTC connection: ' + fallbackError.message);
        }
      }

      let hasReceivedOffer = false;

      peer.on('signal', (data) => {
        if (peer.destroyed) return;

        // Log signaling state for debugging
        if (peer._pc) {
          console.log('🔄 [STATE] Current signaling state:', peer._pc.signalingState);
        }

        if (data?.type === 'answer') {
          if (!hasReceivedOffer) {
            console.warn('⚠️ [SIGNAL] Attempting to send answer before receiving offer');
            return;
          }
          console.log('📤 [SIGNAL] Emitting answerCall:', data);
          socket?.emit('answerCall', { signal: data, to: incomingCall.from });
        }
      });

      peer.on('stream', (remote) => {
        console.log('📡 [PEER] Received remote stream (answerCall)');
        setRemoteStream(remote);
        setCallAccepted(true);
      });

      peer.on('error', (err) => console.error('❌ [PEER] Error (answerCall):', err));

      // Process the incoming offer
      if (incomingCall.signal?.type === 'offer') {
        hasReceivedOffer = true;
        console.log('📥 [SIGNAL] Processing incoming offer');
        setTimeout(() => {
          if (!peer.destroyed) {
            // Check signaling state before processing offer
            if (peer._pc && peer._pc.signalingState === 'stable') {
              console.log('✅ [STATE] Signaling state is stable, processing offer');
              peer.signal(incomingCall.signal);
            } else {
              console.warn('⚠️ [STATE] Invalid signaling state for offer:', peer._pc?.signalingState);
            }
          } else {
            console.warn('⚠️ [SIGNAL] Skipped signaling destroyed peer in answerCall');
          }
        }, 100); // Small delay to ensure peer is fully initialized
      } else {
        console.warn('⚠️ [SIGNAL] Received non-offer signal in answerCall:', incomingCall.signal?.type);
      }

      connectionRef.current = peer;
    } catch (err) {
      console.error('❌ [CALL] answerCall error:', err);
    }
  };

  const callUser = async (id) => {
    if (!stream) {
      console.warn('❌ [callUser] Missing stream, aborting call');
      return;
    }
    if (!socket) {
      console.warn('❌ [callUser] Socket is not initialized, aborting call');
      return;
    }
    if (!socket.connected) {
      console.warn('❌ [callUser] Socket is not connected, aborting call');
      return;
    }

    const tracks = stream.getTracks();
    if (!tracks || tracks.length === 0) {
      console.warn('❌ [callUser] Stream has no tracks, aborting');
      return;
    }

    console.log('📞 [CALL] Starting call to:', id);
    console.log('📹 [DEBUG] Stream tracks:', tracks);

    try {
      // Get ICE servers using our utility function
      const iceServers = await getIceServers();

      if (connectionRef.current) {
        console.log('♻️ [PEER] Cleaning up old connection before calling');
        try {
          connectionRef.current.destroy();
        } catch (err) {
          console.warn('⚠️ [PEER] Error destroying previous connection:', err);
        }
        connectionRef.current = null;
      }

      // Create peer with additional config options
      // Use safer peer creation with error handling
      const peerOptions = {
        initiator: true,
        trickle: false,
        stream,
        config: {
          iceServers: iceServers.iceServers,
          iceCandidatePoolSize: 10,
          sdpSemantics: 'unified-plan'
        },
      };
      let peer;
      try {
        peer = createSafePeer(peerOptions);
      } catch (peerCreateError) {
        console.error('❌ [PEER] Failed to create peer in callUser:', peerCreateError);
        // Try again with minimal config as fallback
        try {
          console.log('🔄 [PEER] Trying fallback with minimal config');
          peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });
        } catch (fallbackError) {
          console.error('❌ [PEER] Fallback also failed:', fallbackError);
          throw new Error('Could not establish WebRTC connection: ' + fallbackError.message);
        }
      }

      // Add safety checks for peer signals
      let hasSetLocalOffer = false;

      peer.on('signal', async (data) => {
        try {
          // Make sure everything is defined before proceeding
          if (peer.destroyed) {
            console.warn('⚠️ [SIGNAL] Peer was destroyed, not sending signal');
            return;
          }
          if (!data) {
            console.warn('⚠️ [SIGNAL] No signal data received');
            return;
          }
          if (!socket?.connected) {
            console.error('❌ [SIGNAL] Socket not available or not connected');
            return;
          }

          // Handle offer
          if (data.type === 'offer') {
            hasSetLocalOffer = true;
            console.log('📤 [SIGNAL] Setting local offer and emitting callUser');
            socket.emit('callUser', {
              userToCall: id,
              signalData: data,
              from: socket?.id,
              name: 'User',
            });
          }
          // Handle answer - only process if we've set our local offer
          if (data.type === 'answer') {
            if (!hasSetLocalOffer) {
              console.warn('⚠️ [SIGNAL] Received answer before setting local offer');
              return;
            }
            console.log('📤 [SIGNAL] Processing answer after local offer');
          }

          // Log signaling state for debugging
          if (peer._pc) {
            console.log('🔄 [STATE] Current signaling state:', peer._pc.signalingState);
          }
        } catch (err) {
          console.error('❌ [SIGNAL] Error in signal handler:', err);
        }
      });

      peer.on('stream', (remote) => {
        console.log('📡 [PEER] Received remote stream (callUser)');
        setRemoteStream(remote);
        setCallAccepted(true);
      });

      if (callAcceptedSignal.current) {
        console.log('🕊️ [IMMEDIATE] Have callAccepted signal to apply');
        // Only apply answer if we're in the correct state
        if (peer._pc && peer._pc.signalingState === 'have-local-offer') {
          console.log('✅ [STATE] In correct state (have-local-offer), applying answer');
          peer.signal(callAcceptedSignal.current);
        } else {
          console.warn('⚠️ [STATE] Wrong state for answer:', peer._pc?.signalingState);
          // Store the answer to apply when we reach the correct state
          peer.once('signal', () => {
            if (peer._pc?.signalingState === 'have-local-offer') {
              console.log('✅ [STATE] Now in correct state, applying stored answer');
              peer.signal(callAcceptedSignal.current);
            }
          });
        }
        callAcceptedSignal.current = null;
      }

      peer.on('close', () => {
        console.log('❌ [PEER] Connection closed');
      });

      // Listen for signaling state changes
      if (peer._pc) {
        peer._pc.onsignalingstatechange = () => {
          console.log('🔄 [STATE] Signaling state changed:', peer._pc.signalingState);
        };
      }

      peer.on('error', (err) => console.error('❌ [PEER] Error in peer connection:', err));

      connectionRef.current = peer;
    } catch (err) {
      console.error('❌ [CALL] callUser error (outer):', err.message);
      console.error('📛 [STACK TRACE]', err.stack);
    }
  };

  const leaveCall = () => {
    // Prevent double cleanup if already disconnecting
    if (isDisconnecting.current) {
      console.log('⏭️ [GUARD] Already disconnecting, ignoring manual leaveCall');
      return;
    }
    
    console.log('👋 [CALL] Leaving call...');
    isDisconnecting.current = true; // Set guard for manual leave
    setCallEnded(true);
    if (connectionRef.current) {
      try {
        connectionRef.current.destroy();
      } catch (err) {
        console.error('❌ [PEER] Error destroying connection:', err);
      }
      connectionRef.current = null;
    }
    if (socket?.connected) {
      try {
        socket.emit('endCall');
      } catch (err) {
        console.error('❌ [SOCKET] Error emitting endCall:', err);
      }
    }
    setIncomingCall({});
    setRemoteStream(null);
    setCallAccepted(false);
    callAcceptedSignal.current = null;

    // Reset disconnection guard and search for new partner
    isDisconnecting.current = false;
    findNewPartner();
  };

  const findNewPartner = () => {
    // Debounce to prevent multiple simultaneous calls
    if (isSearchingPartner.current) {
      console.log('⏭️ [DEBOUNCE] Already searching for partner, ignoring duplicate call');
      return;
    }
    
    // Clear any existing search timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }
    
    console.log('🔄 [MATCH] Finding new partner (synchronized)...');
    if (!socket) {
      console.warn('⚠️ [MATCH] Socket not available, cannot find new partner');
      return;
    }
    if (!socket.connected) {
      console.warn('⚠️ [MATCH] Socket not connected, cannot find new partner');
      return;
    }
    
    isSearchingPartner.current = true;
    
    // Reset both video and text chat states
    setCallEnded(false);
    setCallAccepted(false);
    setIsTextChatConnected(false);
    setCurrentPartnerId(null);
    
    // Clean up existing connections
    if (connectionRef.current) {
      try {
        connectionRef.current.destroy();
      } catch (err) {
        console.error('❌ [PEER] Error destroying connection:', err);
      }
      connectionRef.current = null;
    }
    
    try {
      socket.emit('endCall');
      socket.emit('disconnectTextChat');
      
      // Immediate partner search
      socket.emit('findPartner');
      
      // Reset search flag after a short delay to allow new searches
      searchTimeout.current = setTimeout(() => {
        isSearchingPartner.current = false;
        searchTimeout.current = null;
      }, 1000);
    } catch (err) {
      console.error('❌ [MATCH] Error finding new partner:', err);
      isSearchingPartner.current = false;
    }
  };
  // Find a text chat partner
  const findTextChatPartner = () => {
    console.log('🔄 [TEXT] Finding text chat partner...');
    if (!socket) {
      console.warn('⚠️ [TEXT] Socket not available, cannot find text chat partner');
      return false;
    }
    if (!socket.connected) {
      console.warn('⚠️ [TEXT] Socket not connected, cannot find text chat partner');
      return false;
    }
    try {
      // Clear any existing text chat connections first
      console.log('🧹 [TEXT] Clearing existing text chat state');
      
      // Reset local state for new partner search
      setCallAccepted(false);
      setCallEnded(false);
      setIncomingCall({ isReceivingCall: false, from: '', signal: null, name: '' });
      
      socket.emit('findTextChat');
      return true;
    } catch (err) {
      console.error('❌ [TEXT] Error finding text chat partner:', err);
      return false;
    }
  };

  const toggleMute = () => {
    const audioTrack = stream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };
  // Text chat methods
  const sendTextMessage = (message) => {
    if (!socket) {
      console.error('❌ [CHAT] Socket not initialized, cannot send message');
      return false;
    }
    if (!socket.connected) {
      console.error('❌ [CHAT] Socket not connected, cannot send message');
      try {
        // Attempt to reconnect socket
        socket.connect();
      } catch (connectErr) {
        console.error('❌ [CHAT] Failed to reconnect socket:', connectErr);
      }
      return false;
    }

    try {
      console.log('📤 [CHAT] Sending text message:', message);

      // Make sure we have a valid partner to send to (checking the existing connection)
      const partnerId = socket?.id ? userConnections.current.get(socket.id) : null;
      if (!partnerId) {
        console.warn('⚠️ [CHAT] No connected partner found, trying to initialize text chat');

        // Initialize text chat if not already initialized
        socket.emit('findTextChat');

        // Create a more robust retry mechanism
        let retryCount = 0;
        const maxRetries = 3;
        const retryInterval = 800; // ms

        const attemptSend = () => {
          const currentPartnerId = socket?.id ? userConnections.current.get(socket.id) : null;

          if (currentPartnerId || retryCount >= maxRetries) {
            console.log(`📤 [CHAT] Sending message after ${retryCount} retries`);
            socket.emit('sendMessage', message);
          } else {
            retryCount++;
            console.log(`🔄 [CHAT] Retry ${retryCount}/${maxRetries} sending message`);
            setTimeout(attemptSend, retryInterval);
          }
        };
        // Start retry sequence
        setTimeout(attemptSend, retryInterval);
      } else {
        // Normal flow - send directly
        socket.emit('sendMessage', message);
      }
      return true;
    } catch (err) {
      console.error('❌ [CHAT] Error sending message:', err);
      return false;
    }
  };
  const sendTypingIndicator = () => {
    if (!socket || !socket.connected) {
      console.error('❌ [CHAT] Socket not available, cannot send typing indicator');
      return;
    }
    
    try {
      socket.emit('typing');
    } catch (err) {
      console.error('❌ [CHAT] Error sending typing indicator:', err);
    }
  };

  const sendEmojiReaction = (emoji) => {
    if (!socket || !socket.connected) {
      console.error('❌ [EMOJI] Socket not available, cannot send emoji reaction');
      return false;
    }
    
    try {
      console.log('📤 [EMOJI] Sending emoji reaction:', emoji);
      socket.emit('sendEmojiReaction', { emoji });
      return true;
    } catch (err) {
      console.error('❌ [EMOJI] Error sending emoji reaction:', err);
      return false;
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        stream,
        incomingCall,
        callAccepted,
        callEnded,
        myVideo,
        userVideo,
        isMuted,
        isVideoOff,
        onlineUsers,
        answerCall,
        callUser,
        leaveCall,
        toggleMute,
        toggleVideo,
        findNewPartner,
        remoteStream,
        // Text chat methods
        sendTextMessage,
        sendTypingIndicator,
        sendEmojiReaction,
        isTextChatConnected,
        currentPartnerId,
        findTextChatPartner,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
