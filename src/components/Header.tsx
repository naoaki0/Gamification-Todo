import React from 'react';
import { useGame } from '../store/gameStore';
import { LEAGUES, XP_PER_LEVEL } from '../utils/constants';

const Header: React.FC = () => {
  const { state } = useGame();
  const league = LEAGUES[state.league];
  const xpProgress = (state.xp / XP_PER_LEVEL) * 100;

  return (
    <header className="bg-duo-card border-b border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top row - Logo and main stats */}
        <div className="flex items-center justify-between mb-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            <h1 className="text-xl font-black text-duo-green hidden sm:block">Quest Todo</h1>
          </div>

          {/* Main stats */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Streak */}
            <div className={`flex items-center gap-1 ${state.currentStreak > 0 ? 'fire-glow' : ''}`}>
              <span className="text-2xl">{state.currentStreak > 0 ? '🔥' : '❄️'}</span>
              <span className="font-bold text-duo-orange">{state.currentStreak}</span>
            </div>

            {/* Hearts */}
            <div className="flex items-center gap-1">
              <span className={`text-2xl ${state.hearts <= 2 ? 'heart-pulse' : ''}`}>
                {state.hearts > 0 ? '❤️' : '🖤'}
              </span>
              <span className={`font-bold ${state.hearts <= 2 ? 'text-duo-red' : 'text-red-400'}`}>
                {state.hearts}
              </span>
            </div>

            {/* Gems */}
            <div className="flex items-center gap-1">
              <span className="text-2xl gem-sparkle">💎</span>
              <span className="font-bold text-duo-blue">{state.gems}</span>
            </div>

            {/* League badge */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg badge-shimmer"
              style={{ backgroundColor: `${league.color}20`, borderColor: league.color }}
            >
              <span className="text-xl">{league.icon}</span>
              <span className="font-bold text-sm hidden sm:inline" style={{ color: league.color }}>
                {league.name}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row - Level and XP */}
        <div className="flex items-center gap-3">
          {/* Level badge */}
          <div className="flex items-center gap-2 bg-duo-green/20 px-3 py-1 rounded-full">
            <span className="text-lg">⭐</span>
            <span className="font-bold text-duo-green">Lv.{state.level}</span>
          </div>

          {/* XP Progress bar */}
          <div className="flex-1">
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{state.xp} XP</span>
              <span>{XP_PER_LEVEL} XP</span>
            </div>
          </div>

          {/* Combo indicator */}
          {state.currentCombo > 1 && (
            <div className="flex items-center gap-1 bg-duo-orange/20 px-3 py-1 rounded-full combo-pulse">
              <span className="text-lg">⚡</span>
              <span className="font-bold text-duo-orange">{state.currentCombo}x</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
