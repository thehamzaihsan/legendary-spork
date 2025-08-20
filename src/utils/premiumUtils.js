// This file contains utility functions for managing user premium status

/**
 * Check if a user has premium status
 * @param {string} userId - User ID to check
 * @returns {boolean} Whether the user has premium status
 */
export const hasPremium = (userId) => {
  try {
    const premiumData = localStorage.getItem('voodoPremium');
    if (!premiumData) return false;
    
    const { isActive, expiry } = JSON.parse(premiumData);
    const now = new Date();
    const expiryDate = new Date(expiry);
    
    return isActive && expiryDate > now;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

/**
 * Get premium expiry date if active
 * @param {string} userId - User ID to check
 * @returns {Date|null} Premium expiry date or null if not active
 */
export const getPremiumExpiry = (userId) => {
  try {
    const premiumData = localStorage.getItem('voodoPremium');
    if (!premiumData) return null;
    
    const { isActive, expiry } = JSON.parse(premiumData);
    if (!isActive) return null;
    
    return new Date(expiry);
  } catch (error) {
    console.error('Error getting premium expiry:', error);
    return null;
  }
};

/**
 * Get time remaining on premium subscription
 * @param {string} userId - User ID to check
 * @returns {Object|null} Time remaining object with hours, minutes, seconds or null if not active
 */
export const getPremiumTimeRemaining = (userId) => {
  const expiryDate = getPremiumExpiry(userId);
  if (!expiryDate) return null;
  
  const now = new Date();
  const timeRemaining = expiryDate - now;
  
  if (timeRemaining <= 0) return null;
  
  // Convert milliseconds to hours, minutes, seconds
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

/**
 * Format premium time remaining as string
 * @param {string} userId - User ID to check
 * @returns {string} Formatted time remaining or empty string if not active
 */
export const formatPremiumTimeRemaining = (userId) => {
  const remaining = getPremiumTimeRemaining(userId);
  if (!remaining) return '';
  
  const { hours, minutes, seconds } = remaining;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s remaining`;
  } else {
    return `${seconds}s remaining`;
  }
};
