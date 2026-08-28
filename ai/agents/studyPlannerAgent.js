const userDataTool = require('../tools/userDataTool');
const syllabusTool = require('../tools/syllabusTool');
const revisionTool = require('../tools/revisionTool');
const performanceTool = require('../tools/performanceTool');
const studyPlanTool = require('../tools/studyPlanTool');

const studyPlannerAgent = {
  name: 'StudyPlannerAgent',
  description: 'Generates comprehensive, multi-modal personalized daily study plans adapted to user time constraints and weaknesses.',

  async generateDailyPlan(userId, customDate = null, customHours = null, strategy = 'balanced') {
    const userContext = await userDataTool.getUserContext(userId);
    const profile = userContext?.profile || {
      target_exam_id: 'exam_upsc_cse',
      daily_hours_weekday: 2.0,
      daily_hours_weekend: 4.0,
      user_type: 'student'
    };
    const targetDate = customDate || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(targetDate).getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Determine available minutes
    let availableMinutes = 0;
    if (customHours && Number(customHours) > 0) {
      availableMinutes = Math.round(Number(customHours) * 60);
    } else if (isWeekend) {
      availableMinutes = Math.round((profile.daily_hours_weekend || 4) * 60);
    } else {
      availableMinutes = Math.round((profile.daily_hours_weekday || 2) * 60);
    }

    // Minimum 60 minutes allocation baseline
    if (availableMinutes < 60) availableMinutes = 60;

    // Fetch user context & candidate data
    const pendingRevisions = await revisionTool.getUpcomingRevisions(userId, targetDate);
    const perfSummary = await performanceTool.getUserPerformanceSummary(userId);
    const highYieldTopics = await syllabusTool.getPendingHighYieldTopics(userId, profile.target_exam_id, 6);

    // Fallback topic pool if syllabus topics are few
    const topicPool = highYieldTopics.length > 0 ? highYieldTopics : [
      { id: 'top_fr_dpsp', name: 'Fundamental Rights & Directive Principles (Articles 12-51A)', subjectName: 'Indian Polity' },
      { id: 'top_eco_rbi', name: 'Monetary Policy & Inflation Dynamics', subjectName: 'Indian Economy' },
      { id: 'top_hist_mod', name: 'Indian National Movement & Constitutional Evolution', subjectName: 'Modern Indian History' },
      { id: 'top_geo_monsoon', name: 'Indian Monsoon & Climate Dynamics', subjectName: 'Physical & Indian Geography' },
      { id: 'top_env_biodiv', name: 'Biodiversity Hotspots & Conservation Treaties', subjectName: 'Environment & Ecology' },
      { id: 'top_sci_tech', name: 'Emerging Technologies & Space Missions', subjectName: 'Science & Technology' }
    ];

    const t1 = topicPool[0] || { id: 'top_fr_dpsp', name: 'Core Constitutional Framework', subjectName: 'Indian Polity' };
    const t2 = topicPool[1] || topicPool[0];
    const t3 = topicPool[2] || topicPool[0];
    const t4 = topicPool[3] || topicPool[1];

    const generatedTasks = [];

    // Calculate dynamic session slot distribution based on available minutes
    if (availableMinutes <= 90) {
      // Short 1h-1.5h Focus (3-4 Sessions)
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'revision',
        title: `⚡ Morning Active Recall: ${t1.name}`,
        description: `Rapid 20-min revision of key facts, articles, and definitions.`,
        planned_duration_minutes: 20,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'learn',
        title: `📖 Core Concept Study: ${t1.name}`,
        description: `Focus on fundamental theory and high-yield provisions for ${t1.subjectName || 'Core Syllabus'}.`,
        planned_duration_minutes: 35,
        priority: 'high',
        due_time_slot: 'evening'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'practice_mcq',
        title: `🎯 Timed MCQ Drill: ${t1.name}`,
        description: `Solve 10-15 standard exam questions with instant solution review.`,
        planned_duration_minutes: 20,
        priority: 'medium',
        due_time_slot: 'evening'
      });
      if (availableMinutes >= 85) {
        generatedTasks.push({
          topic_id: t2.id,
          task_type: 'current_affairs',
          title: `📰 Current Affairs & Govt Schemes`,
          description: `Review daily PIB highlights and national developments.`,
          planned_duration_minutes: 15,
          priority: 'medium',
          due_time_slot: 'night'
        });
      }
    } else if (availableMinutes <= 150) {
      // Standard 2h-2.5h Plan (4-5 Sessions)
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'revision',
        title: `🧠 Spaced Memory Recall & Formula Drill: ${t1.name}`,
        description: `Active recall and flashcard memory testing to solidify long-term retention.`,
        planned_duration_minutes: 25,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'learn',
        title: `📖 Primary Concept Mastery: ${t1.name}`,
        description: `In-depth syllabus study for ${t1.subjectName || 'Subject 1'}. Read key commentary and notes.`,
        planned_duration_minutes: 40,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'practice_mcq',
        title: `🎯 MCQ & PYQ Sprint: ${t1.name}`,
        description: `Solve 15-20 questions under real exam time limits. Review error rationales.`,
        planned_duration_minutes: 25,
        priority: 'high',
        due_time_slot: 'afternoon'
      });
      generatedTasks.push({
        topic_id: t2.id,
        task_type: 'learn',
        title: `📚 Secondary Subject Study: ${t2.name}`,
        description: `Interleaved session on ${t2.subjectName || 'Subject 2'} to maintain balanced multi-subject momentum.`,
        planned_duration_minutes: 35,
        priority: 'medium',
        due_time_slot: 'evening'
      });
      generatedTasks.push({
        topic_id: t2.id,
        task_type: 'current_affairs',
        title: `📰 Daily Current Affairs & PIB Analysis`,
        description: `Read official government releases and socio-economic updates related to your syllabus.`,
        planned_duration_minutes: 25,
        priority: 'medium',
        due_time_slot: 'night'
      });
    } else if (availableMinutes <= 240) {
      // Extensive 3h-4h Plan (6 Sessions)
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'revision',
        title: `⚡ Morning Memory Recall & Mistake Review`,
        description: pendingRevisions.length > 0
          ? `Spaced revision for ${pendingRevisions[0].topic_name} (Reason: ${pendingRevisions[0].reason}).`
          : `Review high-frequency mistakes and core definitions in ${t1.subjectName || 'Core Syllabus'}.`,
        planned_duration_minutes: 30,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'learn',
        title: `📖 Core Subject 1 In-Depth Theory: ${t1.name}`,
        description: `Master high-priority syllabus concepts in ${t1.subjectName}. Annotate key points.`,
        planned_duration_minutes: 50,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'practice_mcq',
        title: `🎯 Timed MCQ & PYQ Sectional Drill: ${t1.name}`,
        description: `Attempt 20-25 authentic previous year and practice questions with negative marking simulation.`,
        planned_duration_minutes: 35,
        priority: 'high',
        due_time_slot: 'afternoon'
      });
      generatedTasks.push({
        topic_id: t2.id,
        task_type: 'learn',
        title: `📚 Core Subject 2 Foundation: ${t2.name}`,
        description: `Cover ${t2.subjectName || 'Secondary Subject'} syllabus modules to prevent subject fatigue.`,
        planned_duration_minutes: 45,
        priority: 'medium',
        due_time_slot: 'evening'
      });
      generatedTasks.push({
        topic_id: t2.id,
        task_type: 'practice_mcq',
        title: `✍️ Subject 2 Practice & Short Analytical Notes: ${t2.name}`,
        description: `Practice application MCQs or write 2 conceptual synthesis answers for ${t2.subjectName}.`,
        planned_duration_minutes: 30,
        priority: 'medium',
        due_time_slot: 'evening'
      });
      generatedTasks.push({
        topic_id: t3.id,
        task_type: 'current_affairs',
        title: `📰 Current Affairs, Editorials & Fact Digest`,
        description: `Comprehensive PIB, The Hindu / Express analysis mapped to General Studies syllabus.`,
        planned_duration_minutes: 35,
        priority: 'medium',
        due_time_slot: 'night'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'mock_test',
        title: `🏆 Night Mini-Mock & Day Retention Quiz`,
        description: `Rapid 15-question consolidation test across today's topics to lock in retention before sleep.`,
        planned_duration_minutes: 20,
        priority: 'high',
        due_time_slot: 'night'
      });
    } else {
      // Intensive 5h-8h Full-Time / Weekend Plan (7-8 Detailed Sessions)
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'revision',
        title: `🌅 Morning Active Recall & Spaced Revision`,
        description: `Review critical formula sheets, constitutional articles, and previous test errors.`,
        planned_duration_minutes: 35,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'learn',
        title: `📖 Deep Concept Mastery (Slot 1): ${t1.name}`,
        description: `In-depth primary topic research in ${t1.subjectName}. Read standard reference literature.`,
        planned_duration_minutes: 55,
        priority: 'high',
        due_time_slot: 'morning'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'practice_mcq',
        title: `🎯 High-Yield MCQ & PYQ Sprint (Slot 1): ${t1.name}`,
        description: `Solve 25+ exam-pattern questions. Write one-line rationales for missed questions.`,
        planned_duration_minutes: 40,
        priority: 'high',
        due_time_slot: 'afternoon'
      });
      generatedTasks.push({
        topic_id: t2.id,
        task_type: 'learn',
        title: `📚 Secondary Subject Module (Slot 2): ${t2.name}`,
        description: `Focused deep-dive into ${t2.subjectName || 'Subject 2'}. Understand core framework and dynamics.`,
        planned_duration_minutes: 50,
        priority: 'medium',
        due_time_slot: 'afternoon'
      });
      generatedTasks.push({
        topic_id: t2.id,
        task_type: 'practice_mcq',
        title: `🧩 Speed & Accuracy Drill (Slot 2): ${t2.name}`,
        description: `Timed MCQ test on ${t2.name} to build speed, accuracy, and elimination techniques.`,
        planned_duration_minutes: 35,
        priority: 'medium',
        due_time_slot: 'evening'
      });
      generatedTasks.push({
        topic_id: t3.id,
        task_type: 'learn',
        title: `🔍 Tertiary Subject / CSAT / Aptitude: ${t3.name}`,
        description: `Solve reasoning, quantitative aptitude, or syllabus sub-module for ${t3.subjectName}.`,
        planned_duration_minutes: 40,
        priority: 'medium',
        due_time_slot: 'evening'
      });
      generatedTasks.push({
        topic_id: t4.id,
        task_type: 'current_affairs',
        title: `📰 National Affairs, PIB & Govt Schemes Integration`,
        description: `Read and synthesize current affairs, economic indicators, and bilateral treaties.`,
        planned_duration_minutes: 40,
        priority: 'medium',
        due_time_slot: 'night'
      });
      generatedTasks.push({
        topic_id: t1.id,
        task_type: 'mock_test',
        title: `🏆 Daily Adaptive Mock Test & Error Log Journal`,
        description: `Comprehensive 20-question test evaluating today's syllabus. Record insights in mistake journal.`,
        planned_duration_minutes: 30,
        priority: 'high',
        due_time_slot: 'night'
      });
    }

    const totalAllocatedMinutes = generatedTasks.reduce((sum, t) => sum + t.planned_duration_minutes, 0);
    return await studyPlanTool.createOrReplacePlan(userId, targetDate, generatedTasks, totalAllocatedMinutes);
  }
};

module.exports = studyPlannerAgent;
