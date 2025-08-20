import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdSenseAd from './AdSenseAd';

const VideoPrerollBanner = ({ 
  shouldShow, 
  onAdCompleted, 
  videoDuration,
  compact = false 
}) => {
  const [countdown, setCountdown] = useState(5);
  const [showSkip, setShowSkip] = useState(false);
  
  useEffect(() => {
    if (!shouldShow) {
      setCountdown(5);
      setShowSkip(false);
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [shouldShow]);
  
  const handleSkip = () => {
    onAdCompleted();
  };
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl"
        >
          <div className={`w-full max-w-lg mx-4 ${compact ? 'max-w-sm' : ''}`}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl border border-purple-500/30 overflow-hidden"
            >
              {/* Ad Header */}
              <div className="p-3 bg-gray-800/50 border-b border-gray-700/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-white text-sm">Video Advertisement</span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    {countdown > 0 ? `${countdown}s` : 'Ready'}
                  </span>
                </div>
              </div>
              
              {/* Ad Content */}
              <div className="p-4">
                <AdSenseAd
                  adSlot="VIDEO_PREROLL_AD_SLOT_ID"
                  placeholderText="Video Preroll Advertisement"
                  placeholderHeight={compact ? "150px" : "200px"}
                  style={{ 
                    display: 'block',
                    width: '100%',
                    minHeight: compact ? '150px' : '200px'
                  }}
                  className="rounded-lg"
                />
              </div>
              
              {/* Ad Footer */}
              <div className="p-3 bg-gray-800/50 border-t border-gray-700/50">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    Ad will close in {countdown > 0 ? countdown : 0} seconds
                  </p>
                  {showSkip && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleSkip}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                    >
                      Continue to Video
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPrerollBanner;
