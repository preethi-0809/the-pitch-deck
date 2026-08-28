const performanceTool = require('../tools/performanceTool');

const timeManagementAgent = {
  name: 'TimeManagementAgent',
  description: 'Analyzes user problem-solving speed against ideal exam pacing benchmarks.',

  async analyzePacing(userId) {
    const summary = await performanceTool.getUserPerformanceSummary(userId);
    const avgSpeed = summary.avgSpeedPerQuestion || 60; // in seconds

    // Ideal benchmarks
    // UPSC Prelims: ~72s per question (100 questions in 120 mins)
    // SSC CGL: ~36s per question (100 questions in 60 mins)
    // Banking PO: ~36s per question (100 questions in 60 mins)
    // TNPSC Group 2: ~54s per question (200 questions in 180 mins)

    let status = 'optimal';
    let guidance = 'Your question-solving speed is well calibrated to the official exam clock.';

    if (avgSpeed > 85) {
      status = 'slow';
      guidance = `Your average speed is ${avgSpeed}s per question. You risk running out of time in the final 20% of the paper. Focus on faster option elimination.`;
    } else if (avgSpeed < 25) {
      status = 'rushed';
      guidance = `Your average speed of ${avgSpeed}s indicates rushing, which increases careless mistakes. Spend 10-15s more verifying question nuances.`;
    }

    return {
      averageSpeedSeconds: avgSpeed,
      status,
      guidance,
      recommendedPacingMinutesPerSection: {
        GeneralStudies: 40,
        AptitudeAndReasoning: 50,
        LanguageAndComprehension: 30
      }
    };
  }
};

module.exports = timeManagementAgent;
