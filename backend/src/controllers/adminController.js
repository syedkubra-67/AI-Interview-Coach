const User = require('../models/User');
const Interview = require('../models/Interview');
const Report = require('../models/Report');

// @desc    Get dashboard metrics for administrative view
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    // 1. Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 2. Active users (logged in/active in past 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({
      role: 'user',
      'stats.lastActive': { $gte: sevenDaysAgo },
    });

    // 3. Interviews conducted
    const interviewsConducted = await Interview.countDocuments({ isCompleted: true });

    // 4. Revenue Mock Architecture (pricing conversions tracker, etc.)
    const simulatedRevenue = totalUsers * 15.00; // Mock SaaS conversion estimation ($15/user)

    // 5. Average score
    const reports = await Report.find().select('overallScore');
    const averageScore = reports.length > 0
      ? Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length)
      : 0;

    // 6. Recent Users
    const recentUsers = await User.find({ role: 'user' })
      .select('name email createdAt stats.xp')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        interviewsConducted,
        simulatedRevenue,
        averageScore,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};
