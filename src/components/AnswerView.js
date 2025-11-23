import React, { useState, useEffect } from 'react';
import { subscribeToQuestions, saveScore } from '../utils/firestore';
import Scoring from './Scoring';
import './AnswerView.css';

function AnswerView({ currentUser }) {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only subscribe if currentUser is 'chloe'
    if (currentUser !== 'chloe') return;

    const unsubscribe = subscribeToQuestions((questions) => {
      // Filter for answered questions that haven't been scored yet
      const answered = questions.filter(q => q.answered && q.chloeScore === 0);
      setAnsweredQuestions(answered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Only show on Chloe's device
  if (currentUser !== 'chloe') {
    return null;
  }

  // CHANGED: Return null during loading and when no answers
  if (loading) {
    return null; // ← Don't show anything while loading
  }

  // CHANGED: Return null instead of "No answers yet" box
  if (answeredQuestions.length === 0) {
    return null; // ← Completely hide when no answers to rate
  }

  const handleScore = async (questionId, score) => {
    try {
      await saveScore(questionId, score);
      console.log('Score saved:', score);
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Error saving score. Please try again.');
    }
  };

  return (
    <div className="answer-view-container">
      <h3>Answers to Your Questions</h3>
      {answeredQuestions.map(question => (
        <div key={question.id} className="answer-card">
          <p className="question-text">"{question.text}"</p>
          <div className="answer-section">
            <p className="answer-label">His answer:</p>
            <p className="answer-text">"{question.yourAnswer}"</p>
          </div>
          <div className="scoring-section">
            <p>Rate this answer:</p>
            <Scoring 
              questionId={question.id}
              onScoreSelect={handleScore}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnswerView;