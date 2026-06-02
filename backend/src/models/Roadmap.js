const mongoose = require('mongoose');

const WeeklyPlanSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  focus: {
    type: String,
    required: true,
  },
  topics: {
    type: [String],
    default: [],
  },
  tasks: {
    type: [String],
    default: [],
  },
});

const ProjectRecommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
});

const RoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  currentSkills: {
    type: [String],
    default: [],
  },
  cgpa: {
    type: Number,
    required: true,
  },
  weeklyPlan: [WeeklyPlanSchema],
  recommendedProjects: [ProjectRecommendationSchema],
  certifications: {
    type: [String],
    default: [],
  },
  placementPrepPlan: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
