import React, { useState, useEffect } from 'react';
import { subscribeToRedemptions } from '../utils/firestore';
import './RedemptionHistory.css';

function RedemptionHistory({ currentUser }) {
  const [allRedemptions, setAllRedemptions] = useState([]); // Store ALL redemptions from Firebase
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [hiddenRedemptions, setHiddenRedemptions] = useState([]);

  // Load hidden items from localStorage on component mount
  useEffect(() => {
    const savedHiddenItems = localStorage.getItem('hiddenRedemptions');
    if (savedHiddenItems) {
      setHiddenRedemptions(JSON.parse(savedHiddenItems));
    }
  }, []);

  useEffect(() => {
    if (currentUser !== 'you') return;
    
    const unsubscribe = subscribeToRedemptions((redemptionData) => {
      console.log('📦 Raw Firebase data:', redemptionData); // Debug log
      setAllRedemptions(redemptionData); // Store ALL data from Firebase
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  // Function to permanently hide redemption from view
  const handleComplete = (redemptionId) => {
    console.log('🎯 Hiding redemption:', redemptionId, 'Type:', typeof redemptionId);
    
    // Convert to string for consistent storage
    const idString = String(redemptionId);
    
    // Add to hidden redemptions
    const newHiddenRedemptions = [...hiddenRedemptions, idString];
    setHiddenRedemptions(newHiddenRedemptions);
    
    // Save to localStorage
    localStorage.setItem('hiddenRedemptions', JSON.stringify(newHiddenRedemptions));
    
    // Force immediate re-render by updating a state
    setAllRedemptions(prev => [...prev]); // This triggers re-render
  };

  // Only show for you
  if (currentUser !== 'you') {
    return null;
  }

  const visibleRedemptions = allRedemptions.filter(redemption => 
    !hiddenRedemptions.includes(String(redemption.id))
  );

  const displayedRedemptions = showAll ? visibleRedemptions : visibleRedemptions.slice(0, 5);

  if (loading) {
    return <div className="redemption-history">Loading redemption history...</div>;
  }

  if (visibleRedemptions.length === 0) {
    return (
      <div className="redemption-history">
        <h3>Redemption History</h3>
        <p>{allRedemptions.length === 0 ? 'No rewards redeemed yet.' : 'All rewards marked as completed.'}</p>
      </div>
    );
  }

  return (
    <div className="redemption-history">
      <h3>Rewards Redeemed by Chloe </h3>

      <div className="redemption-list">
        {displayedRedemptions.map(redemption => (
          <div key={redemption.id} className="redemption-item">
            <div className="redemption-image">
              <img src={`/images/${redemption.image}`} alt={redemption.name} />
            </div>
            <div className="redemption-details">
              <div className="redemption-name">{redemption.name}</div>
              <div className="redemption-description">{redemption.description}</div>
              <div className="redemption-meta">
                <span className="redemption-cost">Cost: ⭐ {redemption.cost}</span>
                <span className="redemption-date">{redemption.date}</span>
              </div>
            </div>
            {/* Completed Button - Permanently hides from view */}
            <button 
              className="completed-btn"
              onClick={() => handleComplete(redemption.id)}
            >
              Completed ✓
            </button>
          </div>
        ))}
      </div>
      
      {/* Show More/Less button */}
      {visibleRedemptions.length > 5 && (
        <button 
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `Show All (${visibleRedemptions.length})`}
        </button>
      )}
    </div>
  );
}

export default RedemptionHistory;