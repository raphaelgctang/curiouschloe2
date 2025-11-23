import React, { useState, useEffect } from 'react';
import { subscribeToPoints } from '../utils/firestore';
import './PointsDisplay.css';

function PointsDisplay({ currentUser }) {
  const [points, setPoints] = useState({ chloePoints: 0, yourPoints: 0 });

  useEffect(() => {
    const unsubscribe = subscribeToPoints((pointsData) => {
      setPoints(pointsData);
    });

    return () => unsubscribe();
  }, []);

  // Both sides only show Chloe's points
  const displayText = currentUser === 'chloe' 
    ? "Your Points" 
    : "Chloe's Points";

  return (
    <div className="points-display">
      <div className="points-badge">
        <span className="points-label">{displayText}</span>
        <span className="points-value">⭐ {points.chloePoints}</span>
      </div>
    </div>
  );
}

export default PointsDisplay;