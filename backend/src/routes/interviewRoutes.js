const express = require('express');
const {
  generateInterview,
  evaluateInterview,
  getInterviewReport,
  getInterviewHistory,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, generateInterview);
router.post('/evaluate', protect, evaluateInterview);
router.get('/report/:id', protect, getInterviewReport);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
