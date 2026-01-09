/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Duolingo-inspired colors
        'duo-green': '#58CC02',
        'duo-green-dark': '#46A302',
        'duo-blue': '#1CB0F6',
        'duo-blue-dark': '#1899D6',
        'duo-purple': '#CE82FF',
        'duo-red': '#FF4B4B',
        'duo-orange': '#FF9600',
        'duo-gold': '#FFC800',
        'duo-gray': '#4B4B4B',
        'duo-light': '#E5E5E5',
        'duo-bg': '#131F24',
        'duo-card': '#1A2C32',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 0.5s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'confetti': 'confetti 1s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'xp-gain': 'xpGain 0.5s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(88, 204, 2, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(88, 204, 2, 0.8)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        xpGain: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-30px) scale(1.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
