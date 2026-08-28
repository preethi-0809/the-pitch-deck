const db = require('../../backend/src/config/database');

const syllabusTool = {
  name: 'syllabusTool',
  description: 'Retrieves subjects, topics, user syllabus progress, and pending priority topics',

  async getExamSyllabus(examId) {
    const subjects = db.query('SELECT * FROM subjects WHERE exam_id = ? ORDER BY display_order ASC', [examId]);
    const subjectsWithTopics = subjects.map(s => {
      const topics = db.query('SELECT * FROM topics WHERE subject_id = ? ORDER BY display_order ASC', [s.id]);
      return { ...s, topics };
    });
    return subjectsWithTopics;
  },

  async getUserSyllabusStatus(userId, examId) {
    const syllabus = await this.getExamSyllabus(examId);
    const progressList = db.query('SELECT * FROM user_syllabus_progress WHERE user_id = ?', [userId]);
    const progressMap = {};
    progressList.forEach(p => {
      progressMap[p.topic_id] = p;
    });

    let totalTopics = 0;
    let completedTopics = 0;

    const enrichedSyllabus = syllabus.map(subject => {
      const topics = subject.topics.map(topic => {
        totalTopics++;
        const prog = progressMap[topic.id] || { status: 'pending', mastery_percentage: 0, hours_spent: 0 };
        if (prog.status === 'completed' || prog.status === 'revised') {
          completedTopics++;
        }
        return {
          ...topic,
          progress: prog
        };
      });
      return {
        ...subject,
        topics
      };
    });

    const completionRate = totalTopics > 0 ? ((completedTopics / totalTopics) * 100).toFixed(1) : 0;
    return {
      syllabus: enrichedSyllabus,
      totalTopics,
      completedTopics,
      pendingTopics: totalTopics - completedTopics,
      completionRate: Number(completionRate)
    };
  },

  async getPendingHighYieldTopics(userId, examId, limit = 5) {
    const status = await this.getUserSyllabusStatus(userId, examId);
    const pending = [];
    status.syllabus.forEach(s => {
      s.topics.forEach(t => {
        if (!t.progress || t.progress.status === 'pending' || t.progress.status === 'in_progress') {
          pending.push({
            ...t,
            subjectName: s.name,
            subjectCode: s.code
          });
        }
      });
    });

    // Sort by pyq_importance_score desc
    pending.sort((a, b) => (b.pyq_importance_score || 0) - (a.pyq_importance_score || 0));
    return pending.slice(0, limit);
  }
};

module.exports = syllabusTool;
