import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// List of fun adjectives and nouns for anonymous names
const adjectives = [
  'Cool', 'Mystic', 'Epic', 'Cosmic', 'Wild', 'Funky', 'Vibrant', 'Dreamy', 'Stellar', 'Groovy', 
  'Wavy', 'Electric', 'Neon', 'Chill', 'Retro', 'Hyper', 'Swift', 'Vivid', 'Zen', 'Magic',
  'Fluid', 'Silent', 'Bold', 'Mighty', 'Sleek', 'Ember', 'Astral', 'Dazzle', 'Plush', 'Prime',
  'Fizzy', 'Nimble', 'Lush', 'Breeze', 'Dusk', 'Dawn', 'Frost', 'Sunny', 'Noble', 'Royal'
];

const nouns = [
  'Star', 'Wave', 'Moon', 'Vibe', 'Soul', 'Mind', 'Echo', 'Spark', 'Dream', 'Heart', 
  'Beat', 'Flow', 'Pulse', 'Beam', 'Light', 'Wolf', 'Tiger', 'Eagle', 'Comet', 'Cloud',
  'Pixel', 'Ghost', 'Raven', 'Storm', 'Phoenix', 'Rider', 'Hawk', 'Panther', 'Lynx', 'Lotus',
  'Crystal', 'Owl', 'Shadow', 'Glitch', 'Byte', 'Mist', 'Prism', 'Oracle', 'Galaxy', 'Nebula'
];

/**
 * Hook to generate and persist anonymous user ID and name
 * @returns {Object} { anonymousId, anonymousName, resetId }
 */
export const useAnonymousId = () => {
  const [anonymousId, setAnonymousId] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  
  // Generate a random anonymous name with unique formatting
  const generateAnonymousName = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    
    // Different name formats to make them more unique
    const nameFormats = [
      `${adjective}${noun}${number}`,
      `${adjective}_${noun}${number}`,
      `${adjective}${number}${noun}`,
      `${noun}${adjective}${number}`,
      `${noun}${number}${adjective}`
    ];
    
    const format = nameFormats[Math.floor(Math.random() * nameFormats.length)];
    return `Anon_${format}`;
  };
  
  // Initialize or load from localStorage on component mount
  useEffect(() => {
    // Migrate to single ID: voodo_anon_user_id
    let unifiedId = localStorage.getItem('voodo_anon_user_id');
    let legacyId = localStorage.getItem('voodo_anonymous_id');
    let storedId = unifiedId || legacyId;
    let storedName = localStorage.getItem('voodo_anonymous_name');
    
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('voodo_anon_user_id', storedId);
      localStorage.setItem('voodo_anonymous_id', storedId);
    }
    
    if (!storedName) {
      storedName = generateAnonymousName();
      localStorage.setItem('voodo_anonymous_name', storedName);
    }
    
    // Always write unified key so rest of app uses single ID
    localStorage.setItem('voodo_anon_user_id', storedId);
    setAnonymousId(storedId);
    setAnonymousName(storedName);
  }, []);
  
  // Function to reset the anonymous ID and generate a new one
  const resetId = () => {
    const newId = uuidv4();
    const newName = generateAnonymousName();
    
    localStorage.setItem('voodo_anonymous_id', newId);
    localStorage.setItem('voodo_anon_user_id', newId);
    localStorage.setItem('voodo_anonymous_name', newName);
    
    setAnonymousId(newId);
    setAnonymousName(newName);
  };
  
  return { anonymousId, anonymousName, resetId };
};

export default useAnonymousId;
