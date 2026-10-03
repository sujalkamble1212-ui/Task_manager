const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection (cached for serverless warm reuse) ─────────────────────
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('MongoDB connected');
};

// ── Task Model (inline — no relative path issues in serverless) ───────────────
const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '', trim: true },
    status:      { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate:     { type: Date, default: null }
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ status: 'online', message: 'MERN Task Manager API is running on Vercel' });
});

// ── GET /api/tasks ────────────────────────────────────────────────────────────
app.get('/api/tasks', async (req, res) => {
  try {
    await connectDB();
    const { status, priority, search, sortBy } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'dueDate') sortOptions = { dueDate: 1 };
    else if (sortBy === 'title') sortOptions = { title: 1 };
    else if (sortBy === 'oldest') sortOptions = { createdAt: 1 };

    const tasks = await Task.find(query).sort(sortOptions);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/meta/stats ─────────────────────────────────────────────────
app.get('/api/tasks/meta/stats', async (req, res) => {
  try {
    await connectDB();
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'pending' }),
      Task.countDocuments({ status: 'in-progress' }),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ status: { $ne: 'completed' }, dueDate: { $lt: new Date(), $ne: null } })
    ]);
    res.status(200).json({ total, pending, inProgress, completed, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────
app.get('/api/tasks/:id', async (req, res) => {
  try {
    await connectDB();
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/tasks ───────────────────────────────────────────────────────────
app.post('/api/tasks', async (req, res) => {
  try {
    await connectDB();
    const { title, description, status, priority, dueDate } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null
    });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
app.put('/api/tasks/:id', async (req, res) => {
  try {
    await connectDB();
    const { title, description, status, priority, dueDate } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await connectDB();
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── 404 Fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
});

module.exports = app;
