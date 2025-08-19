const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  checkInGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
const CheckIn = require('../models/CheckIn');
const Goal = require('../models/Goal');

router.route('/').get(getGoals).post(createGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);
router.route('/:id/checkin').post(checkInGoal);
// Add these new routes to goalRoutes.js
router.route('/user/:userId/checkins').get(async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ user: req.params.userId })
      .populate('goal', 'title studyArea')
      .sort({ date: -1 });
    res.status(200).json(checkIns);
  } catch (error) {
    console.error("Error fetching user check-ins:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.route('/user/:userId').get(async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching user goals:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;