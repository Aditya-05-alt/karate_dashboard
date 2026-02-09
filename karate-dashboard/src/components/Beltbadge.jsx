import React from 'react';

const BELT_COLORS = {
  // --- Solid Belts ---
  'Black': 'bg-black text-white border-black border',
  'Brown': 'bg-yellow-900 text-white border-yellow-900 border',
  'Green': 'bg-green-600 text-white border-green-600 border',
  'Purple': 'bg-purple-500 text-white border-purple-500 border',
  'Blue': 'bg-blue-500 text-white border-blue-500 border',
  'Orange': 'bg-orange-500 text-white border-orange-500 border', // Changed text to white for readability
  'Yellow': 'bg-yellow-400 text-gray-900 border-yellow-400 border',
  'White': 'bg-white text-gray-800 border-gray-300 border',

  // --- Striped Belts (Black Stripes) ---
  // Using linear-gradient for the stripe effect
  'Yellow Stripe': 'bg-[linear-gradient(90deg,#facc15_0%,#facc15_40%,#000000_40%,#000000_60%,#facc15_60%,#facc15_100%)] text-white border-yellow-400 border shadow-sm text-shadow-sm',
  
  'Green Stripe': 'bg-[linear-gradient(90deg,#16a34a_0%,#16a34a_40%,#000000_40%,#000000_60%,#16a34a_60%,#16a34a_100%)] text-white border-green-600 border shadow-sm',
  
  'Brown Stripe 1': 'bg-[linear-gradient(90deg,#713f12_0%,#713f12_40%,#000000_40%,#000000_60%,#713f12_60%,#713f12_100%)] text-white border-yellow-900 border shadow-sm',
  
  // Two stripes logic
  'Brown Stripe 2': 'bg-[linear-gradient(90deg,#713f12_0%,#713f12_35%,#000000_35%,#000000_42%,#713f12_42%,#713f12_58%,#000000_58%,#000000_65%,#713f12_65%)] text-white border-yellow-900 border shadow-sm'
};

const BeltBadge = ({ rank }) => {
  // 1. Normalize input: remove extra spaces and handle case insensitivity
  const normalize = (str) => str?.trim().toLowerCase();
  
  // 2. Find the matching key in BELT_COLORS
  const colorKey = Object.keys(BELT_COLORS).find(
    key => normalize(key) === normalize(rank)
  );

  // 3. Get the class string or use a default gray style
  const styleClass = BELT_COLORS[colorKey] || 'bg-gray-100 text-gray-600 border-gray-200 border';

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider inline-block ${styleClass}`}>
      {rank}
    </span>
  );
};

export default BeltBadge;