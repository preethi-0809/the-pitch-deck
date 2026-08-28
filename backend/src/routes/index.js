const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const examRoutes = require('./examRoutes');
const studyRoutes = require('./studyRoutes');
const questionRoutes = require('./questionRoutes');
const testRoutes = require('./testRoutes');
const coachRoutes = require('./coachRoutes');
const performanceRoutes = require('./performanceRoutes');
const revisionRoutes = require('./revisionRoutes');
const currentAffairsRoutes = require('./currentAffairsRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');
const discoveryRoutes = require('./discoveryRoutes');
const syllabusRoutes = require('./syllabusRoutes');

router.use('/auth', authRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/syllabus', syllabusRoutes);
router.use('/exams', examRoutes);
router.use('/study', studyRoutes);
router.use('/questions', questionRoutes);
router.use('/tests', testRoutes);
router.use('/coach', coachRoutes);
router.use('/performance', performanceRoutes);
router.use('/revision', revisionRoutes);
router.use('/current-affairs', currentAffairsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// Healthcheck
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'Government Exam AI Preparation Platform (Pitch Deck)',
    version: '1.0.0'
  });
});

module.exports = router;
