import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query, 
  orderBy,
  getDoc,
  setDoc,
  getDocs, 
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

const QUESTIONS_COLLECTION = 'questions';

// Add new question from Chloe
export const addQuestion = async (questionText) => {
  const newQuestion = {
    date: new Date().toISOString().split('T')[0],
    text: questionText,
    askedBy: 'chloe',
    yourAnswer: '',
    answered: false,
    chloeScore: 0,
    createdAt: new Date()
  };
  
  const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), newQuestion);
  return { id: docRef.id, ...newQuestion };
};

// Save your answer to a question
export const saveAnswer = async (questionId, answerText) => {
  const questionRef = doc(db, QUESTIONS_COLLECTION, questionId);
  await updateDoc(questionRef, {
    yourAnswer: answerText,
    answered: true
  });
};

// Save Chloe's score for your answer - DIRECT INVERSE SCORING
export const saveScore = async (questionId, score) => {
  const questionRef = doc(db, QUESTIONS_COLLECTION, questionId);
  
  // Direct inverse: 5 stars = 0 points, 4 stars = 1 point, etc.
  const pointsEarned = 5 - score; // 5 stars = 0, 4 stars = 1, 3 stars = 2, 2 stars = 3, 1 star = 4
  
  await updateDoc(questionRef, {
    chloeScore: score,
    pointsEarned: pointsEarned
  });

  // Update only Chloe's points
  const data = await getPointsData();
  const newChloePoints = (data.chloePoints || 0) + pointsEarned;
  await updatePoints(newChloePoints, 0); // Your points always 0
};

// Get points data
export const getPointsData = async () => {
  const pointsRef = doc(db, 'points', 'totals');
  const pointsDoc = await getDoc(pointsRef);
  
  if (pointsDoc.exists()) {
    return pointsDoc.data();
  } else {
    // Initialize points if they don't exist
    await setDoc(pointsRef, { chloePoints: 0, yourPoints: 0 });
    return { chloePoints: 0, yourPoints: 0 };
  }
};

// Update points - only Chloe earns points
export const updatePoints = async (chloePoints, yourPoints = 0) => {
  const pointsRef = doc(db, 'points', 'totals');
  await setDoc(pointsRef, { chloePoints, yourPoints: 0 }); // Force yourPoints to 0
};

// Real-time points listener
export const subscribeToPoints = (callback) => {
  const pointsRef = doc(db, 'points', 'totals');
  
  return onSnapshot(pointsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback({ chloePoints: 0, yourPoints: 0 });
    }
  });
};

// Real-time listener for questions
export const subscribeToQuestions = (callback) => {
  const q = query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(questions);
  });
};

// Add redemption to history
// Add redemption to history - FIXED VERSION
export const addRedemption = async (item) => {
  const redemption = {
    name: item.name,
    description: item.description,
    cost: item.cost,
    image: item.image,
    date: new Date().toISOString().split('T')[0],
    redeemedAt: new Date()
  };
  
  // Let Firestore auto-generate the document ID
  const docRef = await addDoc(collection(db, 'redemptions'), redemption);
  
  console.log('✅ Redemption saved with Firestore ID:', docRef.id);
  
  // Return the redemption with the proper Firestore ID
  return { id: docRef.id, ...redemption };
};

// Real-time listener for redemptions
export const subscribeToRedemptions = (callback) => {
  const q = query(collection(db, 'redemptions'), orderBy('redeemedAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const redemptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(redemptions);
  });
};

// Check and apply daily penalty if no questions answered
export const checkDailyPenalty = async () => {
  const today = new Date().toISOString().split('T')[0];
  const pointsData = await getPointsData();
  
  // Check if any questions were answered today
  const questionsQuery = query(
    collection(db, QUESTIONS_COLLECTION), 
    where('answered', '==', true)
  );
  const questionsSnapshot = await getDocs(questionsQuery);
  
  const answeredToday = questionsSnapshot.docs.some(doc => {
    const questionData = doc.data();
    return questionData.date === today;
  });
  
  // If no questions answered today and penalty not applied yet
  if (!answeredToday) {
    const penaltyApplied = localStorage.getItem(`penaltyApplied-${today}`);
    
    if (!penaltyApplied) {
      const newChloePoints = (pointsData.chloePoints || 0) + 10;
      await updatePoints(newChloePoints, 0);
      
      // Mark penalty as applied for today
      localStorage.setItem(`penaltyApplied-${today}`, 'true');
      console.log('⚠️ Daily penalty applied: +10 points to Chloe');
      return true;
    }
  }
  
  return false;
};
