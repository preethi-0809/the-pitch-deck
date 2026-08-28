const db = require('../../backend/src/config/database');

const studyPlanTool = {
  name: 'studyPlanTool',
  description: 'Generates, updates, queries and dynamically re-balances personalized daily and weekly study plans',

  async getTodayPlan(userId, dateStr = null) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const plan = db.get('SELECT * FROM study_plans WHERE user_id = ? AND plan_date = ?', [userId, targetDate]);
    if (!plan) return null;

    const tasks = db.query(`
      SELECT st.*, 
             COALESCE(t.name, 'General Preparation') as topic_name, 
             COALESCE(s.name, 'Core Studies') as subject_name, 
             COALESCE(s.code, 'GEN') as subject_code
      FROM study_tasks st
      LEFT JOIN topics t ON st.topic_id = t.id
      LEFT JOIN subjects s ON t.subject_id = s.id
      WHERE st.plan_id = ?
      ORDER BY 
        CASE st.due_time_slot 
          WHEN 'morning' THEN 1 
          WHEN 'afternoon' THEN 2 
          WHEN 'evening' THEN 3 
          WHEN 'night' THEN 4 
          ELSE 5 
        END,
        st.created_at ASC
    `, [plan.id]);

    return { ...plan, tasks };
  },

  async toggleTaskCompletion(taskId, isCompleted) {
    db.run(`
      UPDATE study_tasks
      SET is_completed = ?, completed_duration_minutes = CASE WHEN ? = 1 THEN planned_duration_minutes ELSE 0 END
      WHERE id = ?
    `, [isCompleted ? 1 : 0, isCompleted ? 1 : 0, taskId]);

    const task = db.get('SELECT plan_id, planned_duration_minutes FROM study_tasks WHERE id = ?', [taskId]);
    if (task) {
      const completedSum = db.get(`
        SELECT COALESCE(SUM(completed_duration_minutes), 0) as total
        FROM study_tasks WHERE plan_id = ?
      `, [task.plan_id]);

      db.run('UPDATE study_plans SET total_completed_minutes = ? WHERE id = ?', [
        completedSum.total,
        task.plan_id
      ]);
    }
    return true;
  },

  async addCustomTask(userId, taskData) {
    const today = new Date().toISOString().split('T')[0];
    let plan = db.get('SELECT id, total_planned_minutes FROM study_plans WHERE user_id = ? AND plan_date = ?', [userId, today]);
    
    if (!plan) {
      const planId = `plan_${userId}_${today}`;
      db.run(`
        INSERT INTO study_plans (id, user_id, plan_date, status, total_planned_minutes, total_completed_minutes, generated_by)
        VALUES (?, ?, ?, 'active', ?, 0, 'custom')
      `, [planId, userId, today, taskData.planned_duration_minutes || 30]);
      plan = { id: planId, total_planned_minutes: taskData.planned_duration_minutes || 30 };
    } else {
      db.run('UPDATE study_plans SET total_planned_minutes = total_planned_minutes + ? WHERE id = ?', [
        taskData.planned_duration_minutes || 30,
        plan.id
      ]);
    }

    const taskId = `custom_task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    // If no topic_id, use fallback
    const fallbackTopic = db.get('SELECT id FROM topics LIMIT 1') || { id: 'top_fr_dpsp' };
    const topicId = taskData.topic_id || fallbackTopic.id;

    db.run(`
      INSERT INTO study_tasks (
        id, plan_id, topic_id, task_type, title, description,
        planned_duration_minutes, completed_duration_minutes, is_completed, priority, due_time_slot
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `, [
      taskId,
      plan.id,
      topicId,
      taskData.task_type || 'learn',
      taskData.title,
      taskData.description || 'Custom candidate study session',
      taskData.planned_duration_minutes || 30,
      taskData.priority || 'medium',
      taskData.due_time_slot || 'evening'
    ]);

    return this.getTodayPlan(userId, today);
  },

  async deleteTask(userId, taskId) {
    const task = db.get('SELECT plan_id, planned_duration_minutes FROM study_tasks WHERE id = ?', [taskId]);
    if (task) {
      db.run('DELETE FROM study_tasks WHERE id = ?', [taskId]);
      db.run('UPDATE study_plans SET total_planned_minutes = MAX(0, total_planned_minutes - ?) WHERE id = ?', [
        task.planned_duration_minutes,
        task.plan_id
      ]);
    }
    const today = new Date().toISOString().split('T')[0];
    return this.getTodayPlan(userId, today);
  },

  async createOrReplacePlan(userId, dateStr, tasks, totalMinutes = 120) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const planId = `plan_${userId}_${targetDate}`;

    db.transaction(() => {
      // Clear existing plan for this date
      const existing = db.get('SELECT id FROM study_plans WHERE user_id = ? AND plan_date = ?', [userId, targetDate]);
      if (existing) {
        db.run('DELETE FROM study_tasks WHERE plan_id = ?', [existing.id]);
        db.run('DELETE FROM study_plans WHERE id = ?', [existing.id]);
      }

      db.run(`
        INSERT INTO study_plans (id, user_id, plan_date, status, total_planned_minutes, total_completed_minutes, generated_by)
        VALUES (?, ?, ?, 'active', ?, 0, 'ai_study_planner')
      `, [planId, userId, targetDate, totalMinutes]);

      const insertTask = db.getRawDb().prepare(`
        INSERT INTO study_tasks (
          id, plan_id, topic_id, task_type, title, description,
          planned_duration_minutes, completed_duration_minutes, is_completed, priority, due_time_slot
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
      `);

      tasks.forEach((t, idx) => {
        const taskId = `task_${planId}_${idx}_${Date.now()}`;
        insertTask.run(
          taskId,
          planId,
          t.topic_id,
          t.task_type || 'learn',
          t.title,
          t.description || '',
          t.planned_duration_minutes || 30,
          t.priority || 'high',
          t.due_time_slot || 'morning'
        );
      });
    });

    return this.getTodayPlan(userId, targetDate);
  },

  async redistributeMissedTasks(userId) {
    const today = new Date().toISOString().split('T')[0];
    // Find incomplete tasks from past active plans
    const missedTasks = db.query(`
      SELECT st.*
      FROM study_tasks st
      JOIN study_plans sp ON st.plan_id = sp.id
      WHERE sp.user_id = ? AND sp.plan_date < ? AND st.is_completed = 0
    `, [userId, today]);

    if (missedTasks.length === 0) {
      return { adjustedCount: 0, message: 'No pending missed tasks found.' };
    }

    // Get today's plan or create one
    let todayPlan = await this.getTodayPlan(userId, today);
    if (!todayPlan) {
      todayPlan = await this.createOrReplacePlan(userId, today, []);
    }

    // Append up to 2 high-priority missed tasks to today's plan
    const insertTask = db.getRawDb().prepare(`
      INSERT INTO study_tasks (
        id, plan_id, topic_id, task_type, title, description,
        planned_duration_minutes, completed_duration_minutes, is_completed, priority, due_time_slot
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 'high', 'evening')
    `);

    let addedCount = 0;
    for (const mt of missedTasks.slice(0, 2)) {
      const taskId = `redist_${todayPlan.id}_${mt.id}`;
      insertTask.run(
        taskId,
        todayPlan.id,
        mt.topic_id,
        mt.task_type,
        `[Carried Over] ${mt.title}`,
        mt.description,
        Math.min(mt.planned_duration_minutes, 30)
      );
      // Mark old task as adjusted
      db.run("UPDATE study_tasks SET is_completed = 1, description = description || ' [Redistributed]' WHERE id = ?", [mt.id]);
      addedCount++;
    }

    return {
      adjustedCount: addedCount,
      message: `Successfully rebalanced ${addedCount} pending topic(s) into today's schedule without overloading.`
    };
  }
};

module.exports = studyPlanTool;
