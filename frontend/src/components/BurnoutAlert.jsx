import React, { useEffect, useState } from "react";
import axios from "axios";

const BurnoutAlert = ({ userId, token }) => {
  const [burnoutMessage, setBurnoutMessage] = useState("");
  const pythonApiUrl = process.env.REACT_APP_PYTHON_API_URL;

  useEffect(() => {
    const fetchBurnoutStatus = async () => {
      try {
        const response = await axios.get(
          `${pythonApiUrl}/api/burnout/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const burnoutRisk = response.data.burnoutRisk;
        const daysInactive = response.data.daysSinceLastCheckIn;

        // You can customize messages per risk level
        let message = "";
        if (burnoutRisk === "High") {
          message = `⚠️ High burnout risk! It's been ${daysInactive} days since your last check-in. Take it slow and ease back in.`;
        } else if (burnoutRisk === "Medium") {
          message = `⚠️ Medium burnout risk! It's been ${daysInactive} days since your last check-in. Consider restarting with a light task today.`;
        }
        else if (burnoutRisk === "None") {
          message = `welcome back! You haven't started yet. Begin with your first check-in to start tracking your journey.`;
        }

        setBurnoutMessage(message);
      } catch (error) {
        console.error("Error fetching burnout data:", error);
      }
    };

    if (userId && token) {
      fetchBurnoutStatus();
    }
  }, [userId, token, pythonApiUrl]);

  if (!burnoutMessage) return null;

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow">
      <p className="font-semibold">Burnout Alert</p>
      <p>{burnoutMessage}</p>
    </div>
  );
};

export default BurnoutAlert;
