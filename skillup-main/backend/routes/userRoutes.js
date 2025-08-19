const express = require('express');
const router = express.Router();
const { getUserStats, getCheckInHistory, getUserBadges, getWeeklyXp } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/stats').get(getUserStats);
router.route('/checkin-history').get(getCheckInHistory);
router.route('/badges').get(getUserBadges);
router.route('/weekly-xp').get(getWeeklyXp);

module.exports = router;