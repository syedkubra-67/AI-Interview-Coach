const Roadmap = require('../models/Roadmap');
const geminiHelper = require('../utils/geminiHelper');

// @desc    Generate career learning roadmap
// @route   POST /api/roadmaps/generate
// @access  Private
exports.generateRoadmap = async (req, res, next) => {
  try {
    const { targetRole, currentSkills, cgpa } = req.body;

    if (!targetRole || !cgpa) {
      return res.status(400).json({
        success: false,
        error: 'Please provide targetRole and cgpa (currentSkills is optional)',
      });
    }

    const skillsArray = Array.isArray(currentSkills)
      ? currentSkills
      : currentSkills
      ? currentSkills.split(',').map(s => s.trim())
      : [];

    const cgpaNum = parseFloat(cgpa);

    // Call Gemini helper to compile roadmap content
    const roadmapData = await geminiHelper.generateRoadmap(skillsArray, cgpaNum, targetRole);

    // Save to DB
    const roadmap = await Roadmap.create({
      user: req.user.id,
      targetRole,
      currentSkills: skillsArray,
      cgpa: cgpaNum,
      weeklyPlan: roadmapData.weeklyPlan,
      recommendedProjects: roadmapData.recommendedProjects,
      certifications: roadmapData.certifications,
      placementPrepPlan: roadmapData.placementPrepPlan,
    });

    res.status(201).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's latest roadmap
// @route   GET /api/roadmaps/latest
// @access  Private
exports.getLatestRoadmap = async (req, res, next) => {
  try {
    const latest = await Roadmap.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        error: 'No roadmap generated yet',
      });
    }

    res.status(200).json({
      success: true,
      data: latest,
    });
  } catch (error) {
    next(error);
  }
};
