import React from 'react';
import { motion } from 'framer-motion';
import AdSenseAd from './AdSenseAd';
import { useAdSystem } from '../../hooks/useAdSystem';

const ChatAdSpace = ({ 
  position = 'sidebar',
  className = '',
  style = {}
}) => {
  const { isPremium } = useAdSystem();
  
  // Don't show ads for premium users
  if (isPremium) return null;
  
  const adConfigs = {
    sidebar: {
      slot: 'CHAT_SIDEBAR_AD_SLOT_ID',
      placeholder: 'Chat Sidebar Advertisement',
      height: '250px',
      containerClass: 'w-full mb-4'
    },
    bottom: {
      slot: 'CHAT_BOTTOM_AD_SLOT_ID', 
      placeholder: 'Chat Bottom Advertisement',
      height: '100px',
      containerClass: 'w-full mt-4'
    },
    inline: {
      slot: 'CHAT_INLINE_AD_SLOT_ID',
      placeholder: 'Chat Inline Advertisement', 
      height: '120px',
      containerClass: 'w-full my-3'
    },
    corner: {
      slot: 'CHAT_CORNER_AD_SLOT_ID',
      placeholder: 'Corner Advertisement',
      height: '200px', 
      containerClass: 'w-64'
    }
  };
  
  const config = adConfigs[position] || adConfigs.sidebar;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${config.containerClass} ${className}`}
      style={style}
    >
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-3">
        {/* Ad Label (AdSense Compliance) */}
        <div className="text-center mb-2">
          <span className="text-xs text-gray-400">Advertisement</span>
        </div>
        
        {/* AdSense Ad */}
        <AdSenseAd
          adSlot={config.slot}
          placeholderText={config.placeholder}
          placeholderHeight={config.height}
          style={{ 
            display: 'block',
            width: '100%',
            minHeight: config.height
          }}
          className="rounded-lg"
        />
        
        {/* Ad Controls (AdSense Compliance) */}
        <div className="text-center mt-2">
          <button className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            Why this ad? • Report
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatAdSpace;
