import React from 'react';
import { useAdSystem } from '../../hooks/useAdSystem';
import TimedAdModal from './TimedAdModal';

/**
 * Central AdSense Manager Component
 * Handles timed ads and provides context for all ad components
 */
const AdSenseManager = ({ children }) => {
  const { 
    shouldShowVideoAd, 
    onVideoAdCompleted,
    isPremium 
  } = useAdSystem();
  
  return (
    <>
      {children}
      
      {/* Timed Ad Modal (every 10 minutes) */}
      {!isPremium && (
        <TimedAdModal 
          isOpen={shouldShowVideoAd} 
          onAdCompleted={onVideoAdCompleted}
          duration={15} // 15 seconds before user can close
        />
      )}
    </>
  );
};

export default AdSenseManager;
