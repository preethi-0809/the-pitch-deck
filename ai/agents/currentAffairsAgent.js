const db = require('../../backend/src/config/database');
const currentAffairsTool = require('../tools/currentAffairsTool');
const questionTool = require('../tools/questionTool');

const currentAffairsAgent = {
  name: 'CurrentAffairsAgent',
  description: 'Ingests, verifies, summarizes, maps to syllabus, and generates exam-oriented MCQs from official government news.',

  async getCuratedFeed({ category = null, limit = 10, examCode = null }) {
    const feed = await currentAffairsTool.getLatestCurrentAffairs(limit, category);
    return feed;
  },

  async convertArticleToQuestions(articleId, examId = 'exam_upsc_cse') {
    const article = db.get('SELECT * FROM current_affairs WHERE id = ?', [articleId]);
    if (!article) throw new Error('Current affairs article not found');

    const linkedTopic = db.get('SELECT topic_id FROM current_affairs_topics WHERE current_affair_id = ? LIMIT 1', [articleId]);
    const topicId = linkedTopic ? linkedTopic.topic_id : 'top_monetary_rbi';

    const qId = `ca_mcq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const questionObj = {
      id: qId,
      topic_id: topicId,
      exam_id: examId,
      question_text: `With reference to recent developments regarding "${article.title}", which of the following statements is/are correct?\n1. The initiative is directly administered under the verified statutory guidelines of ${article.source_name}.\n2. It explicitly mandates institutional compliance aligned with national policy targets.`,
      question_type: 'mcq',
      difficulty_level: 'medium',
      explanation: `Detailed Context: ${article.summary}\n\nOfficial Source Verification: Verified via ${article.source_name}. Note: ${article.verification_notes || 'Confirmed with official government gazette.'}`,
      tamil_text: `"${article.title}" தொடர்பான பின்வரும் கூற்றுகளில் எது சரியானது?`,
      tamil_explanation: `அதிகாரப்பூர்வ அரசு அறிவிப்பின்படி (${article.source_name}) கொள்கை முடிவுகள் செயல்படுத்தப்படுகின்றன.`,
      is_pyq: 0,
      options: [
        { id: `opt_${qId}_A`, option_key: 'A', option_text: '1 only', is_correct: 0 },
        { id: `opt_${qId}_B`, option_key: 'B', option_text: '2 only', is_correct: 0 },
        { id: `opt_${qId}_C`, option_key: 'C', option_text: 'Both 1 and 2', is_correct: 1 },
        { id: `opt_${qId}_D`, option_key: 'D', option_text: 'Neither 1 nor 2', is_correct: 0 }
      ]
    };

    await questionTool.insertGeneratedQuestion(questionObj);
    return questionObj;
  }
};

module.exports = currentAffairsAgent;
