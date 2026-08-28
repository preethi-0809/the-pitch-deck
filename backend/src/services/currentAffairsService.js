const currentAffairsAgent = require('../../../ai/agents/currentAffairsAgent');
const currentAffairsTool = require('../../../ai/tools/currentAffairsTool');

const currentAffairsService = {
  async getFeed({ category, limit, examCode }) {
    return await currentAffairsAgent.getCuratedFeed({ category, limit, examCode });
  },

  async generateQuestionsFromArticle(articleId, examId) {
    return await currentAffairsAgent.convertArticleToQuestions(articleId, examId);
  },

  async addArticle(articleData) {
    return await currentAffairsTool.addVerifiedArticle(articleData);
  }
};

module.exports = currentAffairsService;
