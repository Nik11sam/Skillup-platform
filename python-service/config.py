import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Load environment variables
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://rejoycherian:EJ99qtdCPGmPxZZK@cluster-skillup.wbuz6am.mongodb.net/')
SERVICE_PORT = int(os.getenv('PORT', os.getenv('SERVICE_PORT', 8000)))
SERVICE_HOST = os.getenv('SERVICE_HOST', '0.0.0.0')
NODE_BACKEND_URL = os.getenv('https://skillup-backend-cq6x.onrender.com', 'http://localhost:5001')

# Burnout thresholds
BURNOUT_HIGH_THRESHOLD_DAYS = 7
BURNOUT_MEDIUM_THRESHOLD_DAYS = 3
MAX_HEALTHY_HOURS = 6    # More than 6 hours/day = potential overwork
MIN_HEALTHY_HOURS = 0.5  # Less than 30 min/day = too little

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Log the loaded configuration
logger.info(f"Service running on {SERVICE_HOST}:{SERVICE_PORT}")
logger.info(f"Node.js backend URL: {NODE_BACKEND_URL}")
logger.info(f"MongoDB URI configured: {'Yes' if MONGO_URI else 'No'}")

