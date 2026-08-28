const db = require('../../backend/src/config/database');
const userDataTool = require('../tools/userDataTool');
const syllabusTool = require('../tools/syllabusTool');
const performanceTool = require('../tools/performanceTool');
const studyPlanTool = require('../tools/studyPlanTool');
const revisionTool = require('../tools/revisionTool');
const studyPlannerAgent = require('./studyPlannerAgent');
const weaknessAgent = require('./weaknessAgent');
const examReadinessAgent = require('./examReadinessAgent');
const examStrategyAgent = require('./examStrategyAgent');

const examCoachAgent = {
  name: 'ExamCoachAgent',
  description: 'Central AI Exam Coach orchestrating personalized Q&A, actionable study guidance, and live plan adjustments.',

  async handleUserQuery(userId, userMessage) {
    const userContext = await userDataTool.getUserContext(userId);
    if (!userContext || !userContext.profile) {
      return {
        reply: 'Please complete your onboarding profile so I can provide personalized coaching advice tailored to your target exam and schedule.',
        actionTaken: null
      };
    }

    const { user, profile, targetExam } = userContext;
    const lower = (userMessage || '').toLowerCase();

    // 1. "I only have one hour today" / "I have X hours today"
    const hourMatch = lower.match(/(?:only\s+have|have|got)\s+(\d+(?:\.\d+)?)\s*hour/);
    if (hourMatch || lower.includes('one hour') || lower.includes('1 hour') || lower.includes('rush plan')) {
      const hours = hourMatch ? parseFloat(hourMatch[1]) : 1.0;
      const newPlan = await studyPlannerAgent.generateDailyPlan(userId, null, hours);
      return {
        reply: `I have updated your schedule for today to fit strictly into **${hours} hour (${Math.round(hours * 60)} mins)**.

Here is your high-yield focus plan:
${newPlan.tasks.map((t, i) => `${i + 1}. **${t.title}** (${t.planned_duration_minutes}m) — ${t.description}`).join('\n')}

I have saved this directly into your active daily study tracker!`,
        actionTaken: 'plan_regenerated',
        plan: newPlan
      };
    }

    // 2. "I missed yesterday's plan" / "Missed session" / "Adjust missed plan"
    if (lower.includes('missed') || lower.includes('adjust') || lower.includes('rebalance') || lower.includes('redistribute')) {
      const result = await studyPlanTool.redistributeMissedTasks(userId);
      const updatedPlan = await studyPlanTool.getTodayPlan(userId);
      return {
        reply: `Don't worry! ${result.message}

${result.adjustedCount > 0 ? 'Your pending high-priority topics have been gracefully blended into today\'s schedule so you remain on track without cognitive overload.' : 'All your previous tasks are up to date!'}`,
        actionTaken: 'tasks_redistributed',
        plan: updatedPlan
      };
    }

    // 3. "What should I study today?" / "Create today's plan"
    if (lower.includes('what should i study') || lower.includes('today\'s plan') || lower.includes('todays plan') || lower.includes('create plan')) {
      let todayPlan = await studyPlanTool.getTodayPlan(userId);
      if (!todayPlan || todayPlan.tasks.length === 0) {
        todayPlan = await studyPlannerAgent.generateDailyPlan(userId);
      }
      return {
        reply: `Here is your customized preparation plan for today based on your **${profile.user_type.replace('_', ' ')}** schedule:

${todayPlan.tasks.map((t, i) => `${i + 1}. **[${t.due_time_slot.toUpperCase()}] ${t.title}** (${t.planned_duration_minutes} mins)\n   ${t.description}`).join('\n\n')}

Target Exam: **${targetExam ? targetExam.name : 'Target Exam'}** | Total Time: **${todayPlan.total_planned_minutes} minutes**.`,
        actionTaken: 'plan_fetched',
        plan: todayPlan
      };
    }

    // 4. "What are my weakest topics?" / "Why am I scoring low?"
    if (lower.includes('weak') || lower.includes('scoring low') || lower.includes('mistake') || lower.includes('why am i')) {
      const weaknessData = await weaknessAgent.analyzeUserWeaknesses(userId);
      const perfData = await performanceTool.getUserPerformanceSummary(userId);

      if (weaknessData.activeMistakesCount === 0) {
        return {
          reply: `You haven't recorded any major mistake patterns yet! Take an adaptive mock test to help me map your exact concept gaps and timing bottlenecks.`,
          actionTaken: 'suggest_mock_test'
        };
      }

      const topMistakes = weaknessData.repeatedMistakes.slice(0, 3);
      return {
        reply: `### AI Weakness & Mistake Diagnosis for ${user.name}:

${topMistakes.length > 0 ? `**High-Frequency Mistake Alert:**\n${topMistakes.map(m => `• **${m.topic_name}** (${m.subject_name}): Made errors across **${m.frequency_count} tests**. Cause: *${m.mistake_type.replace('_', ' ')}*`).join('\n')}` : `• No repeated topic traps detected yet.`}

**Root-Cause Error Distribution:**
- Concept Gaps: ${weaknessData.taxonomyBreakdown.concept_gap.count}
- Concept Confusion: ${weaknessData.taxonomyBreakdown.confusion.count}
- Question Misreading: ${weaknessData.taxonomyBreakdown.misreading.count}
- Careless / Calculation Errors: ${weaknessData.taxonomyBreakdown.careless.count}

**AI Coach Recommendation:**
> ${weaknessData.recommendations[0]?.message || 'Complete scheduled spaced revisions before taking your next mock test.'}`,
        actionTaken: 'weakness_analyzed',
        weaknessData
      };
    }

    // 5. "How prepared am I?" / "Readiness"
    if (lower.includes('prepared') || lower.includes('readiness') || lower.includes('ready')) {
      const readiness = await examReadinessAgent.calculateReadiness(userId);
      return {
        reply: `### Your Overall Exam Readiness: **${readiness.readinessScore}%** (${readiness.readinessBand})

**Readiness Diagnostic Matrix:**
• **Syllabus Coverage**: ${readiness.metrics.syllabusCompletionRate}% complete
• **Mock Test Accuracy**: ${readiness.metrics.averageMockAccuracy}% average accuracy
• **Revision & Error Hygiene**: ${readiness.metrics.activeMistakesCount} active mistake logs, ${readiness.metrics.urgentRevisionsPending} urgent revisions pending

**Next Actionable Step:**
${readiness.readinessAdvice}`,
        actionTaken: 'readiness_calculated',
        readiness
      };
    }

    // 6. "What should I revise?" / "Revision"
    if (lower.includes('revise') || lower.includes('revision')) {
      const revs = await revisionTool.getUpcomingRevisions(userId);
      if (revs.length === 0) {
        return {
          reply: `Your revision queue is currently clear! You can continue studying new topics from your syllabus or take a practice mock test.`,
          actionTaken: 'revision_checked'
        };
      }
      return {
        reply: `You have **${revs.length} topics** scheduled for spaced revision:

${revs.map((r, i) => `${i + 1}. **${r.topic_name}** (${r.subject_name}) — Priority: *${r.priority.toUpperCase()}* | Reason: *${r.reason.replace('_', ' ')}*`).join('\n')}

I recommend dedicating your next 30 minutes to review these topics to preserve retention.`,
        actionTaken: 'revisions_listed',
        revisions: revs
      };
    }

    // 7. General Coach response with personalized data injection
    const strategy = await examStrategyAgent.generateStrategy(userId);
    return {
      reply: `Hello ${user.name}! As your AI Exam Coach for **${targetExam ? targetExam.name : 'your exam'}** (${strategy.daysRemaining} days remaining):

- **Your Target Weekly Budget**: ${strategy.weeklyHoursBudget} hours (${profile.daily_hours_weekday}h weekdays / ${profile.daily_hours_weekend}h weekends).
- **Current Completion**: ${strategy.completionRate}% of syllabus.
- **Top Priority Focus**: ${strategy.subjectPriorities[0]?.subjectName || 'Indian Polity'} & ${strategy.subjectPriorities[1]?.subjectName || 'Indian Economy'}.

You can ask me to:
• *"What should I study today?"*
• *"I only have 1 hour today"*
• *"Why am I scoring low?"*
• *"Adjust my missed plan"*
• *"What should I revise next?"*`,
      actionTaken: 'coach_overview'
    };
  }
};

module.exports = examCoachAgent;
