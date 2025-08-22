// src/pages/Stats.jsx
import React, { useEffect, useState } from "react";
import XPChart from "../components/Xpchart";
import StreakCalendar from "../components/StreakCalendar";
import Badges from "../components/Badges";
import axios from 'axios';

const StatsPage = () => {
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, streak: 0, badges: [] });
  const [weeklyXp, setWeeklyXp] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchStats = async () => {
        try {
            const res = await axios.get("https://skillup-backend-cq6x.onrender.com/api/user/stats", config);
            setUserStats(res.data);
        } catch (err) {
            console.error("Failed to fetch user stats", err);
        }
    };

    const fetchWeeklyXp = async () => {
        try {
            const res = await axios.get("https://skillup-backend-cq6x.onrender.com/api/user/weekly-xp", config);
            setWeeklyXp(res.data);
        } catch (err) {
            console.error("Failed to fetch weekly XP data", err);
        }
    };

    fetchStats();
    fetchWeeklyXp();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-800 mb-10">
        📊 Your Progress Stats
      </h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white hover:shadow-xl transition duration-300 shadow-md rounded-xl p-6 text-center">
          <p className="text-lg text-gray-500 font-medium">🎖 Level</p>
          <p className="text-3xl font-bold text-indigo-700">{userStats.level}</p>
        </div>

        <div className="bg-white hover:shadow-xl transition duration-300 shadow-md rounded-xl p-6 text-center">
          <p className="text-lg text-gray-500 font-medium">⚡ XP</p>
          <p className="text-3xl font-bold text-indigo-700">{userStats.xp}</p>
        </div>

        <div className="bg-white hover:shadow-xl transition duration-300 shadow-md rounded-xl p-6 text-center">
          <p className="text-lg text-gray-500 font-medium">🔥 Streak</p>
          <p className="text-3xl font-bold text-indigo-700">{userStats.streak || 0} days</p>
        </div>
      </div>

      {/* XP Chart and Badges */}
      <div className="lg:col-span-2 space-y-10">
        <XPChart data={weeklyXp} />
        <Badges earnedBadges={userStats.badges} />
      </div>

      {/* Streak Calendar */}
      <div className="lg:col-span-1">
        <StreakCalendar />
      </div>
    </div>
  );
};

export default StatsPage;

