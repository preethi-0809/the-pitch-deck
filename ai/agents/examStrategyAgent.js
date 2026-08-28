const userDataTool = require('../tools/userDataTool');
const syllabusTool = require('../tools/syllabusTool');
const performanceTool = require('../tools/performanceTool');

const examStrategyAgent = {
  name: 'ExamStrategyAgent',
  description: 'Formulates high-yield exam preparation strategy, milestone roadmaps, and priority matrices.',

  async generateStrategy(userId) {
    const userContext = await userDataTool.getUserContext(userId);
    if (!userContext || !userContext.profile) {
      return { error: 'User profile not found.' };
    }

    const { profile, targetExam } = userContext;
    const examDate = profile.exam_date ? new Date(profile.exam_date) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysRemaining = Math.max(1, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));

    const syllabusStatus = await syllabusTool.getUserSyllabusStatus(userId, profile.target_exam_id);
    const performance = await performanceTool.getUserPerformanceSummary(userId);

    // Calculate weekly study hours budget
    const weekdayHours = profile.daily_hours_weekday || 2;
    const weekendHours = profile.daily_hours_weekend || 4;
    const weeklyHoursBudget = (weekdayHours * 5) + (weekendHours * 2);
    const totalEstimatedStudyHoursAvailable = Math.round((daysRemaining / 7) * weeklyHoursBudget);

    // Prioritize high-yield subjects
    const subjectPriorities = syllabusStatus.syllabus.map(subj => {
      const isWeak = (profile.weak_subjects || []).includes(subj.name);
      const isStrong = (profile.strong_subjects || []).includes(subj.name);
      
      let priorityScore = (subj.weightage_percentage || 15);
      if (isWeak) priorityScore += 10;
      if (isStrong) priorityScore -= 5;

      return {
        subjectId: subj.id,
        subjectName: subj.name,
        code: subj.code,
        weightage: subj.weightage_percentage,
        isWeak,
        isStrong,
        priorityLevel: priorityScore >= 25 ? 'High Priority' : (priorityScore >= 15 ? 'Medium Priority' : 'Standard Priority'),
        recommendedWeeklyHours: Math.max(2, Math.round((priorityScore / 100) * weeklyHoursBudget))
      };
    });

    // Milestone Roadmap Phases
    const phases = [];
    if (daysRemaining > 60) {
      phases.push({
        phase: 'Phase 1: Comprehensive Syllabus Foundation',
        duration: `Next ${Math.round(daysRemaining * 0.5)} days`,
        focus: 'Complete remaining core topics, build conceptual clarity, take topic-wise drills.',
        targetCompletion: '80% of syllabus'
      });
      phases.push({
        phase: 'Phase 2: PYQ Integration & Weakness Rectification',
        duration: `${Math.round(daysRemaining * 0.3)} days`,
        focus: 'Analyze last 5 years PYQs, target active mistake clusters, take 2 mock tests per week.',
        targetCompletion: '100% syllabus + 5 full mocks'
      });
      phases.push({
        phase: 'Phase 3: High-Intensity Simulation & Rapid Revision',
        duration: `Final ${Math.round(daysRemaining * 0.2)} days`,
        focus: 'Full-length timed mock tests, current affairs revision cards, formula & cheat-sheet memorization.',
        targetCompletion: 'Peak exam readiness & optimal pacing'
      });
    } else {
      phases.push({
        phase: 'Accelerated High-Yield Revision',
        duration: `Next ${Math.round(daysRemaining * 0.6)} days`,
        focus: 'Prioritize top 20% high-frequency topics, revise error logs, take daily mini-tests.',
        targetCompletion: 'High-yield coverage'
      });
      phases.push({
        phase: 'Final Exam Simulation & Confidence Building',
        duration: `Final ${Math.round(daysRemaining * 0.4)} days`,
        focus: 'Full length mock tests at exam hours, time management calibration, stress elimination.',
        targetCompletion: 'Exam readiness'
      });
    }

    return {
      targetExamName: targetExam ? targetExam.name : 'Target Examination',
      daysRemaining,
      userType: profile.user_type,
      weeklyHoursBudget,
      totalEstimatedStudyHoursAvailable,
      completionRate: syllabusStatus.completionRate,
      subjectPriorities,
      phases,
      strategicGuidance: `As a ${profile.user_type.replace('_', ' ')} with ${weeklyHoursBudget} hours available weekly, your strategy allocates ${weekdayHours}h on weekdays and ${weekendHours}h on weekends, frontloading weak topics into weekend deep-work blocks.`
    };
  }
};

module.exports = examStrategyAgent;
