const User = require('../models/User');
const Goal = require('../models/Goal');
const CheckIn = require('../models/CheckIn');
const { BADGES, calculateStreak } = require('../services/badgeService');
const { format, subDays } = require('date-fns');

const calculateLevel = (xp) => {
    return Math.floor(Math.pow(xp / 100, 2/3)) + 1;
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User object fetched in getUserStats:', user);

    const currentLevel = calculateLevel(user.xp);
    if (user.level !== currentLevel) {
      await User.updateOne({ _id: userId }, { $set: { level: currentLevel } });
      user.level = currentLevel;
    }

    const totalGoals = await Goal.countDocuments({ user: userId });
    const completedGoals = await Goal.countDocuments({ user: userId, status: 'Completed' });
    const totalCheckIns = await CheckIn.countDocuments({ user: userId });

    const userGoals = await Goal.find({ user: userId });
    let maxStreak = 0;
    for (const goal of userGoals) {
      const checkIns = await CheckIn.find({ goal: goal._id }).sort({ date: 'desc' });
      const currentStreak = calculateStreak(checkIns);
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    }

    const earnedBadges = (user.badges || [])
        .map(badgeId => Object.values(BADGES).find(b => b.id === badgeId))
        .filter(Boolean);

    res.status(200).json({
      username: user.username,
      xp: user.xp,
      level: user.level,
      streak: maxStreak,
      totalGoals,
      completedGoals,
      totalCheckIns,
      badges: earnedBadges,
    });

  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserBadges = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('badges');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (!Array.isArray(user.badges)) {
            return res.status(200).json([]);
        }

        const userBadges = user.badges
        .map(badgeId => Object.values(BADGES).find(b => b.id === badgeId))
        .filter(Boolean);

        res.status(200).json(userBadges);
    } catch (error) {
        console.error("Error in getUserBadges:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getCheckInHistory = async (req, res) => {
    try {
        const checkIns = await CheckIn.find({ user: req.user.id }).select('date');
        const dates = checkIns.map(ci => ci.date);
        res.status(200).json(dates);
    } catch (error) {
        console.error("Error in getCheckInHistory:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getWeeklyXp = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = subDays(today, 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const checkIns = await CheckIn.find({
            user: req.user.id,
            date: { $gte: sevenDaysAgo }
        });

        const weeklyData = new Map();
        for (let i = 0; i < 7; i++) {
            const date = subDays(today, i);
            const dayKey = format(date, 'yyyy-MM-dd');
            weeklyData.set(dayKey, { day: format(date, 'EEE'), xp: 0 });
        }

        checkIns.forEach(ci => {
            const dayKey = format(new Date(ci.date), 'yyyy-MM-dd');
            if (weeklyData.has(dayKey)) {
                weeklyData.get(dayKey).xp += ci.xpGained;
            }
        });

        const sortedData = Array.from(weeklyData.values()).reverse();

        res.status(200).json(sortedData);
    } catch (error) {
        console.error("Error in getWeeklyXp:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};