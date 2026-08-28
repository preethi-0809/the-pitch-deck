const db = require('../../backend/src/config/database');
const revisionTool = require('../tools/revisionTool');

const weaknessAgent = {
  name: 'WeaknessAgent',
  description: 'Isolates root causes of user mistakes, tracks repeated multi-test error patterns, and auto-triggers remedial workflows.',

  async analyzeUserWeaknesses(userId) {
    const mistakes = db.query(`
      SELECT um.*, t.name as topic_name, s.name as subject_name
      FROM user_mistakes um
      JOIN topics t ON um.topic_id = t.id
      JOIN subjects s ON t.subject_id = s.id
      WHERE um.user_id = ? AND um.status = 'active'
      ORDER BY um.frequency_count DESC, um.last_occurred_at DESC
    `, [userId]);

    // Group repeated mistakes
    const repeatedMistakes = mistakes.filter(m => m.frequency_count >= 2);
    
    // Categorize mistakes by taxonomy
    const taxonomyBreakdown = {
      concept_gap: { count: 0, label: 'Concept Gap', description: 'Underlying theory or definition was misunderstood.' },
      memory_issue: { count: 0, label: 'Memory / Recall Issue', description: 'Specific articles, facts, or dates were forgotten.' },
      confusion: { count: 0, label: 'Concept Confusion', description: 'Confused between two closely related options or provisions.' },
      misreading: { count: 0, label: 'Misreading Question', description: 'Missed keywords like "NOT", "INCORRECT", or "EXCEPT".' },
      careless: { count: 0, label: 'Careless Error', description: 'Calculation or option selection slip despite knowing the concept.' },
      guessing: { count: 0, label: 'Blind / Wild Guessing', description: 'Attempted without sufficient elimination evidence.' },
      time_management: { count: 0, label: 'Time Management Panic', description: 'Rushed response due to running out of time.' }
    };

    mistakes.forEach(m => {
      if (taxonomyBreakdown[m.mistake_type]) {
        taxonomyBreakdown[m.mistake_type].count += m.frequency_count || 1;
      }
    });

    const recommendations = [];
    if (repeatedMistakes.length > 0) {
      const worst = repeatedMistakes[0];
      recommendations.push({
        priority: 'Urgent Action Required',
        topicId: worst.topic_id,
        topicName: worst.topic_name,
        subjectName: worst.subject_name,
        frequency: worst.frequency_count,
        message: `You have made errors related to ${worst.topic_name} across ${worst.frequency_count} tests/drills. We have scheduled an urgent revision block.`,
        suggestedAction: 'Review foundational notes and complete 10 topic MCQs before taking full mock tests.'
      });
    }

    if (taxonomyBreakdown.misreading.count >= 2) {
      recommendations.push({
        priority: 'Technique Calibration',
        topicName: 'Question Reading Technique',
        message: 'You have made multiple errors due to misreading negative qualifiers ("NOT", "INCORRECT"). Highlight question keywords before reading choices.'
      });
    }

    return {
      activeMistakesCount: mistakes.length,
      repeatedMistakes,
      taxonomyBreakdown,
      recommendations
    };
  },

  async triggerAutoRemediation(userId, topicId, mistakeType) {
    // Schedule an urgent revision task immediately
    const rev = await revisionTool.scheduleRevision(userId, topicId, 'mistake_trigger', 'urgent', 1);
    return {
      success: true,
      revisionScheduled: rev,
      message: `Automatic remediation triggered: Spaced revision queued for topic #${topicId}`
    };
  }
};

module.exports = weaknessAgent;
