const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { login, register, getProfile, updateProfile } = authController;
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
