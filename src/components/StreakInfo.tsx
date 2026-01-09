import React from 'react';
import { useGame } from '../store/gameStore';

const StreakInfo: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleUseFreeze = () => {
    if (state.inventory.streakFreezes <= 0) return;
    dispatch({ type: 'USE_STREAK_FREEZE' });
  };

  // Generate streak calendar for last 7 days
  const getStreakDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const isToday = i === 0;
      const isActive = state.lastActiveDate === dateStr || (i > 0 && state.currentStreak > i);
      const dayName = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

      days.push({
        dateStr,
        dayName,
        isToday,
        isActive,
      });
    }

    return days;
  };

  const streakDays = getStreakDays();

  return (
    <div className="card mb-6">
      {/* Streak header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-4xl ${state.currentStreak > 0 ? 'fire-glow' : ''}`}>
            {state.currentStreak > 0 ? '🔥' : '❄️'}
          </div>
          <div>
            <p className="text-sm text-gray-400">連続ストリーク</p>
            <p className="font-bold text-2xl text-duo-orange">
              {state.currentStreak}日
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">最長記録</p>
          <p className="font-bold text-duo-gold">{state.longestStreak}日</p>
        </div>
      </div>

      {/* Week calendar */}
      <div className="flex justify-between mb-4">
        {streakDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{day.dayName}</span>
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm
                transition-all duration-300
                ${day.isActive
                  ? 'bg-duo-orange text-white'
                  : day.isToday
                  ? 'bg-gray-600 border-2 border-duo-orange'
                  : 'bg-gray-700'
                }
              `}
            >
              {day.isActive ? '🔥' : day.isToday ? '○' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Streak freeze */}
      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧊</span>
          <div>
            <p className="text-sm font-semibold">ストリークフリーズ</p>
            <p className="text-xs text-gray-400">所持数: {state.inventory.streakFreezes}</p>
          </div>
        </div>
        <button
          onClick={handleUseFreeze}
          disabled={state.inventory.streakFreezes <= 0 || state.streakFreezeUsed}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-bold transition-all
            ${state.inventory.streakFreezes > 0 && !state.streakFreezeUsed
              ? 'bg-duo-blue hover:bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {state.streakFreezeUsed ? '使用済み' : '使用する'}
        </button>
      </div>

      {/* Streak motivation */}
      {state.currentStreak > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            {state.currentStreak >= 30 && '🏆 伝説の継続者!'}
            {state.currentStreak >= 7 && state.currentStreak < 30 && '⚔️ 素晴らしい継続力!'}
            {state.currentStreak >= 3 && state.currentStreak < 7 && '🔥 いい調子!'}
            {state.currentStreak < 3 && '💪 継続は力なり!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StreakInfo;
