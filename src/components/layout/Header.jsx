/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import PremiumModal from "../premium/PremiumModal";
import ReactDOM from "react-dom";
import logo from "/src/assets/logo.png"; // Adjust path based on your project structure

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const location = useLocation();
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(80); // Default header height
  const [mobileMenuHeight, setMobileMenuHeight] = useState(180); // Default mobile menu height

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("showPremium") === "true") {
      setIsPremiumModalOpen(true);
    }
  }, [location.search]);

  // Dynamically measure header and mobile menu heights
  useEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      if (mobileMenuRef.current && isMenuOpen) {
        setMobileMenuHeight(
          headerRef.current.offsetHeight + mobileMenuRef.current.offsetHeight
        );
      }
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, [isMenuOpen]);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  const modalRoot = document.getElementById("modal-root") || document.body;

  return (
    <>
      {/* Placeholder to reserve space for the fixed header */}
      <div
        className="w-full bg-transparent"
        style={{
          height: isMenuOpen ? `${mobileMenuHeight}px` : `${headerHeight}px`, // Responsive height
          transition: "height 0.3s ease", // Smooth transition
        }}
      />

      {/* Premium Modal */}
      {ReactDOM.createPortal(
        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
        />,
        modalRoot
      )}

      <motion.header
        ref={headerRef}
        variants={headerVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/40 backdrop-blur-md border-b border-purple-500/30 shadow-2xl shadow-purple-500/20"
            : "bg-black/20 backdrop-blur-md border-b border-purple-500/20"
        }`}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black/30 to-fuchsia-900/20 opacity-70" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                <img
                  src={logo}
                  alt="Voodo Logo"
                  className="h-8 sm:h-10 relative z-10"
                />
              </motion.div>
              <motion.span
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Voodo.
              </motion.span>
            </motion.div>

            {/* Hamburger Menu for Mobile */}
            <motion.button
              className="sm:hidden text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </motion.button>

            {/* Right Section - Desktop */}
            <motion.div
              variants={itemVariants}
              className="hidden sm:flex items-center space-x-3 lg:space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/community"
                  className="group relative px-4 lg:px-6 py-2 bg-gradient-to-r from-purple-600/50 to-fuchsia-600/50 backdrop-blur-sm border border-purple-400 text-white rounded-full font-medium text-sm lg:text-base transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40 overflow-hidden"
                >
                  <span className="relative z-10">Join Community</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                  />
                </Link>
              </motion.div>
              <motion.button
                className="group relative px-4 lg:px-6 py-2 bg-black/30 backdrop-blur-sm border border-purple-500/30 text-white rounded-full font-medium text-sm lg:text-base overflow-hidden transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setIsPremiumModalOpen(true)}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Premium</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.button>
              <motion.button
                className="group relative px-4 lg:px-6 py-2 bg-black/30 backdrop-blur-sm border border-purple-500/30 text-white rounded-full font-medium text-sm lg:text-base overflow-hidden transition-all duration-300 hover:border-purple-400 hover:bg-purple-900/20"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              className="sm:hidden mt-4 bg-black/50 backdrop-blur-md border border-purple-500/30 rounded-lg p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3">
                <Link
                  to="/community"
                  className="group relative px-4 py-2 bg-gradient-to-r from-purple-600/50 to-fuchsia-600/50 backdrop-blur-sm border border-purple-400 text-white rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-300/40 overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">Join Community</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                  />
                </Link>
                <button
                  className="group relative px-4 py-2 bg-black/30 backdrop-blur-sm border border-purple-gray/30 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:border-purple-300 hover:bg-purple/20"
                  onClick={() => {
                    setIsPremiumModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Premium</span>
                  </span>
                </button>
                <button
                  className="group relative px-4 py-2 bg-black/30 backdrop-blur-sm border border-purple-gray/30 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:border-purple-300 hover:bg-purple/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download</span>
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom border glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </motion.header>
    </>
  );
};

export default Header;
