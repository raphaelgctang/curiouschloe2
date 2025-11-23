import React, { useState, useEffect } from 'react';
import { subscribeToQuestions } from '../utils/firestore';
import AnswerInput from './AnswerInput';
import './QuestionDisplay.css';

function QuestionDisplay({ currentUser }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser !== 'you') return;

    const unsubscribe = subscribeToQuestions((firebaseQuestions) => {
      setQuestions(firebaseQuestions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (currentUser !== 'you') {
    return null;
  }

  const unansweredQuestions = questions.filter(q => !q.answered);

  if (loading) {
    return (
      <div className="question-display-container">
        <div className="question-card-centered">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (unansweredQuestions.length === 0) {
    return (
      <div className="question-display-container">
        <div className="question-card-centered">
          <h3>No questions yet</h3>
          <p>Waiting for Chloe to ask you something... 💫</p>
        </div>
      </div>
    );
  }

  // If only one question, show centered
  if (unansweredQuestions.length === 1) {
    const question = unansweredQuestions[0];
    return (
      <div className="question-display-container">
        <div className="question-card-centered">
          <p className="question-text-centered">"{question.text}"</p>
          <p className="question-date-centered">Asked on {question.date}</p>
          <AnswerInput 
            question={question} 
            onAnswerSubmitted={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // If multiple questions (after answering some), show list
  return (
    <div className="questions-list-container">
      <h3>Questions from Chloe</h3>
      {unansweredQuestions.map(question => (
        <div key={question.id} className="question-card">
          <p className="question-text">"{question.text}"</p>
          <p className="question-date">Asked on {question.date}</p>
          <AnswerInput 
            question={question} 
            onAnswerSubmitted={() => window.location.reload()}
          />
        </div>
      ))}
    </div>
  );
}

export default QuestionDisplay;