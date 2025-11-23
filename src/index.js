import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // This imports the default export

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// In index.js
const backgroundImages = [
  'bg1.jpg',
  'bg2.jpg',
  'bg3.jpg',
  'bg4.jpg',
  'bg5.jpg',
  'bg6.jpg',
  'bg7.jpg',
  'bg8.jpg',
  'bg9.jpg',
  'bg10.jpg',
  'bg11.jpg',
  'bg12.jpg',
  'bg13.jpg',
  'bg14.jpg',
  'bg15.jpg',
  'bg16.jpg'
];

function getRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return `/images/backgrounds/${backgroundImages[randomIndex]}`;
}

const randomBackground = getRandomBackground();

// Apply to both the body and the ::after pseudo-element
document.body.style.backgroundImage = `url('${randomBackground}')`;

// Also set it as a CSS variable for the ::after element
const style = document.createElement('style');
style.textContent = `
  body::after {
    background-image: url('${randomBackground}');
  }
`;
document.head.appendChild(style);