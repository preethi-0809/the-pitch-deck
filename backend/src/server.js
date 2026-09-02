const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { initializeDatabase } = require('./config/initDb');
const { runSeed } = require('../../database/seed/seedRunner');
const apiRoutes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize DB and ensure seed catalog
try {
  initializeDatabase();
  runSeed(false);
} catch (err) {
  console.error('Database startup warning:', err.message);
}

// Middleware
const allowedOrigins = [
  'https://the-pitch-deck.vercel.app',
  'https://the-pitch-deck.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow all cross-origin requests from deployed frontend
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Mount API
app.use('/api', apiRoutes);

// Centralized error handling for API
app.use(errorMiddleware);

// Serve static frontend assets if built
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  // Catch-all route to serve index.html for SPA client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
} else {
  // If static files are not built, provide a helpful default response on root
  app.get('/', (req, res) => {
    res.json({
      message: 'Government Exam AI Preparation Platform API is operational.',
      apiDocumentation: '/api/health',
      status: 'online'
    });
  });
}

// Start standalone server when executed directly (or on traditional hosting like Render/Railway)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Pitch Deck Government Exam Platform is running!`);
    console.log(`👉 Unified Single Web Link Server Port: ${PORT}`);
    console.log(`👉 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);

    // Start background automated notification engine (runs initially and every 30 mins)
    try {
      const notificationEngine = require('./services/notificationEngine');
      setTimeout(() => {
        notificationEngine.runNotificationEngine().catch(e => console.warn('Initial notification engine run:', e.message));
      }, 5000);

      setInterval(() => {
        notificationEngine.runNotificationEngine().catch(e => console.warn('Scheduled notification engine run:', e.message));
      }, 30 * 60 * 1000);
    } catch (e) {
      console.warn('Could not schedule notification engine:', e.message);
    }
  });
}

module.exports = app;
