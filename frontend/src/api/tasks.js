import axios from 'axios';

// Support both Vite (import.meta.env.VITE_API_URL) and CRA (process.env.REACT_APP_BACKEND_URL)
const rawBaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL) ||
  'http://localhost:5000/api/tasks';

// Ensure base URL points to /api/tasks
const API_URL = rawBaseUrl.endsWith('/api/tasks') 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, '')}/api/tasks`;

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
