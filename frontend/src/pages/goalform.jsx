// src/pages/GoalForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoalForm = () => {
  const navigate = useNavigate();   
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [studyArea, setStudyArea] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([{ taskName: "", taskDate: "" }]);
  const [errors, setErrors] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleAddTask = () => {
    setTasks([...tasks, { taskName: "", taskDate: "" }]);
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!title || !startDate || !studyArea) {
      setErrors("Please fill in Goal Name, Start Date, and Study Area.");
      return;
    }

    if (!token) {
      alert("You must be logged in to create a goal.");
      navigate('/login');
      return;
    }

    const goalData = {
      title,
      startDate,
      endDate: endDate || null,
      studyArea,
      description,
      tasks: tasks.filter(t => t.taskName && t.taskDate),
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.post("/api/goals", goalData, config);

      alert("Goal added successfully!");
      navigate("/myprofile");

    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to create goal.";
      setErrors(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600 mb-6">Create a New Goal</h2>

        {errors && <p className="text-red-500 text-center mb-4">{errors}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Goal Name</label>
              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., Learn React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Study Area</label>
              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., Frontend Development"
                value={studyArea}
                onChange={(e) => setStudyArea(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
              <input
                type="date"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="3"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Master React fundamentals and build 3 projects."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Sub-Tasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Tasks (Optional)</label>
            {tasks.map((task, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Task name"
                  className="flex-grow border border-gray-300 rounded-md p-2"
                  value={task.taskName}
                  onChange={(e) => handleTaskChange(index, "taskName", e.target.value)}
                />
                <input
                  type="date"
                  className="border border-gray-300 rounded-md p-2"
                  value={task.taskDate}
                  onChange={(e) => handleTaskChange(index, "taskDate", e.target.value)}
                  min={startDate || today}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTask}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              + Add Another Task
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
