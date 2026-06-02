const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  badgeUrl: {
    type: String,
    required: true,
  },
  xpReward: {
    type: Number,
    default: 100,
  },
  criteriaType: {
    type: String,
    enum: ['interviews_completed', 'streak_days', 'perfect_score', 'communication_score'],
    required: true,
  },
  criteriaValue: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
