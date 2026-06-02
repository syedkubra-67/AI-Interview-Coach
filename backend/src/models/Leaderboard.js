const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  streak: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  timeframe: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
