const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

// Health check & Info endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    relational_db: 'SQLite (PostgreSQL Schema Compatible)',
    vibe_check_feature: 'Workload Balancing Active'
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Kanban API Server running on http://localhost:${PORT}`);
});
