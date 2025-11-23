import React, { useState, useEffect } from 'react';
import { subscribeToPoints, updatePoints, addRedemption } from '../utils/firestore';
import './RedeemShop.css';

function RedeemShop({ currentUser }) {
  const [points, setPoints] = useState({ chloePoints: 0 });
  const [showShop, setShowShop] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (currentUser !== 'chloe') return;
    const unsubscribe = subscribeToPoints((pointsData) => {
      setPoints(pointsData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  if (currentUser !== 'chloe') {
    return null;
  }

  const redeemItems = [
    { id: 1, image: 'say.jpg', name: 'Say it', description: 'Make me say anything, anywhere! (Especially when there are people in my room)', cost: 5 },
    { id: 2, image: 'cup.jpg', name: 'Cup of Love', description: 'I buy you a drink, hopefully with a voucher hehe', cost: 12 },
    { id: 3, image: 'pastry.jpg', name: 'Pastry Time', description: 'I buy your favorite pastries, dont make me put a limit on this', cost: 15 },
    { id: 4, image: 'package.jpg', name: 'Surprise Package', description: 'In a few days you shall receive a special delivery...', cost: 20 },
    { id: 5, image: 'post.jpg', name: 'Post That', description: 'I post anything you want me to, regardless of content', cost: 22 },
    { id: 6, image: 'gym.jpg', name: 'Go to the Gym, Fatass', description: 'I have to make this cost more coz if not youre going to spam it', cost: 30 },
  ];

  const handleRedeem = async (item) => {
    if (points.chloePoints >= item.cost) {
      setSelectedItem(item);
    } else {
      alert(`Not enough stars! You need ${item.cost} but only have ${points.chloePoints}.`);
    }
  };

  const confirmRedeem = async () => {
    if (!selectedItem) return;
    
    const newPoints = points.chloePoints - selectedItem.cost;
    await updatePoints(newPoints, 0);
    await addRedemption(selectedItem);
    
    alert(`🎉 Redeemed successfully! Enjoy your reward: ${selectedItem.name}!`);
    setSelectedItem(null);
    setShowShop(false);
  };

  return (
    <>
      {/* Button at bottom */}
        <div className="redeem-button-container">
          <button 
            className="redeem-button"
            onClick={() => setShowShop(true)}
          >
            Redeem Rewards 🎁
          </button>
          <p className="redeem-description">Spend your stars on "special" rewards</p>
        </div>

      {/* Popups rendered at root level */}
      {showShop && (
        <div className="shop-popup-root">
          <div className="shop-overlay">
            <div className="shop-modal">
              <div className="shop-header">
                <h2>Redeem Your Rewards</h2>
                <button className="close-button" onClick={() => setShowShop(false)}>
                  ✕
                </button>
              </div>
              
              <div className="points-balance">
                Your Stars: ⭐ <strong>{points.chloePoints}</strong>
              </div>

              <div className="shop-content">
                <div className="shop-grid">
                  {redeemItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`shop-item ${points.chloePoints >= item.cost ? 'affordable' : 'expensive'}`}
                      onClick={() => handleRedeem(item)}
                    >
                      <div className="item-image">
                        <img src={`/images/${item.image}`} alt={item.name} />
                      </div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-description">{item.description}</div>
                      <div className="item-cost">⭐ {item.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="shop-popup-root">
          <div className="shop-overlay">
            <div className="confirmation-modal">
              <h3>Confirm Redeem</h3>
              <div className="confirm-item">
                <div className="confirm-image">
                  <img src={`/images/${selectedItem.image}`} alt={selectedItem.name} />
                </div>
                <div>
                  <div className="confirm-name">{selectedItem.name}</div>
                  <div className="confirm-desc">{selectedItem.description}</div>
                </div>
              </div>
              <div className="cost-breakdown">
                <div>Cost: ⭐ {selectedItem.cost}</div>
                <div>Current: ⭐ {points.chloePoints}</div>
                <div>Remaining: ⭐ {points.chloePoints - selectedItem.cost}</div>
              </div>
              <div className="confirm-buttons">
                <button className="cancel-btn" onClick={() => setSelectedItem(null)}>
                  Cancel
                </button>
                <button className="confirm-btn" onClick={confirmRedeem}>
                  Confirm Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RedeemShop;