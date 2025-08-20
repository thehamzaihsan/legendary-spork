import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import VideoControls from "./VideoControls";
import VideoFeed from "./VideoFeed";
import TextChat from "../text-chat/TextChat";

const VideoChat = () => {
  const { socket, callAccepted, callEnded, call, answerCall, findNewPartner } =
    useSocket();

  const [searching, setSearching] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  // Auto-answer incoming call
  useEffect(() => {
    if (call?.isReceivingCall && !callAccepted && !callEnded) {
      answerCall();
    }
  }, [call, callAccepted, callEnded, answerCall]);

  // Start searching when component mounts
  useEffect(() => {
    if (!socket) {
      setConnectionStatus("Connecting to server...");
      return;
    }

    const handlePartnerDisconnect = () => {
      setConnectionStatus("Partner disconnected. Finding new partner...");
      setSearching(true);
      findNewPartner();
    };

    if (!callAccepted && !callEnded && !searching) {
      setSearching(true);
      setConnectionStatus("Waiting for a partner...");
      try {
        findNewPartner();
      } catch (error) {
        setConnectionStatus("Error finding partner: " + error.message);
        setSearching(false);
      }
    }

    if (callAccepted) {
      setConnectionStatus("Connected to a stranger!");
      setSearching(false);
    }

    if (callEnded) {
      setConnectionStatus("Call ended. Click Next to find a new partner.");
      setSearching(false);
    }

    socket.on("partnerDisconnected", handlePartnerDisconnect);

    return () => {
      socket.off("partnerDisconnected", handlePartnerDisconnect);
    };
  }, [socket, callAccepted, callEnded, searching, findNewPartner]);

  // Reset searching state when call changes
  useEffect(() => {
    if (callAccepted) {
      setSearching(false);
    }
  }, [callAccepted]);

  // Emit video call status changes to sync with text chat
  useEffect(() => {
    if (!socket) return;

    if (callAccepted && !callEnded) {
      setTimeout(() => {
        socket.emit("videoCallStatus", "connected");
      }, 500);
    } else if (callEnded) {
      socket.emit("videoCallStatus", "disconnected");
    }
  }, [callAccepted, callEnded]);

  // If socket is null, show loading screen
  if (!socket) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-white rounded-full mx-auto"></div>
          </div>
          <p className="text-lg">
            {connectionStatus || "Connecting to server..."}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please wait while we establish a connection
          </p>
        </div>
      </div>
    );
  }

  // Normal render with connected socket
  return (
    <div className="flex h-full overflow-hidden bg-black">
      {/* Video area - full width on mobile, 30% on larger screens */}
      <div className="flex flex-col h-full w-full md:w-[30%] border-r border-gray-800 md:border-r-0 overflow-hidden">
        {/* Video feed takes up most of the height */}
        <div className="h-[calc(100%-60px)] w-full">
          <VideoFeed />
        </div>

        {/* Video Controls with fixed height */}
        <div className="flex justify-center items-center h-[60px] bg-black">
          <VideoControls />
        </div>
      </div>

      {/* Text chat - hidden on mobile, 70% width on larger screens */}
      <div className="hidden md:block h-full w-[70%] bg-[#2f1b43] border-l border-gray-800 overflow-hidden">
        <TextChat isEmbeddedInVideo={true} />
      </div>
    </div>
  );
};

export default VideoChat;
