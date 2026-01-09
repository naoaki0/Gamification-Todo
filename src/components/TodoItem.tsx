import React, { useState } from 'react';
import type { Todo } from '../types';
import { useGame } from '../store/gameStore';
import { PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_XP, PRIORITY_GEMS } from '../utils/constants';
import useSound from '../hooks/useSound';
import useConfetti from '../hooks/useConfetti';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { dispatch, state } = useGame();
  const { playSound } = useSound();
  const { createConfetti, createXPParticles, createGemParticles } = useConfetti();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleComplete = (e: React.MouseEvent) => {
    if (todo.completed || isCompleting) return;

    setIsCompleting(true);
    playSound('success');

    // Get position for particles
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // Create particles
    createXPParticles(x, y, todo.xpReward);
    if (todo.gemReward > 0) {
      setTimeout(() => createGemParticles(x + 30, y, todo.gemReward), 200);
    }

    // Check for special events
    const willLevelUp = (state.totalXP + todo.xpReward) >= (state.level * 100);
    if (willLevelUp) {
      setTimeout(() => {
        createConfetti({ count: 100 });
        playSound('levelUp');
      }, 300);
    }

    // Complete after animation
    setTimeout(() => {
      dispatch({
        type: 'COMPLETE_TODO',
        payload: { id: todo.id, x, y },
      });
      setIsCompleting(false);
    }, 100);
  };

  const handleUncomplete = () => {
    if (!todo.completed) return;
    playSound('click');
    dispatch({ type: 'UNCOMPLETE_TODO', payload: todo.id });
  };

  const handleDelete = () => {
    playSound('click');
    dispatch({ type: 'DELETE_TODO', payload: todo.id });
  };

  return (
    <div
      className={`
        group relative card mb-3 transition-all duration-300
        ${todo.completed ? 'opacity-60' : 'hover:scale-[1.02]'}
        ${isCompleting ? 'reward-bounce' : ''}
      `}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      style={{
        borderLeft: `4px solid ${PRIORITY_COLORS[todo.priority]}`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={todo.completed ? handleUncomplete : handleComplete}
          className={`
            w-7 h-7 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 flex-shrink-0
            ${todo.completed
              ? 'bg-duo-green border-duo-green'
              : `border-gray-500 hover:border-[${PRIORITY_COLORS[todo.priority]}] hover:scale-110`
            }
          `}
          style={{
            borderColor: todo.completed ? '#58CC02' : PRIORITY_COLORS[todo.priority],
          }}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {todo.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${PRIORITY_COLORS[todo.priority]}20`,
                color: PRIORITY_COLORS[todo.priority],
              }}
            >
              {PRIORITY_LABELS[todo.priority]}
            </span>
            {!todo.completed && (
              <>
                <span className="text-xs text-duo-gold">+{PRIORITY_XP[todo.priority]} XP</span>
                <span className="text-xs text-duo-blue">+{PRIORITY_GEMS[todo.priority]} 💎</span>
              </>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={`
            p-2 rounded-lg text-gray-400 hover:text-duo-red hover:bg-duo-red/10
            transition-all duration-200
            ${showDelete ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Completion celebration overlay */}
      {isCompleting && (
        <div className="absolute inset-0 bg-duo-green/20 rounded-2xl flex items-center justify-center">
          <span className="text-4xl animate-pop">✨</span>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
