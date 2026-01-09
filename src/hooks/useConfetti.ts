import { useCallback } from 'react';

interface ConfettiOptions {
  count?: number;
  spread?: number;
  startY?: number;
}

export const useConfetti = () => {
  const createConfetti = useCallback((options: ConfettiOptions = {}) => {
    const { count = 50, spread = 100, startY = 50 } = options;

    const colors = ['#58CC02', '#1CB0F6', '#CE82FF', '#FF9600', '#FFC800', '#FF4B4B'];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${50 + (Math.random() - 0.5) * spread}%`;
      confetti.style.top = `${startY}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

      // Random shape
      const shapes = ['circle', 'square', 'rectangle'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
      } else if (shape === 'rectangle') {
        confetti.style.width = '6px';
        confetti.style.height = '14px';
      }

      document.body.appendChild(confetti);

      // Remove after animation
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }
  }, []);

  const createXPParticles = useCallback((x: number, y: number, amount: number) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.color = '#FFC800';
    particle.style.fontWeight = 'bold';
    particle.style.fontSize = '18px';
    particle.style.zIndex = '9999';
    particle.textContent = `+${amount} XP`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }, []);

  const createGemParticles = useCallback((x: number, y: number, amount: number) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = '20px';
    particle.style.zIndex = '9999';
    particle.textContent = `+${amount} 💎`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }, []);

  return { createConfetti, createXPParticles, createGemParticles };
};

export default useConfetti;
