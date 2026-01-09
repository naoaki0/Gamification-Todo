import { useCallback } from 'react';
import { useGame } from '../store/gameStore';

// Sound URLs (using Web Audio API for simple sounds)
const createOscillatorSound = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const useSound = () => {
  const { state } = useGame();

  const playSound = useCallback((type: 'success' | 'xp' | 'levelUp' | 'combo' | 'error' | 'click' | 'achievement') => {
    if (!state.soundEnabled) return;

    try {
      switch (type) {
        case 'success':
          // Happy major chord arpeggio
          createOscillatorSound(523.25, 0.15, 'sine', 0.2); // C5
          setTimeout(() => createOscillatorSound(659.25, 0.15, 'sine', 0.2), 50); // E5
          setTimeout(() => createOscillatorSound(783.99, 0.2, 'sine', 0.2), 100); // G5
          break;

        case 'xp':
          // Quick ascending tone
          createOscillatorSound(880, 0.1, 'sine', 0.15);
          setTimeout(() => createOscillatorSound(1108.73, 0.15, 'sine', 0.15), 50);
          break;

        case 'levelUp':
          // Fanfare-like sound
          createOscillatorSound(523.25, 0.15, 'square', 0.15);
          setTimeout(() => createOscillatorSound(659.25, 0.15, 'square', 0.15), 100);
          setTimeout(() => createOscillatorSound(783.99, 0.15, 'square', 0.15), 200);
          setTimeout(() => createOscillatorSound(1046.5, 0.3, 'square', 0.2), 300);
          break;

        case 'combo':
          // Escalating tones based on combo
          createOscillatorSound(440 * (1 + Math.random() * 0.5), 0.1, 'triangle', 0.2);
          break;

        case 'error':
          // Descending minor tone
          createOscillatorSound(330, 0.15, 'sawtooth', 0.1);
          setTimeout(() => createOscillatorSound(277.18, 0.2, 'sawtooth', 0.1), 100);
          break;

        case 'click':
          // Simple click
          createOscillatorSound(1000, 0.05, 'sine', 0.1);
          break;

        case 'achievement':
          // Triumphant fanfare
          const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
          notes.forEach((freq, i) => {
            setTimeout(() => createOscillatorSound(freq, 0.2, 'sine', 0.15), i * 80);
          });
          break;
      }
    } catch (e) {
      // Audio not supported
      console.log('Audio not supported');
    }
  }, [state.soundEnabled]);

  return { playSound };
};

export default useSound;
