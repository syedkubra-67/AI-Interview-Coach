const ResumeAnalysis = require('../models/ResumeAnalysis');
const pdfParser = require('../utils/pdfParser');
const geminiHelper = require('../utils/geminiHelper');

// @desc    Upload and analyze resume
// @route   POST /api/resumes/upload
// @access  Private
exports.analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF resume file',
      });
    }

    // Ensure it is a PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        error: 'Only PDF resume files are supported',
      });
    }

    // Extract text from the PDF buffer
    const parsedText = await pdfParser.parsePdf(req.file.buffer);

    if (!parsedText || parsedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Unable to extract text from the uploaded PDF. Please make sure the PDF is not scanned/an image.',
      });
    }

    // Query Gemini helper for ATS evaluation
    const analysis = await geminiHelper.analyzeResumeText(parsedText);

    // Save to DB
    const resumeAnalysis = await ResumeAnalysis.create({
      user: req.user.id,
      resumeFileName: req.file.originalname,
      parsedText,
      skillsExtracted: analysis.skillsExtracted,
      missingSkills: analysis.missingSkills,
      atsScore: analysis.atsScore,
      recommendations: analysis.recommendations,
    });

    res.status(201).json({
      success: true,
      data: resumeAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's resume analysis history
// @route   GET /api/resumes/history
// @access  Private
exports.getResumeHistory = async (req, res, next) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
