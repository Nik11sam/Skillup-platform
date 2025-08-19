import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const XPChart = ({ data }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 mb-10">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">📈 Weekly XP</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPChart;
