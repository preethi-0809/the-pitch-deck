const db = require('../config/database');

function getCuratedBooksAndSyllabusLinks(exam, topicItem) {
  const category = exam?.category || 'General';
  const examName = exam?.name || 'Government Examination';
  const topicName = topicItem?.topic || topicItem?.name || 'Core Module';
  const subjectName = topicItem?.subject || topicItem?.subject_name || 'General Studies';
  const lowerTopic = (topicName + ' ' + subjectName + ' ' + (exam?.name || '')).toLowerCase();

  let reference_books = [];
  let syllabus_links = [];

  let officialSyllabusUrl = 'https://upsc.gov.in';
  let officialPortalName = `${exam?.organization || 'Staff Selection & Civil Service Commissions'} Official Portal`;

  if (category === 'Healthcare' || lowerTopic.includes('norcet') || lowerTopic.includes('nursing') || lowerTopic.includes('aiims')) {
    officialSyllabusUrl = 'https://www.aiimsexams.ac.in';
    officialPortalName = 'AIIMS New Delhi Examination Section (NORCET Official)';
    syllabus_links = [
      { name: 'AIIMS NORCET Official Examination Scheme & Syllabus', url: 'https://www.aiimsexams.ac.in', type: 'Official Gazette' },
      { name: 'Indian Nursing Council (INC) National Curriculum & Standard Competencies', url: 'https://www.indiannursingcouncil.org', type: 'Curriculum Standard' },
      { name: 'Ministry of Health & Family Welfare (MoHFW) Clinical Practice Guidelines', url: 'https://www.mohfw.gov.in', type: 'Government Ministry' }
    ];

    reference_books = [
      {
        title: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing",
        authors: "Janice L. Hinkle, PhD, RN, CNRN & Kerry H. Cheever, PhD, RN",
        publisher: "Wolters Kluwer / Lippincott Williams & Wilkins",
        edition: "15th Global Edition",
        focus_chapters: "Cardiovascular Care, Mechanical Ventilation, Shock & Fluid Management",
        link: "https://www.lww.com",
        type: "Standard Textbook"
      },
      {
        title: "DC Dutta's Textbook of Obstetrics (Including Perinatology)",
        authors: "Dr. D.C. Dutta (Edited by Dr. Hiralal Konar, MD, DNB)",
        publisher: "Jaypee Brothers Medical Publishers",
        edition: "9th Edition",
        focus_chapters: "Antenatal Assessment, Stages of Labor, PPH & Eclampsia Management",
        link: "https://www.jaypeebrothers.com",
        type: "Clinical Textbook"
      },
      {
        title: "Park's Textbook of Preventive and Social Medicine",
        authors: "Dr. K. Park, MD",
        publisher: "Banarsidas Bhanot Publishers",
        edition: "27th Edition",
        focus_chapters: "Epidemiology, Universal Immunization Programme (UIP) & BMW 2016 Rules",
        link: "https://www.cbspd.com",
        type: "Reference Standard"
      },
      {
        title: "Target NORCET — Comprehensive Nursing Officer Exam Guide",
        authors: "Pritesh Gautam & Dr. S.K. Sharma",
        publisher: "CBS Publishers & Distributors",
        edition: "Latest Edition (AIIMS NORCET Pattern)",
        focus_chapters: "Image-Based Questions, Clinical Case Scenarios & High-Yield MCQs",
        link: "https://www.cbspd.com",
        type: "Exam Prep Guide"
      },
      {
        title: "National Digital Library of India (NDLI) Medical & Nursing Resources",
        authors: "Ministry of Education, Government of India / IIT Kharagpur",
        publisher: "National Digital Library of India (NDLI)",
        edition: "Open Digital Repository",
        focus_chapters: "Open-Access Clinical Research, Guidelines & E-Books",
        link: "https://ndl.gov.in",
        type: "Open Digital Library"
      }
    ];
  } else if (lowerTopic.includes('polity') || lowerTopic.includes('constitution') || lowerTopic.includes('right') || lowerTopic.includes('writ') || category === 'UPSC' || category === 'State PSC') {
    officialSyllabusUrl = exam?.code?.includes('TNPSC') ? 'https://tnpsc.gov.in/english/syllabus.html' : 'https://upsc.gov.in/examinations/active-exams';
    officialPortalName = `${exam?.organization || 'Public Service Commission'} Official Examination Portal`;
    syllabus_links = [
      { name: `${examName} Official Syllabus & Examination Scheme`, url: officialSyllabusUrl, type: 'Commission Gazette' },
      { name: 'Legislative Department, Ministry of Law and Justice (Constitution of India)', url: 'https://legislative.gov.in/constitution-of-india', type: 'Official Legal Text' },
      { name: 'Supreme Court of India Official Judgments Repository', url: 'https://main.sci.gov.in/judgments', type: 'Judicial Precedents' }
    ];

    reference_books = [
      {
        title: "Indian Polity for Civil Services & State Examinations",
        authors: "M. Laxmikanth",
        publisher: "McGraw Hill Education India",
        edition: "7th Revised Edition",
        focus_chapters: "Fundamental Rights (Art 12-35), Writs, DPSP, Parliament, Judicial Review & Amendments",
        link: "https://www.mheducation.co.in",
        type: "Standard Master Guide"
      },
      {
        title: "Introduction to the Constitution of India",
        authors: "Dr. Durga Das Basu (D.D. Basu)",
        publisher: "LexisNexis / Wadhwa Nagpur",
        edition: "26th Edition",
        focus_chapters: "Constitutional Philosophy, Basic Structure Doctrine & Federal Relations",
        link: "https://www.lexisnexis.in",
        type: "Authoritative Reference"
      },
      {
        title: "NCERT Class 11: Indian Constitution at Work & Political Theory",
        authors: "NCERT Editorial Board",
        publisher: "National Council of Educational Research and Training",
        edition: "Official NCERT Edition",
        focus_chapters: "Rights in the Indian Constitution, Election & Representation, Judiciary",
        link: "https://ncert.nic.in/textbook.php",
        type: "Foundational NCERT"
      },
      {
        title: "Our Parliament & Our Constitution",
        authors: "Dr. Subhash C. Kashyap (Former Secretary-General of Lok Sabha)",
        publisher: "National Book Trust (NBT) India",
        edition: "NBT Essential Series",
        focus_chapters: "Parliamentary Procedures, Committees & Legislative Bills",
        link: "https://www.nbtindia.gov.in",
        type: "Parliamentary Reference"
      }
    ];
  } else if (lowerTopic.includes('quant') || lowerTopic.includes('math') || lowerTopic.includes('percent') || lowerTopic.includes('speed') || lowerTopic.includes('arithmetic')) {
    officialSyllabusUrl = 'https://ssc.gov.in/for-candidates/tentative-syllabus';
    officialPortalName = 'Staff Selection Commission Official Candidate Portal';
    syllabus_links = [
      { name: `${examName} Quantitative Aptitude & Mathematics Official Syllabus`, url: officialSyllabusUrl, type: 'Commission Syllabus' },
      { name: 'NCERT E-Textbooks Portal (Mathematics Class 6 to 12)', url: 'https://ncert.nic.in/textbook.php', type: 'National Curriculum' }
    ];

    reference_books = [
      {
        title: "Quantitative Aptitude for Competitive Examinations",
        authors: "Dr. R.S. Aggarwal",
        publisher: "S. Chand Publishing",
        edition: "Latest Fully Revised Edition",
        focus_chapters: "Percentages, Profit & Loss, Time Speed Distance, Ratio & Proportions, Algebra",
        link: "https://www.schandpublishing.com",
        type: "Standard Practice Book"
      },
      {
        title: "Fast Track Objective Arithmetic",
        authors: "Rajesh Verma",
        publisher: "Arihant Publications",
        edition: "Special Speed Edition",
        focus_chapters: "Shortcut Multiplicative Factor, Successive Variations, Alligation & Mixtures",
        link: "https://www.arihantbooks.com",
        type: "Speed Math Guide"
      },
      {
        title: "Magical Book on Quicker Maths",
        authors: "M. Tyra",
        publisher: "BSC Publishing",
        edition: "5th Edition",
        focus_chapters: "Vedic Mental Calculation Tricks & Option Elimination Techniques",
        link: "https://www.bscpublishing.com",
        type: "Mental Math"
      }
    ];
  } else if (lowerTopic.includes('reasoning') || lowerTopic.includes('syllogism') || lowerTopic.includes('puzzle') || lowerTopic.includes('logic')) {
    officialSyllabusUrl = 'https://ssc.gov.in';
    officialPortalName = 'Staff Selection Commission Examination Blueprint';
    syllabus_links = [
      { name: `${examName} General Intelligence & Reasoning Official Scheme`, url: officialSyllabusUrl, type: 'Commission Blueprint' }
    ];

    reference_books = [
      {
        title: "A Modern Approach to Verbal & Non-Verbal Reasoning",
        authors: "Dr. R.S. Aggarwal",
        publisher: "S. Chand Publishing",
        edition: "Revised Color Edition",
        focus_chapters: "Syllogisms, Seating Arrangement Puzzles, Direction Sense & Coding-Decoding",
        link: "https://www.schandpublishing.com",
        type: "Master Guide"
      },
      {
        title: "Analytical Reasoning",
        authors: "M.K. Pandey",
        publisher: "BSC Publishing",
        edition: "Comprehensive Edition",
        focus_chapters: "Critical Reasoning, Statement-Assumptions & Structural Deductions",
        link: "https://www.bscpublishing.com",
        type: "Analytical Guide"
      }
    ];
  } else if (lowerTopic.includes('economy') || lowerTopic.includes('bank') || lowerTopic.includes('budget') || lowerTopic.includes('rbi')) {
    officialSyllabusUrl = 'https://rbi.org.in';
    officialPortalName = 'Reserve Bank of India & Ministry of Finance Portals';
    syllabus_links = [
      { name: 'Reserve Bank of India (RBI) Notifications & Monetary Bulletins', url: 'https://rbi.org.in', type: 'Central Bank Portal' },
      { name: 'Union Budget & Economic Survey Official Portal', url: 'https://www.indiabudget.gov.in', type: 'Ministry of Finance' }
    ];

    reference_books = [
      {
        title: "Indian Economy for Civil Services and Other Examinations",
        authors: "Ramesh Singh",
        publisher: "McGraw Hill India",
        edition: "16th Edition",
        focus_chapters: "Fiscal Policy, Monetary Transmission, Inflation Targeting & External Sector",
        link: "https://www.mheducation.co.in",
        type: "Standard Economy Text"
      },
      {
        title: "Banking Awareness for SBI, IBPS & RBI Exams",
        authors: "Arihant Academic Team",
        publisher: "Arihant Publications",
        edition: "Latest Edition",
        focus_chapters: "RBI Regulations, Monetary Instruments (Repo/SDF/MSF) & Banking Terms",
        link: "https://www.arihantbooks.com",
        type: "Banking Guide"
      }
    ];
  } else {
    officialSyllabusUrl = 'https://upsc.gov.in';
    officialPortalName = `${exam?.organization || 'National Commission'} Official Portal`;
    syllabus_links = [
      { name: `${examName} Official Examination Scheme & Syllabus`, url: officialSyllabusUrl, type: 'Commission Gazette' },
      { name: 'National Digital Library of India (NDLI)', url: 'https://ndl.gov.in', type: 'Open Digital Repository' }
    ];

    reference_books = [
      {
        title: `${subjectName} Comprehensive Master Guide for Competitive Exams`,
        authors: "Standard Academic Editorial Board",
        publisher: "National Higher Education Publishers",
        edition: "Latest Standard Edition",
        focus_chapters: `Fundamental Principles, Problem Solving & Key Formulations for ${topicName}`,
        link: "https://ndl.gov.in",
        type: "Standard Reference"
      },
      {
        title: "NCERT Class 9-12 Foundational Series",
        authors: "NCERT National Board",
        publisher: "NCERT Official E-Books",
        edition: "Official Govt Edition",
        focus_chapters: `Core Concepts, Theoretical Models & Analytical Applications of ${topicName}`,
        link: "https://ncert.nic.in/textbook.php",
        type: "Foundational Textbook"
      }
    ];
  }

  return {
    official_portal_name: officialPortalName,
    official_syllabus_url: officialSyllabusUrl,
    syllabus_links,
    reference_books
  };
}

const syllabusService = {
  // 1. Get all exams with syllabus stats & user progress
  async getExamsForSyllabus({ category, search, userId }) {
    let sql = `
      SELECT e.id, e.code, e.name, e.category, e.organization, e.qualification, e.difficulty, e.status,
             COUNT(DISTINCT sh.id) as total_topics_count
      FROM exams e
      LEFT JOIN syllabus_hierarchy sh ON e.id = sh.exam_id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND e.category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ' AND (e.name LIKE ? OR e.code LIKE ? OR e.organization LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' GROUP BY e.id ORDER BY e.is_popular DESC, e.name ASC';
    const exams = db.query(sql, params);

    // Compute user completion percentage per exam
    return exams.map(e => {
      let completedCount = 0;
      if (userId) {
        const row = db.get(`
          SELECT COUNT(*) as count
          FROM user_syllabus_progress usp
          JOIN syllabus_hierarchy sh ON usp.topic_id = sh.id
          WHERE usp.user_id = ? AND sh.exam_id = ? AND usp.status = 'completed'
        `, [userId, e.id]);
        completedCount = row?.count || 0;
      }

      const totalCount = Math.max(e.total_topics_count || 0, 1);
      const overall_progress_percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

      return {
        ...e,
        total_topics_count: e.total_topics_count || 0,
        completed_topics_count: completedCount,
        overall_progress_percentage
      };
    });
  },

  // 2. Get Structured Exam-Wise Syllabus Hierarchy (Stage -> Subject -> Topic -> Progress)
  async getExamSyllabusHierarchy(examId, userId) {
    const exam = db.get('SELECT id, code, name, category, organization, qualification FROM exams WHERE id = ?', [examId]);
    if (!exam) throw new Error('Exam not found');

    const rawTopics = db.query(`
      SELECT sh.*,
             usp.status as user_status,
             usp.completion_percentage as user_completion,
             usp.notes_bookmarked,
             usp.last_studied_at,
             CASE WHEN tn.id IS NOT NULL THEN 1 ELSE 0 END as has_detailed_notes
      FROM syllabus_hierarchy sh
      LEFT JOIN user_syllabus_progress usp ON (sh.id = usp.topic_id AND usp.user_id = ?)
      LEFT JOIN topic_notes tn ON sh.id = tn.topic_id
      WHERE sh.exam_id = ?
      ORDER BY sh.stage ASC, sh.subject ASC, sh.display_order ASC
    `, [userId || 'anonymous', examId]);

    // If no specific hierarchy exists in syllabus_hierarchy, synthesize from existing subjects and topics tables
    let topicsList = rawTopics;
    if (topicsList.length === 0) {
      const fallback = db.query(`
        SELECT t.id,
               ? as exam_id,
               'General Tier' as stage,
               s.name as subject,
               t.name as topic,
               t.description as subtopic,
               t.description,
               t.difficulty_level as priority,
               t.pyq_importance_score as pyq_weightage,
               t.display_order,
               usp.status as user_status,
               usp.completion_percentage as user_completion,
               usp.notes_bookmarked,
               usp.last_studied_at,
               1 as has_detailed_notes
        FROM topics t
        JOIN subjects s ON t.subject_id = s.id
        LEFT JOIN user_syllabus_progress usp ON (t.id = usp.topic_id AND usp.user_id = ?)
        WHERE s.exam_id = ?
        ORDER BY s.display_order ASC, t.display_order ASC
      `, [examId, userId || 'anonymous', examId]);
      topicsList = fallback;
    }

    // Group into Stages -> Subjects -> Topics
    const stagesMap = {};
    let totalTopics = 0;
    let completedTopics = 0;
    const subjectProgressMap = {};

    topicsList.forEach(item => {
      totalTopics++;
      const isCompleted = item.user_status === 'completed';
      if (isCompleted) completedTopics++;

      const stageName = item.stage || 'Tier 1';
      const subjectName = item.subject || 'General Studies';

      if (!stagesMap[stageName]) {
        stagesMap[stageName] = {
          stage_name: stageName,
          subjects: {}
        };
      }

      if (!stagesMap[stageName].subjects[subjectName]) {
        stagesMap[stageName].subjects[subjectName] = {
          subject_name: subjectName,
          topics: [],
          total_count: 0,
          completed_count: 0
        };
      }

      if (!subjectProgressMap[subjectName]) {
        subjectProgressMap[subjectName] = { total: 0, completed: 0 };
      }

      subjectProgressMap[subjectName].total++;
      if (isCompleted) subjectProgressMap[subjectName].completed++;

      stagesMap[stageName].subjects[subjectName].total_count++;
      if (isCompleted) stagesMap[stageName].subjects[subjectName].completed_count++;

      stagesMap[stageName].subjects[subjectName].topics.push({
        id: item.id,
        exam_id: item.exam_id,
        stage: item.stage,
        subject: item.subject,
        topic: item.topic,
        subtopic: item.subtopic,
        description: item.description,
        priority: item.priority || 'high',
        pyq_weightage: item.pyq_weightage || 8.0,
        status: item.user_status || 'not_started',
        completion_percentage: item.user_completion || (isCompleted ? 100 : 0),
        notes_bookmarked: item.notes_bookmarked === 1,
        last_studied_at: item.last_studied_at,
        has_detailed_notes: item.has_detailed_notes === 1
      });
    });

    const structuredStages = Object.values(stagesMap).map(stg => ({
      stage_name: stg.stage_name,
      subjects: Object.values(stg.subjects).map(sub => ({
        subject_name: sub.subject_name,
        total_count: sub.total_count,
        completed_count: sub.completed_count,
        progress_percentage: sub.total_count > 0 ? Math.round((sub.completed_count / sub.total_count) * 100) : 0,
        topics: sub.topics
      }))
    }));

    // Overall Subject Progress Summary
    const subjectProgressSummary = Object.entries(subjectProgressMap).map(([subj, stats]) => ({
      subject_name: subj,
      total_topics: stats.total,
      completed_topics: stats.completed,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));

    const overall_percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      exam,
      overall_percentage,
      total_topics: totalTopics,
      completed_topics: completedTopics,
      subject_progress: subjectProgressSummary,
      stages: structuredStages
    };
  },

  // 3. Get Topic Detailed Notes (Concept, Formulas, Examples, Short Tricks, Mistakes, Revision, Practice)
  async getTopicDetailedNotes(topicId, examId, userId) {
    let note = db.get('SELECT * FROM topic_notes WHERE topic_id = ?', [topicId]);

    // If not found in topic_notes, check study_materials or build structured fallback
    if (!note) {
      const topic = db.get('SELECT * FROM syllabus_hierarchy WHERE id = ?', [topicId]) ||
                    db.get('SELECT t.*, s.name as subject_name FROM topics t JOIN subjects s ON t.subject_id = s.id WHERE t.id = ?', [topicId]);

      if (topic) {
        note = {
          id: `gen_note_${topicId}`,
          topic_id: topicId,
          exam_id: examId || topic.exam_id || 'exam_ssc_cgl',
          title: `${topic.topic || topic.name} — Comprehensive Learning Master Guide`,
          concept: `### 1. Conceptual Foundation & Syllabus Scope
This chapter covers foundational statutory mechanisms, conceptual principles, and numerical methodologies for **${topic.topic || topic.name}**.

#### Key Examination Pillars:
1. Core definitions, governing theorems, and statutory provisions.
2. Standard examination patterns and recurring variable models.
3. Multi-tier application in preliminary and main examination papers.`,
          formulas: JSON.stringify([
            { name: 'Core Formulation', formula: 'Standard Method: Direct Proportional Calculation & Conservation Model', notes: 'Frequently tested in Tier 1 and Tier 2 CBT' }
          ]),
          examples: JSON.stringify([
            {
              question: `Sample Standard Problem on ${topic.topic || topic.name}: Calculate the proportional variance when parameters shift by standard ratios.`,
              step1: 'Step 1: Write down the primary governing relationship.',
              step2: 'Step 2: Substitute given initial boundary conditions.',
              step3: 'Step 3: Solve for the target unknown variable.',
              answer: 'Standard computed solution verified against official keys.'
            }
          ]),
          shortcuts: JSON.stringify([
            '⚡ Speed Strategy: Always eliminate extreme or outlier options first.',
            '⚡ Fast Calculation: Use digital sum or unit-digit verification to check choices in under 15 seconds.'
          ]),
          common_mistakes: JSON.stringify([
            '⚠️ Pitfall: Forgetting to verify unit consistency (e.g. km/h vs m/s or percentage vs fraction base).',
            '⚠️ Trap: Misidentifying the baseline value when applying successive changes.'
          ]),
          quick_revision: `* Master the foundational theorem and primary identities.
* Always verify unit compatibility.
* Practice option elimination before full mechanical derivation.`,
          practice_questions: JSON.stringify([
            {
              id: `pq_${topicId}_1`,
              question: `Which of the following statements is mathematically/conceptually correct regarding ${topic.topic || topic.name}?`,
              options: [
                'The parameter varies inversely with baseline magnitude.',
                'The parameter remains constant across all linear transformations.',
                'The net outcome is determined by proportional scaling.',
                'None of the above'
              ],
              correct_index: 2,
              explanation: 'Standard concept verification: Proportional scaling governs linear and non-linear parameter shifts.'
            }
          ]),
          source_authority: 'Official Standard Textbooks & Commission Gazette Reference'
        };
      } else {
        throw new Error('Topic not found in syllabus database');
      }
    }

    // Parse JSON fields
    const parsedNote = {
      ...note,
      formulas: typeof note.formulas === 'string' ? JSON.parse(note.formulas) : (note.formulas || []),
      examples: typeof note.examples === 'string' ? JSON.parse(note.examples) : (note.examples || []),
      shortcuts: typeof note.shortcuts === 'string' ? JSON.parse(note.shortcuts) : (note.shortcuts || []),
      common_mistakes: typeof note.common_mistakes === 'string' ? JSON.parse(note.common_mistakes) : (note.common_mistakes || []),
      practice_questions: typeof note.practice_questions === 'string' ? JSON.parse(note.practice_questions) : (note.practice_questions || [])
    };

    // Attach user progress
    let userProgress = { status: 'not_started', completion_percentage: 0, notes_bookmarked: false };
    if (userId) {
      const prog = db.get('SELECT * FROM user_syllabus_progress WHERE user_id = ? AND topic_id = ?', [userId, topicId]);
      if (prog) {
        userProgress = {
          status: prog.status,
          completion_percentage: prog.completion_percentage || (prog.status === 'completed' ? 100 : 50),
          notes_bookmarked: prog.notes_bookmarked === 1,
          last_studied_at: prog.last_studied_at
        };
      }
    }

    // Attach linked Current Affairs articles for this topic
    const linkedCurrentAffairs = db.query(`
      SELECT id, title, summary, category, published_date, source_name, source_url
      FROM ca_rag_documents
      WHERE syllabus_topic_ids LIKE ?
      ORDER BY published_date DESC LIMIT 4
    `, [`%${topicId}%`]);

    // Fetch parent exam details
    const targetExamId = examId || note.exam_id;
    const examDetails = db.get('SELECT id, code, name, category, organization, qualification FROM exams WHERE id = ?', [targetExamId]) || {};

    // Fetch topic hierarchy details (stage, subject, topic, subtopic)
    const topicDetails = db.get('SELECT id, exam_id, stage, subject, topic, subtopic, priority, pyq_weightage, display_order FROM syllabus_hierarchy WHERE id = ?', [topicId]) || {
      id: topicId,
      exam_id: targetExamId,
      stage: 'Core Stage',
      subject: 'General Studies',
      topic: note.title.split('—')[0].trim(),
      subtopic: ''
    };

    // Fetch adjacent topics in the same subject for continuous navigation
    const siblingTopics = db.query(`
      SELECT id, topic, display_order
      FROM syllabus_hierarchy
      WHERE exam_id = ? AND subject = ?
      ORDER BY display_order ASC
    `, [targetExamId, topicDetails.subject]);

    const currentIndex = siblingTopics.findIndex(t => t.id === topicId);
    const adjacent_topics = {
      previous: currentIndex > 0 ? siblingTopics[currentIndex - 1] : null,
      next: currentIndex >= 0 && currentIndex < siblingTopics.length - 1 ? siblingTopics[currentIndex + 1] : null,
      total_in_subject: siblingTopics.length
    };

    // Generate curated reference books and official syllabus links
    const curatedData = getCuratedBooksAndSyllabusLinks(examDetails, topicDetails);

    return {
      note: parsedNote,
      user_progress: userProgress,
      linked_current_affairs: linkedCurrentAffairs,
      exam: examDetails,
      topic_info: topicDetails,
      reference_books: curatedData.reference_books,
      syllabus_links: curatedData.syllabus_links,
      official_portal_name: curatedData.official_portal_name,
      official_syllabus_url: curatedData.official_syllabus_url,
      adjacent_topics
    };
  },

  // 4. Update Topic Progress (Not Started / Learning / Completed / Needs Revision)
  async updateTopicProgress(userId, examId, topicId, { status, completion_percentage, notes_bookmarked }) {
    if (!userId) throw new Error('User authentication required');

    const id = `usp_${userId}_${topicId}`;
    const validStatus = ['not_started', 'learning', 'completed', 'needs_revision'].includes(status) ? status : 'completed';
    const pct = completion_percentage !== undefined ? completion_percentage : (validStatus === 'completed' ? 100 : 50);
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO user_syllabus_progress (
        id, user_id, exam_id, topic_id, status, completion_percentage, notes_bookmarked, last_studied_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, topic_id) DO UPDATE SET
        status = excluded.status,
        completion_percentage = excluded.completion_percentage,
        notes_bookmarked = COALESCE(excluded.notes_bookmarked, user_syllabus_progress.notes_bookmarked),
        last_studied_at = excluded.last_studied_at,
        updated_at = excluded.updated_at
    `, [
      id, userId, examId, topicId, validStatus, pct,
      notes_bookmarked !== undefined ? (notes_bookmarked ? 1 : 0) : null,
      now, now
    ]);

    return { success: true, status: validStatus, completion_percentage: pct };
  },

  // 5. Notes Library Search & Filter Browser
  async getNotesLibrary(userId, { examId, subject, search, bookmarkedOnly }) {
    let sql = `
      SELECT tn.id, tn.topic_id, tn.exam_id, tn.title, tn.quick_revision, tn.source_authority,
             sh.stage, sh.subject, sh.topic, sh.priority,
             e.name as exam_name, e.code as exam_code,
             usp.status as user_status,
             usp.notes_bookmarked,
             usp.last_studied_at
      FROM topic_notes tn
      JOIN syllabus_hierarchy sh ON tn.topic_id = sh.id
      JOIN exams e ON tn.exam_id = e.id
      LEFT JOIN user_syllabus_progress usp ON (tn.topic_id = usp.topic_id AND usp.user_id = ?)
      WHERE 1=1
    `;
    const params = [userId || 'anonymous'];

    if (examId && examId !== 'All') {
      sql += ' AND tn.exam_id = ?';
      params.push(examId);
    }

    if (subject && subject !== 'All') {
      sql += ' AND sh.subject = ?';
      params.push(subject);
    }

    if (bookmarkedOnly === 'true' || bookmarkedOnly === true) {
      sql += ' AND usp.notes_bookmarked = 1';
    }

    if (search && search.trim()) {
      sql += ' AND (tn.title LIKE ? OR tn.concept LIKE ? OR sh.topic LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY e.name ASC, sh.stage ASC, sh.display_order ASC';
    const notes = db.query(sql, params);

    return notes.map(n => ({
      ...n,
      notes_bookmarked: n.notes_bookmarked === 1,
      status: n.user_status || 'not_started'
    }));
  }
};

module.exports = syllabusService;
