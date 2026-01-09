import React, { useState } from 'react';
import { useGame } from '../store/gameStore';
import type { Achievement } from '../types';

const Achievements: React.FC = () => {
  const { state } = useGame();
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const unlockedCount = state.achievements.filter(a => a.unlocked).length;
  const totalCount = state.achievements.length;

  const categories = [
    { id: 'streak', name: 'ストリーク', icon: '🔥' },
    { id: 'xp', name: 'XP', icon: '⭐' },
    { id: 'tasks', name: 'タスク', icon: '📝' },
    { id: 'league', name: 'リーグ', icon: '🏆' },
    { id: 'special', name: 'スペシャル', icon: '✨' },
  ];

  const filteredAchievements = selectedCategory
    ? state.achievements.filter(a => a.category === selectedCategory)
    : state.achievements;

  const getProgressPercentage = (achievement: Achievement) => {
    if (achievement.unlocked) return 100;

    switch (achievement.category) {
      case 'streak':
        return Math.min((state.currentStreak / achievement.requirement) * 100, 100);
      case 'xp':
        return Math.min((state.totalXP / achievement.requirement) * 100, 100);
      case 'tasks':
        return Math.min((state.completedTodosCount / achievement.requirement) * 100, 100);
      default:
        return (achievement.progress / achievement.requirement) * 100;
    }
  };

  if (!showAchievements) {
    return (
      <button
        onClick={() => setShowAchievements(true)}
        className="fixed bottom-4 left-4 bg-duo-gold hover:bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-30"
      >
        <span className="text-2xl">🏆</span>
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-duo-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unlockedCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-duo-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="text-xl font-bold">アチーブメント</h2>
              <p className="text-sm text-gray-400">{unlockedCount} / {totalCount} 解除済み</p>
            </div>
          </div>
          <button
            onClick={() => setShowAchievements(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-duo-gold to-duo-orange transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              !selectedCategory ? 'bg-duo-green text-white' : 'bg-gray-700/50 text-gray-400'
            }`}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === cat.id ? 'bg-duo-green text-white' : 'bg-gray-700/50 text-gray-400'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Achievement list */}
        <div className="space-y-3">
          {filteredAchievements.map((achievement) => {
            const progress = getProgressPercentage(achievement);

            return (
              <div
                key={achievement.id}
                className={`
                  p-4 rounded-xl border transition-all duration-300
                  ${achievement.unlocked
                    ? 'bg-gradient-to-r from-duo-gold/10 to-duo-orange/10 border-duo-gold/30'
                    : 'bg-gray-700/30 border-gray-600/30'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-3xl ${
                      achievement.unlocked ? '' : 'grayscale opacity-50'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${achievement.unlocked ? 'text-duo-gold' : 'text-white'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-duo-blue transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.floor(progress)}% 完了
                        </p>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-duo-green">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
