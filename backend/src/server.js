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
const authRoutes = require('./routes/authRoutes');
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

// CORS: Allow deployed frontend, localhost dev, and any custom CLIENT_URL
const allowedOrigins = [
  'https://the-pitch-deck.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

// Allow additional origins from environment (e.g. custom domain or preview deployments)
if (process.env.CLIENT_URL) {
  const clientUrl = process.env.CLIENT_URL.trim().replace(/\/+$/, '');
  if (!allowedOrigins.includes(clientUrl)) {
    allowedOrigins.push(clientUrl);
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);
    // Allow any Vercel preview deployment
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is working"
  });
});

// Mount Auth Routes directly
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

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
