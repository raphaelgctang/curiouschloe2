import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="app-title">Dear Chloe 💕</h1>
        <p className="welcome-text">Welcome to our special space</p>
        
        <div className="button-group">
          <button 
            className="role-btn creator-btn"
            onClick={() => navigate('/you')}
          >
            I'm the App Creator
          </button>
          <button 
            className="role-btn chloe-btn"
            onClick={() => navigate('/chloe')}
          >
            I'm Chloe
          </button>
        </div>
        
        <p className="hint">Choose your role to enter our world</p>
      </div>
    </div>
  );
}

export default LandingPage;