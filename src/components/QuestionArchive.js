import React, { useState, useEffect } from 'react';
import { subscribeToQuestions } from '../utils/firestore';
import './QuestionArchive.css';

function QuestionArchive({ currentUser }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuestions((firebaseQuestions) => {
      setQuestions(firebaseQuestions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="archive-container">Loading archive...</div>;
  }

  // Filter only answered questions for archive
  const answeredQuestions = questions.filter(q => q.answered);
  
  if (answeredQuestions.length === 0) {
    return (
      <div className="archive-container">
        <h3>Question Archive</h3>
        <p>No answered questions yet.</p>
      </div>
    );
  }

  // Sort questions based on selection
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
    <div className="archive-container">
      <h3>Question Archive</h3>
      
      <div className="sort-controls">
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
                <p className="answer-label">Your answer:</p>
                <p className="answer-text">"{question.yourAnswer}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionArchive;