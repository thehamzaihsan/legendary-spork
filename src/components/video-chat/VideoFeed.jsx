import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../hooks/useSocket";
import BadgeChip from "../common/BadgeChip";
import SocketContext from "../../context/SocketContext";

const VideoFeed = () => {
  const {
    myVideo,
    userVideo,
    callAccepted,
    callEnded,
    stream,
    remoteStream,
    isMuted
  } = useSocket();
  const socketCtx = useContext(SocketContext);
  const [partnerTier, setPartnerTier] = useState(null);

  useEffect(() => {
    const s = socketCtx?.socket;
    if (!s) return;
    const onPartnerFound = ({ partnerSubscription }) => setPartnerTier(partnerSubscription || null);
    s.on('partnerFound', onPartnerFound);
    s.on('chatConnected', ({ partnerSubscription }) => setPartnerTier(partnerSubscription || null));
    return () => {
      s.off('partnerFound', onPartnerFound);
      s.off('chatConnected');
    };
  }, [socketCtx?.socket]);
  // Log when stream or video refs change to help debug
  useEffect(() => {
    console.log("Stream changed:", stream ? "available" : "not available");
    console.log(
      "myVideo ref:",
      myVideo.current ? "available" : "not available"
    );

    if (stream && myVideo.current) {
      console.log(
        "Setting stream to local video element directly from VideoFeed"
      );
      myVideo.current.srcObject = stream;

      const playPromise = myVideo.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing video in VideoFeed:", error);
          setTimeout(() => {
            myVideo.current
              ?.play()
              .catch((e) => console.error("Retry play failed:", e));
          }, 1000);
        });
      }
    }
  }, [stream, myVideo]);

  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showEmojiTimer, setShowEmojiTimer] = useState(null);

  // Function to handle emoji reactions
  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmoji(true);

    if (showEmojiTimer) clearTimeout(showEmojiTimer);

    const timer = setTimeout(() => {
      setShowEmoji(false);
      setSelectedEmoji(null);
    }, 3000);

    setShowEmojiTimer(timer);
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (showEmojiTimer) clearTimeout(showEmojiTimer);
    };
  }, [showEmojiTimer]);
  useEffect(() => {
    if (userVideo.current && remoteStream) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // List of emoji reactions
  const emojiReactions = ["❤️", "😂", "👍", "🔥", "😮", "👏"];

  return (
    <div className="relative flex flex-col h-full w-full bg-black/40 backdrop-blur-sm overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Remote/Stranger Video (Top) */}
      <div className="relative h-1/2 w-full bg-black/40 backdrop-blur-sm border-b border-white/[0.08] overflow-hidden">
        {callAccepted && !callEnded ? (
          <motion.video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label="Stranger's video feed"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-black/40 backdrop-blur-sm">
            <div className="animate-spin h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gradient-to-r from-violet-500 to-purple-600 rounded-full mb-3 sm:mb-4"></div>
            <p className="text-white text-sm sm:text-lg">
              Finding someone to chat with...
            </p>
          </div>
        )}

        {/* Stranger Label + partner badge */}
        {callAccepted && !callEnded && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-violet-500/30 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
            <span>Stranger</span>
            {partnerTier && <BadgeChip tier={partnerTier} />}
          </div>
        )}

        {/* Emoji Reactions Display (On stranger's video) */}
        {callAccepted && !callEnded && showEmoji && selectedEmoji && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-6xl drop-shadow-2xl z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedEmoji}
          </motion.div>
        )}
      </div>

      {/* Local/My Video (Bottom) */}
      <div className="relative h-1/2 w-full bg-black/40 backdrop-blur-sm overflow-hidden">
        {stream ? (
          <motion.video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label="Your video feed"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-black/40 backdrop-blur-sm">
            <p className="text-white text-xs sm:text-sm">
              Loading your camera...
            </p>
          </div>
        )}

        {/* My Video Label */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-violet-500/30">
          You
        </div>
      </div>

      {/* Emoji Reaction Bar */}
      {callAccepted && !callEnded && (
        <motion.div
          className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/70 backdrop-blur-sm rounded-full p-1 sm:p-1.5 z-20 border border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex space-x-1 sm:space-x-1.5">
            {emojiReactions.map((emoji, index) => (
              <motion.button
                key={index}
                className="text-base sm:text-lg hover:text-violet-400 transition-all hover:scale-125"
                onClick={() => handleEmojiClick(emoji)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Send ${emoji} reaction`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoFeed;
