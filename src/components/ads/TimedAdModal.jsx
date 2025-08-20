import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdSenseAd from './AdSenseAd';

const TimedAdModal = ({ isOpen, onAdCompleted, duration = 15 }) => {
  const [countdown, setCountdown] = useState(duration);
  const [canClose, setCanClose] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      setCountdown(duration);
      setCanClose(false);
      return;
    }
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [isOpen, countdown, duration]);
  
  const handleClose = () => {
    if (canClose) {
      onAdCompleted();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl max-w-2xl w-full"
          >
            {/* Ad Header */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">Advertisement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm">
                    {countdown > 0 ? `${countdown}s` : 'Ready to close'}
                  </span>
                  {canClose && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleClose}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                      title="Close Ad"
                    >
                      ×
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ad Content Area */}
            <div className="p-6">
              <AdSenseAd
                adSlot="TIMED_AD_SLOT_ID"
                placeholderText="10-Minute Interval Advertisement"
                placeholderHeight="300px"
                style={{ 
                  display: 'block',
                  width: '100%',
                  minHeight: '300px'
                }}
                className="rounded-lg"
              />
            </div>
            
            {/* Ad Footer */}
            <div className="p-4 border-t border-gray-700/50 text-center">
              <p className="text-gray-400 text-xs">
                {canClose 
                  ? "You can now close this advertisement" 
                  : `Please wait ${countdown} seconds before closing`
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimedAdModal;
