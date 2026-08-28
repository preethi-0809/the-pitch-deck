const agentOrchestrator = require('./agentOrchestrator');

const agentRouter = {
  routeRequest(intent, payload) {
    const agent = agentOrchestrator.getAgent(intent);
    if (!agent) {
      throw new Error(`Unknown agent intent: ${intent}`);
    }
    return agent;
  }
};

module.exports = agentRouter;
