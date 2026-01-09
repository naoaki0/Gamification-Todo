import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './store/gameStore';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import Mascot from './components/Mascot';
import DailyChallenges from './components/DailyChallenges';
import StreakInfo from './components/StreakInfo';
import LeagueInfo from './components/LeagueInfo';
import Shop from './components/Shop';
import Achievements from './components/Achievements';
import NotificationToast from './components/NotificationToast';
import useSound from './hooks/useSound';
import useConfetti from './hooks/useConfetti';

const AppContent: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playSound } = useSound();
  const { createConfetti } = useConfetti();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'stats'>('tasks');

  // Welcome animation on first load
  useEffect(() => {
    const hasVisited = localStorage.getItem('quest-todo-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('quest-todo-visited', 'true');
    }
  }, []);

  // Check combo timeout
  useEffect(() => {
    if (state.currentCombo > 0 && state.lastCompletedAt) {
      const timeout = setTimeout(() => {
        if (Date.now() - state.lastCompletedAt! > 30000) {
          dispatch({ type: 'RESET_COMBO' });
        }
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, [state.currentCombo, state.lastCompletedAt, dispatch]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    playSound('levelUp');
    createConfetti({ count: 80 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-duo-bg to-duo-card">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Mascot and Welcome */}
        <div className="flex justify-center mb-6">
          <Mascot />
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`
              flex-1 py-3 rounded-xl font-bold text-center transition-all duration-200
              ${activeTab === 'tasks'
                ? 'bg-duo-green text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            <span className="mr-2">📝</span>
            クエスト
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`
              flex-1 py-3 rounded-xl font-bold text-center transition-all duration-200
              ${activeTab === 'stats'
                ? 'bg-duo-green text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            <span className="mr-2">📊</span>
            ステータス
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="animate-slide-up">
            <TodoInput />
            <TodoList />
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="animate-slide-up space-y-6">
            <StreakInfo />
            <LeagueInfo />
            <DailyChallenges />

            {/* Stats summary */}
            <div className="card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">📈</span>
                統計情報
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-duo-gold">{state.totalXP}</p>
                  <p className="text-sm text-gray-400">累計XP</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-duo-green">{state.completedTodosCount}</p>
                  <p className="text-sm text-gray-400">完了タスク</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-duo-orange">{state.longestStreak}</p>
                  <p className="text-sm text-gray-400">最長ストリーク</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-duo-purple">{state.maxCombo}</p>
                  <p className="text-sm text-gray-400">最大コンボ</p>
                </div>
              </div>
            </div>

            {/* Sound toggle */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{state.soundEnabled ? '🔊' : '🔇'}</span>
                  <span className="font-semibold">サウンド</span>
                </div>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                  className={`
                    w-14 h-8 rounded-full transition-all duration-200 relative
                    ${state.soundEnabled ? 'bg-duo-green' : 'bg-gray-600'}
                  `}
                >
                  <div
                    className={`
                      absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-200
                      ${state.soundEnabled ? 'left-7' : 'left-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating buttons */}
      <Shop />
      <Achievements />

      {/* Notifications */}
      <NotificationToast />

      {/* Welcome modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-duo-card rounded-2xl p-8 max-w-md w-full text-center animate-pop">
            <div className="text-6xl mb-4 mascot-float">🦉</div>
            <h1 className="text-2xl font-black text-duo-green mb-2">
              Quest Todo へようこそ!
            </h1>
            <p className="text-gray-400 mb-6">
              タスクを完了してXPを獲得し、<br />
              レベルアップしてリーグを制覇しよう!
            </p>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <span className="text-2xl">✅</span>
                <span>タスクを完了して<span className="text-duo-gold font-bold">XP</span>を獲得</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <span className="text-2xl">🔥</span>
                <span>毎日続けて<span className="text-duo-orange font-bold">ストリーク</span>を伸ばそう</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <span className="text-2xl">💎</span>
                <span><span className="text-duo-blue font-bold">ジェム</span>でアイテムを購入</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <span className="text-2xl">🏆</span>
                <span><span className="text-duo-purple font-bold">アチーブメント</span>を解除しよう</span>
              </div>
            </div>

            <button
              onClick={handleWelcomeClose}
              className="btn-primary w-full text-lg"
            >
              冒険を始める!
            </button>
          </div>
        </div>
      )}

      {/* Double XP indicator */}
      {state.inventory.doubleXPActive && state.inventory.doubleXPEndTime && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-duo-gold text-black px-4 py-2 rounded-full font-bold animate-pulse z-30">
          ⚡ 2倍XP発動中! ⚡
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
