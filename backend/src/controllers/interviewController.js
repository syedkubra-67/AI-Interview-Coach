const Interview = require('../models/Interview');
const Report = require('../models/Report');
const User = require('../models/User');
const geminiHelper = require('../utils/geminiHelper');

// @desc    Generate interview session
// @route   POST /api/interviews/generate
// @access  Private
exports.generateInterview = async (req, res, next) => {
  try {
    const { jobRole, difficulty } = req.body;

    if (!jobRole || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a jobRole and difficulty level',
      });
    }

    // Call AI helper to generate 10 questions
    const generatedQuestions = await geminiHelper.generateQuestions(jobRole, difficulty);

    // Save Interview session to database
    const interview = await Interview.create({
      user: req.user.id,
      jobRole,
      difficulty,
      questions: generatedQuestions.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        category: q.category,
        userAnswer: '',
      })),
    });

    res.status(201).json({
      success: true,
      interview: {
        id: interview._id,
        jobRole: interview.jobRole,
        difficulty: interview.difficulty,
        questions: interview.questions.map(q => ({
          questionId: q.questionId,
          questionText: q.questionText,
          category: q.category,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluate a completed interview session
// @route   POST /api/interviews/evaluate
// @access  Private
exports.evaluateInterview = async (req, res, next) => {
  try {
    const { interviewId, answers } = req.body; // answers is an array: [{ questionId: 1, userAnswer: "..." }]

    if (!interviewId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide interviewId and an array of answers',
      });
    }

    // Find the interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview session not found',
      });
    }

    if (interview.isCompleted) {
      return res.status(400).json({
        success: false,
        error: 'This interview has already been evaluated',
      });
    }

    // Map answers into the interview questions list
    const questionsAndAnswers = interview.questions.map(q => {
      const match = answers.find(a => a.questionId === q.questionId);
      const userAnswer = match ? match.userAnswer : '';
      q.userAnswer = userAnswer;
      return {
        questionId: q.questionId,
        questionText: q.questionText,
        category: q.category,
        userAnswer: userAnswer,
      };
    });

    // Call Gemini API to evaluate
    const evaluation = await geminiHelper.evaluateAnswers(
      questionsAndAnswers,
      interview.jobRole,
      interview.difficulty
    );

    // Update questions list with feedback
    interview.questions.forEach(q => {
      const evalItem = evaluation.questions.find(eq => eq.questionId === q.questionId);
      if (evalItem) {
        q.feedback = {
          score: evalItem.feedback.score,
          technicalAccuracy: evalItem.feedback.technicalAccuracy,
          communicationQuality: evalItem.feedback.communicationQuality,
          clarity: evalItem.feedback.clarity,
          confidenceEstimation: evalItem.feedback.confidenceEstimation,
          suggestions: evalItem.feedback.suggestions,
        };
      }
    });

    // Create Report
    const report = await Report.create({
      interview: interviewId,
      user: req.user.id,
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      actionPlan: evaluation.actionPlan,
    });

    // Update Interview status
    interview.overallReport = report._id;
    interview.isCompleted = true;
    interview.completedAt = new Date();
    await interview.save();

    // Gamification & Streak updates for User
    const user = await User.findById(req.user.id);
    if (user) {
      // 1. Calculate XP (e.g., base 100 XP + overallScore * 2 XP)
      const earnedXp = 100 + Math.round(evaluation.overallScore * 2);
      user.stats.xp += earnedXp;

      // 2. Increment interviews count
      user.stats.interviewsCount += 1;

      // 3. Update Streak
      const today = new Date();
      const lastActive = new Date(user.stats.lastActive);

      // Reset hours, minutes, seconds, ms for date calculations
      today.setHours(0, 0, 0, 0);
      lastActive.setHours(0, 0, 0, 0);

      const oneDayInMs = 24 * 60 * 60 * 1000;
      const differenceInDays = Math.round((today - lastActive) / oneDayInMs);

      if (differenceInDays === 1) {
        // Active yesterday, increment streak
        user.stats.streak += 1;
      } else if (differenceInDays > 1) {
        // Missed days, reset streak to 1
        user.stats.streak = 1;
      } else if (user.stats.streak === 0) {
        // First time
        user.stats.streak = 1;
      }
      // If difference is 0 (same day), streak remains unchanged

      user.stats.lastActive = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      report,
      earnedXp: 100 + Math.round(evaluation.overallScore * 2),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview report
// @route   GET /api/interviews/report/:id
// @access  Private
exports.getInterviewReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({ interview: req.params.id }).populate('interview');
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found for this interview session',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user interview history
// @route   GET /api/interviews/history
// @access  Private
exports.getInterviewHistory = async (req, res, next) => {
  try {
    const history = await Interview.find({ user: req.user.id, isCompleted: true })
      .populate('overallReport')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
