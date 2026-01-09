import React, { useState, useEffect } from 'react';
import { useGame } from '../store/gameStore';
import { MASCOT_MESSAGES } from '../utils/constants';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'sad' | 'idle' | 'celebration';
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({ mood = 'idle', message }) => {
  const { state } = useGame();
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine mood based on game state
  const getMood = () => {
    if (mood !== 'idle') return mood;
    if (state.currentStreak >= 7) return 'excited';
    if (state.hearts === 0) return 'sad';
    if (state.currentCombo >= 3) return 'celebration';
    return 'idle';
  };

  const actualMood = getMood();

  // Mascot face based on mood
  const getMascotFace = () => {
    switch (actualMood) {
      case 'happy':
        return '😊';
      case 'excited':
        return '🤩';
      case 'sad':
        return '😢';
      case 'celebration':
        return '🥳';
      default:
        return '🦉'; // Default owl mascot like Duo
    }
  };

  // Random message selection
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      return;
    }

    const getRandomMessage = () => {
      let messages = MASCOT_MESSAGES.idle;

      if (actualMood === 'celebration') {
        messages = MASCOT_MESSAGES.taskComplete;
      } else if (state.currentStreak >= 7) {
        messages = MASCOT_MESSAGES.encouragement;
      } else if (state.hearts <= 2) {
        messages = MASCOT_MESSAGES.streakWarning;
      }

      return messages[Math.floor(Math.random() * messages.length)];
    };

    setCurrentMessage(getRandomMessage());

    const interval = setInterval(() => {
      setCurrentMessage(getRandomMessage());
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [actualMood, message, state.currentStreak, state.hearts]);

  return (
    <div className="flex flex-col items-center">
      {/* Speech bubble */}
      <div
        className={`relative bg-white text-gray-800 px-4 py-2 rounded-2xl mb-2 max-w-[200px] text-center text-sm font-semibold
          ${isAnimating ? 'animate-pop' : ''}
        `}
      >
        {currentMessage}
        {/* Bubble tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
      </div>

      {/* Mascot */}
      <div
        className={`text-6xl mascot-float cursor-pointer select-none
          ${actualMood === 'celebration' ? 'reward-bounce' : ''}
          ${actualMood === 'sad' ? 'opacity-70' : ''}
        `}
        onClick={() => {
          setCurrentMessage(MASCOT_MESSAGES.encouragement[Math.floor(Math.random() * MASCOT_MESSAGES.encouragement.length)]);
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 500);
        }}
      >
        {getMascotFace()}
      </div>

      {/* Status indicators */}
      <div className="flex gap-2 mt-2">
        {state.currentStreak >= 7 && (
          <span className="text-xl fire-glow">🔥</span>
        )}
        {state.inventory.doubleXPActive && (
          <span className="text-xl animate-pulse">⚡</span>
        )}
        {state.currentCombo >= 3 && (
          <span className="text-xl animate-bounce">💪</span>
        )}
      </div>
    </div>
  );
};

export default Mascot;
