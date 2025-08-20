import React from 'react';

const COLORS = {
  bronze: { bg: 'bg-amber-600/20', text: 'text-amber-300', ring: 'border-amber-500/30', label: 'Bronze' },
  gold: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', ring: 'border-yellow-400/30', label: 'Gold' },
  arcane: { bg: 'bg-purple-600/20', text: 'text-purple-300', ring: 'border-purple-500/30', label: 'Arcane' },
  silver: { bg: 'bg-gray-400/20', text: 'text-gray-200', ring: 'border-gray-300/30', label: 'Silver' },
};

const BadgeChip = ({ tier }) => {
  if (!tier) return null;
  const c = COLORS[tier] || COLORS.bronze;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.ring}`}>
      👑 {c.label}
    </span>
  );
};

export default BadgeChip;


