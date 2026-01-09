import React, { useState } from 'react';
import { useGame } from '../store/gameStore';
import { LEAGUES } from '../utils/constants';
import type { League } from '../types';

const LeagueInfo: React.FC = () => {
  const { state } = useGame();
  const [showLeagueModal, setShowLeagueModal] = useState(false);

  const currentLeague = LEAGUES[state.league];
  const leagueOrder: League[] = ['bronze', 'silver', 'gold', 'diamond', 'obsidian', 'legendary'];
  const currentLeagueIndex = leagueOrder.indexOf(state.league);
  const nextLeague = currentLeagueIndex < leagueOrder.length - 1 ? LEAGUES[leagueOrder[currentLeagueIndex + 1]] : null;

  const progressToNextLeague = nextLeague
    ? Math.min(((state.weeklyXP - currentLeague.minXP) / (nextLeague.minXP - currentLeague.minXP)) * 100, 100)
    : 100;

  return (
    <>
      {/* League Card */}
      <div
        className="card mb-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
        onClick={() => setShowLeagueModal(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="text-4xl badge-shimmer p-2 rounded-xl"
              style={{ backgroundColor: `${currentLeague.color}20` }}
            >
              {currentLeague.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400">現在のリーグ</p>
              <p className="font-bold text-lg" style={{ color: currentLeague.color }}>
                {currentLeague.name}リーグ
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">週間XP</p>
            <p className="font-bold text-duo-gold text-lg">{state.weeklyXP}</p>
          </div>
        </div>

        {/* Progress to next league */}
        {nextLeague && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{currentLeague.name}</span>
              <span>{nextLeague.name}まで {nextLeague.minXP - state.weeklyXP} XP</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progressToNextLeague}%`,
                  background: `linear-gradient(to right, ${currentLeague.color}, ${nextLeague.color})`,
                }}
              />
            </div>
          </div>
        )}

        {/* Weekly gem bonus */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-gray-400">週末報酬:</span>
          <span className="text-duo-blue font-bold">{currentLeague.gemBonus} 💎</span>
        </div>
      </div>

      {/* League Modal */}
      {showLeagueModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-duo-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">リーグ一覧</h2>
              <button
                onClick={() => setShowLeagueModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {leagueOrder.map((leagueKey, index) => {
                const league = LEAGUES[leagueKey];
                const isCurrentLeague = state.league === leagueKey;
                const isUnlocked = index <= currentLeagueIndex;

                return (
                  <div
                    key={leagueKey}
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${isCurrentLeague
                        ? 'border-duo-green bg-duo-green/10 level-glow'
                        : isUnlocked
                        ? 'border-gray-600/50 bg-gray-700/30'
                        : 'border-gray-700/30 bg-gray-800/30 opacity-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl ${!isUnlocked ? 'grayscale' : ''}`}>
                        {league.icon}
                      </span>
                      <div className="flex-1">
                        <p
                          className="font-bold"
                          style={{ color: isUnlocked ? league.color : '#666' }}
                        >
                          {league.name}リーグ
                        </p>
                        <p className="text-xs text-gray-400">
                          必要XP: {league.minXP}+
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-duo-blue text-sm font-bold">
                          +{league.gemBonus} 💎
                        </p>
                        <p className="text-xs text-gray-500">週間報酬</p>
                      </div>
                      {isCurrentLeague && (
                        <div className="bg-duo-green text-white text-xs px-2 py-1 rounded-full font-bold">
                          現在
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeagueInfo;
