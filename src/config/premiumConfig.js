// Premium configuration for badge tiers and subscription types
import bronzeBadge from '../assets/bronze.webp';
import goldBadge from '../assets/gold.webp';
import arcaneBadge from '../assets/arcane.webp';

export const PREMIUM_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free User',
    badge: null,
    color: '#9CA3AF', // gray-400
    priority: 0
  },
  BRONZE: {
    id: 'bronze',
    name: 'Bronze Member',
    badge: bronzeBadge,
    color: '#CD7F32', // bronze color
    priority: 1,
    price: {
      monthly: 4.99,
      yearly: 49.99
    }
  },
  GOLD: {
    id: 'gold',
    name: 'Gold Member', 
    badge: goldBadge,
    color: '#FFD700', // gold color
    priority: 2,
    price: {
      monthly: 9.99,
      yearly: 99.99
    }
  },
  ARCANE: {
    id: 'arcane',
    name: 'Arcane Member',
    badge: arcaneBadge,
    color: '#8B5CF6', // violet-500 
    priority: 3,
    price: {
      monthly: 19.99,
      yearly: 199.99
    }
  }
};

export const PREMIUM_FEATURES = {
  FREE: [
    'Basic text and video chat',
    'Standard matching',
    'Community posts'
  ],
  BRONZE: [
    'All Free features',
    'Priority matching queue',
    'Ad-free experience',
    'Bronze badge display',
    'Basic chat customization',
    'Extended chat history'
  ],
  GOLD: [
    'All Bronze features', 
    'Advanced preference matching',
    'Gold badge display',
    'Custom chat themes',
    'Enhanced emoji reactions',
    'Premium support',
    'Chat partner insights'
  ],
  ARCANE: [
    'All Gold features',
    'Exclusive Arcane badge',
    'Ultimate priority matching',
    'Advanced chat analytics',
    'Custom avatar frames',
    'VIP community access',
    'Early feature access',
    'Personal chat concierge'
  ]
};

export const PREMIUM_BENEFITS = {
  BRONZE: {
    chatPriority: 1,
    adFree: true,
    customization: 'basic',
    supportLevel: 'standard',
    specialFeatures: ['priority_queue', 'extended_history']
  },
  GOLD: {
    chatPriority: 2,
    adFree: true,
    customization: 'advanced',
    supportLevel: 'premium',
    specialFeatures: ['priority_queue', 'extended_history', 'preference_matching', 'chat_themes', 'partner_insights']
  },
  ARCANE: {
    chatPriority: 3,
    adFree: true,
    customization: 'ultimate',
    supportLevel: 'vip',
    specialFeatures: ['priority_queue', 'extended_history', 'preference_matching', 'chat_themes', 'partner_insights', 'analytics', 'vip_access', 'early_features']
  }
};

// Helper functions
export const getUserTier = (premiumStatus) => {
  if (!premiumStatus || !premiumStatus.isActive) {
    return PREMIUM_TIERS.FREE;
  }
  
  const tierKey = premiumStatus.tier?.toUpperCase() || 'FREE';
  return PREMIUM_TIERS[tierKey] || PREMIUM_TIERS.FREE;
};

export const getTierFeatures = (tier) => {
  const tierKey = tier.toUpperCase();
  return PREMIUM_FEATURES[tierKey] || PREMIUM_FEATURES.FREE;
};

export const getTierBenefits = (tier) => {
  const tierKey = tier.toUpperCase();
  return PREMIUM_BENEFITS[tierKey] || {};
};

export const getTierByPriority = (priority) => {
  return Object.values(PREMIUM_TIERS).find(tier => tier.priority === priority) || PREMIUM_TIERS.FREE;
};

export const compareTiers = (tier1, tier2) => {
  const t1 = typeof tier1 === 'string' ? PREMIUM_TIERS[tier1.toUpperCase()] : tier1;
  const t2 = typeof tier2 === 'string' ? PREMIUM_TIERS[tier2.toUpperCase()] : tier2;
  
  return (t1?.priority || 0) - (t2?.priority || 0);
};

export const formatTierName = (tier) => {
  const tierObj = typeof tier === 'string' ? PREMIUM_TIERS[tier.toUpperCase()] : tier;
  return tierObj?.name || 'Free User';
};
