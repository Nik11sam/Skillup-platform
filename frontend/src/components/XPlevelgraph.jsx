import React from 'react';

const XPLevelGraph = ({ xp, streak, level }) => {
  const nextLevelXP = (level + 1) * 100;
  const progress = (xp / nextLevelXP) * 100;

  return (
    <div className="bg-white rounded  mt-2">
      <p>🔥 Streak: {streak} days</p>
      <p>🏆 Level: {level}</p>
      <div className="mt-2">
        <div className="h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{xp} XP / {nextLevelXP} XP</p>
      </div>
    </div>
  );
};

export default XPLevelGraph;
