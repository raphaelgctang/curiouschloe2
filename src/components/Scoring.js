import React, { useState } from 'react';
import './Scoring.css';

function Scoring({ questionId, onScoreSelect }) {
  const [selectedScore, setSelectedScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleScoreClick = async (score) => {
    setSelectedScore(score);
    try {
      await onScoreSelect(questionId, score);
      setSubmitted(true);
    } catch (error) {
      setSelectedScore(0);
    }
  };

  if (submitted) {
    return (
      <div className="scoring-container">
        <p className="success-message">✅ Rated {selectedScore} stars!</p>
      </div>
    );
  }

  return (
    <div className="scoring-container">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            className={`star-btn ${selectedScore >= star ? 'active' : ''}`}
            onClick={() => handleScoreClick(star)}
          >
            ⭐
          </button>
        ))}
      </div>
      <p className="score-hint">{selectedScore > 0 ? `Rating: ${selectedScore}/5` : 'Click stars to rate'}</p>
    </div>
  );
}

export default Scoring;