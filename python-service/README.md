# Burnout Detection & Suggestion Microservice

## Overview
This microservice uses **FastAPI** to analyze user study habits and provide burnout risk analysis and personalized suggestions. It is designed to work as part of a larger system , fetching user data from a Node.js backend and returning actionable advice to help users maintain healthy study routines.

---

## Features
- **Burnout Risk Analysis:** Detects if a user is at risk of burnout based on their check-in frequency and study hours.
- **Personalized Suggestions:** Offers motivational messages and practical tips to improve study habits or prevent burnout.
- **REST API:** Simple endpoints for health check, burnout analysis, and suggestions.
- **Easy Deployment:** Includes a Dockerfile for containerized deployment.

---

## Folder Structure
```
python-service/
├── main.py                # FastAPI app and API endpoints
├── models.py              # Data models (Pydantic)
├── config.py              # Configuration and environment variables
├── requirements.txt       # Python dependencies
├── Dockerfile             # For containerization
├── services/
│   ├── burnout_service.py     # Burnout analysis logic
│   └── analytics_service.py   # Suggestion generation logic
└── ...
```

---

## How It Works
1. **User Data Fetching:**
   - The service fetches user check-ins and goals from a Node.js backend.
2. **Burnout Analysis:**
   - Analyzes how often the user checks in and how many hours they study.
   - Flags high risk if the user is inactive for a week.
3. **Suggestions:**
   - Generates up to 3 personalized suggestions and a motivational message based on the user's burnout risk and goals.

---

## API Endpoints

### 1. Health Check
- **GET /health**
- Returns: `{ "status": "ok" }`

### 2. Burnout Analysis
- **GET /api/burnout/{user_id}**
- **Headers:** `Authorization: Bearer <token>`
- **Returns:**
  ```json
  {
    "userId": "...",
    "burnoutRisk": "Low|Medium|High",
    "lastCheckIn": "2024-06-01T12:00:00Z",
    "daysSinceLastCheckIn": 2,
    "totalCheckIns": 10,
    "averageHoursPerDay": 2.5,
    "suggestions": ["...", "..."]
  }
  ```

### 3. Suggestions
- **GET /api/suggestions/{user_id}**
- **Headers:** `Authorization: Bearer <token>`
- **Returns:**
  ```json
  {
    "suggestions": ["...", "..."],
    "motivationalMessage": "...",
    "recommendedBreak": true
  }
  ```

---

## Configuration
- Copy or create a `.env` file in this folder. Example:
  ```env
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster-skillup.mongodb.net/
  SERVICE_PORT=8000
  SERVICE_HOST=0.0.0.0
  NODE_BACKEND_URL=http://localhost:5001
  ```
- See `config.py` for all configurable options and defaults.

---

## Installation & Running

### 1. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Set up environment variables
- Create a `.env` file as shown above, or export variables in your shell.

### 3. Start the service (development)
```bash
uvicorn main:app  --reload
```

### 4. Run with Docker (production or testing)
```bash
docker build -t burnout-service .
docker run -p 8000:8000 --env-file .env burnout-service
```

---

## Dependencies
- fastapi
- uvicorn
- pydantic
- httpx
- pymongo
- python-dotenv

(See `requirements.txt` for the full list and versions.)

---

## Service Logic (In Simple Terms)
- **Burnout is HIGH** if you haven't checked in for a week or more, or if you study too much.
- **Burnout is MEDIUM** if you miss a few days or show signs of overwork.
- **Burnout is LOW** if you check in regularly and study a healthy amount.
- Suggestions and motivational messages are tailored to your current risk level and goals.

---

## For Developers
- All business logic is in `services/`.
- Data models are in `models.py`.
- API and integration logic is in `main.py`.
- Logging and configuration are handled in `config.py`.

---

## Troubleshooting
- Make sure your Node.js backend is running and accessible at the URL set in `NODE_BACKEND_URL`.
- Check your `.env` file for typos or missing variables.
- Use the `/health` endpoint to verify the service is running.

