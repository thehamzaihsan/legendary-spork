import { useState, useEffect, useMemo } from 'react';
import { usePremiumStatus } from './usePremiumStatus';

export const useAdSystem = () => {
  const { badgeData } = usePremiumStatus();
  const [sessionStartTime] = useState(Date.now());
  const [lastAdTime, setLastAdTime] = useState(Date.now());
  const [shouldShowVideoAd, setShouldShowVideoAd] = useState(false);
  
  const isPremium = !!badgeData;
  const AD_INTERVAL = 10 * 60 * 1000; // 10 minutes
  
  // Timer for 10-minute video ads (AdSense compliant)
  useEffect(() => {
    if (isPremium) return;
    
    const checkAdTime = () => {
      const now = Date.now();
      const timeSinceLastAd = now - lastAdTime;
      
      if (timeSinceLastAd >= AD_INTERVAL) {
        setShouldShowVideoAd(true);
      }
    };
    
    // Check every 30 seconds for ad timing
    const interval = setInterval(checkAdTime, 30000);
    return () => clearInterval(interval);
  }, [lastAdTime, isPremium]);
  
  const onVideoAdCompleted = () => {
    setLastAdTime(Date.now());
    setShouldShowVideoAd(false);
  };
  
  // Community post ad logic (every 5th post)
  const shouldShowCommunityAd = (postIndex) => {
    return !isPremium && (postIndex + 1) % 5 === 0;
  };
  
  // Video preroll ad logic (30% of 15+ second videos)
  const shouldShowVideoPreroll = (videoDuration, videoId) => {
    if (isPremium || videoDuration < 15) return false;
    
    // Use consistent hash-based selection for same video
    const videoHash = hashString(videoId);
    const showAdThreshold = 0.3; // 30% of eligible videos
    
    return (videoHash % 100) / 100 < showAdThreshold;
  };
  
  // Helper function for consistent video selection
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  return {
    isPremium,
    shouldShowVideoAd,
    onVideoAdCompleted,
    shouldShowCommunityAd,
    shouldShowVideoPreroll,
    sessionDuration: Date.now() - sessionStartTime
  };
};

export default useAdSystem;
