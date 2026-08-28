const path = require('path');
const db = require('../../backend/src/config/database');
const { initializeDatabase } = require('../../backend/src/config/initDb');
const { getSeedData } = require('./seedData');
const { getDiscoveryExams } = require('./discoveryExamsData');

async function runSeed(force = false) {
  try {
    // Ensure tables exist
    initializeDatabase();

    console.log('🌱 Populating initial database seed data and 50+ Discovery Exams...');
    const seedData = await getSeedData();
    const discoveryExams = getDiscoveryExams();

    db.transaction(() => {
      // 1. Users & Profiles: Clean real-auth only (Zero dummy accounts)
      // Genuine users register through the /register endpoint.

      // 3. Insert Comprehensive Discovery Exams (50+ exams)
      const insertExam = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO exams (
          id, code, name, organization, category, sub_category, qualification, degree_required,
          age_min, age_max, salary_min, salary_max, pay_level, in_hand_salary, difficulty,
          frequency, job_type, state, description, selection_process, exam_pattern_summary,
          official_url, last_verified, status, is_popular, is_featured, total_marks, duration_minutes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertExamDate = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO exam_dates (
          id, exam_id, cycle_name, year, notification_date, application_start, application_end,
          admit_card_date, exam_date, result_date, interview_date, final_result_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const e of discoveryExams) {
        insertExam.run(
          e.id, e.code, e.name, e.organization, e.category, e.sub_category, e.qualification,
          e.degree_required, e.age_min, e.age_max, e.salary_min, e.salary_max, e.pay_level,
          e.in_hand_salary, e.difficulty, e.frequency, e.job_type, e.state, e.description,
          e.selection_process, e.exam_pattern_summary, e.official_url, e.last_verified,
          e.status, e.is_popular, e.is_featured, e.total_marks, e.duration_minutes
        );

        if (e.dates) {
          const d = e.dates;
          insertExamDate.run(
            `ed_${e.id}_${d.year}`, e.id, d.cycle_name, d.year, d.notification_date,
            d.application_start, d.application_end, d.admit_card_date, d.exam_date,
            d.result_date, d.interview_date, d.final_result_date, d.status
          );
        }
      }

      // Also ensure any seed exams that are base are inserted if not in discovery
      for (const e of seedData.exams) {
        const exists = discoveryExams.find(de => de.id === e.id);
        if (!exists) {
          insertExam.run(
            e.id, e.code, e.name, e.category, e.category, 'General', 'Any Degree', 'Graduation',
            18, 32, 25000, 80000, 'Level 7', '₹45,000 - ₹60,000', 'intermediate', 'Annual',
            'Non-Technical', 'All India', e.description, JSON.stringify(['Written Exam', 'Interview']),
            'Standard Examination Pattern', 'https://upsc.gov.in', '2026-08-20', 'Upcoming', 0, 0,
            e.total_marks, e.duration_minutes
          );
        }
      }

      // 4. Insert Subjects
      const insertSubject = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO subjects (id, exam_id, name, code, description, icon, weightage_percentage, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of seedData.subjects) {
        insertSubject.run(s.id, s.exam_id, s.name, s.code, s.description, s.icon, s.weightage_percentage, s.display_order);
      }

      // 5. Insert Topics
      const insertTopic = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO topics (id, subject_id, name, code, description, difficulty_level, pyq_importance_score, estimated_hours, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const t of seedData.topics) {
        insertTopic.run(t.id, t.subject_id, t.name, t.code, t.description, t.difficulty_level, t.pyq_importance_score, t.estimated_hours, t.display_order);
      }

      // 6. Insert Study Materials
      const insertMaterial = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO study_materials (id, topic_id, title, content_type, content, language, source_authority)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const m of seedData.studyMaterials) {
        insertMaterial.run(m.id, m.topic_id, m.title, m.content_type, m.content, m.language, m.source_authority);
      }

      // 7. Insert Questions & Options
      const insertQuestion = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO questions (id, topic_id, exam_id, question_text, question_type, difficulty_level, explanation, tamil_text, tamil_explanation, is_pyq, pyq_year, pyq_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertOption = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO question_options (id, question_id, option_key, option_text, is_correct)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const q of seedData.questions) {
        insertQuestion.run(q.id, q.topic_id, q.exam_id, q.question_text, q.question_type, q.difficulty_level, q.explanation, q.tamil_text || '', q.tamil_explanation || '', q.is_pyq, q.pyq_year || null, q.pyq_source || '');
        if (q.options) {
          for (const opt of q.options) {
            insertOption.run(opt.id, q.id, opt.option_key, opt.option_text, opt.is_correct);
          }
        }
      }

      // 8. Insert Tests & Test Questions Mapping
      const insertTest = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO tests (id, exam_id, title, description, test_type, duration_minutes, total_marks, pass_percentage, is_adaptive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertTestQ = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO test_questions (id, test_id, question_id, marks, negative_marks, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const t of seedData.tests) {
        insertTest.run(t.id, t.exam_id, t.title, t.description, t.test_type, t.duration_minutes, t.total_marks, t.pass_percentage, t.is_adaptive);
        let order = 1;
        for (const q of seedData.questions) {
          if (q.exam_id === t.exam_id) {
            insertTestQ.run(`tq_${t.id}_${q.id}`, t.id, q.id, 2.0, 0.66, order++);
          }
        }
      }

      // 9. Insert Current Affairs
      const insertCA = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO current_affairs (id, title, summary, detailed_analysis, category, source_name, source_url, is_verified, verification_notes, exam_relevance_tags, published_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertCATopic = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO current_affairs_topics (id, current_affair_id, topic_id)
        VALUES (?, ?, ?)
      `);

      for (const ca of seedData.currentAffairs) {
        insertCA.run(ca.id, ca.title, ca.summary, ca.detailed_analysis, ca.category, ca.source_name, ca.source_url, ca.is_verified, ca.verification_notes, ca.exam_relevance_tags, ca.published_date);
        if (ca.topic_id) {
          insertCATopic.run(`cat_${ca.id}_${ca.topic_id}`, ca.id, ca.topic_id);
        }
      }

      // 10. Global Recruitment Notifications (System Notifications available to all)
      const insertNotif = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO exam_notifications (id, user_id, exam_id, title, message, notification_type, urgency, action_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertNotif.run('notif_01', null, 'exam_ssc_cgl', '🚨 SSC CGL Application Closes in 12 Days', 'Final deadline for online fee payment is approaching. Complete your application now.', 'application_deadline', 'urgent', 'https://ssc.gov.in');
      insertNotif.run('notif_02', null, 'exam_rbi_grade_b', '📢 RBI Grade B 2026 Notification Released', 'Reserve Bank of India has published recruitment for 130+ Grade B Officers.', 'notification_released', 'normal', 'https://rbi.org.in');
      insertNotif.run('notif_03', null, 'exam_tnpsc_grp2', '🎫 TNPSC Group 2 Hall Tickets Released', 'Download your hall tickets for Combined Civil Services Examination.', 'admit_card', 'urgent', 'https://tnpsc.gov.in');
      insertNotif.run('notif_04', null, 'exam_gate', '⚡ GATE 2027 Registration Portal Opened', 'Application submission is now active on the official GOAPS portal.', 'notification_released', 'normal', 'https://gate2026.iit.ac.in');
      insertNotif.run('notif_05', null, 'exam_ibps_po', '📊 IBPS PO Prelims Result Declared', 'Scores and cutoffs for CRP PO/MT Prelims are live.', 'result_out', 'critical', 'https://ibps.in');

      // 11. Insert Exam-Wise Syllabus Hierarchy & Topic Notes
      const { syllabusHierarchyData, topicNotesData, caRagDocumentsData, caSourcesData } = require('./syllabusAndRagData');

      const insertSylH = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO syllabus_hierarchy (
          id, exam_id, stage, subject, topic, subtopic, description, priority, pyq_weightage, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const sh of syllabusHierarchyData) {
        insertSylH.run(
          sh.id, sh.exam_id, sh.stage, sh.subject, sh.topic, sh.subtopic,
          sh.description, sh.priority, sh.pyq_weightage, sh.display_order
        );
      }

      const insertTopicNote = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO topic_notes (
          id, topic_id, exam_id, title, concept, formulas, examples, shortcuts,
          common_mistakes, quick_revision, practice_questions, source_authority
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const tn of topicNotesData) {
        insertTopicNote.run(
          tn.id, tn.topic_id, tn.exam_id, tn.title, tn.concept, tn.formulas,
          tn.examples, tn.shortcuts, tn.common_mistakes, tn.quick_revision,
          tn.practice_questions, tn.source_authority
        );
      }

      // 17. Insert RAG Current Affairs Documents & Trusted Sources Registry
      const insertCARag = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO ca_rag_documents (
          id, title, summary, what_happened, why_important, key_facts, category,
          published_date, source_name, source_url, retrieved_at, relevance_score,
          exam_relevance_tags, syllabus_topic_ids, mcqs, one_liners, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const card of caRagDocumentsData) {
        insertCARag.run(
          card.id, card.title, card.summary, card.what_happened, card.why_important,
          card.key_facts, card.category, card.published_date, card.source_name,
          card.source_url, card.retrieved_at, card.relevance_score,
          card.exam_relevance_tags, card.syllabus_topic_ids, card.mcqs,
          card.one_liners, card.is_verified
        );
      }

      const insertCASource = db.getRawDb().prepare(`
        INSERT OR REPLACE INTO ca_sources (
          id, name, type, url, is_trusted, category, last_ingested_at, documents_count, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const src of caSourcesData) {
        insertCASource.run(
          src.id, src.name, src.type, src.url, src.is_trusted, src.category,
          src.last_ingested_at, src.documents_count, src.status
        );
      }
    });

    console.log('✅ Seed data successfully inserted!');
  } catch (err) {
    console.error('❌ Error executing seed data:', err);
    throw err;
  }
}

if (require.main === module) {
  runSeed(true);
}

module.exports = { runSeed };
