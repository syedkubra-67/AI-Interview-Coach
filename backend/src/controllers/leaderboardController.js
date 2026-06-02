const User = require('../models/User');

// @desc    Get top ranked users by XP and Streak
// @route   GET /api/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    // Top 10 by XP
    const topXp = await User.find()
      .select('name stats.xp stats.streak')
      .sort({ 'stats.xp': -1 })
      .limit(10);

    // Top 10 by Streak
    const topStreak = await User.find()
      .select('name stats.xp stats.streak')
      .sort({ 'stats.streak': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        byXp: topXp,
        byStreak: topStreak,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requesting user's rank details
// @route   GET /api/leaderboard/my-rank
// @access  Private
exports.getMyRank = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all users sorted by XP
    const allUsersXp = await User.find().sort({ 'stats.xp': -1 }).select('_id');
    const xpRank = allUsersXp.findIndex(u => u._id.toString() === userId.toString()) + 1;

    // Find all users sorted by Streak
    const allUsersStreak = await User.find().sort({ 'stats.streak': -1 }).select('_id');
    const streakRank = allUsersStreak.findIndex(u => u._id.toString() === userId.toString()) + 1;

    res.status(200).json({
      success: true,
      data: {
        xpRank,
        streakRank,
        totalUsers: allUsersXp.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
