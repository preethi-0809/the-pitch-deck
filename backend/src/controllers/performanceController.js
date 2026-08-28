const performanceService = require('../services/performanceService');

const performanceController = {
  async getDashboard(req, res, next) {
    try {
      const data = await performanceService.getPerformanceDashboard(req.user.id);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = performanceController;
