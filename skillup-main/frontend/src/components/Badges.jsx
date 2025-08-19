import React from 'react'; // Removed useEffect and useState
import { Star, Award, Shield, Trophy } from 'lucide-react';
// Removed axios import

const badgeDesigns = {
  'streak-3': { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  'streak-7': { icon: Star, color: 'text-orange-500', bgColor: 'bg-orange-100' },
  'streak-30': { icon: Star, color: 'text-red-500', bgColor: 'bg-red-100' },
  'goal-1': { icon: Award, color: 'text-green-500', bgColor: 'bg-green-100' },
  'goal-5': { icon: Award, color: 'text-teal-500', bgColor: 'bg-teal-100' },
  'level-5': { icon: Shield, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  'level-10': { icon: Trophy, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  'default': { icon: Shield, color: 'text-gray-400', bgColor: 'bg-gray-100' }
};

// The component now accepts props
const Badges = ({ earnedBadges }) => {
  // It no longer fetches its own data

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6">
       <h2 className="text-xl font-semibold text-indigo-700 mb-4">🏆 Your Achievements</h2>
       {/* Check if earnedBadges is defined and has items */}
       {earnedBadges && earnedBadges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {earnedBadges.map((badge) => {
                const design = badgeDesigns[badge.id] || badgeDesigns.default;
                const Icon = design.icon;
                return (
                    <div key={badge.id} className="flex flex-col items-center text-center" title={badge.description}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner ${design.bgColor}`}>
                            <Icon className={`w-10 h-10 ${design.color}`} />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-gray-700">{badge.name}</p>
                    </div>
                );
            })}
        </div>
       ) : (
        <p className="text-gray-500">No badges earned yet. Keep up the great work!</p>
       )}
    </div>
  );
};

export default Badges;