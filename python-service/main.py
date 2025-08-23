from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from datetime import datetime
from models import UserActivity, CheckInData, GoalData, BurnoutAnalysis, SuggestionResponse, TaskData
from config import NODE_BACKEND_URL, SERVICE_PORT, SERVICE_HOST, logger
from services import BurnoutService, AnalyticsService

app = FastAPI(title="Burnout Detection Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://skillup-frontend-one.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
burnout_service = BurnoutService()
analytics_service = AnalyticsService()

# HTTP Bearer scheme for token extraction
security = HTTPBearer()

def parse_date(date_str):
    """Helper function to parse various date formats"""
    if not date_str:
        return datetime.now()
    
    try:
        if isinstance(date_str, str):
            if date_str.endswith('Z'):
                return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            else:
                return datetime.fromisoformat(date_str)
        return date_str if isinstance(date_str, datetime) else datetime.now()
    except ValueError:
        logger.warning(f"Could not parse date: {date_str}, using current time")
        return datetime.now()

# Dependency to get user data from Node.js backend
async def get_user_data(user_id: str, token: str) -> UserActivity:
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    try:
        async with httpx.AsyncClient() as client:
            # Fetch check-ins
            checkins_response = await client.get(
                f"{NODE_BACKEND_URL}/api/goals/user/{user_id}/checkins", 
                headers=headers, 
                timeout=10.0
            )
            checkins_response.raise_for_status()
            checkins_data = checkins_response.json()

            # Fetch goals
            goals_response = await client.get(
                f"{NODE_BACKEND_URL}/api/goals/user/{user_id}", 
                headers=headers, 
                timeout=10.0
            )
            goals_response.raise_for_status()
            goals_data = goals_response.json()

            # Process check-ins
            checkins = []
            for checkin in checkins_data:
                parsed_date = parse_date(checkin.get("date"))
                checkins.append(CheckInData(
                    user=str(checkin.get("user", user_id)),
                    goal=str(checkin.get("goal", "")),
                    date=parsed_date,
                    taskDescription=checkin.get("taskDescription", ""),
                    hoursStudied=float(checkin.get("hoursStudied", 0))
                ))

            # Process goals
            goals = []
            for goal in goals_data:
                parsed_start_date = parse_date(goal.get("startDate"))
                parsed_end_date = parse_date(goal.get("endDate")) if goal.get("endDate") else None
                parsed_created_at = parse_date(goal.get("createdAt"))

                tasks = []
                for task in goal.get("tasks", []):
                    parsed_task_date = parse_date(task.get("taskDate"))
                    tasks.append(TaskData(
                        taskName=task.get("taskName", ""),
                        taskDate=parsed_task_date,
                        completed=task.get("completed", False)
                    ))

                goals.append(GoalData(
                    _id=str(goal.get("_id", "")),
                    user=str(goal.get("user", user_id)),
                    title=goal.get("title", ""),
                    description=goal.get("description", ""),
                    studyArea=goal.get("studyArea", ""),
                    startDate=parsed_start_date,
                    endDate=parsed_end_date,
                    tasks=tasks,
                    status=goal.get("status", "In Progress"),
                    createdAt=parsed_created_at
                ))

            return UserActivity(userId=user_id, checkIns=checkins, goals=goals)

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error fetching user data for {user_id}: {e}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Backend error: {e}")
    except Exception as e:
        logger.error(f"Error fetching user data for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user data")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Burnout Detection Service", "version": "1.0.0"}

@app.get("/api/burnout/{user_id}", response_model=BurnoutAnalysis)
async def get_burnout_analysis(
    user_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get burnout analysis for specific user"""
    try:
        token = credentials.credentials
        logger.info(f"Analyzing burnout risk for user: {user_id}")
        user_data = await get_user_data(user_id, token)
        burnout_analysis = burnout_service.analyze_burnout_risk(user_data)
        return burnout_analysis
    except Exception as e:
        logger.error(f"Error analyzing burnout risk for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/api/suggestions/{user_id}", response_model=SuggestionResponse)
async def get_suggestions(
    user_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get personalized suggestions for user"""
    try:
        token = credentials.credentials
        logger.info(f"Generating suggestions for user: {user_id}")
        
        user_data = await get_user_data(user_id, token)
        burnout_analysis = burnout_service.analyze_burnout_risk(user_data)
        suggestions = analytics_service.generate_personalized_suggestions(user_data, burnout_analysis)
        
        return suggestions
    except Exception as e:
        logger.error(f"Error generating suggestions for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=SERVICE_HOST, port=SERVICE_PORT)
