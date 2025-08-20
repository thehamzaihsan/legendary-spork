import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const PreferencesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Get chat mode from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const chatMode = searchParams.get("mode") || "video";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Debug effect
  useEffect(() => {
    console.log("Preferences selected:", {
      gender,
      lookingFor,
      dateOfBirth,
      isAgeConfirmed,
      isPremium,
    });
  }, [gender, lookingFor, dateOfBirth, isAgeConfirmed, isPremium]);

  // Check if user has premium from localStorage
  useEffect(() => {
    const premiumStatus = localStorage.getItem("voodoPremium");
    if (premiumStatus) {
      const { isActive, expiry } = JSON.parse(premiumStatus);
      if (isActive && new Date(expiry) > new Date()) {
        setIsPremium(true);
      } else {
        localStorage.removeItem("voodoPremium");
      }
    }
  }, []);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const handleStartChat = () => {
    if (!gender || !lookingFor || !isAgeConfirmed) {
      return;
    }

    let age = null;
    if (dateOfBirth.year && dateOfBirth.month && dateOfBirth.day) {
      const birthDate = new Date(
        parseInt(dateOfBirth.year),
        parseInt(dateOfBirth.month) - 1,
        parseInt(dateOfBirth.day)
      );
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    const preferences = {
      gender,
      lookingFor,
      age,
      isPremium,
    };
    localStorage.setItem("voodoPreferences", JSON.stringify(preferences));

    if (socket) {
      socket.emit("setPreferences", preferences);
    }

    navigate(`/chat?mode=${chatMode}`);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/90 to-fuchsia-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.15),transparent_50%)]" />
      </div>

      {/* Interactive cursor glow (disabled on mobile) */}
      <motion.div
        className="absolute pointer-events-none z-0 hidden md:block"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
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
        <div className="w-96 h-96 bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 rounded-full blur-3xl" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 w-full max-w-md sm:max-w-lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Before You Start
            </h1>
            <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full mx-auto mb-4" />
            <p className="text-purple-200 text-sm sm:text-base">
              Let us know a bit about you to enhance your chat experience
            </p>

            {isPremium && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block mt-3 px-3 py-1 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full text-xs sm:text-sm font-medium text-white"
              >
                Premium Active
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-xl"
          >
            {/* Gender selection */}
            <div className="mb-6">
              <label className="flex items-center text-purple-200 mb-3 text-base sm:text-lg">
                <span className="mr-2">👤</span>
                What Best Describes You?
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {["Male", "Female", "Other"].map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => setGender(option.toLowerCase())}
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base truncate ${
                      gender === option.toLowerCase()
                        ? "bg-gradient-to-r from-purple-600/70 to-fuchsia-600/70 text-white border-purple-400"
                        : "bg-black/50 border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
                    } border`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Looking for */}
            <div className="mb-6">
              <label className="flex items-center text-purple-200 mb-3 text-base sm:text-lg">
                <span className="mr-2">👥</span>
                Looking To Meet?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {["Everyone", "Men", "Women", "Other"].map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => setLookingFor(option.toLowerCase())}
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base truncate ${
                      lookingFor === option.toLowerCase()
                        ? "bg-gradient-to-r from-purple-600/70 to-fuchsia-600/70 text-white border-purple-400"
                        : "bg-black/50 border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
                    } border`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="mb-6">
              <label className="flex items-center text-purple-200 mb-3 text-base sm:text-lg">
                <span className="mr-2">🎂</span>
                Date of Birth
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={dateOfBirth.month}
                  onChange={(e) =>
                    setDateOfBirth({ ...dateOfBirth, month: e.target.value })
                  }
                  className="bg-black/50 border border-purple-500/30 text-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 flex-1 text-sm sm:text-base"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <div className="text-gray-400">/</div>
                <select
                  value={dateOfBirth.day}
                  onChange={(e) =>
                    setDateOfBirth({ ...dateOfBirth, day: e.target.value })
                  }
                  className="bg-black/50 border border-purple-500/30 text-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 flex-1 text-sm sm:text-base"
                >
                  <option value="">DD</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <div className="text-gray-400">/</div>
                <select
                  value={dateOfBirth.year}
                  onChange={(e) =>
                    setDateOfBirth({ ...dateOfBirth, year: e.target.value })
                  }
                  className="bg-black/50 border border-purple-500/30 text-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 flex-1 text-sm sm:text-base"
                >
                  <option value="">YYYY</option>
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - 13 - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age confirmation */}
            <div className="mb-6">
              <motion.label
                className="flex items-start space-x-3 text-left cursor-pointer group"
                whileHover={{ scale: 1.01 }}
              >
                <motion.div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={isAgeConfirmed}
                    onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                    className="sr-only"
                  />
                  <motion.div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      isAgeConfirmed
                        ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 border-purple-400"
                        : "border-purple-400 bg-transparent"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isAgeConfirmed && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </motion.div>
                </motion.div>
                <span className="text-xs sm:text-sm text-purple-100 leading-relaxed group-hover:text-white transition-colors">
                  I confirm that I am at least 18 years old and have read and
                  agree to the{" "}
                  <span className="text-purple-300 hover:text-purple-200 underline decoration-purple-400">
                    Terms Of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-300 hover:text-purple-200 underline decoration-purple-400">
                    Privacy Policy
                  </span>
                  .
                </span>
              </motion.label>
            </div>

            {/* Start button */}
            <motion.button
              className={`group relative w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                gender && lookingFor && isAgeConfirmed
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              whileHover={
                gender && lookingFor && isAgeConfirmed ? { scale: 1.02 } : {}
              }
              whileTap={
                gender && lookingFor && isAgeConfirmed ? { scale: 0.98 } : {}
              }
              disabled={!gender || !lookingFor || !isAgeConfirmed}
              onClick={handleStartChat}
            >
              Start
              {gender && lookingFor && isAgeConfirmed && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-400 opacity-0 group-hover:opacity-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
              )}
            </motion.button>

            {/* Back button */}
            <div className="mt-4 text-center">
              <motion.button
                onClick={() => navigate("/")}
                className="text-purple-300 hover:text-white transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Back
              </motion.button>
            </div>
          </motion.div>

          {/* Premium benefits reminder */}
          {!isPremium && (
            <motion.div
              variants={itemVariants}
              className="mt-6 p-4 bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 rounded-xl text-center"
            >
              <p className="text-purple-200 mb-2 text-sm sm:text-base">
                Unlock premium features for enhanced matching
              </p>
              <motion.button
                onClick={() => navigate("/?showPremium=true")}
                className="text-xs sm:text-sm px-3 sm:px-4 py-1 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Premium
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PreferencesPage;
