import React, { useState } from 'react';
import { saveAnswer } from '../utils/firestore';
import './AnswerInput.css';

function AnswerInput({ question, onAnswerSubmitted }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    try {
      await saveAnswer(question.id, answer.trim());
      console.log('Answer saved successfully!');
      
      if (onAnswerSubmitted) {
        onAnswerSubmitted();
      }
      setAnswer('');
    } catch (error) {
      console.error('Error saving answer:', error);
      alert('Error saving answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="answer-input-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows="3"
          disabled={loading}
        />
        <button type="submit" disabled={!answer.trim() || loading}>
          {loading ? 'Sending...' : 'Send Answer 💌'}
        </button>
      </form>
    </div>
  );
}

export default AnswerInput;