import React from 'react';

const Navbar = ({ totalTasks = 0 }) => {
  return (
    <header className="page-header">
      <div className="header-left">
        <div className="header-badge-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <circle cx="4" cy="6" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="18" r="1.5" fill="currentColor"></circle>
          </svg>
        </div>
        <div className="header-titles">
          <h1 className="header-main-title">Task Manager</h1>
          <p className="header-sub-title">Manage your daily tasks</p>
        </div>
      </div>

      <div className="header-right">
        <span className="task-count-pill">
          {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
