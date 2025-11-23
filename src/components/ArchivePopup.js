import React, { useState, useEffect } from 'react';
import { subscribeToQuestions } from '../utils/firestore';
import './ArchivePopup.css';

function ArchivePopup({ currentUser }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchive, setShowArchive] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuestions((firebaseQuestions) => {
      setQuestions(firebaseQuestions);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Only show for Chloe
  if (currentUser !== 'chloe') {
    return null;
  }

  const answeredQuestions = questions.filter(q => q.answered);
  
  const sortedQuestions = [...answeredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest':
        return (b.chloeScore || 0) - (a.chloeScore || 0);
      case 'lowest':
        return (a.chloeScore || 0) - (b.chloeScore || 0);
      default:
        return 0;
    }
  });

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const getStarsDisplay = (score) => {
    if (!score) return 'Not rated';
    return '⭐'.repeat(score) + ` (${score}/5)`;
  };

  return (
    <>
      {/* Archive Button */}
      <div className="archive-button-container">
        <button 
          className="archive-button"
          onClick={() => setShowArchive(true)}
        >
          Question Archive 📚
        </button>
        <p className="archive-description">Look at past questions and answers</p>
      </div>

      {/* Archive Popup */}
      {showArchive && (
        <div className="archive-popup-root">
          <div className="archive-overlay">
            <div className="archive-modal">
              <div className="archive-header">
                <h2>Question Archive</h2>
                <button 
                  className="archive-close-button"
                  onClick={() => setShowArchive(false)}
                >
                  ✕
                </button>
              </div>

              <div className="archive-content">
                {loading ? (
                  <div className="archive-loading">Loading archive...</div>
                ) : answeredQuestions.length === 0 ? (
                  <div className="archive-empty">
                    <h3>No answered questions yet</h3>
                    <p>Questions you ask and get answers to will appear here.</p>
                  </div>
                ) : (
                  <>
                    <div className="archive-stats">
                      <div className="stat-item">
                        <span className="stat-number">{answeredQuestions.length}</span>
                        <span className="stat-label">Questions Answered</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">
                          {answeredQuestions.reduce((sum, q) => sum + (q.chloeScore || 0), 0)}
                        </span>
                        <span className="stat-label">Total Stars Given</span>
                      </div>
                    </div>

                    <div className="archive-controls">
                      <label>Sort by: </label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                      </select>
                    </div>

                    <div className="archive-list">
                      {sortedQuestions.map(question => (
                        <div key={question.id} className="archive-item">
                          <div 
                            className="archive-question"
                            onClick={() => toggleQuestion(question.id)}
                          >
                            <span className="question-text">"{question.text}"</span>
                            <div className="question-meta">
                              <span className="date">{question.date}</span>
                              <span className="rating">{getStarsDisplay(question.chloeScore)}</span>
                              <span className="points">+{question.pointsEarned || 0} pts</span>
                              <span className="expand-icon">
                                {expandedQuestion === question.id ? '▼' : '►'}
                              </span>
                            </div>
                          </div>
                          
                          {expandedQuestion === question.id && (
                            <div className="archive-answer">
                              <p className="answer-label">His answer:</p>
                              <p className="answer-text">"{question.yourAnswer}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ArchivePopup;