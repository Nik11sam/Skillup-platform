import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import XPLevelGraph from '../components/XPlevelgraph';
import axios from 'axios';

const GoalPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showFormId, setShowFormId] = useState(null);
  const [todayTask, setTodayTask] = useState('');
  const [hours, setHours] = useState('');

  const [userStats, setUserStats] = useState({ xp: 0, level: 1 });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const username = user?.username;

  useEffect(() => {
    if (!token) {
      alert("Not authorized. Please login.");
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchGoals = async () => {
      try {
        const response = await axios.get("/api/goals", config);
        setGoals(response.data);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
        alert("Could not fetch goals. Please try again.");
      }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get("/api/user/stats", config);
            setUserStats(response.data);
        } catch (error) {
            console.error("Failed to fetch user stats:", error);
            setUserStats({ xp: user?.xp || 0, level: user?.level || 1 });
        }
    };

    fetchGoals();
    fetchStats();
  }, [navigate, token, user?.xp, user?.level]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCheckInSubmit = async (e, goalId) => {
    e.preventDefault();
    if (!todayTask || !hours) {
      alert("Please fill out all fields for the check-in.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const body = {
        taskDescription: todayTask,
        hoursStudied: hours,
      };
      const response = await axios.post(`/api/goals/${goalId}/checkin`, body, config);

      alert(response.data.message);

      if (response.data.userXp) {
          setUserStats(prevStats => ({ ...prevStats, xp: response.data.userXp }));
      }

      setTodayTask('');
      setHours('');
      setShowFormId(null);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Check-in failed.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-red-600 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">SkillUp</h2>
          <nav>
            <button className="mb-4 w-full text-left" onClick={() => navigate('/myprofile')}>👤 Your Profile</button>
            <button className="mb-4 w-full text-left" onClick={() => navigate('/goals')}>🎯 Your Goals</button>
            <button className="mb-4 w-full text-left" onClick={() => navigate('/Stats')}>📊 Stats</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="mt-6 lg:mt-auto bg-white text-red-600 py-2 px-4 rounded hover:bg-red-100 transition">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 px-4 py-6 sm:px-6 md:px-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center lg:text-left">Welcome, {username}!</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Your Goals</h2>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => navigate('/goalform')}
          >
            + Create Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <p className="text-gray-500">No goals added yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div key={goal._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">{goal.title}</h3>
                <p className="text-sm text-gray-600">
                  📆 {new Date(goal.startDate).toLocaleDateString()} →{" "}
                  {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : "Ongoing"}
                </p>
                <p className="text-sm">📚 {goal.studyArea}</p>

                <XPLevelGraph xp={userStats.xp} streak={goal.streak} level={userStats.level} />

                <button
                  onClick={() => setShowFormId(showFormId === goal._id ? null : goal._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4 mt-4"
                >
                  Check-in
                </button>

                {showFormId === goal._id && (
                  <form onSubmit={(e) => handleCheckInSubmit(e, goal._id)} className="mb-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Today's Task</label>
                      <input
                        type="text"
                        value={todayTask}
                        onChange={(e) => setTodayTask(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="mb-2">
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
      </div>
    </div>
  );
};

export default GoalPage;