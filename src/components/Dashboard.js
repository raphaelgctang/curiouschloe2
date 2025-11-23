import React from 'react';

function Dashboard({ currentUser }) {
  return (
    <div>
      <h1>Welcome, {currentUser === 'you' ? 'My Love' : 'Chloe'}! 💖</h1>
      <p>This is your personal dashboard</p>
      <p>Current user: {currentUser}</p>
    </div>
  );
}

export default Dashboard;