import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(null); // 'Help/Faq' | 'community guidelines' | null

  const Modal = ({ title, content, onClose }) => (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 text-white rounded-xl p-6 max-w-md w-full shadow-lg border border-voodo-purple-500"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h2 className="text-voodo-purple-300 text-xl font-bold mb-4">{title}</h2>
          <p className="text-gray-300 text-sm mb-6">{content}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-voodo-purple-600 hover:bg-voodo-purple-700 transition-colors text-sm"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      <footer className="bg-black bg-opacity-95 backdrop-blur-sm text-white py-6 px-6 w-full border-t border-voodo-purple-800/30">
        <div className="container mx-auto">
          {/* Upper section with links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company section */}
            <div className="space-y-4">
              <motion.h3
                className="text-voodo-purple-300 font-mono text-lg font-bold tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                VODOO
              </motion.h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Connecting Gen-Z minds through immersive conversations and shared
                experiences.
              </p>
            </div>

            {/* Links section 1 */}
            <div className="space-y-4">
              <h3 className="text-voodo-purple-300 font-mono text-sm font-bold">
                EXPLORE
              </h3>
              <ul className="space-y-3 text-sm">
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-voodo-purple-300 transition-colors"
                  >
                    About Us
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                              <button
  onClick={() => navigate("/helpfaq")}
  className="text-gray-400 hover:text-voodo-purple-300 transition-colors"
>
Help/faqs</button>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                <button
  onClick={() => navigate("/communityGuide")}
  className="text-gray-400 hover:text-voodo-purple-300 transition-colors"
>
  community guidelines
</button>

                </motion.li>
              </ul>
            </div>

            {/* Links section 2 */}
            <div className="space-y-4">
              <h3 className="text-voodo-purple-300 font-mono text-sm font-bold">
                LEGAL
              </h3>
              <ul className="space-y-3 text-sm">
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a href="/contact" className="text-gray-400 hover:text-voodo-purple-300 transition-colors">Contact Us</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a href="/terms" className="text-gray-400 hover:text-voodo-purple-300 transition-colors">Terms</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a href="/privacy" className="text-gray-400 hover:text-voodo-purple-300 transition-colors">Privacy</a>
                </motion.li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs mb-4 md:mb-0">
              &copy; {currentYear} Vodoo. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {/* (social icons remain unchanged) */}
            </div>
          </div>
        </div>

        {/* Admin button */}
        <motion.button
          onClick={() => navigate("/admin")}
          className="opacity-30 hover:opacity-100 transition-opacity fixed bottom-4 right-4 w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg border border-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0 5.986 5.986 0 00-.554-2.084A5 5 0 0010 7z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </footer>

      {/* Modals */}
      {showModal === "Help/Faq" && (
        <Modal
          title="Help/Faq"
          content="Help/Faq new conversations, curated content, and trending topics across Gen-Z communities. From shared interests to inspiring stories — this is where ideas spark."
          onClose={() => setShowModal(null)}
        />
      )}
      {showModal === "community guidelines" && (
        <Modal
          title="community guidelines"
          content="Your community guidelines matters. Voodoo ensures a respectful space by enforcing community guidelines and moderation to foster a positive experience."
          onClose={() => setShowModal(null)}
        />
      )}
    </>
  );
};

export default Footer;
