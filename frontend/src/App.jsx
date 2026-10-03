import React, { useState, useEffect, useCallback } from 'react';
import {
  Navbar,
  TaskForm,
  TaskList,
  StatsOverview,
  Toast
} from './components';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from './api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Could not reach backend API server', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (newTaskData) => {
    try {
      await createTask(newTaskData);
      showToast(`Task created!`, 'success');
      await fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      const errMsg = err.response?.data?.message || 'Failed to create task';
      showToast(errMsg, 'error');
      throw err;
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      await updateTask(id, updatedData);
      setEditingTask(null);
      showToast(`Task updated!`, 'success');
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      const errMsg = err.response?.data?.message || 'Failed to update task';
      showToast(errMsg, 'error');
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      showToast(`Task removed`, 'success');
      if (editingTask && editingTask._id === id) {
        setEditingTask(null);
      }
      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      showToast('Failed to delete task', 'error');
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
      await updateTask(task._id, { status: nextStatus });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showToast('Failed to update status', 'error');
      await fetchTasks();
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-viewport">
      <main className="main-content-wrapper">
        {/* Top Header */}
        <Navbar totalTasks={tasks.length} />

        {/* Add / Edit Task Card */}
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialData={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        {/* Pending & Completed 2-Card Stats */}
        <StatsOverview tasks={tasks} />

        {/* Your Tasks Section */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
