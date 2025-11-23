import React, { useState } from 'react';
import { addQuestion } from '../utils/firestore';
import './QuestionInput.css';

function QuestionInput({ currentUser, onQuestionAdded }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser !== 'chloe') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setLoading(true);
    try {
      const question = await addQuestion(newQuestion.trim());
      console.log('Question saved to Firebase:', question);
      
      if (onQuestionAdded) {
        onQuestionAdded(question);
      }
      
      setNewQuestion('');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-input-container">
      <div>
        <h3>Ask Raphael a Question:</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Any questions you want to ask me bb?"
            
            rows="4"
            disabled={loading}
          />
          <button type="submit" disabled={!newQuestion.trim() || loading}>
            {loading ? 'Sending...' : 'Send Question 💫'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuestionInput;