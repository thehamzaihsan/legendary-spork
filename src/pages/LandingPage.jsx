import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import { Link } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    console.log("Selected Tags:", selectedTags);
    console.log("Is Agreed:", isAgreed);
    console.log(
      "Button should be enabled:",
      isAgreed && selectedTags.length > 0
    );
  }, [selectedTags, isAgreed]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const toggleTag = (tag) => {
    console.log("Toggle tag:", tag);
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      console.log("New selected tags:", newTags);
      return newTags;
    });
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen lg:py-10 bg-black overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/90 to-fuchsia-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        </div>

        {/* Interactive cursor glow - Disabled on mobile */}
        <motion.div
          className="hidden sm:block absolute pointer-events-none z-0"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 rounded-full blur-3xl" />
        </motion.div>

        {/* Floating orbs - Reduced number on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-15"
              style={{
                width: Math.random() * 100 + 30,
                height: Math.random() * 100 + 30,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(45deg, ${
                  i % 3 === 0
                    ? "rgba(147,51,234,0.4)"
                    : i % 3 === 1
                    ? "rgba(236,72,153,0.4)"
                    : "rgba(168,85,247,0.4)"
                }, transparent)`,
                filter: "blur(1px)",
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 sm:opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle_at_1px_1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
              backgroundSize: "30px 30px sm:40px sm:40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-full sm:max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Logo Section */}
            <motion.div variants={itemVariants} className="mb-4 pt-16 sm:pt-20">
              <motion.div
                className="flex items-center justify-center mb-3"
                variants={floatingVariants}
                animate="animate"
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur-md opacity-75" />
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10"
                    viewBox="0 0 40 40"
                    fill="currentColor"
                  >
                    <circle cx="20" cy="20" r="18" />
                    <circle cx="15" cy="15" r="3" fill="black" />
                    <circle cx="25" cy="15" r="3" fill="black" />
                    <path
                      d="M15 26a5 5 0 0110 0"
                      stroke="black"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </motion.div>
                <motion.span
                  className="text-2xl sm:text-3xl font-extrabold ml-2 sm:ml-3 bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 text-transparent bg-clip-text"
                  whileHover={{ scale: 1.05 }}
                >
                  Voodo.
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 text-transparent bg-clip-text leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Voodo Chats
              </motion.h1>
              <motion.div
                className="h-1 w-20 sm:w-24 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full mx-auto"
                initial={{ width: 0 }}
                animate={{ width: "5rem" }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <motion.p
                className="text-base sm:text-lg md:text-xl text-purple-100 mb-1 sm:mb-2 max-w-md sm:max-w-2xl leading-relaxed"
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 text-transparent bg-clip-text font-semibold">
                  Connect With A Touch of Mystery
                </span>
              </motion.p>
              <motion.p
                className="text-sm sm:text-base md:text-lg text-purple-200/80 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Not Your Average Chat App
              </motion.p>
            </motion.div>

            {/* Tag Input Section */}
            <motion.div
              variants={itemVariants}
              className="mb-4 sm:mb-5 w-full max-w-xs sm:max-w-md"
            >
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full mt-1 px-3 py-2 sm:px-4 sm:py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
                  placeholder="Type your interests..."
                />
              </div>
            </motion.div>

            {/* Tag Selection */}
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <motion.h2
                className="text-lg sm:text-xl text-purple-200 mb-3 sm:mb-4 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Select Your Tags
              </motion.h2>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-1">
                {[
                  {
                    id: "text",
                    label: "Text Chat",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: "video",
                    label: "Video Chat",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    ),
                  },
                ].map((tag) => (
                  <motion.button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`group relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base ${
                      selectedTags.includes(tag.id)
                        ? "bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border-purple-400 text-white shadow-lg shadow-purple-500/25"
                        : "bg-black/30 border-purple-500/30 text-purple-200 hover:border-purple-400 hover:bg-purple-900/20"
                    }`}
                    aria-pressed={selectedTags.includes(tag.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={
                          selectedTags.includes(tag.id) ? { rotate: 360 } : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {tag.icon}
                      </motion.div>
                      <span className="font-medium">{tag.label}</span>
                    </div>
                    {selectedTags.includes(tag.id) && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 blur-sm -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-xs sm:max-w-md"
            >
              <motion.div
                className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />

                <motion.label
                  className="flex items-start space-x-2 sm:space-x-3 text-left mb-4 sm:mb-5 cursor-pointer group"
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        isAgreed
                          ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 border-purple-400"
                          : "border-purple-400 bg-transparent"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {isAgreed && (
                          <motion.svg
                            className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                  <span className="text-xs sm:text-sm text-purple-100 leading-relaxed group-hover:text-white transition-colors">
                    I confirm I have read and agree to the{" "}
                    <Link
  to="/terms"
  className="text-purple-300 hover:text-purple-200 underline decoration-purple-400"
>
  Terms of Service
</Link>
                    .<br />I confirm that I am at least 13 years old and I have
                    reached the age of majority.
                  </span>
                </motion.label>

                <motion.button
                  className={`group relative w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
                    isAgreed && selectedTags.length > 0
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                  whileHover={
                    isAgreed && selectedTags.length > 0
                      ? { scale: 1.03, y: -2 }
                      : {}
                  }
                  whileTap={
                    isAgreed && selectedTags.length > 0 ? { scale: 0.97 } : {}
                  }
                  disabled={!isAgreed || selectedTags.length === 0}
                  onClick={() => {
                    if (isAgreed && selectedTags.length > 0) {
                      console.log("Start chatting button clicked");
                      const mode = selectedTags.includes("video")
                        ? "video"
                        : "text";
                      navigate(`/preferences?mode=${mode}`);
                    }
                  }}
                >
                  <span className="relative z-10">
                    {isAgreed && selectedTags.length > 0
                      ? "Start Chatting"
                      : !isAgreed
                      ? "Please agree to terms"
                      : "Select at least one tag"}
                  </span>
                  {isAgreed && selectedTags.length > 0 && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                    />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
