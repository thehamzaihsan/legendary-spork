import React from 'react';
import bronzeBadge from '../../assets/bronze.webp';
import goldBadge from '../../assets/gold.webp';
import arcaneBadge from '../../assets/arcane.webp';

const BadgeDisplay = ({ badge, size = 'sm', showTooltip = true }) => {
  if (!badge) return null;

  const getBadgeImage = (tier) => {
    switch (tier) {
      case 'bronze':
        return bronzeBadge;
      case 'gold':
        return goldBadge;
      case 'arcane':
        return arcaneBadge;
      default:
        return null;
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4';
      case 'sm':
        return 'w-5 h-5';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-10 h-10';
      default:
        return 'w-5 h-5';
    }
  };

  const badgeImage = getBadgeImage(badge.tier);
  if (!badgeImage) return null;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${getSizeClasses(size)} ${showTooltip ? 'group' : ''}`}
      title={showTooltip ? `${badge.name} Member` : ''}
    >
      <img
        src={badgeImage}
        alt={`${badge.name} Badge`}
        className={`${getSizeClasses(size)} object-contain drop-shadow-lg`}
        style={{
          filter: `drop-shadow(0 0 4px ${badge.color}40)`
        }}
      />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          {badge.name} Member
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-black/80"></div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
