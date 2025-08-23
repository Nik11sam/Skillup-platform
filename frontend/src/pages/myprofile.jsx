import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import BurnoutAlert from "../components/BurnoutAlert";
import XPLevelGraph from '../components/XPlevelgraph';
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const username = user?.username || "User";

  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState({ level: 1, xp: 0, streak: 0, badges: [] });
  const [goals, setGoals] = useState([]);
  const [showFormId, setShowFormId] = useState(null);
  const [todayTask, setTodayTask] = useState('');
  const [hours, setHours] = useState('');
  const [hideSuggestions, setHideSuggestions] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      console.log("Fetching essential data (stats, goals)...");
      const [statsRes, goalsRes] = await Promise.all([
        axios.get("https://skillup-backend-cq6x.onrender.com/api/user/stats", config),
        axios.get("https://skillup-backend-cq6x.onrender.com/api/goals", config)
      ]);
      setStats(statsRes.data);
      setGoals(goalsRes.data);
    } catch (err) {
      console.error("Failed to fetch essential data:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login');
      }
    }

    if (user?._id) {
        try {
            const pythonApiUrl = process.env.REACT_APP_PYTHON_API_URL ;
            console.log("Fetching suggestions...");
            const suggestionsRes = await axios.get(`${pythonApiUrl}/api/suggestions/${user._id}`, config);
            setSuggestions(suggestionsRes.data.suggestions || []);
        } catch (err) {
            console.error("Could not fetch suggestions. Is the Python service running?", err);
            setSuggestions(["Suggestions are currently unavailable."]);
        }
    }
  }, [token, navigate, user?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCheckInSubmit = async (e, goalId) => {
    e.preventDefault();
    if (!todayTask || !hours) {
      alert("Please fill out all fields for the check-in.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { taskDescription: todayTask, hoursStudied: hours };
      const response = await axios.post(`https://skillup-backend-cq6x.onrender.com/api/goals/${goalId}/checkin`, body, config);

      alert(response.data.message);
      setTodayTask('');
      setHours('');
      setShowFormId(null);

      fetchData();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Check-in failed.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-red-600 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">SkillUp</h2>
          <nav>
            <button className="mb-4 w-full text-left" onClick={() => navigate('/myprofile')}>👤 Your Profile</button>
            <button className="mb-4 w-full text-left" onClick={() => navigate('/stats')}>📊 Stats</button>
            <button className="mb-4 w-full text-left" onClick={() => navigate('/goals')}>🎯 Your goals</button>
          </nav>
        </div>
        <button className="mt-8 bg-white text-red-600 py-2 px-4 rounded" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Welcome back, {username}!</h1>

        {user?._id && token && (
        <BurnoutAlert userId={user._id} token={token} />
      )}


        {/* User Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-blue-100 p-4 sm:p-6 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">Level</p>
            <p className="text-4xl text-blue-700 font-bold">{stats.level}</p>
          </div>
          <div className="bg-green-100 p-4 sm:p-6 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">XP</p>
            <p className="text-4xl text-green-700 font-bold">{stats.xp}</p>
          </div>
          <div className="bg-yellow-100 p-4 sm:p-6 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">Streak</p>
            <p className="text-4xl text-yellow-700 font-bold">{stats.streak} 🔥</p>
          </div>
          <div className="bg-purple-100 p-4 sm:p-6 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">Badges</p>
            <div className="flex items-center justify-center">
              <p className="text-4xl text-purple-700 font-bold mr-2">{stats.badges?.length || 0}</p>
              <Award className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        {!hideSuggestions && (
          <div className="flex flex-col gap-3 p-4 sm:p-6 rounded-xl bg-orange-50 border border-orange-200 shadow-sm mb-6 max-w-4xl">
            {suggestions.length === 0 ? (
              <p className="text-sm text-orange-700 mt-1">Loading suggestions...</p>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((s, idx) => (
                  <p key={idx} className="text-sm text-orange-700 leading-relaxed">{s}</p>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition"
                onClick={() => navigate('/goalform')}
              >
                Set your goal
              </button>
              <button
                className="border border-orange-300 text-orange-700 px-4 py-2 rounded-lg text-sm hover:bg-orange-100 transition"
                onClick={() => {
                  setHideSuggestions(true);
                  alert("Suggestions skipped for today!");
                }}
              >
                Skip today
              </button>
            </div>
          </div>
        )}

        {/* Goals Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Your Goals</h2>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => navigate('/goalform')}
          >
            + Create Goal
          </button>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <p className="text-gray-500">No goals added yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div key={goal._id} className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">{goal.title}</h3>
                <p className="text-sm text-gray-600">
                  📆 {new Date(goal.startDate).toLocaleDateString()} → {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : 'Ongoing'}
                </p>
                <p className="text-sm">📚 {goal.studyArea}</p>

                <XPLevelGraph xp={stats.xp} streak={goal.streak} level={stats.level} />

                <button
                  onClick={() => setShowFormId(showFormId === goal._id ? null : goal._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 my-4"
                >
                  Check-in
                </button>

                {showFormId === goal._id && (
                  <form onSubmit={(e) => handleCheckInSubmit(e, goal._id)} className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Today's Task</label>
                      <input
                        type="text"
                        value={todayTask}
                        onChange={(e) => setTodayTask(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Hours Studied</label>
                      <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <button type="submit" className="bg-green-500 text-white px-3 py-2 rounded mt-2">
                      Log Progress
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
