const authService = require('../services/authService');
const userDataTool = require('../../../ai/tools/userDataTool');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, profileData } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }
      const result = await authService.register({ name, email, password, profileData });
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }
      const result = await authService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await userDataTool.updateProfile(req.user.id, req.body);
      res.json({ success: true, user: updated });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
