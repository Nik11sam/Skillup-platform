import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import SkillUpLogo from "../components/skilluplogo";
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://skillup-backend-cq6x.onrender.com/api/auth/register", form);
      alert("Signup successful!");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      navigate("/login");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Signup failed.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md">
        
        <div className="flex justify-center mb-2">
          <SkillUpLogo />
        </div>

        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Create an Account
        </h2>

        <input
          name="username"
          type="text"
          required
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <input
          name="email"
          type="email"
          required
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <input
          name="password"
          type="password"
          required
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
