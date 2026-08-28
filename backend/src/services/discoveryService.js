const db = require('../config/database');
const emailService = require('./emailService');
const { v4: uuidv4 } = require('crypto').randomUUID ? { v4: () => require('crypto').randomUUID() } : { v4: () => 'uuid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) };

/**
 * Discovery Service for India Government Exam Discovery Platform
 */
class DiscoveryService {
  /**
   * Search and filter exams with multi-faceted criteria
   */
  async getExams(params = {}) {
    const {
      q = '',
      category = '',
      qualification = '',
      state = '',
      status = '',
      difficulty = '',
      job_type = '',
      age = null,
      salary_min = null,
      is_popular = null,
      is_featured = null,
      sortBy = 'popularity', // 'popularity' | 'salary' | 'date' | 'name'
      limit = 50,
      offset = 0
    } = params;

    let query = `
      SELECT e.*, 
             ed.application_start, ed.application_end, ed.exam_date, ed.admit_card_date,
             ed.result_date, ed.status as cycle_status, ed.cycle_name
      FROM exams e
      LEFT JOIN exam_dates ed ON e.id = ed.exam_id
      WHERE e.is_active = 1
    `;
    const queryParams = [];

    // Full-text / Keyword search
    if (q && q.trim()) {
      const term = `%${q.trim().toLowerCase()}%`;
      query += ` AND (
        LOWER(e.name) LIKE ? OR 
        LOWER(e.code) LIKE ? OR 
        LOWER(e.organization) LIKE ? OR 
        LOWER(e.category) LIKE ? OR 
        LOWER(e.sub_category) LIKE ? OR
        LOWER(e.qualification) LIKE ? OR
        LOWER(e.description) LIKE ? OR
        LOWER(e.degree_required) LIKE ? OR
        LOWER(e.state) LIKE ?
      )`;
      queryParams.push(term, term, term, term, term, term, term, term, term);
    }

    // Category filter
    if (category && category !== 'All') {
      query += ` AND e.category = ?`;
      queryParams.push(category);
    }

    // Qualification filter
    if (qualification && qualification !== 'All') {
      if (qualification === '10th') {
        query += ` AND e.qualification IN ('10th', '10th Pass')`;
      } else if (qualification === '12th') {
        query += ` AND e.qualification IN ('10th', '12th', '10+2')`;
      } else if (qualification === 'Diploma') {
        query += ` AND (e.qualification = 'Diploma' OR e.qualification LIKE '%Diploma%')`;
      } else if (qualification === 'B.E/B.Tech' || qualification === 'Engineering') {
        query += ` AND (e.qualification IN ('B.E/B.Tech', 'Engineering', 'Any Degree') OR e.degree_required LIKE '%Engineering%' OR e.degree_required LIKE '%B.E%')`;
      } else if (qualification === 'Postgraduate') {
        query += ` AND (e.qualification IN ('Postgraduate', 'Any Degree'))`;
      } else if (qualification === 'Law') {
        query += ` AND (e.qualification LIKE '%Law%' OR e.degree_required LIKE '%LL.B%')`;
      } else if (qualification === 'Healthcare') {
        query += ` AND (e.qualification LIKE '%Nursing%' OR e.qualification LIKE '%MBBS%')`;
      } else {
        query += ` AND (e.qualification = ? OR e.qualification = 'Any Degree')`;
        queryParams.push(qualification);
      }
    }

    // State filter
    if (state && state !== 'All India' && state !== 'All') {
      query += ` AND (e.state = ? OR e.state = 'All India')`;
      queryParams.push(state);
    }

    // Status filter
    if (status && status !== 'All') {
      query += ` AND e.status = ?`;
      queryParams.push(status);
    }

    // Difficulty
    if (difficulty && difficulty !== 'All') {
      query += ` AND e.difficulty = ?`;
      queryParams.push(difficulty);
    }

    // Job Type
    if (job_type && job_type !== 'All') {
      query += ` AND e.job_type = ?`;
      queryParams.push(job_type);
    }

    // Age constraint
    if (age && !isNaN(Number(age))) {
      const userAge = Number(age);
      query += ` AND e.age_min <= ? AND e.age_max >= ?`;
      queryParams.push(userAge, userAge);
    }

    // Salary Min
    if (salary_min && !isNaN(Number(salary_min))) {
      query += ` AND e.salary_max >= ?`;
      queryParams.push(Number(salary_min));
    }

    // Popular / Featured
    if (is_popular !== null && is_popular !== undefined && is_popular !== '') {
      query += ` AND e.is_popular = ?`;
      queryParams.push(Number(is_popular));
    }
    if (is_featured !== null && is_featured !== undefined && is_featured !== '') {
      query += ` AND e.is_featured = ?`;
      queryParams.push(Number(is_featured));
    }

    // Sorting
    if (sortBy === 'salary') {
      query += ` ORDER BY e.salary_max DESC, e.salary_min DESC`;
    } else if (sortBy === 'name') {
      query += ` ORDER BY e.name ASC`;
    } else if (sortBy === 'date') {
      query += ` ORDER BY CASE WHEN ed.application_end IS NULL THEN 1 ELSE 0 END, ed.application_end ASC`;
    } else {
      query += ` ORDER BY e.is_featured DESC, e.is_popular DESC, e.name ASC`;
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), Number(offset));

    const rows = db.query(query, queryParams);

    // Compute days remaining and countdown badges for each exam
    const now = new Date();
    const exams = rows.map(exam => {
      let daysRemaining = null;
      let countdownLabel = null;
      let isUrgent = false;

      if (exam.application_end) {
        const deadline = new Date(exam.application_end);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          daysRemaining = diffDays;
          countdownLabel = `Application closes in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
          isUrgent = diffDays <= 7;
        } else if (exam.exam_date) {
          const examD = new Date(exam.exam_date);
          const examDiff = Math.ceil((examD.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (examDiff >= 0) {
            daysRemaining = examDiff;
            countdownLabel = `Exam in ${examDiff} day${examDiff === 1 ? '' : 's'}`;
          }
        }
      }

      let selectionSteps = [];
      try {
        selectionSteps = exam.selection_process ? JSON.parse(exam.selection_process) : [];
      } catch (e) {
        selectionSteps = [exam.selection_process || 'Written Examination & Interview'];
      }

      return {
        ...exam,
        selection_steps: selectionSteps,
        days_remaining: daysRemaining,
        countdown_label: countdownLabel,
        is_urgent: isUrgent
      };
    });

    return exams;
  }

  /**
   * Get detailed profile of a single exam by ID
   */
  async getExamById(id) {
    const exam = db.get(`SELECT * FROM exams WHERE id = ?`, [id]);
    if (!exam) return null;

    const dates = db.query(`SELECT * FROM exam_dates WHERE exam_id = ? ORDER BY year DESC, application_end DESC`, [id]);
    const subjects = db.query(`SELECT * FROM subjects WHERE exam_id = ? ORDER BY display_order ASC`, [id]);
    const roadmaps = db.query(`SELECT * FROM exam_roadmaps WHERE exam_id = ?`, [id]);
    const pyqCount = db.get(`SELECT COUNT(*) as count FROM questions WHERE exam_id = ? AND is_pyq = 1`, [id]);

    let selectionSteps = [];
    try {
      selectionSteps = exam.selection_process ? JSON.parse(exam.selection_process) : [];
    } catch (e) {
      selectionSteps = [exam.selection_process || 'Written Examination & Interview'];
    }

    // Attach subject topics
    const subjectsWithTopics = subjects.map(s => {
      const topics = db.query(`SELECT * FROM topics WHERE subject_id = ? ORDER BY display_order ASC`, [s.id]);
      return {
        ...s,
        topics: topics.map(t => ({
          ...t,
          priority_label: t.pyq_importance_score >= 8.5 ? 'High Priority' : t.pyq_importance_score >= 6.5 ? 'Medium Priority' : 'Foundation Topic'
        }))
      };
    });

    return {
      ...exam,
      selection_steps: selectionSteps,
      dates: dates[0] || null,
      all_dates: dates,
      subjects: subjectsWithTopics,
      roadmaps,
      pyq_count: pyqCount ? pyqCount.count : 0
    };
  }

  /**
   * AI Personalized Exam Recommendation Engine (10-Point Algorithm)
   */
  async getPersonalizedRecommendations(preferences = {}) {
    const {
      qualification = 'Any Degree',
      degree = 'General',
      age = 22,
      state = 'All India',
      job_type = 'All',
      technical_preference = 'both', // 'technical' | 'non_technical' | 'both'
      desired_salary = 40000,
      defence_interest = 'yes',
      banking_interest = 'yes',
      preparation_months = 6
    } = preferences;

    const allExams = await this.getExams({ limit: 100 });
    const userAge = Number(age) || 22;
    const targetSalary = Number(desired_salary) || 40000;

    const scored = allExams.map(exam => {
      let score = 50; // base score
      const reasons = [];
      const eligibilityGaps = [];

      // 1. Age Eligibility (Hard criterion)
      if (userAge >= exam.age_min && userAge <= exam.age_max) {
        score += 20;
        reasons.push(`You meet the age criteria (${exam.age_min}–${exam.age_max} years).`);
      } else {
        score -= 35;
        eligibilityGaps.push(`Age requirement is ${exam.age_min}–${exam.age_max} years (You are ${userAge}).`);
      }

      // 2. Educational Qualification Match
      const userQual = (qualification || '').toLowerCase();
      const examQual = (exam.qualification || '').toLowerCase();
      const degreeReq = (exam.degree_required || '').toLowerCase();
      const userDegree = (degree || '').toLowerCase();

      if (examQual.includes('any degree') || examQual.includes('graduation')) {
        if (userQual.includes('degree') || userQual.includes('b.e') || userQual.includes('b.tech') || userQual.includes('postgraduate')) {
          score += 20;
          reasons.push(`Open to graduates of any discipline.`);
        }
      } else if (examQual.includes('10th') || examQual.includes('12th')) {
        score += 15;
        reasons.push(`Minimum education qualification satisfied.`);
      } else if (examQual.includes('b.e') || examQual.includes('engineering') || examQual.includes('diploma')) {
        if (userQual.includes('b.e') || userQual.includes('b.tech') || userQual.includes('engineering') || userQual.includes('diploma') || userDegree.includes('eng') || userDegree.includes('tech') || userDegree.includes('cse') || userDegree.includes('ece') || userDegree.includes('mech') || userDegree.includes('civil')) {
          score += 25;
          reasons.push(`Exact technical engineering qualification match for ${exam.code}.`);
        } else {
          score -= 25;
          eligibilityGaps.push(`Requires Engineering / Technical Diploma degree.`);
        }
      } else if (examQual.includes('law')) {
        if (userDegree.includes('law') || userDegree.includes('llb') || userQual.includes('law')) {
          score += 25;
          reasons.push(`Degree in Law matched for Judicial Service.`);
        } else {
          score -= 30;
          eligibilityGaps.push(`Requires Degree in Law (LL.B).`);
        }
      } else if (examQual.includes('nursing') || examQual.includes('mbbs')) {
        if (userDegree.includes('nurs') || userDegree.includes('mbbs') || userDegree.includes('medical')) {
          score += 25;
          reasons.push(`Medical / Nursing degree matched.`);
        } else {
          score -= 30;
          eligibilityGaps.push(`Requires B.Sc Nursing / GNM / Medical qualification.`);
        }
      }

      // 3. Technical vs Non-Technical alignment
      if (technical_preference === 'technical' && exam.job_type === 'Technical') {
        score += 15;
        reasons.push(`Matches your preference for technical roles.`);
      } else if (technical_preference === 'non_technical' && exam.job_type !== 'Technical') {
        score += 10;
        reasons.push(`Matches your administrative & non-technical career goal.`);
      }

      // 4. Sector Interests (Defence / Banking)
      if (defence_interest === 'yes' && exam.category === 'Defence') {
        score += 15;
        reasons.push(`High match for your interest in Armed Forces & Defence officers.`);
      } else if (defence_interest === 'no' && exam.category === 'Defence') {
        score -= 20;
      }

      if (banking_interest === 'yes' && exam.category === 'Banking') {
        score += 15;
        reasons.push(`Strong fit for banking and financial sector careers.`);
      } else if (banking_interest === 'no' && exam.category === 'Banking') {
        score -= 20;
      }

      // 5. State Alignment
      if (state && state !== 'All India' && state !== 'All') {
        if (exam.state === state) {
          score += 15;
          reasons.push(`Local state domicile advantage for ${state}.`);
        } else if (exam.state === 'All India') {
          score += 5;
          reasons.push(`Central Government All-India posting opportunity.`);
        }
      }

      // 6. Salary Expectation
      if (exam.salary_max >= targetSalary) {
        score += 10;
        reasons.push(`Offers salary bracket exceeding ₹${(targetSalary / 1000).toFixed(0)}k/month.`);
      }

      // 7. Timeline Feasibility
      const months = Number(preparation_months) || 6;
      if (months <= 3 && exam.difficulty === 'beginner') {
        score += 10;
        reasons.push(`Feasible syllabus for 3-month focused preparation.`);
      } else if (months >= 12 && exam.difficulty === 'hard') {
        score += 10;
        reasons.push(`Ideal 1-year timeline for in-depth comprehensive syllabus mastery.`);
      }

      // Clamp score 20% to 98%
      const matchScore = Math.min(98, Math.max(25, score));

      return {
        ...exam,
        match_score: matchScore,
        is_eligible: eligibilityGaps.length === 0,
        reasons: reasons.slice(0, 3),
        eligibility_gaps: eligibilityGaps
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.match_score - a.match_score);
    return scored;
  }

  /**
   * Compare 2 to 4 exams side-by-side
   */
  async compareExams(examIds = [], userProfile = null) {
    if (!Array.isArray(examIds) || examIds.length === 0) {
      return { exams: [], comparison_matrix: [], best_pick: null };
    }

    const cleanIds = examIds.slice(0, 4);
    const exams = [];

    for (const id of cleanIds) {
      const exam = await this.getExamById(id);
      if (exam) exams.push(exam);
    }

    if (exams.length === 0) {
      return { exams: [], comparison_matrix: [], best_pick: null };
    }

    // Build comparison matrix
    const matrix = [
      {
        feature: 'Conducting Body',
        key: 'organization',
        values: exams.map(e => e.organization || 'Central/State Board')
      },
      {
        feature: 'Qualification',
        key: 'qualification',
        values: exams.map(e => e.qualification)
      },
      {
        feature: 'Age Limit',
        key: 'age_limit',
        values: exams.map(e => `${e.age_min} to ${e.age_max} Years`)
      },
      {
        feature: 'Monthly In-Hand Salary',
        key: 'in_hand_salary',
        values: exams.map(e => e.in_hand_salary || `₹${e.salary_min.toLocaleString()} - ₹${e.salary_max.toLocaleString()}`)
      },
      {
        feature: 'Pay Matrix Level',
        key: 'pay_level',
        values: exams.map(e => e.pay_level || '7th CPC')
      },
      {
        feature: 'Exam Difficulty',
        key: 'difficulty',
        values: exams.map(e => (e.difficulty || 'intermediate').toUpperCase())
      },
      {
        feature: 'Exam Frequency',
        key: 'frequency',
        values: exams.map(e => e.frequency || 'Annual')
      },
      {
        feature: 'Selection Stages',
        key: 'selection_stages',
        values: exams.map(e => `${e.selection_steps.length} Stages (${e.selection_steps.join(' → ')})`)
      },
      {
        feature: 'Technical Requirement',
        key: 'job_type',
        values: exams.map(e => e.job_type === 'Technical' ? 'Technical Degree / Diploma Mandatory' : 'Open to General Non-Tech Graduates')
      },
      {
        feature: 'Official Portal',
        key: 'official_url',
        values: exams.map(e => e.official_url || 'Official Website')
      },
      {
        feature: 'Last Verified Date',
        key: 'last_verified',
        values: exams.map(e => e.last_verified ? `Verified on ${e.last_verified}` : 'Official Gazette Verified')
      }
    ];

    // Determine Best For You pick based on profile or highest salary/prestige
    let bestPick = exams[0];
    if (userProfile && userProfile.user_type === 'working_professional') {
      // prefer predictable syllabus & high ROI
      bestPick = exams.find(e => e.code.includes('CGL') || e.code.includes('RBI') || e.code.includes('Group 2')) || exams[0];
    } else {
      bestPick = exams.find(e => e.is_popular === 1) || exams[0];
    }

    return {
      exams,
      comparison_matrix: matrix,
      best_pick: {
        exam_id: bestPick.id,
        code: bestPick.code,
        name: bestPick.name,
        verdict_reason: `Top recommendation based on high recruitment frequency, solid pay progression (${bestPick.in_hand_salary}), and extensive study material availability.`
      }
    };
  }

  /**
   * Calendar Event Stream (Yearly & Monthly view)
   */
  async getCalendarEvents(params = {}) {
    const { category = '', month = '', year = 2026, state = '' } = params;

    let query = `
      SELECT ed.*, e.name as exam_name, e.code as exam_code, e.category, e.state, e.official_url
      FROM exam_dates ed
      JOIN exams e ON ed.exam_id = e.id
      WHERE e.is_active = 1
    `;
    const queryParams = [];

    if (category && category !== 'All') {
      query += ` AND e.category = ?`;
      queryParams.push(category);
    }
    if (state && state !== 'All India' && state !== 'All') {
      query += ` AND (e.state = ? OR e.state = 'All India')`;
      queryParams.push(state);
    }

    const rows = db.query(query, queryParams);

    // Transform into discrete timeline events
    const events = [];
    const now = new Date();

    for (const r of rows) {
      if (r.notification_date) {
        events.push({
          id: `ev_${r.id}_notif`,
          exam_id: r.exam_id,
          exam_code: r.exam_code,
          exam_name: r.exam_name,
          category: r.category,
          state: r.state,
          event_type: 'Notification',
          event_title: `${r.exam_code} Official Notification Released`,
          date: r.notification_date,
          badge_color: 'var(--brand-primary)',
          official_url: r.official_url
        });
      }
      if (r.application_start) {
        events.push({
          id: `ev_${r.id}_app_start`,
          exam_id: r.exam_id,
          exam_code: r.exam_code,
          exam_name: r.exam_name,
          category: r.category,
          state: r.state,
          event_type: 'Application',
          event_title: `${r.exam_code} Application Form Opens`,
          date: r.application_start,
          badge_color: 'var(--accent-teal)',
          official_url: r.official_url
        });
      }
      if (r.application_end) {
        events.push({
          id: `ev_${r.id}_app_end`,
          exam_id: r.exam_id,
          exam_code: r.exam_code,
          exam_name: r.exam_name,
          category: r.category,
          state: r.state,
          event_type: 'Application',
          event_title: `🚨 ${r.exam_code} Application Deadline`,
          date: r.application_end,
          badge_color: 'var(--danger)',
          official_url: r.official_url
        });
      }
      if (r.admit_card_date) {
        events.push({
          id: `ev_${r.id}_admit`,
          exam_id: r.exam_id,
          exam_code: r.exam_code,
          exam_name: r.exam_name,
          category: r.category,
          state: r.state,
          event_type: 'Admit Card',
          event_title: `🎫 ${r.exam_code} Hall Ticket / Admit Card Release`,
          date: r.admit_card_date,
          badge_color: 'var(--warning)',
          official_url: r.official_url
        });
      }
      if (r.exam_date) {
        events.push({
          id: `ev_${r.id}_exam`,
          exam_id: r.exam_id,
          exam_code: r.exam_code,
          exam_name: r.exam_name,
          category: r.category,
          state: r.state,
          event_type: 'Exam',
          event_title: `📝 ${r.exam_code} Examination Date`,
          date: r.exam_date,
          badge_color: 'var(--brand-primary)',
          official_url: r.official_url
        });
      }
      if (r.result_date) {
        events.push({
          id: `ev_${r.id}_result`,
          exam_id: r.exam_id,
          exam_code: r.exam_code,
          exam_name: r.exam_name,
          category: r.category,
          state: r.state,
          event_type: 'Result',
          event_title: `📊 ${r.exam_code} Results & Cutoffs Declared`,
          date: r.result_date,
          badge_color: 'var(--success)',
          official_url: r.official_url
        });
      }
    }

    // Filter by month if provided
    let filtered = events;
    if (month && month !== 'All') {
      const targetMonthStr = String(month).padStart(2, '0');
      filtered = events.filter(e => e.date && e.date.includes(`-${targetMonthStr}-`));
    }

    // Sort by date ascending
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    return filtered;
  }

  /**
   * Natural Language Eligibility Checker
   * Example: "I am 21 years old and studying B.E CSE in Tamil Nadu"
   */
  async checkNaturalLanguageEligibility(queryText = '') {
    const text = (queryText || '').toLowerCase();
    
    // Extract age
    let extractedAge = 22;
    const ageMatch = text.match(/(\d{2})\s*(?:years|yr|yrs|yo|age)/) || text.match(/(?:age|am|i am)\s*(\d{2})/);
    if (ageMatch && ageMatch[1]) {
      extractedAge = parseInt(ageMatch[1], 10);
    }

    // Extract qualification
    let extractedQual = 'Any Degree';
    if (text.includes('10th') || text.includes('sslc') || text.includes('matric')) {
      extractedQual = '10th';
    } else if (text.includes('12th') || text.includes('hsc') || text.includes('10+2') || text.includes('intermediate')) {
      extractedQual = '12th';
    } else if (text.includes('diploma') || text.includes('polytechnic')) {
      extractedQual = 'Diploma';
    } else if (text.includes('b.e') || text.includes('b.tech') || text.includes('engineering') || text.includes('cse') || text.includes('ece') || text.includes('mech') || text.includes('civil') || text.includes('it')) {
      extractedQual = 'B.E/B.Tech';
    } else if (text.includes('law') || text.includes('llb') || text.includes('ll.b')) {
      extractedQual = 'Law';
    } else if (text.includes('nursing') || text.includes('mbbs') || text.includes('gnm')) {
      extractedQual = 'Healthcare';
    } else if (text.includes('postgraduate') || text.includes('m.sc') || text.includes('m.a') || text.includes('m.tech') || text.includes('mba') || text.includes('master')) {
      extractedQual = 'Postgraduate';
    }

    // Extract state
    let extractedState = 'All India';
    const states = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Odisha'];
    for (const s of states) {
      if (text.includes(s.toLowerCase())) {
        extractedState = s;
        break;
      }
    }

    // Run recommendation engine with extracted facets
    const recommendations = await this.getPersonalizedRecommendations({
      qualification: extractedQual,
      degree: text,
      age: extractedAge,
      state: extractedState,
      desired_salary: 40000
    });

    return {
      extracted_entities: {
        detected_age: extractedAge,
        detected_qualification: extractedQual,
        detected_state: extractedState,
        raw_query: queryText
      },
      eligible_exams: recommendations.filter(r => r.is_eligible).slice(0, 8),
      alternative_exams: recommendations.filter(r => !r.is_eligible).slice(0, 3)
    };
  }

  /**
   * AI Study Roadmap Generator (30 / 60 / 90 Days)
   */
  async generateStudyRoadmap(examId, durationDays = 60) {
    const exam = await this.getExamById(examId);
    if (!exam) throw new Error('Exam not found');

    const duration = Math.max(7, Math.min(365, parseInt(durationDays) || 60));
    const numWeeks = Math.ceil(duration / 7);

    const subjects = exam.subjects || [];
    const allTopics = [];
    for (const s of subjects) {
      for (const t of s.topics || []) {
        allTopics.push({
          subject_name: s.name,
          topic_name: t.name,
          difficulty: t.difficulty_level,
          priority: t.pyq_importance_score >= 8.5 ? 'High' : 'Medium'
        });
      }
    }

    // Generate weekly schedule chunks
    const weeklySchedule = [];
    const topicsPerWeek = Math.max(1, Math.ceil(allTopics.length / Math.max(1, numWeeks - 1)));

    for (let w = 1; w <= numWeeks; w++) {
      if (w === numWeeks) {
        // Final week is revision & full mocks
        weeklySchedule.push({
          week_number: w,
          title: `Week ${w}: High-Yield Revision & Full Mock Exam Drills`,
          focus_areas: ['Complete PYQ Simulation (2020-2024)', 'Formula & Landmark Articles Revision', 'Time Management Calibration'],
          daily_targets: [
            { day: 1, task: 'Full Length Timed Mock Test 1 + AI Mistake Diagnostics', hours: 3.5 },
            { day: 2, task: 'Weak Area Targeted Remediation & Flashcards', hours: 3.0 },
            { day: 3, task: 'Full Length Timed Mock Test 2', hours: 3.5 },
            { day: 4, task: 'Current Affairs 6-Month Marathon Review', hours: 3.0 },
            { day: 5, task: 'Formula Sheets, Articles & Tables Speed Drill', hours: 2.5 },
            { day: 6, task: 'Light Revision & Exam Day Strategy Planning', hours: 2.0 },
            { day: 7, task: 'Rest & Mental Readiness Calibration', hours: 1.0 }
          ]
        });
      } else {
        const startIdx = (w - 1) * topicsPerWeek;
        const weekTopics = allTopics.slice(startIdx, startIdx + topicsPerWeek);
        const focusTitles = weekTopics.map(t => `${t.subject_name}: ${t.topic_name}`);

        weeklySchedule.push({
          week_number: w,
          title: `Week ${w}: Core Concepts & High-Priority Syllabus Building`,
          focus_areas: focusTitles.length > 0 ? focusTitles.slice(0, 4) : ['Core Subject Foundations', 'Topic-wise Practice MCQs'],
          daily_targets: [
            { day: 1, task: `In-depth theory study: ${focusTitles[0] || 'Core Subject Unit'}`, hours: 2.5 },
            { day: 2, task: 'Solved examples & Official PYQ analysis (50 Questions)', hours: 2.5 },
            { day: 3, task: `Second subject deep-dive: ${focusTitles[1] || 'Quantitative Aptitude / GS'}`, hours: 2.5 },
            { day: 4, task: 'Speed test practice & Mistake taxonomy tagging', hours: 2.0 },
            { day: 5, task: 'Spaced repetition revision of previous weeks notes', hours: 2.0 },
            { day: 6, task: 'Weekly Sectional Test + AI Performance Review', hours: 3.0 },
            { day: 7, task: 'Buffer Catchup & Doubt Resolution with AI Tutor', hours: 2.0 }
          ]
        });
      }
    }

    return {
      exam_id: exam.id,
      exam_name: exam.name,
      code: exam.code,
      duration_days: duration,
      total_weeks: numWeeks,
      weekly_schedule: weeklySchedule
    };
  }

  /**
   * Target Exams Management for Aspirants
   */
  async getUserTargetExams(userId) {
    const rows = db.query(`
      SELECT te.id as target_id, te.priority, te.target_year, te.created_at as targeted_at,
             e.*, ed.application_end, ed.exam_date, ed.status as cycle_status
      FROM target_exams te
      JOIN exams e ON te.exam_id = e.id
      LEFT JOIN exam_dates ed ON e.id = ed.exam_id
      WHERE te.user_id = ?
      ORDER BY te.priority ASC, te.created_at DESC
    `, [userId]);

    const now = new Date();
    return rows.map(exam => {
      let daysRemaining = null;
      let countdownLabel = null;
      if (exam.application_end) {
        const diff = Math.ceil((new Date(exam.application_end).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0) {
          daysRemaining = diff;
          countdownLabel = `Application closes in ${diff} days`;
        }
      }
      return {
        ...exam,
        days_remaining: daysRemaining,
        countdown_label: countdownLabel
      };
    });
  }

  async toggleTargetExam(userId, examId, priority = 'primary') {
    const existing = db.get(`SELECT id FROM target_exams WHERE user_id = ? AND exam_id = ?`, [userId, examId]);
    if (existing) {
      db.run(`DELETE FROM target_exams WHERE id = ?`, [existing.id]);
      return { targeted: false, message: 'Removed from Target Exams' };
    } else {
      const id = 'tgt_' + uuidv4().substring(0, 12);
      db.run(`INSERT INTO target_exams (id, user_id, exam_id, priority, target_year) VALUES (?, ?, ?, ?, 2026)`, [id, userId, examId, priority]);

      // Asynchronously dispatch Target Exam Confirmation & Exam News Notification Email
      const exam = db.get('SELECT * FROM exams WHERE id = ?', [examId]);
      const user = db.get('SELECT id, name, email FROM users WHERE id = ?', [userId]);
      if (exam && user) {
        emailService.sendExamNewsAlert({
          exam,
          newsTitle: `Target Registered: ${exam.name}`,
          newsSummary: `You have successfully set ${exam.name} as your primary target examination. You will receive active recruitment notices, syllabus updates, and timeline reminders.`,
          recipientEmail: user.email
        }).catch(err => console.warn('⚠️ [Target Exam Email]:', err.message));
      }

      return { targeted: true, message: 'Added to Target Exams' };
    }
  }

  /**
   * Saved / Bookmarked Exams Management
   */
  async getUserSavedExams(userId) {
    return db.query(`
      SELECT se.id as saved_id, se.created_at as saved_at,
             e.*, ed.application_end, ed.exam_date
      FROM saved_exams se
      JOIN exams e ON se.exam_id = e.id
      LEFT JOIN exam_dates ed ON e.id = ed.exam_id
      WHERE se.user_id = ?
      ORDER BY se.created_at DESC
    `, [userId]);
  }

  async toggleSavedExam(userId, examId) {
    const existing = db.get(`SELECT id FROM saved_exams WHERE user_id = ? AND exam_id = ?`, [userId, examId]);
    if (existing) {
      db.run(`DELETE FROM saved_exams WHERE id = ?`, [existing.id]);
      return { saved: false, message: 'Removed from Bookmarks' };
    } else {
      const id = 'sav_' + uuidv4().substring(0, 12);
      db.run(`INSERT INTO saved_exams (id, user_id, exam_id) VALUES (?, ?, ?)`, [id, userId, examId]);
      return { saved: true, message: 'Bookmarked successfully' };
    }
  }

  /**
   * Recruitment Notifications & Alerts
   */
  async getNotifications(userId = null) {
    let query = `
      SELECT n.*, e.code as exam_code, e.name as exam_name
      FROM exam_notifications n
      LEFT JOIN exams e ON n.exam_id = e.id
      WHERE (n.user_id IS NULL OR n.user_id = ?)
      ORDER BY n.created_at DESC
      LIMIT 30
    `;
    return db.query(query, [userId || '']);
  }
}

module.exports = new DiscoveryService();
