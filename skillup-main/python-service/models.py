from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TaskData(BaseModel):
    taskName: str
    taskDate: datetime
    completed: bool = False

class CheckInData(BaseModel):
    user: str  # ObjectId as string from MongoDB
    goal: str  # ObjectId as string from MongoDB
    date: datetime = Field(default_factory=datetime.now)
    taskDescription: str
    hoursStudied: float
class GoalData(BaseModel):
    _id: str         # MongoDB ID as string
    user: str        # user ID as string (ObjectId)
    title: str
    description: Optional[str] = None
    studyArea: str
    startDate: datetime
    endDate: Optional[datetime] = None
    tasks: List[TaskData] = []
    status: str = "In Progress"  # Default status
    createdAt: datetime = Field(default_factory=datetime.now)
    
    
class UserActivity(BaseModel):
    userId: str
    checkIns: List[CheckInData]
    goals:List[GoalData]
    
  
class BurnoutAnalysis(BaseModel):
    userId: str
    burnoutRisk: str        # e.g., "Low", "Medium", "High"
    lastCheckIn: Optional[str]  
    daysSinceLastCheckIn: int
    totalCheckIns: int
    averageHoursPerDay: float
    suggestions: List[str]
    
class SuggestionResponse(BaseModel):
    suggestions: List[str]
    motivationalMessage: str
    recommendedBreak: bool  # Fixed typo