from models import UserActivity, BurnoutAnalysis, SuggestionResponse

class AnalyticsService:
    @staticmethod
    def generate_personalized_suggestions(user_data: UserActivity, burnout_analysis: BurnoutAnalysis) -> SuggestionResponse:
        """ Generate personalized suggestions based on user activity and burnout analysis. """
        suggestions = []
        motivational_message = ""
        recommended_break = False
        
        # Base suggestions from burnout analysis
        suggestions.extend(burnout_analysis.suggestions)
        
        # Additional suggestions based on burnout risk
        if burnout_analysis.burnoutRisk == "High":
            recommended_break = True
            motivational_message = "It's okay to take a break! Rest is part of the learning process."
            
        elif burnout_analysis.burnoutRisk == "Medium":
            motivational_message = "You're doing great! Just take it one step at a time."
            
        else:  # Low risk
            motivational_message = "Keep up the great work! You're on the right track."
            
            
        # Add goal-specific suggestions
        active_goals = [goal for goal in user_data.goals if goal.status == 'In Progress']
        if len(active_goals) > 3:
            suggestions.append("You have multiple active goals. Consider focusing on 2-3 at a time to avoid overwhelm.")
        elif len(active_goals) == 0:
            suggestions.append("You currently have no active goals. Consider setting a new goal to keep your learning journey engaging.")
                
        return SuggestionResponse(
            suggestions=suggestions[:6],  # Limit to 6 suggestions
            motivationalMessage=motivational_message,
            recommendedBreak=recommended_break
        )
