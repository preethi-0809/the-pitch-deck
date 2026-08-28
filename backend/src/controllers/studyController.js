const studyPlanService = require('../services/studyPlanService');

const studyController = {
  async getDailyPlan(req, res, next) {
    try {
      const { date } = req.query;
      const plan = await studyPlanService.getTodayPlan(req.user.id, date);
      res.json({ success: true, plan });
    } catch (err) {
      next(err);
    }
  },

  async toggleTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const { isCompleted } = req.body;
      await studyPlanService.toggleTask(taskId, isCompleted);
      const plan = await studyPlanService.getTodayPlan(req.user.id);
      res.json({ success: true, plan });
    } catch (err) {
      next(err);
    }
  },

  async addTask(req, res, next) {
    try {
      const { title, description, planned_duration_minutes, due_time_slot, priority, task_type } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Task title is required.' });
      }
      const plan = await studyPlanService.addCustomTask(req.user.id, {
        title: title.trim(),
        description,
        planned_duration_minutes: parseInt(planned_duration_minutes) || 30,
        due_time_slot: due_time_slot || 'evening',
        priority: priority || 'medium',
        task_type: task_type || 'learn'
      });
      res.json({ success: true, plan, message: 'Custom study task added.' });
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const plan = await studyPlanService.deleteTask(req.user.id, taskId);
      res.json({ success: true, plan, message: 'Task removed.' });
    } catch (err) {
      next(err);
    }
  },

  async regeneratePlan(req, res, next) {
    try {
      const { customHours, strategy } = req.body;
      const newPlan = await studyPlanService.regeneratePlan(req.user.id, customHours, strategy);
      res.json({ success: true, plan: newPlan, message: 'Study plan successfully updated.' });
    } catch (err) {
      next(err);
    }
  },

  async redistributeMissed(req, res, next) {
    try {
      const result = await studyPlanService.redistributeMissed(req.user.id);
      const plan = await studyPlanService.getTodayPlan(req.user.id);
      res.json({ success: true, result, plan });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = studyController;
