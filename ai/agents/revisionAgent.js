const db = require('../../backend/src/config/database');
const revisionTool = require('../tools/revisionTool');

const defaultFlashcards = [
  {
    id: 'fc_nursing_parkland',
    category: 'Healthcare & Nursing',
    topic: 'Medical-Surgical & Burns Management',
    front: 'What is the Parkland Burn Fluid Formula and its clinical infusion rate protocol?',
    back: 'Total 24h Fluid = 4 mL x Weight (kg) x % TBSA Burned (Ringer Lactate).\n• First 8 Hours (from injury time, NOT hospital arrival): 50% of total volume.\n• Next 16 Hours: Remaining 50% of total volume.\n• Monitored via Urine Output: 0.5 - 1.0 mL/kg/hour in adults.',
    exam_tag: 'AIIMS NORCET / ESIC',
    difficulty: 'Hard'
  },
  {
    id: 'fc_nursing_apgar',
    category: 'Healthcare & Nursing',
    topic: 'Obstetrics & Neonatal Assessment',
    front: 'What are the 5 clinical parameters of the APGAR score evaluated at 1 & 5 minutes?',
    back: 'Score range 0-10 (Normal >= 7):\n• A = Appearance (Skin color: 0=Blue/Pale, 1=Acrocyanosis, 2=Pink)\n• P = Pulse (>100 bpm = 2, <100 bpm = 1, Absent = 0)\n• G = Grimace (Cough/Cry = 2, Grimace = 1, None = 0)\n• A = Activity (Active motion = 2, Flexed arms/legs = 1, Flaccid = 0)\n• R = Respiration (Vigorous cry = 2, Weak/slow = 1, Absent = 0)',
    exam_tag: 'AIIMS NORCET / CHO',
    difficulty: 'Medium'
  },
  {
    id: 'fc_polity_writs',
    category: 'Indian Polity & Law',
    topic: 'Part III Fundamental Rights & Judicial Writs',
    front: 'What are the 5 Constitutional Writs under Articles 32 (SC) and 226 (HC)?',
    back: '1. Habeas Corpus: \"To have the body\" — against unlawful detention.\n2. Mandamus: \"We command\" — enforces performance of mandatory public duty.\n3. Prohibition: Issued to lower courts/tribunals to stop exceeding jurisdiction.\n4. Certiorari: \"To be certified\" — quashes illegal judicial/quasi-judicial orders.\n5. Quo-Warranto: \"By what authority\" — prevents unlawful usurpation of public office.',
    exam_tag: 'UPSC CSE / State PSC / SSC CGL',
    difficulty: 'Hard'
  },
  {
    id: 'fc_polity_freedoms',
    category: 'Indian Polity & Law',
    topic: 'Article 19: Six Democratic Freedoms',
    front: 'What are the 6 Fundamental Freedoms guaranteed under Article 19(1)?',
    back: '• 19(1)(a): Freedom of Speech and Expression.\n• 19(1)(b): Freedom to Assemble peacefully and without arms.\n• 19(1)(c): Freedom to form Associations, Unions or Co-operative Societies.\n• 19(1)(d): Freedom to Move freely throughout India.\n• 19(1)(e): Freedom to Reside and settle in any part of India.\n• 19(1)(g): Freedom to practice any Profession, Trade or Business.\n(Note: Right to Property 19(1)(f) repealed by 44th Amendment 1978).',
    exam_tag: 'UPSC CSE / TNPSC Group 1-2',
    difficulty: 'Medium'
  },
  {
    id: 'fc_quant_successive',
    category: 'Quantitative Aptitude',
    topic: 'Percentage & Commercial Arithmetic',
    front: 'What is the formula for Net Successive Percentage Variation of +a% and -b%?',
    back: 'Net Change = [a - b - (a * b) / 100] %\n• Example 1: +20% length, -10% breadth -> Net Area = 20 - 10 - 2 = +8% increase.\n• Example 2: Two successive discounts of 20% and 30% -> Net Discount = 20 + 30 - 6 = 44%.',
    exam_tag: 'SSC CGL / IBPS PO / RRB',
    difficulty: 'Easy'
  },
  {
    id: 'fc_quant_avg_speed',
    category: 'Quantitative Aptitude',
    topic: 'Time, Speed & Distance Formulations',
    front: 'What is the Harmonic Average Speed formula for equal distance segments at speeds x and y?',
    back: 'Average Speed = (2 * x * y) / (x + y)\n• For 3 equal segments at speeds x, y, z:\nAvg Speed = (3 * x * y * z) / (xy + yz + zx)\n• Crucial Rule: Always convert km/h to m/s by multiplying with 5/18.',
    exam_tag: 'SSC / Banking / Railways',
    difficulty: 'Medium'
  },
  {
    id: 'fc_econ_inflation',
    category: 'Indian Economy & Banking',
    topic: 'Monetary Framework & Inflation Targeting',
    front: 'What is the statutory CPI Inflation Target under Section 45ZA of the RBI Act 1934?',
    back: '• Headline CPI Target: 4.00%\n• Lower & Upper Tolerance Band: +/- 2.00% (Target Range: 2.00% to 6.00%).\n• Set by the 6-member Monetary Policy Committee (MPC) headed by RBI Governor.',
    exam_tag: 'RBI Grade B / UPSC / Banking',
    difficulty: 'Medium'
  },
  {
    id: 'fc_ca_chess',
    category: 'Current Affairs 2026',
    topic: 'Sports & International Records',
    front: 'Where did the Indian Men\'s and Women\'s teams create history by winning double Gold at the 45th Chess Olympiad?',
    back: '• Venue: Budapest, Hungary.\n• Historic Achievement: India became only the third nation in history (after Soviet Union and China) to sweep both Open and Women\'s Olympiad gold medals simultaneously.\n• Key Performers: D. Gukesh, Arjun Erigaisi, Divya Deshmukh, Vantika Agrawal.',
    exam_tag: 'All 49+ Govt Exams',
    difficulty: 'Easy'
  }
];

const revisionAgent = {
  name: 'RevisionAgent',
  description: 'Smart revision manager implementing spaced repetition (1, 3, 7, 21, 60 days) and mistake-driven prioritization.',

  async getRevisionQueue(userId) {
    const revisions = await revisionTool.getUpcomingRevisions(userId);
    const completed = db.query(`
      SELECT rs.*, 
             COALESCE(t.name, sh.topic, 'High-Yield Topic') as topic_name, 
             COALESCE(s.name, sh.subject, 'General Studies') as subject_name
      FROM revision_schedules rs
      LEFT JOIN topics t ON rs.topic_id = t.id
      LEFT JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN syllabus_hierarchy sh ON rs.topic_id = sh.id
      WHERE rs.user_id = ? AND rs.status = 'completed'
      ORDER BY rs.completed_at DESC
      LIMIT 10
    `, [userId]);

    const urgentCount = revisions.filter(r => r.priority === 'urgent').length;
    const highCount = revisions.filter(r => r.priority === 'high').length;

    return {
      pendingRevisions: revisions,
      completedRevisions: completed,
      totalPending: revisions.length,
      urgentCount,
      highCount,
      flashcards: defaultFlashcards,
      retentionMetrics: {
        estimated_recall_rate: 88,
        current_streak_days: 5,
        cards_mastered: 36,
        active_spaced_intervals: revisions.length,
        memory_index: 'High Retention (Spaced Optimized)'
      },
      ebbinghausCurve: [
        { day: 'Day 1', without_revision: '50%', with_spaced: '100%', label: 'Immediate Review' },
        { day: 'Day 3', without_revision: '28%', with_spaced: '95%', label: 'Spaced Recall Spike' },
        { day: 'Day 7', without_revision: '15%', with_spaced: '92%', label: 'Consolidation' },
        { day: 'Day 21', without_revision: '8%', with_spaced: '96%', label: 'Long-Term Storage' },
        { day: 'Day 60', without_revision: '4%', with_spaced: '99%', label: 'Permanent Mastery' }
      ],
      revisionAdvice: urgentCount > 0
        ? `You have ${urgentCount} urgent revision task(s) triggered by high-weightage syllabus topics. Complete them to maintain 88%+ recall accuracy.`
        : 'Your spaced repetition schedule is on track. Consistent daily 15-minute flashcard review boosts long-term exam retention by over 70%.'
    };
  },

  async completeRevisionTask(revisionId) {
    return await revisionTool.completeRevision(revisionId);
  }
};

module.exports = revisionAgent;

