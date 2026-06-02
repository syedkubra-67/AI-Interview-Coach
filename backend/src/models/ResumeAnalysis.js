const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeFileName: {
    type: String,
    required: true,
  },
  parsedText: {
    type: String,
    required: true,
  },
  skillsExtracted: {
    type: [String],
    default: [],
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  recommendations: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
