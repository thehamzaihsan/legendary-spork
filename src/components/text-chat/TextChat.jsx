import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocketContext from "../../context/SocketContext";
import BadgeDisplay from "../premium/BadgeDisplay";
import BadgeChip from "../common/BadgeChip";
import { usePremiumStatus } from "../../hooks/usePremiumStatus";
import arcaneBadge from "../../assets/arcanebadge.png";
import bronzeBadge from "../../assets/bronzebadge.png";
import goldBadge from "../../assets/goldbadge.png";
import AdSenseAd from "../ads/AdSenseAd";


const TextChat = ({ isEmbeddedInVideo = false }) => {
  const {
    socket,
    callAccepted,
    sendTextMessage,
    sendTypingIndicator,
    findNewPartner,
    userSubscription,
    sendEmojiReaction, // <-- Added this line
  } = useContext(SocketContext);

  // Premium status hook
  const { isPremium, premiumData, badgeData } = usePremiumStatus();

  const [isPartnerAvailable, setIsPartnerAvailable] = useState(false);
  const [, setConnectionStatus] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [strangerTyping, setStrangerTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const [partnerSubscription, setPartnerSubscription] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPostShare, setShowPostShare] = useState(false);

  const messagesEndRef = useRef(null);

  // Function to get badge image based on subscription type or premium status
  const getBadgeImage = (subscription) => {
    // Check if current user is premium
    if (isPremium && badgeData) {
      switch (badgeData.tier) {
        case "arcane":
          return arcaneBadge;
        case "gold":
          return goldBadge;
        case "bronze":
          return bronzeBadge;
        default:
          return bronzeBadge;
      }
    }
    
    // Fallback to old subscription system
    switch (subscription?.toLowerCase()) {
      case "arcane":
        return arcaneBadge;
      case "gold":
        return goldBadge;
      case "bronze":
        return bronzeBadge;
      default:
        return null;
    }
  };

  // Function to get badge name for display
  const getBadgeName = (subscription) => {
    // Check if current user is premium
    if (isPremium && badgeData) {
      return badgeData.name;
    }
    
    // Fallback to old subscription system
    switch (subscription?.toLowerCase()) {
      case "arcane":
        return "Arcane";
      case "gold":
        return "Gold";
      case "bronze":
        return "Bronze";
      default:
        return null;
    }
  };

  // Function to get ring class based on subscription or premium status
  const getRingClass = (subscription) => {
    // Check if current user is premium
    if (isPremium && badgeData) {
      switch (badgeData.tier) {
        case "arcane":
          return "ring-fuchsia-300";
        case "gold":
          return "ring-amber-300";
        case "bronze":
          return "ring-orange-300";
        default:
          return "ring-orange-300";
      }
    }
    
    // Fallback to old subscription system
    switch (subscription?.toLowerCase()) {
      case "arcane":
        return "ring-fuchsia-300";
      case "gold":
        return "ring-amber-300";
      case "bronze":
      default:
        return "ring-orange-300";
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (socket) {
      setConnected(true);
      console.log("Socket connected:", socket.connected);

      if (callAccepted) {
        setIsPartnerAvailable(true);
        setChat([
          { text: "You are now chatting with a stranger!", sender: "system" },
        ]);
        setConnectionStatus("Connected to a stranger!");
      } else {
        setIsPartnerAvailable(false);
        setChat([
          {
            text: "No strangers available right now. Try clicking 'Next' to find a partner.",
            sender: "system",
          },
        ]);
        setConnectionStatus("Waiting for a partner...");
      }
    } else {
      setConnected(false);
      setConnectionStatus("Connecting to server...");
    }
  }, [socket, callAccepted]);

  useEffect(() => {
    if (!socket) return;

    const handleTextMessage = (data) => {
      const messageText = typeof data === "object" ? data.message : data;
      setChat((prev) => [...prev, { text: messageText, sender: "stranger" }]);
      setStrangerTyping(false);
    };

    const handleTyping = () => {
      setStrangerTyping(true);
      setTimeout(() => setStrangerTyping(false), 3000);
    };

    const handlePartnerFound = ({ partnerId, partnerSubscription }) => {
      console.log("Partner found:", partnerId);
      setIsPartnerAvailable(true);
      setPartnerSubscription(partnerSubscription);
      setChat([
        { text: "You are now chatting with a stranger!", sender: "system" },
      ]);
      setConnectionStatus("Connected to a stranger!");
    };

    const handleCallAccepted = () => {
      console.log("Call accepted");
      setIsPartnerAvailable(true);
      setConnectionStatus("Connected to a stranger!");
      if (
        chat.length === 0 ||
        (chat[0]?.sender === "system" && chat[0]?.text.includes("Looking for"))
      ) {
        setChat([
          { text: "You are now chatting with a stranger!", sender: "system" },
        ]);
      }
    };

    socket.on("receiveMessage", handleTextMessage);
    socket.on("typing", handleTyping);
    socket.on("partnerFound", handlePartnerFound);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("chatConnected", ({ partnerSubscription }) => {
      setIsPartnerAvailable(true);
      setPartnerSubscription(partnerSubscription);
      setChat([
        { text: "You are now chatting with a stranger!", sender: "system" },
      ]);
    });
    socket.on("chatDisconnected", () => {
      setIsPartnerAvailable(false);
      setPartnerSubscription(null);
      setChat((prev) => [
        ...prev,
        { text: "Your chat partner has disconnected.", sender: "system" },
      ]);
    });

    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected event triggered");
    });
    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("receiveMessage", handleTextMessage);
      socket.off("typing", handleTyping);
      socket.off("partnerFound", handlePartnerFound);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("chatConnected");
      socket.off("chatDisconnected");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, chat]);

  const sendMessage = () => {
    if (message.trim() && connected && socket) {
      console.log("Attempting to send message:", message);
      try {
        setChat((prevChat) => [...prevChat, { text: message, sender: "me" }]);
        sendTextMessage(message);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        setChat((prevChat) => [
          ...prevChat,
          {
            text: "Message failed to send: " + error.message,
            sender: "system",
          },
        ]);
      }
    } else if (!isPartnerAvailable) {
      setChat((prevChat) => [
        ...prevChat,
        {
          text: "Message sent locally. No partner available to receive it.",
          sender: "system",
        },
      ]);
      setChat((prevChat) => [...prevChat, { text: message, sender: "me" }]);
      setMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (connected && socket && e.target.value && !isTyping) {
      setIsTyping(true);
      if (isPartnerAvailable) sendTypingIndicator();
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  // Handle emoji reaction sending
  const handleEmojiClick = (emoji) => {
    if (sendEmojiReaction && isPartnerAvailable) {
      sendEmojiReaction(emoji);
      setShowEmojiPicker(false);
    }
  };

  // Handle sharing a post with chat partner
  // Removed unused handleSharePost function to fix compile error.

  // Common emojis for quick reactions
  const quickEmojis = [
    "😂",
    "❤️",
    "👍",
    "👎",
    "😢",
    "😍",
    "🤔",
    "😴",
    "🔥",
    "🎉",
  ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Badge Component
  const UserBadge = ({ subscription, isCurrentUser = false }) => {
    const badgeImage = getBadgeImage(subscription);
    const badgeName = getBadgeName(subscription);

    // For current user, show premium badge if available
    if (isCurrentUser && isPremium && badgeData) {
      return (
        <div className="flex items-center space-x-1">
          <img
            src={badgeImage}
            alt={`${badgeName} Badge`}
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
            title={`${badgeName} Member`}
          />
          <span className="text-xs text-purple-300">👑</span>
        </div>
      );
    }

    // For other users or non-premium current user
    if (badgeImage && badgeName) {
      return (
        <img
          src={badgeImage}
          alt={`${badgeName} Badge`}
          className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
          title={`${badgeName} Member`}
        />
      );
    }

    return null;
  };

  // Ad Component for non-premium users
  const AdDisplay = () => {
    if (isPremium) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 my-2"
      >
        <AdSenseAd
          adSlot="TEXT_CHAT_AD_SLOT_ID"
          placeholderText="Text Chat Advertisement"
          placeholderHeight="120px"
          style={{ 
            display: 'block',
            width: '100%',
            minHeight: '120px'
          }}
          className="rounded-lg"
        />
        <div className="text-xs text-gray-500 mt-2 text-center">
          Get ad-free experience with Premium
        </div>
      </motion.div>
    );
  };

  if (!socket) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        <div className="text-center relative z-10 px-4">
          <div className="mb-4 sm:mb-6">
            <div className="animate-spin h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-violet-400 rounded-full mx-auto"></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
            Connecting to chat server...
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Please wait while we establish a connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 sm:p-6"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Anonymous Chat
                </h2>
                {/* Own badge via existing BadgeDisplay */}
                {UserBadge && (
                  <BadgeDisplay badge={UserBadge} size="sm" showTooltip={true} />
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                {isPartnerAvailable
                  ? "Connected with a stranger"
                  : "No stranger available"}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <UserBadge subscription={userSubscription} isCurrentUser={true} />
                {/* Partner badge chip */}
                {partnerSubscription && <BadgeChip tier={partnerSubscription} />}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: connected ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                } shadow-lg`}
              />
              <span className="text-xs sm:text-sm font-medium text-white">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {!isEmbeddedInVideo && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFindingPartner(true);
                  setChat([
                    { text: "Looking for a partner...", sender: "system" },
                  ]);
                  findNewPartner();
                  setMessage("");
                  setIsTyping(false);
                  setStrangerTyping(false);
                  setPartnerSubscription(null);
                  setTimeout(() => setIsFindingPartner(false), 1000);
                }}
                disabled={isFindingPartner}
                className="px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/10 hover:border-violet-500/30 font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Skip to a new chat partner - this will disconnect your current conversation and find someone new to chat with"
              >
                {isFindingPartner ? "Searching..." : "Next"}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence initial={false}>
              {chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${
                    msg.sender === "me"
                      ? "justify-end"
                      : msg.sender === "system"
                      ? "justify-center"
                      : "justify-start"
                  }`}
                >
                  {msg.sender === "system" ? (
                    <div className="bg-white/10 backdrop-blur-md text-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium border border-white/20 mt-10 sm:mt-5">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="flex items-end space-x-2 sm:space-x-3 max-w-[80%] sm:max-w-[70%]">
                      {msg.sender === "stranger" && (
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-lg flex-shrink-0">
                            S
                          </div>
                          {partnerSubscription && (
                            <UserBadge
                              subscription={partnerSubscription}
                              isStranger={true}
                            />
                          )}
                        </div>
                      )}
                      <div
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-3xl shadow-lg backdrop-blur-md border ring-2 ${
                          msg.sender === "me"
                            ? `bg-gradient-to-r from-violet-600/80 to-purple-600/80 text-white rounded-br-lg border-violet-500/30 ${getRingClass(
                                userSubscription
                              )}`
                            : `bg-white/10 text-white rounded-bl-lg border-white/20 hover:bg-white/15 transition-all duration-300 ${getRingClass(
                                partnerSubscription
                              )}`
                        }`}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed">
                          {msg.text}
                        </p>
                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] sm:text-xs opacity-70">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      {msg.sender === "me" && (
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-lg flex-shrink-0">
                            M
                          </div>
                          <UserBadge subscription={userSubscription} isCurrentUser={true} />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {strangerTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end space-x-2 sm:space-x-3 max-w-[80%] sm:max-w-[70%]">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-lg flex-shrink-0">
                        S
                      </div>
                      {partnerSubscription && (
                        <UserBadge
                          subscription={partnerSubscription}
                          isStranger={true}
                        />
                      )}
                    </div>
                    <div
                      className={`bg-white/10 backdrop-blur-md text-white px-3 sm:px-4 py-2 sm:py-3 rounded-3xl rounded-bl-lg border border-white/20 shadow-lg ring-2 ${getRingClass(
                        partnerSubscription
                      )}`}
                    >
                      <div className="flex space-x-1 sm:space-x-2">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0,
                          }}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {chat.length === 0 && connected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center py-8 sm:py-12"
              >
                <div className="text-center text-gray-400 px-4">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
                  <p className="text-base sm:text-lg font-medium">
                    Waiting for a stranger...
                  </p>
                  <p className="text-xs sm:text-sm mt-2">
                    Please wait while we find someone to chat with
                  </p>
                </div>
              </motion.div>
            )}

            {/* Show ad for non-premium users */}
            <AdDisplay />

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-0 z-30 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6"
      >
        <div className="max-w-4xl mx-auto">
          {/* Emoji Picker Panel */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickEmojis.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmojiClick(emoji)}
                      className="p-2 text-2xl hover:bg-white/10 rounded-xl transition-all duration-200"
                      disabled={!isPartnerAvailable}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isEmbeddedInVideo && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  console.log("🔄 [SKIP] User clicked skip to find new partner");
                  setIsFindingPartner(true);
                  setChat((prev) => [
                    ...prev,
                    { text: "Looking for a new partner...", sender: "system" },
                  ]);
                  setIsPartnerAvailable(false);
                  setConnectionStatus("Searching for a new partner...");

                  // Clear current state
                  setMessage("");
                  setIsTyping(false);
                  setStrangerTyping(false);
                  sendEmojiReaction([]);

                  // Use appropriate matchmaking based on mode
                  if (callAccepted) {
                    console.log(
                      "🎥 [SKIP] In video mode, finding new video partner"
                    );
                    findNewPartner();
                  } else {
                    console.log(
                      "💬 [SKIP] In text-only mode, finding new text partner"
                    );
                    findNewPartner();
                  }

                  setTimeout(() => setIsFindingPartner(false), 2000);
                }}
                disabled={isFindingPartner}
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Skip to next person"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            )}

            {/* Post Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowPostShare(!showPostShare)}
              className="p-2 sm:p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/10 hover:border-violet-500/30 group"
              title="Share a community post with your chat partner"
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </motion.button>

            {/* Emoji Picker Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 sm:p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/10 hover:border-violet-500/30 group"
              title="Send emoji reaction"
            >
              <span className="text-lg">😊</span>
            </motion.button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={!connected}
                className="w-full bg-white/10 backdrop-blur-md text-white rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20 placeholder-gray-400 disabled:opacity-50"
              />
              {isTyping && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!connected || !message.trim()}
              className="p-2 sm:p-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TextChat;
