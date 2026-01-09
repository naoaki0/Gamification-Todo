import React from 'react';
import { useGame } from '../store/gameStore';

const DailyChallenges: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-lg font-bold">デイリーチャレンジ</h2>
      </div>

      <div className="space-y-3">
        {state.dailyChallenges.map((challenge) => {
          const progress = (challenge.current / challenge.target) * 100;

          return (
            <div
              key={challenge.id}
              className={`
                p-3 rounded-xl border transition-all duration-300
                ${challenge.completed
                  ? 'bg-duo-green/10 border-duo-green/30'
                  : 'bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {challenge.completed ? (
                    <span className="text-xl">✅</span>
                  ) : (
                    <span className="text-xl">⭕</span>
                  )}
                  <div>
                    <p className={`font-semibold ${challenge.completed ? 'text-duo-green' : 'text-white'}`}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-gray-400">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-duo-gold text-sm font-bold">+{challenge.xpReward} XP</p>
                  <p className="text-duo-blue text-xs">+{challenge.gemReward} 💎</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    challenge.completed
                      ? 'bg-duo-green'
                      : 'bg-gradient-to-r from-duo-blue to-duo-purple'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {challenge.current} / {challenge.target}
              </p>
            </div>
          );
        })}
      </div>

      {/* All completed bonus */}
      {state.dailyChallenges.every(c => c.completed) && (
        <div className="mt-4 p-3 bg-gradient-to-r from-duo-gold/20 to-duo-orange/20 rounded-xl text-center">
          <span className="text-2xl">🏆</span>
          <p className="font-bold text-duo-gold">すべてのチャレンジ完了!</p>
          <p className="text-sm text-gray-400">明日も頑張ろう!</p>
        </div>
      )}
    </div>
  );
};

export default DailyChallenges;
