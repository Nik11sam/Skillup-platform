import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/myprofile";
import Goalform from "./pages/goalform";
import GoalPage from './pages/goalpage';
import Stats from './pages/Stats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<Profile />}/>
        <Route path="/goals" element={<GoalPage />} />
        <Route path="/goalform" element={<Goalform />} />
        <Route path="/Stats" element={<Stats />} />
        {/* Add other routes as needed */}

      </Routes>
    </Router>
  );
}

export default App;
