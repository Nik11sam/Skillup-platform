from datetime import datetime, timedelta,timezone
from typing import List, Optional
from statistics import mean
from models import UserActivity, BurnoutAnalysis, CheckInData
from config import (
    BURNOUT_HIGH_THRESHOLD_DAYS,
    BURNOUT_MEDIUM_THRESHOLD_DAYS,
    MAX_HEALTHY_HOURS,
    MIN_HEALTHY_HOURS,
    logger
)

class BurnoutService:
    @staticmethod
    def analyze_burnout_risk(user_data: UserActivity) -> BurnoutAnalysis:
        """ Analyze user activity data to determine burnout risk. """
        now = datetime.now(timezone.utc)
        checkins = user_data.checkIns
        
        # Sort check-ins by date (date is already datetime object)
        checkins.sort(key=lambda x: x.date)
        
        # Calculate days since last check-in
        days_since_last_checkin : Optional[int] = None
        last_checkin = None
        
        if checkins:
            last_checkin = checkins[-1].date
            days_since_last_checkin = (now - last_checkin).days
        else:
            days_since_last_checkin : Optional[int] = None  # Handle first-time users gracefully

        # Determine burnout risk
        burnout_risk = BurnoutService._calculate_simple_risk(
            days_since_last_checkin, checkins
        )

        # Generate suggestions
        suggestions = BurnoutService._get_simple_suggestions(
            burnout_risk, days_since_last_checkin, checkins
        )

        # Calculate average hours
        avg_hours = BurnoutService._calculate_average_hours(checkins)

        # Convert last_checkin to ISO string if it's a datetime object
        last_checkin_str = None
        if last_checkin:
            last_checkin_str = last_checkin.isoformat()
            
        return BurnoutAnalysis(
            userId=user_data.userId,
            burnoutRisk=burnout_risk,
            lastCheckIn=last_checkin_str,
            daysSinceLastCheckIn=days_since_last_checkin if days_since_last_checkin is not None else 0,
            totalCheckIns=len(checkins),
            averageHoursPerDay=avg_hours,
            suggestions=suggestions
        )

    @staticmethod
    def _calculate_simple_risk(days_inactive: Optional[int], checkins: List[CheckInData]) -> str:
        """Simple risk calculation based on inactivity."""
        
        if not checkins or days_inactive is None:
            return "None"

        # High risk: No check-in for a week OR no check-ins at all
        if days_inactive >= BURNOUT_HIGH_THRESHOLD_DAYS:
            return "High"

        # Medium risk: No check-in for 3+ days
        elif days_inactive >= BURNOUT_MEDIUM_THRESHOLD_DAYS:
            return "Medium"

        # Check for overwork pattern (studying too much)
        if len(checkins) >= 3:
            recent_hours = [c.hoursStudied for c in checkins[-3:]]  # Last 3 check-ins
            if mean(recent_hours) > MAX_HEALTHY_HOURS:
                return "Medium"  # Overwork is also a risk

        # Low risk: Regular check-ins
        return "Low"

    @staticmethod
    def _get_simple_suggestions(risk_level: str, days_inactive: Optional[int], checkins: List[CheckInData]) -> List[str]:
        """Simple suggestions based on risk level."""
        suggestions = []
        
        if risk_level == "None":
            suggestions= [
                "🎉 Welcome! You haven’t started yet.",
                "Begin with your first check-in to start tracking your journey.",
                "Set a goal and log your first task today!"
            ]

        if risk_level == "High":
            if days_inactive is not None and days_inactive >= 14:  # Been away for 2+ weeks
                suggestions = [
                    "You've been away for a while. Start with just 15 minutes today.",
                    "Choose your easiest goal to rebuild momentum.",
                    "Don't pressure yourself - small steps count!"
                ]
            else:
                suggestions = [
                    "You haven't checked in for a week. Time to get back on track!",
                    "Start with a small, achievable task today.",
                    "Review your goals - maybe they need adjustment."
                ]

        elif risk_level == "Medium":
            # Check if it's due to overwork or inactivity
            if checkins and len(checkins) >= 3:
                recent_hours = [c.hoursStudied for c in checkins[-3:]]
                if mean(recent_hours) > MAX_HEALTHY_HOURS:
                    suggestions = [
                        "You're studying too much! Take a day off to rest.",
                        "Limit your study sessions to 3-4 hours maximum.",
                        "Remember: consistent small efforts beat burnout."
                    ]
                else:
                    suggestions = [
                        "You've missed a few days. Let's get back to it!",
                        "Try studying for just 30 minutes today.",
                        "Set a daily reminder to check in."
                    ]
            else:
                suggestions = [
                    "You've been inconsistent lately. Try a daily routine.",
                    "Break your goals into smaller, daily tasks.",
                    "Aim for at least 30 minutes of study per day."
                ]
                
        elif risk_level == "None":
            suggestions= [
                "🎉 Welcome! You haven’t started yet.",
                "Begin with your first check-in to start tracking your journey.",
                "Set a goal and log your first task today!"
            ]

        else:  # Low risk
            suggestions = [
                "Great job staying consistent! Keep it up!",
                "You're building a good study habit.",
                "Consider setting a new challenge for yourself."
            ]

        return suggestions

    @staticmethod
    def _calculate_average_hours(checkins: List[CheckInData]) -> float:
        """Calculate simple average hours per check-in."""
        if not checkins:
            return 0.0

        # Use last 7 check-ins for recent average
        recent_checkins = checkins[-7:] if len(checkins) >= 7 else checkins

        total_hours = sum(c.hoursStudied for c in recent_checkins)
        return round(total_hours / len(recent_checkins), 2)
