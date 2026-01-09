import React, { useState } from 'react';
import { useGame } from '../store/gameStore';
import type { Priority } from '../types';
import { PRIORITY_XP, PRIORITY_GEMS, PRIORITY_COLORS, PRIORITY_LABELS } from '../utils/constants';
import useSound from '../hooks/useSound';

const TodoInput: React.FC = () => {
  const { dispatch } = useGame();
  const { playSound } = useSound();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: 'ADD_TODO',
      payload: {
        title: title.trim(),
        priority,
        completed: false,
      },
    });

    playSound('click');
    setTitle('');
    setIsExpanded(false);
  };

  const priorities: Priority[] = ['easy', 'medium', 'hard', 'epic'];

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        {/* Main input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="新しいクエストを追加..."
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-duo-green focus:ring-2 focus:ring-duo-green/20 transition-all"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="hidden sm:inline">追加</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>

        {/* Priority selector (expanded) */}
        {isExpanded && (
          <div className="mt-4 animate-slide-up">
            <label className="text-sm text-gray-400 mb-2 block">難易度を選択 (報酬が変わります)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPriority(p);
                    playSound('click');
                  }}
                  className={`
                    p-3 rounded-xl border-2 transition-all duration-200
                    ${priority === p
                      ? 'scale-105 shadow-lg'
                      : 'opacity-60 hover:opacity-100'
                    }
                  `}
                  style={{
                    borderColor: priority === p ? PRIORITY_COLORS[p] : 'transparent',
                    backgroundColor: priority === p ? `${PRIORITY_COLORS[p]}20` : 'rgba(75, 75, 75, 0.3)',
                  }}
                >
                  <div className="font-bold" style={{ color: PRIORITY_COLORS[p] }}>
                    {PRIORITY_LABELS[p]}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="text-duo-gold">+{PRIORITY_XP[p]} XP</span>
                    {' · '}
                    <span className="text-duo-blue">+{PRIORITY_GEMS[p]} 💎</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected priority info */}
            <div
              className="mt-3 p-3 rounded-xl text-center"
              style={{ backgroundColor: `${PRIORITY_COLORS[priority]}15` }}
            >
              <span style={{ color: PRIORITY_COLORS[priority] }} className="font-bold">
                {PRIORITY_LABELS[priority]}クエスト
              </span>
              <span className="text-gray-400"> - 完了で </span>
              <span className="text-duo-gold font-bold">{PRIORITY_XP[priority]} XP</span>
              <span className="text-gray-400"> と </span>
              <span className="text-duo-blue font-bold">{PRIORITY_GEMS[priority]} ジェム</span>
              <span className="text-gray-400"> 獲得!</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoInput;
