import React from 'react';

const StatsOverview = ({ tasks }) => {
  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="stats-cards-row">
      <div className="card stat-box">
        <span className="stat-box-title">Pending</span>
        <span className="stat-box-number">{pendingCount}</span>
      </div>

      <div className="card stat-box">
        <span className="stat-box-title">Completed</span>
        <span className="stat-box-number">{completedCount}</span>
      </div>
    </div>
  );
};

export default StatsOverview;
