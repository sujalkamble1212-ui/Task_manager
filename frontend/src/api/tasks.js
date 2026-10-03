import axios from 'axios';

// In production on Vercel, frontend and API share the same domain.
// Use a relative URL (/api/tasks) so it works automatically.
// In local dev, fall back to the VITE_API_URL pointing to localhost:5000.
const API_URL =
  import.meta.env.VITE_API_URL || '/api/tasks';

console.log('[API Config] Connected to backend endpoint:', API_URL);

/**
 * Fetch all tasks with optional filters (status, priority, search, sortBy)
 */
export const getTasks = (params = {}) => {
  return axios.get(API_URL, { params });
};

/**
 * Fetch a single task by ID
 */
export const getTaskById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

/**
 * Create a new task
 */
export const createTask = (taskData) => {
  return axios.post(API_URL, taskData);
};

/**
 * Update an existing task
 */
export const updateTask = (id, taskData) => {
  return axios.put(`${API_URL}/${id}`, taskData);
};

/**
 * Delete a task by ID
 */
export const deleteTask = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

/**
 * Fetch summary statistics (total, pending, in-progress, completed, overdue)
 */
export const getTaskStats = () => {
  return axios.get(`${API_URL}/meta/stats`);
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
