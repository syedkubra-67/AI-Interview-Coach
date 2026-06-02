const mongoose = require('mongoose');

const QuestionFeedbackSchema = new mongoose.Schema({
  score: {
    type: Number,
    min: 0,
    max: 10,
  },
  technicalAccuracy: {
    type: Number,
    min: 0,
    max: 10,
  },
  communicationQuality: {
    type: Number,
    min: 0,
    max: 10,
  },
  clarity: {
    type: Number,
    min: 0,
    max: 10,
  },
  confidenceEstimation: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Pending'],
    default: 'Pending',
  },
  suggestions: {
    type: String,
    default: '',
  },
});

const InterviewQuestionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'HR'],
    required: true,
  },
  userAnswer: {
    type: String,
    default: '',
  },
  feedback: {
    type: QuestionFeedbackSchema,
    default: () => ({}),
  },
});

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
    enum: [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'AI Engineer',
      'Data Scientist',
      'Data Analyst',
    ],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  questions: [InterviewQuestionSchema],
  overallReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Interview', InterviewSchema);
