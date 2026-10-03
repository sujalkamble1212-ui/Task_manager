const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

// Meta statistics route (must be before /:id)
router.get('/meta/stats', getTaskStats);

// Main collection routes
router.route('/')
  .get(getTasks)
  .post(createTask);

// Individual item routes
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
