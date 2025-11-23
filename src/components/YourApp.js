import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

function YourApp({ userType }) {
  const [currentUser, setCurrentUser] = useState(userType);

  useEffect(() => {
    // Save identity to localStorage
    localStorage.setItem('dearChloe_user', userType);
    setCurrentUser(userType);
  }, [userType]);

  return (
    <div className="app">
      <Dashboard currentUser={currentUser} />
    </div>
  );
}

export default YourApp;