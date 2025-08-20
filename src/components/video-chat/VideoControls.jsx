import React from "react";
import { motion } from "framer-motion";
import { useSocket } from "../../hooks/useSocket";

const VideoControls = () => {
  const {
    callAccepted,
    callEnded,
    leaveCall,
    findNewPartner,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
  } = useSocket();

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3  ">
      {/* Mute Button */}
      <motion.button
        onClick={toggleMute}
        className={`
          relative group p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out
          ${
            isMuted
              ? "bg-violet-500/20 text-white shadow-inner shadow-violet-500/30 border border-violet-400/40"
              : "bg-white/10 text-white hover:bg-white/20 shadow-inner shadow-white/20 border border-white/20"
          } backdrop-blur-sm
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isMuted ? "Unmute" : "Mute"}
        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
        {/* Tooltip */}
        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/20 shadow-sm">
          {isMuted ? "Unmute" : "Mute"}
        </div>
      </motion.button>

      {/* Video Toggle Button */}
      <motion.button
        onClick={toggleVideo}
        className={`
          relative group p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out
          ${
            isVideoOff
              ? "bg-violet-500/20 text-white shadow-inner shadow-violet-500/30 border border-violet-400/40"
              : "bg-white/10 text-white hover:bg-white/20 shadow-inner shadow-white/20 border border-white/20"
          } backdrop-blur-sm
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        aria-label={isVideoOff ? "Turn video on" : "Turn video off"}
      >
        {isVideoOff ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
        {/* Tooltip */}
        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/20 shadow-sm">
          {isVideoOff ? "Turn Video On" : "Turn Video Off"}
        </div>
      </motion.button>

      {/* Next Button */}
      <motion.button
        onClick={callAccepted && !callEnded ? leaveCall : findNewPartner}
        className="
          relative group p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out
          bg-violet-500/40 hover:bg-violet-500/30 text-white shadow-inner shadow-violet-500/30
          border border-violet-400/40 backdrop-blur-sm
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={callAccepted && !callEnded ? "End Call" : "Find next person"}
        aria-label={
          callAccepted && !callEnded ? "End call" : "Find next person"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
        {/* Tooltip */}
        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/20 shadow-sm">
          {callAccepted && !callEnded ? "End Call" : "Next"}
        </div>
      </motion.button>
    </div>
  );
};

export default VideoControls;
