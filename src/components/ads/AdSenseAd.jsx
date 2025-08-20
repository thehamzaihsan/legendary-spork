import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AdSenseAd = ({ 
  adSlot = "PLACEHOLDER_SLOT_ID", 
  adClient = "ca-pub-PLACEHOLDER_CLIENT_ID",
  adFormat = "auto",
  style = { display: 'block' },
  className = "",
  placeholderText = "Advertisement",
  placeholderHeight = "250px",
  isResponsive = true
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Only try to load ads if we have real AdSense IDs (not placeholders)
    if (adClient !== "ca-pub-PLACEHOLDER_CLIENT_ID" && adSlot !== "PLACEHOLDER_SLOT_ID") {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adClient, adSlot]);

  // Show placeholder if using demo IDs
  if (adClient === "ca-pub-PLACEHOLDER_CLIENT_ID" || adSlot === "PLACEHOLDER_SLOT_ID") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-purple-500/20 flex items-center justify-center ${className}`}
        style={{ minHeight: placeholderHeight, ...style }}
      >
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">📺</div>
          <p className="text-sm font-medium">{placeholderText}</p>
          <p className="text-xs text-gray-500 mt-1">AdSense Placeholder</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={isResponsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdSenseAd;
