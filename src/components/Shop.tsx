import React, { useState } from 'react';
import { useGame } from '../store/gameStore';
import { SHOP_ITEMS } from '../utils/constants';
import useSound from '../hooks/useSound';

const Shop: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playSound } = useSound();
  const [showShop, setShowShop] = useState(false);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (state.gems < item.price) {
      playSound('error');
      return;
    }

    if (item.maxOwn && state.inventory.streakFreezes >= item.maxOwn && item.type === 'streak_freeze') {
      playSound('error');
      return;
    }

    dispatch({ type: 'BUY_ITEM', payload: item });
    playSound('success');
  };

  const handleUseDoubleXP = () => {
    if (state.inventory.doubleXPActive) return;
    dispatch({ type: 'USE_DOUBLE_XP' });
    playSound('levelUp');
  };

  if (!showShop) {
    return (
      <button
        onClick={() => setShowShop(true)}
        className="fixed bottom-4 right-4 bg-duo-purple hover:bg-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-30"
      >
        <span className="text-2xl">🛒</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-duo-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛒</span>
            <h2 className="text-xl font-bold">ショップ</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-xl gem-sparkle">💎</span>
              <span className="font-bold text-duo-blue">{state.gems}</span>
            </div>
            <button
              onClick={() => setShowShop(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="mb-6 p-4 bg-gray-700/30 rounded-xl">
          <h3 className="font-bold mb-3">所持アイテム</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧊</span>
              <span className="text-sm">フリーズ: {state.inventory.streakFreezes}</span>
            </div>
            {state.inventory.doubleXPActive && (
              <div className="flex items-center gap-2 text-duo-gold animate-pulse">
                <span className="text-xl">⚡</span>
                <span className="text-sm">2倍XP発動中!</span>
              </div>
            )}
          </div>
        </div>

        {/* Shop Items */}
        <div className="space-y-3">
          {SHOP_ITEMS.map((item) => {
            const canBuy = state.gems >= item.price;
            const isMaxed = item.maxOwn && item.type === 'streak_freeze' && state.inventory.streakFreezes >= item.maxOwn;

            return (
              <div
                key={item.id}
                className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${canBuy && !isMaxed
                    ? 'bg-gray-700/30 border-gray-600/50 hover:border-duo-purple/50'
                    : 'bg-gray-800/30 border-gray-700/30 opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                    {item.maxOwn && (
                      <p className="text-xs text-gray-500">
                        最大所持: {item.maxOwn}個
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canBuy || !!isMaxed}
                      className={`
                        px-4 py-2 rounded-xl font-bold text-sm transition-all
                        ${canBuy && !isMaxed
                          ? 'bg-duo-purple hover:bg-purple-600 text-white hover:scale-105'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className="flex items-center gap-1">
                        💎 {item.price}
                      </span>
                    </button>
                    {isMaxed && (
                      <p className="text-xs text-gray-500 mt-1">最大所持数</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Use Double XP Button */}
        {state.inventory.streakFreezes > 0 || !state.inventory.doubleXPActive ? (
          <div className="mt-6 space-y-2">
            {!state.inventory.doubleXPActive && (
              <button
                onClick={handleUseDoubleXP}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>ダブルXPを発動する</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Shop;
