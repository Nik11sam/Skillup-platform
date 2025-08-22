const Goal = require('../models/Goal');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const { checkAndAwardBadges: checkAndAwardBadges, calculateStreak: calculateStreak } = require('../services/badgeService');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();

    for (const goal of goals) {
      const checkIns = await CheckIn.find({ goal: goal._id }).sort({ date: 'desc' });
      goal.streak = calculateStreak(checkIns);
    }
    
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error in getGoals:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, description, studyArea, startDate, endDate, tasks } = req.body;
    if (!title || !studyArea || !startDate) {
      return res.status(400).json({ message: 'Please provide title, studyArea, and startDate' });
    }

    const goal = await Goal.create({
      title,
      description,
      studyArea,
      startDate,
      endDate,
      tasks,
      user: req.user.id,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Error in createGoal:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });

    let newBadges = [];
    if (req.body.status === 'Completed' && goal.status !== 'Completed') {
      newBadges = await checkAndAwardBadges(req.user.id);
    }

    res.status(200).json({ updatedGoal, newBadges });
  } catch (error) {
    console.error("Error in updateGoal:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await goal.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error("Error in deleteGoal:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.checkInGoal = async (req, res) => {
  try {
    const { taskDescription, hoursStudied } = req.body;
    if (!taskDescription || !hoursStudied) {
      return res.status(400).json({ message: 'Please provide taskDescription and hoursStudied' });
    }

    const goal = await Goal.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!goal || !user) {
      return res.status(404).json({ message: 'Goal or User not found' });
    }
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingCheckIn = await CheckIn.findOne({
      goal: req.params.id,
      date: { $gte: startOfToday, $lte: endOfToday },
    });

    if (existingCheckIn) {
      return res.status(400).json({ message: 'Already checked in today for this goal' });
    }

    const checkInsForStreak = await CheckIn.find({ goal: req.params.id }).sort({ date: 'desc' });
    const currentStreak = calculateStreak(checkInsForStreak);

    const baseXp = 10;
    const bonusXp = currentStreak * 2;
    const totalXpGained = baseXp + bonusXp;
    
    user.xp += totalXpGained;

    const checkIn = await CheckIn.create({
      goal: req.params.id,
      user: req.user.id,
      taskDescription,
      hoursStudied,
      xpGained: totalXpGained,
    });

    await user.save();

    const newBadges = await checkAndAwardBadges(req.user.id);

    res.status(201).json({
      message: `Check-in successful! You earned ${totalXpGained} XP!`,
      userXp: user.xp,
      newBadges: newBadges,
      checkIn,
    });
  } catch (error) {
    console.error("Error during check-in:", error);
    res.status(500).json({ message: "An internal server error occurred during check-in." });
  }
};