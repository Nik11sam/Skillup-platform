# SkillUp - Gamified Learning Tracker for Developers

## Overview
SkillUp is a modern, interactive web application designed to help users track their learning progress, set goals, and maintain motivation through gamification elements. Built with React and enhanced with beautiful animations, it provides a comprehensive platform for personal skill development.

## Features

### 🎯 Goal Management
- Create and track multiple learning goals
- Set study areas and timeframes
- Monitor progress with visual indicators
- Daily check-ins to log study sessions

### 📊 Progress Analytics
- Real-time XP tracking and level progression
- Weekly activity charts and streak monitoring
- Visual calendar showing study consistency

### 🏆 Gamification
- Experience points (XP) system
- Level progression with badges
- Achievement tracking
- Streak counters for motivation

### 👤 User Experience
- Personalized dashboard with recommendations
- Beautiful animations and transitions
- Responsive design for all devices
- Intuitive navigation and user interface

### 🔐 Authentication
- Secure user registration and login
- Profile management
- Session persistence

## Technology Stack

- **Frontend :** React 
- **Routing:** React Router DOM 
- **Styling:** Tailwind CSS with custom animations
- **Animations:** Framer Motion
- **Charts:** Recharts for data visualization
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Date Handling:** date-fns

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AnimatedBackground.jsx
│   │   ├── Badges.jsx
│   │   ├── GoalModal.jsx
│   │   ├── ParticleBackground.jsx
│   │   ├── StreakCalendar.jsx
│   │   ├── Xpchart.jsx
│   │   └── XPlevelgraph.jsx
│   ├── pages/             # Main application pages
│   │   ├── Home.jsx       # Landing page with features
│   │   ├── login.jsx      # User authentication
│   │   ├── signup.jsx     # User registration
│   │   ├── myprofile.jsx  # User dashboard
│   │   ├── goalpage.jsx   # Goal management
│   │   ├── goalform.jsx   # Goal creation
│   │   └── Stats.jsx      # Analytics and progress
│   ├── utils/             # Utility functions
│   │   └── auth.js        # Authentication helpers
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
└── tailwind.config.js     # Tailwind CSS configuration
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application


## Application Pages

### 🏠 Home Page (`/`)
- Beautiful landing page with animated backgrounds
- Feature showcase with interactive cards
- Call-to-action buttons for signup/login
- Particle effects and smooth animations

### 🔐 Authentication Pages
- **Login** (`/login`) - User authentication with form validation
- **Signup** (`/signup`) - New user registration with validation

### 👤 Profile Dashboard (`/myprofile`)
- User profile overview with XP and level display
- Personalized suggestions and recommendations
- Quick access to goals and check-ins
- Achievement badges and progress indicators

### 🎯 Goals Management (`/goals`)
- View all user goals with progress tracking
- Create new goals with detailed forms
- Daily check-ins for study sessions
- Goal completion status and statistics

### 📊 Statistics (`/Stats`)
- Comprehensive progress analytics
- Weekly XP charts and trends
- Streak calendar visualization

## Key Components

### AnimatedBackground
Creates dynamic, interactive backgrounds using particle systems and gradient animations.

### StreakCalendar
Visual calendar component showing study consistency and active days.

### XP Charts
Interactive charts displaying weekly progress and XP accumulation.

### GoalModal
Modal component for creating and editing learning goals.

### Badges
Achievement system displaying user accomplishments and levels.

## Styling and Design

The application uses **Tailwind CSS** for styling with custom configurations:
- Responsive design principles
- Modern color scheme with red accent colors
- Smooth animations and transitions
- Glassmorphism effects and backdrop blur
- Consistent spacing and typography

## State Management

The application uses React's built-in state management:
- `useState` for local component state
- `useEffect` for side effects and data fetching
- Local storage for user authentication persistence
- Context could be added for global state if needed

## License

This project is for educational and demonstration purposes.

---

**Built with ❤️ using React and modern web technologies**

