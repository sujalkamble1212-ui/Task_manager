import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const [showExtra, setShowExtra] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      let formattedDate = '';
      if (initialData.dueDate) {
        try {
          formattedDate = new Date(initialData.dueDate).toISOString().split('T')[0];
        } catch {
          formattedDate = '';
        }
      }

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: formattedDate
      });
      setShowExtra(Boolean(initialData.dueDate || initialData.priority !== 'medium'));
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
      });
      setShowExtra(false);
    }
    setError('');
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'title' && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a task title');
      return;
    }

    try {
      setSubmitting(true);
      if (initialData && initialData._id) {
        await onSubmit(initialData._id, formData);
      } else {
        await onSubmit(formData);
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          dueDate: ''
        });
        setShowExtra(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(initialData && initialData._id);

  return (
    <div className="card add-task-card">
      <div className="card-title-row">
        <h2 className="card-title">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
        {isEditing && (
          <button
            type="button"
            className="btn-cancel-edit"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      {error && <div className="form-error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form-inner">
        <div className="input-field-wrap">
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Task title..."
            value={formData.title}
            onChange={handleChange}
            className="custom-input"
            maxLength={120}
            required
          />
        </div>

        <div className="input-field-wrap">
          <textarea
            id="description"
            name="description"
            rows="2"
            placeholder="Task description..."
            value={formData.description}
            onChange={handleChange}
            className="custom-input custom-textarea"
          />
        </div>

        {/* Optional options toggle */}
        {showExtra ? (
          <div className="extra-options-row">
            <div className="field-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="custom-input custom-input-sm"
              />
            </div>
            <div className="field-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="custom-input custom-input-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="field-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="custom-input custom-input-sm"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="extra-toggle-line">
            <button
              type="button"
              className="btn-toggle-options"
              onClick={() => setShowExtra(true)}
            >
              + Set due date & priority
            </button>
          </div>
        )}

        <div className="form-btn-row">
          <button
            type="submit"
            className="btn-add-task"
            disabled={submitting}
          >
            {submitting ? (
              'Saving...'
            ) : isEditing ? (
              'Update Task'
            ) : (
              '+ Add Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
