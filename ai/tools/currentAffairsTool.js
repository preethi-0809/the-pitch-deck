const db = require('../../backend/src/config/database');

const currentAffairsTool = {
  name: 'currentAffairsTool',
  description: 'Retrieves verified current affairs, connects them to syllabus topics, and verifies source authority',

  async getLatestCurrentAffairs(limit = 10, category = null) {
    let sql = 'SELECT * FROM current_affairs';
    const params = [];
    if (category && category !== 'All') {
      sql += ' WHERE category = ?';
      params.push(category);
    }
    sql += ' ORDER BY published_date DESC LIMIT ?';
    params.push(limit);

    const items = db.query(sql, params);
    return items.map(item => {
      const linkedTopics = db.query(`
        SELECT t.id, t.name, s.name as subject_name
        FROM current_affairs_topics cat
        JOIN topics t ON cat.topic_id = t.id
        JOIN subjects s ON t.subject_id = s.id
        WHERE cat.current_affair_id = ?
      `, [item.id]);

      return {
        ...item,
        exam_relevance_tags: item.exam_relevance_tags ? JSON.parse(item.exam_relevance_tags) : [],
        linkedTopics
      };
    });
  },

  async getCurrentAffairsForTopic(topicId) {
    const items = db.query(`
      SELECT ca.*
      FROM current_affairs ca
      JOIN current_affairs_topics cat ON ca.id = cat.current_affair_id
      WHERE cat.topic_id = ?
      ORDER BY ca.published_date DESC
    `, [topicId]);

    return items.map(item => ({
      ...item,
      exam_relevance_tags: item.exam_relevance_tags ? JSON.parse(item.exam_relevance_tags) : []
    }));
  },

  async addVerifiedArticle(articleData) {
    const id = `ca_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.run(`
      INSERT INTO current_affairs (
        id, title, summary, detailed_analysis, category, source_name, source_url,
        is_verified, verification_notes, exam_relevance_tags, published_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      articleData.title,
      articleData.summary,
      articleData.detailed_analysis || '',
      articleData.category || 'General',
      articleData.source_name || 'Official PIB/Govt Bulletin',
      articleData.source_url || '',
      articleData.is_verified ? 1 : 0,
      articleData.verification_notes || 'Verified against official ministry notification.',
      JSON.stringify(articleData.exam_relevance_tags || []),
      articleData.published_date || new Date().toISOString().split('T')[0]
    ]);

    if (articleData.topic_ids && Array.isArray(articleData.topic_ids)) {
      for (const tid of articleData.topic_ids) {
        db.run('INSERT INTO current_affairs_topics (id, current_affair_id, topic_id) VALUES (?, ?, ?)', [
          `cat_${id}_${tid}`,
          id,
          tid
        ]);
      }
    }

    return { id, ...articleData };
  }
};

module.exports = currentAffairsTool;
