import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import AdSenseAd from './AdSenseAd';

const CommunityAdInjector = ({ 
  posts, 
  shouldShowAds, 
  children, 
  compact = false 
}) => {
  const postsWithAds = useMemo(() => {
    if (!shouldShowAds || !posts.length) return posts;
    
    const result = [];
    posts.forEach((post, index) => {
      result.push(post);
      
      // Insert ad every 5th position (after posts 4, 9, 14, etc.)
      if ((index + 1) % 5 === 0) {
        result.push({
          _id: `community-ad-${Math.floor(index / 5)}`,
          isAd: true,
          adType: 'community',
          adIndex: Math.floor(index / 5)
        });
      }
    });
    
    return result;
  }, [posts, shouldShowAds]);
  
  const CommunityAdComponent = ({ adIndex, compact }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`break-inside-avoid ${compact ? 'mb-3' : 'mb-4 sm:mb-6'}`}
    >
      <div className={`bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden ${
        compact ? 'p-3' : 'p-4'
      }`}>
        {/* Ad Label */}
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>📢</span>
            <span>Sponsored Content</span>
          </div>
        </div>
        
        {/* AdSense Ad */}
        <AdSenseAd
          adSlot="COMMUNITY_AD_SLOT_ID"
          placeholderText="Community Feed Advertisement"
          placeholderHeight={compact ? "200px" : "250px"}
          style={{ 
            display: 'block',
            width: '100%',
            minHeight: compact ? '200px' : '250px'
          }}
          className="rounded-lg"
        />
        
        {/* Premium upsell message */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Get ad-free experience with Premium
          </p>
        </div>
      </div>
    </motion.div>
  );
  
  return children ? children(postsWithAds, CommunityAdComponent) : (
    <div className="space-y-4">
      {postsWithAds.map((item) => (
        item.isAd ? (
          <CommunityAdComponent 
            key={item._id}
            adIndex={item.adIndex}
            compact={compact}
          />
        ) : (
          <div key={item._id}>
            {/* Original post content would go here */}
            {item.content}
          </div>
        )
      ))}
    </div>
  );
};

export default CommunityAdInjector;
