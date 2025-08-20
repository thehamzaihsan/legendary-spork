import { useState, useEffect, useCallback, useRef } from 'react';
import { premiumApi } from '../services/premiumApi.js';
import { useSocket } from './useSocket.js';

/**
 * Custom hook for managing premium status with backend validation
 * This is the single source of truth for premium status in the frontend
 */
export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumData, setPremiumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anonUserId, setAnonUserId] = useState(null);
  const [lastValidation, setLastValidation] = useState(null);
  const { socket } = useSocket();
  
  // Refs for cleanup
  const heartbeatIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  /**
   * Get or create client session ID
   */
  const initializeAnon = useCallback(() => {
    const id = premiumApi.ensureAnonUserId();
    setAnonUserId(id);
    return id;
  }, []);

  /**
   * Clean up stale premium data in localStorage
   */
  const cleanupStaleData = useCallback(() => {
    try {
      const premiumData = localStorage.getItem('voodoPremium');
      if (premiumData) {
        const parsed = JSON.parse(premiumData);
        const now = new Date();
        const expiryDate = new Date(parsed.expiry);
        
        // If expired, remove from localStorage
        if (expiryDate <= now) {
          localStorage.removeItem('voodoPremium');
          console.log('🧹 Cleaned up expired premium data from localStorage');
        }
      }
    } catch (error) {
      console.warn('Error cleaning up localStorage:', error);
      localStorage.removeItem('voodoPremium');
    }
  }, []);

  /**
   * Validate premium status with backend (heartbeat)
   */
  const validateWithBackend = useCallback(async () => {
    try {
      const { purchases, serverTime } = await premiumApi.getStatus();
      setLastValidation(new Date(serverTime));
      const badge = premiumApi.getActiveBadge(purchases);
      if (badge) {
        setIsPremium(true);
        setPremiumData({
          planType: badge.tier === 'bronze' ? '30min' : badge.tier === 'gold' ? '1hour' : '24hour',
          purchaseTime: null,
          expiryTime: new Date(badge.endAt),
          minutesRemaining: Math.floor((new Date(badge.endAt).getTime() - Date.now()) / 60000),
          serverTime: new Date(serverTime)
        });
        // emit status+tier to server for partner badge propagation
        try {
          socket?.emit('setPremiumStatus', { isPremium: true, expiryDate: badge.endAt, tier: badge.tier });
        } catch (_) {}
      } else {
        setIsPremium(false);
        setPremiumData(null);
        try { socket?.emit('setPremiumStatus', { isPremium: false }); } catch (_) {}
      }
    } catch (e) {
      // fall back to local cache
      const local = premiumApi.getLocalPurchases();
      const badge = premiumApi.getActiveBadge(local);
      if (badge) {
        setIsPremium(true);
        setPremiumData({
          planType: badge.tier === 'bronze' ? '30min' : badge.tier === 'gold' ? '1hour' : '24hour',
          expiryTime: new Date(badge.endAt),
          isUnvalidated: true,
        });
        try { socket?.emit('setPremiumStatus', { isPremium: true, expiryDate: badge.endAt, tier: badge.tier }); } catch (_) {}
      } else {
        setIsPremium(false);
        setPremiumData(null);
        try { socket?.emit('setPremiumStatus', { isPremium: false }); } catch (_) {}
      }
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  /**
   * Get badge information for plan type
   */
  const getBadgeInfo = (planType) => {
    switch (planType) {
      case '30min':
        return {
          name: 'Bronze',
          tier: 'bronze',
          color: '#CD7F32'
        };
      case '1hour':
        return {
          name: 'Gold',
          tier: 'gold',
          color: '#FFD700'
        };
      case '24hour':
        return {
          name: 'Arcane',
          tier: 'arcane',
          color: '#8B5CF6'
        };
      default:
        return {
          name: 'Bronze',
          tier: 'bronze',
          color: '#CD7F32'
        };
    }
  };

  /**
   * Start the heartbeat validation
   */
  const startHeartbeat = useCallback(() => {
    // Clear any existing interval
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Validate immediately
    validateWithBackend();

    // Set up interval for every minute
    heartbeatIntervalRef.current = setInterval(() => {
      validateWithBackend();
    }, 60000); // 60 seconds

    console.log('💓 Premium heartbeat started');
  }, [validateWithBackend]);

  /**
   * Stop the heartbeat validation
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
      console.log('💓 Premium heartbeat stopped');
    }
  }, []);

  /**
   * Manually refresh premium status
   */
  const refreshPremiumStatus = useCallback(() => {
    setIsLoading(true);
    validateWithBackend();
  }, [validateWithBackend]);

  /**
   * Clear premium status (for testing or logout)
   */
  const clearPremiumStatus = useCallback(() => {
    setIsPremium(false);
    setPremiumData(null);
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    mountedRef.current = true;
    
    // Clean up stale data first
    cleanupStaleData();
    
    // Initialize client session
    const id = initializeAnon();
    startHeartbeat();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      stopHeartbeat();
    };
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopHeartbeat();
    };
  }, [stopHeartbeat]);

  // Return hook interface
  return {
    // Status
    isPremium,
    premiumData,
    isLoading,
    clientSessionId: anonUserId,
    lastValidation,
    
    // Actions
    refreshPremiumStatus,
    clearPremiumStatus,
    
    // Helper functions
    getBadgeInfo: (planType) => getBadgeInfo(planType),
    
    // Computed values
    timeRemaining: premiumData?.minutesRemaining || 0,
    isExpiringSoon: (premiumData?.minutesRemaining || 0) < 10, // Less than 10 minutes
    badgeData: premiumData ? getBadgeInfo(premiumData.planType) : null
  };
};