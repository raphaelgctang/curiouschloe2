import React, { useEffect, useState } from 'react';
import { subscribeToQuestions } from './utils/firestore';
import QuestionInput from './components/QuestionInput';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerView from './components/AnswerView';
import PointsDisplay from './components/PointsDisplay';
import RedeemShop from './components/RedeemShop';
import ArchivePopup from './components/ArchivePopup';
import RedemptionHistory from './components/RedemptionHistory';
import { checkDailyPenalty } from './utils/firestore';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [hasAnswers, setHasAnswers] = useState(false);
  const [questions, setQuestions] = useState([]);

  // In your App.js, add this useEffect
useEffect(() => {
  const checkPenalty = async () => {
    try {
      await checkDailyPenalty();
    } catch (error) {
      console.error('Error checking daily penalty:', error);
    }
  };

  // Check penalty when app loads
  checkPenalty();

  // Set up interval to check every hour (optional)
  const interval = setInterval(checkPenalty, 60 * 60 * 1000); // 1 hour
  
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const deviceOwner = localStorage.getItem('dearChloe_deviceOwner');
    
    if (deviceOwner === 'you') {
      setCurrentUser('you');
    } else {
      setCurrentUser('chloe');
    }

    const unsubscribe = subscribeToQuestions((firebaseQuestions) => {
      setQuestions(firebaseQuestions);
      
      const answeredQuestions = firebaseQuestions.filter(q => q.answered && q.chloeScore === 0);
      setHasAnswers(answeredQuestions.length > 0);
    });

    return () => unsubscribe();
  }, []);

  const refreshData = () => {
    setDataVersion(prev => prev + 1);
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="App no-scroll"> {/* Always no-scroll now */}
      <PointsDisplay currentUser={currentUser} />
      
      {/* Welcome text in top left */}
      <h1 style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        margin: 0,
        fontSize: '2rem',
        color: currentUser === 'chloe' ? 'black' : 'black'
      }}>
        Dear {currentUser === 'you' ? 'Creator' : 'Chloe'}💕
      </h1>
      
      {/* REPLACEMENT LOGIC: Show AnswerView OR QuestionInput */}
      {hasAnswers ? (
        <AnswerView currentUser={currentUser} />
      ) : (
        <QuestionInput currentUser={currentUser} onQuestionAdded={refreshData} />
      )}
      
      <QuestionDisplay currentUser={currentUser} key={dataVersion} />
      <RedemptionHistory currentUser={currentUser} />
      
      {/* Buttons with absolute positioning for perfect alignment */}
      <div style={{
        position: 'relative',
        marginTop: '40px',
        marginBottom: '50px',
        minHeight: '100px'
      }}>
        <div style={{
          position: 'absolute',
          left: '50px',
          bottom: '0'
        }}>
          <ArchivePopup currentUser={currentUser} />
        </div>
        <div style={{
          position: 'absolute', 
          right: '50px',
          bottom: '0'
        }}>
          <RedeemShop currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}


export default App;