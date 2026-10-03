const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

// Initialize Express app
const app = express();

// Middlewares — allow frontend origin (set FRONTEND_URL in production env)
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for dev insights
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl}`);
  next();
});

// API Root / Health Check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Full-Stack MERN Task Manager REST API is running',
    version: '1.0.0',
    documentation: {
      getTasks: 'GET /api/tasks (query params: status, priority, search, sortBy)',
      getTaskById: 'GET /api/tasks/:id',
      createTask: 'POST /api/tasks (body: { title, description, status, priority, dueDate })',
      updateTask: 'PUT /api/tasks/:id (body: update fields)',
      deleteTask: 'DELETE /api/tasks/:id',
      getStats: 'GET /api/tasks/meta/stats'
    }
  });
});

// Mount Task API Routes
app.use('/api/tasks', taskRoutes);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` MERN Task Manager Server running on port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(` Health Check: http://localhost:${PORT}/`);
  console.log(`=============================================`);
});
