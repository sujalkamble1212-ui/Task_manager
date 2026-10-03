import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-row-card ${isCompleted ? 'is-completed' : ''}`}>
      {/* Circular check toggle */}
      <button
        type="button"
        className={`circle-check-btn ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggleStatus(task)}
        aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isCompleted ? '#ffffff' : '#9ca3af'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      {/* Task text content */}
      <div className="task-row-content">
        <div className="task-title-line">
          <span className={`task-text-title ${isCompleted ? 'task-title-done' : ''}`}>
            {task.title}
          </span>
          <span className={`status-tag ${isCompleted ? 'tag-completed' : 'tag-pending'}`}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>

        {task.description && (
          <p className="task-text-desc">{task.description}</p>
        )}

        {task.dueDate && (
          <span className="task-text-date">
            Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Action buttons: Completed button, Update button, and Delete button */}
      <div className="task-row-actions">
        {/* Button of Completed / Complete */}
        <button
          type="button"
          className={`btn-action-pill ${isCompleted ? 'btn-pill-completed' : 'btn-pill-complete'}`}
          onClick={() => onToggleStatus(task)}
          title={isCompleted ? 'Click to mark pending' : 'Click to mark completed'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{isCompleted ? 'Completed' : 'Complete'}</span>
        </button>

        {/* Button of Update */}
        <button
          type="button"
          className="btn-action-pill btn-pill-update"
          onClick={() => onEdit(task)}
          title="Update task"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Update</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          className="btn-action-icon btn-action-delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
