const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const logger = require('./utils/logger');
const rsvpRoutes = require('./routes/rsvpRoutes');
const themeRoutes = require('./routes/themeRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(cors({
    origin: env.allowedOrigins,
    credentials: true
  }));

  app.use((req, res, next) => {
    logger.info({ method: req.method, path: req.path }, 'Incoming request');
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'golden-wings-api',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/rsvps', rsvpRoutes);
  app.use('/api/theme', themeRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
