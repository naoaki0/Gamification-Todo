import React, { useState } from 'react';
import { useGame } from '../store/gameStore';
import TodoItem from './TodoItem';

type FilterType = 'all' | 'active' | 'completed';

const TodoList: React.FC = () => {
  const { state } = useGame();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = state.todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodos = state.todos.filter(t => !t.completed);
  const completedTodos = state.todos.filter(t => t.completed);

  const filters: { type: FilterType; label: string; count: number }[] = [
    { type: 'all', label: 'すべて', count: state.todos.length },
    { type: 'active', label: 'アクティブ', count: activeTodos.length },
    { type: 'completed', label: '完了', count: completedTodos.length },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.type}
            onClick={() => setFilter(f.type)}
            className={`
              px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap
              transition-all duration-200
              ${filter === f.type
                ? 'bg-duo-green text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            {f.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              filter === f.type ? 'bg-white/20' : 'bg-gray-600'
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {filter === 'completed' ? '🏆' : '📝'}
            </div>
            <p className="text-gray-400 text-lg">
              {filter === 'completed'
                ? 'まだ完了したクエストはありません'
                : filter === 'active'
                ? 'すべてのクエストを完了しました!'
                : '新しいクエストを追加しよう!'}
            </p>
            {filter === 'active' && state.todos.length > 0 && (
              <p className="text-duo-green font-bold mt-2">素晴らしい!</p>
            )}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>

      {/* Stats summary */}
      {state.todos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              今日の進捗: <span className="text-white font-bold">{completedTodos.length}</span> / {state.todos.length} クエスト
            </span>
            <span className="text-duo-gold font-bold">
              +{state.todayXPEarned} XP
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-duo-green to-duo-blue transition-all duration-500"
              style={{ width: `${(completedTodos.length / state.todos.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
