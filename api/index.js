// Vercel Serverless Function entry point
// Connects Vercel /api/* requests directly to Express backend
const app = require('../backend/src/server');

module.exports = (req, res) => {
  return app(req, res);
};
