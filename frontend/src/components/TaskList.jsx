import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({
  tasks,
  loading,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <section className="tasks-section">
      <h2 className="section-title">Your Tasks</h2>

      {loading && tasks.length === 0 ? (
        <div className="empty-tasks-box">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-tasks-box">
          <p>No tasks yet. Create your first task using the form above.</p>
        </div>
      ) : (
        <div className="task-items-stack">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
