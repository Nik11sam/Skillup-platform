import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './StreakCalendar.css'; // Custom styles

const StreakCalendar = () => {
  const [checkInDates, setCheckInDates] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("/api/user/checkin-history", config);

        const dates = response.data.map(dateStr => {
          const date = new Date(dateStr);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        });
        setCheckInDates(new Set(dates));
      } catch (error) {
        console.error("Failed to fetch check-in history", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    }
  }, [token]);

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    if (checkInDates.has(normalizedDate.getTime())) {
      return 'streak-day';
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    if (checkInDates.has(normalizedDate.getTime())) {
      return <div className="streak-indicator">🔥</div>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          📅 <span className="ml-2">Your Check-in History</span>
        </h3>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          📅 <span className="ml-2">Your Check-in History</span>
        </h3>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {checkInDates.size} days active
        </div>
      </div>
      
      <div className="calendar-container">
        <Calendar
          tileClassName={tileClassName}
          tileContent={tileContent}
          className="custom-calendar"
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false}
        />
      </div>
      
      <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span>Check-in day</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🔥</span>
            <span>Active streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;