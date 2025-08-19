const User = require('../models/User');
const Goal = require('../models/Goal');
const CheckIn = require('../models/CheckIn');

const calculateStreak = (checkIns) => {
    if (checkIns.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDays = new Set(checkIns.map(ci => {
        const d = new Date(ci.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }));
    if (!checkInDays.has(today.getTime())) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (!checkInDays.has(yesterday.getTime())) return 0;
    }
    let currentDate = today;
    while (checkInDays.has(currentDate.getTime())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
};

const BADGES = {
    STREAK_3: { id: 'streak-3', name: 'On a Roll', description: 'Maintain a 3-day streak.' },
    STREAK_7: { id: 'streak-7', name: 'Committed Learner', description: 'Maintain a 7-day streak.' },
    STREAK_30: { id: 'streak-30', name: 'Habit Builder', description: 'Maintain a 30-day streak.' },
    GOAL_1: { id: 'goal-1', name: 'First Goal Down', description: 'Complete your first learning goal.' },
    GOAL_5: { id: 'goal-5', name: 'Goal Getter', description: 'Complete 5 learning goals.' },
    LEVEL_5: { id: 'level-5', name: 'Level Up', description: 'Reach Level 5.' },
    LEVEL_10: { id: 'level-10', name: 'Skilled Developer', description: 'Reach Level 10.' },
};

const checkAndAwardBadges = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        console.log('[Badge Service] User not found.');
        return [];
    }

    const newBadges = [];
    const userBadges = new Set(user.badges || []);
    if (user.level >= 5 && !userBadges.has(BADGES.LEVEL_5.id)) newBadges.push(BADGES.LEVEL_5.id);
    if (user.level >= 10 && !userBadges.has(BADGES.LEVEL_10.id)) newBadges.push(BADGES.LEVEL_10.id);

    const completedGoalsCount = await Goal.countDocuments({ user: userId, status: 'Completed' });
    if (completedGoalsCount >= 1 && !userBadges.has(BADGES.GOAL_1.id)) newBadges.push(BADGES.GOAL_1.id);
    if (completedGoalsCount >= 5 && !userBadges.has(BADGES.GOAL_5.id)) newBadges.push(BADGES.GOAL_5.id);

    const goals = await Goal.find({ user: userId });
    let maxStreak = 0;
    for (const goal of goals) {
        const checkIns = await CheckIn.find({ goal: goal._id }).sort({ date: 'desc' });
        const currentStreak = calculateStreak(checkIns);
        if (currentStreak > maxStreak) maxStreak = currentStreak;
    }
    if (maxStreak >= 3 && !userBadges.has(BADGES.STREAK_3.id)) newBadges.push(BADGES.STREAK_3.id);
    if (maxStreak >= 7 && !userBadges.has(BADGES.STREAK_7.id)) newBadges.push(BADGES.STREAK_7.id);
    if (maxStreak >= 30 && !userBadges.has(BADGES.STREAK_30.id)) newBadges.push(BADGES.STREAK_30.id);
    
    if (newBadges.length > 0) {
        console.log(`[Badge Service] Saving new badges to user: ${newBadges}`);
        
        if (!Array.isArray(user.badges)) {
            user.badges = [];
        }

        newBadges.forEach(badgeId => {
            if (!user.badges.includes(badgeId)) {
                user.badges.push(badgeId);
            }
        });

        await user.save();
        console.log('[Badge Service] User saved successfully. Badges are now:', user.badges);
    }

    return newBadges.map(id => Object.values(BADGES).find(b => b.id === id));
};

module.exports = { checkAndAwardBadges, BADGES, calculateStreak };