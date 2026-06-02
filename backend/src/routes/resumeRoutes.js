const express = require('express');
const multer = require('multer');
const { analyzeResume, getResumeHistory } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post('/upload', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getResumeHistory);

module.exports = router;
