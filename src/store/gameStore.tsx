import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction, Todo, League, Notification } from '../types';
import {
  PRIORITY_XP,
  PRIORITY_GEMS,
  XP_PER_LEVEL,
  COMBO_TIMEOUT_MS,
  MAX_COMBO_MULTIPLIER,
  LEAGUES,
  DEFAULT_ACHIEVEMENTS,
  generateDailyChallenges,
} from '../utils/constants';

const STORAGE_KEY = 'quest-todo-game-state';

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 9);

const getToday = () => new Date().toISOString().split('T')[0];

const getWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split('T')[0];
};

const calculateLevel = (totalXP: number) => Math.floor(totalXP / XP_PER_LEVEL) + 1;

const getXPForCurrentLevel = (totalXP: number) => totalXP % XP_PER_LEVEL;

const determineLeague = (weeklyXP: number): League => {
  if (weeklyXP >= LEAGUES.legendary.minXP) return 'legendary';
  if (weeklyXP >= LEAGUES.obsidian.minXP) return 'obsidian';
  if (weeklyXP >= LEAGUES.diamond.minXP) return 'diamond';
  if (weeklyXP >= LEAGUES.gold.minXP) return 'gold';
  if (weeklyXP >= LEAGUES.silver.minXP) return 'silver';
  return 'bronze';
};

// Initial state
const createInitialState = (): GameState => ({
  xp: 0,
  totalXP: 0,
  level: 1,
  gems: 50,
  hearts: 5,
  maxHearts: 5,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  streakFreezeUsed: false,
  currentCombo: 0,
  maxCombo: 0,
  lastCompletedAt: undefined,
  league: 'bronze',
  weeklyXP: 0,
  weekStartDate: getWeekStart(),
  inventory: {
    streakFreezes: 2,
    doubleXPActive: false,
    doubleXPEndTime: undefined,
    themes: ['default'],
    mascotOutfits: ['default'],
  },
  todos: [],
  completedTodosCount: 0,
  dailyChallenges: generateDailyChallenges(),
  lastChallengeRefresh: getToday(),
  achievements: DEFAULT_ACHIEVEMENTS,
  currentTheme: 'default',
  currentMascotOutfit: 'default',
  soundEnabled: true,
  todayCompletedCount: 0,
  todayXPEarned: 0,
});

// Notification queue (managed outside of reducer for side effects)
let notificationQueue: Notification[] = [];
let notificationListeners: ((notifications: Notification[]) => void)[] = [];

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const newNotification = { ...notification, id: generateId() };
  notificationQueue = [...notificationQueue, newNotification];
  notificationListeners.forEach(listener => listener(notificationQueue));

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notificationQueue = notificationQueue.filter(n => n.id !== newNotification.id);
    notificationListeners.forEach(listener => listener(notificationQueue));
  }, 3000);
};

export const subscribeToNotifications = (listener: (notifications: Notification[]) => void) => {
  notificationListeners.push(listener);
  return () => {
    notificationListeners = notificationListeners.filter(l => l !== listener);
  };
};

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_TODO': {
      const { title, priority, dueDate } = action.payload;
      const newTodo: Todo = {
        id: generateId(),
        title,
        completed: false,
        priority,
        createdAt: Date.now(),
        dueDate,
        xpReward: PRIORITY_XP[priority],
        gemReward: PRIORITY_GEMS[priority],
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }

    case 'COMPLETE_TODO': {
      const { id } = action.payload;
      const todoIndex = state.todos.findIndex(t => t.id === id);
      if (todoIndex === -1) return state;

      const todo = state.todos[todoIndex];
      if (todo.completed) return state;

      const now = Date.now();
      const today = getToday();

      // Check combo
      let newCombo = 1;
      if (state.lastCompletedAt && now - state.lastCompletedAt < COMBO_TIMEOUT_MS) {
        newCombo = Math.min(state.currentCombo + 1, MAX_COMBO_MULTIPLIER);
      }

      // Calculate XP with bonuses
      let xpGain = todo.xpReward;

      // Combo bonus
      if (newCombo > 1) {
        xpGain = Math.floor(xpGain * (1 + (newCombo - 1) * 0.2));
        addNotification({
          type: 'combo',
          title: `${newCombo}x コンボ!`,
          message: `XPボーナス +${Math.floor((newCombo - 1) * 20)}%`,
          icon: '🔥',
        });
      }

      // Double XP bonus
      if (state.inventory.doubleXPActive && state.inventory.doubleXPEndTime && now < state.inventory.doubleXPEndTime) {
        xpGain *= 2;
      }

      const newTotalXP = state.totalXP + xpGain;
      const newLevel = calculateLevel(newTotalXP);
      const newWeeklyXP = state.weeklyXP + xpGain;

      // Check level up
      if (newLevel > state.level) {
        addNotification({
          type: 'level_up',
          title: 'レベルアップ!',
          message: `レベル ${newLevel} に到達!`,
          icon: '🎉',
        });
      }

      // Update streak
      let newStreak = state.currentStreak;
      let newLongestStreak = state.longestStreak;

      if (state.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActiveDate === yesterdayStr || state.lastActiveDate === '') {
          newStreak = state.currentStreak + 1;
          if (newStreak > state.longestStreak) {
            newLongestStreak = newStreak;
          }

          if (newStreak > 0 && newStreak % 7 === 0) {
            addNotification({
              type: 'streak',
              title: `${newStreak}日連続!`,
              message: '素晴らしい継続力!',
              icon: '🔥',
            });
          }
        }
      }

      // Update todos
      const updatedTodos = [...state.todos];
      updatedTodos[todoIndex] = {
        ...todo,
        completed: true,
        completedAt: now,
      };

      // XP notification
      addNotification({
        type: 'xp',
        title: `+${xpGain} XP`,
        message: todo.title,
        icon: '⭐',
      });

      // Gem notification
      if (todo.gemReward > 0) {
        addNotification({
          type: 'gem',
          title: `+${todo.gemReward} ジェム`,
          message: '',
          icon: '💎',
        });
      }

      const newTodayCompleted = state.lastActiveDate === today
        ? state.todayCompletedCount + 1
        : 1;

      return {
        ...state,
        todos: updatedTodos,
        xp: getXPForCurrentLevel(newTotalXP),
        totalXP: newTotalXP,
        level: newLevel,
        gems: state.gems + todo.gemReward,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today,
        currentCombo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        lastCompletedAt: now,
        weeklyXP: newWeeklyXP,
        completedTodosCount: state.completedTodosCount + 1,
        todayCompletedCount: newTodayCompleted,
        todayXPEarned: state.lastActiveDate === today
          ? state.todayXPEarned + xpGain
          : xpGain,
      };
    }

    case 'UNCOMPLETE_TODO': {
      const id = action.payload;
      const todoIndex = state.todos.findIndex(t => t.id === id);
      if (todoIndex === -1) return state;

      const todo = state.todos[todoIndex];
      if (!todo.completed) return state;

      const updatedTodos = [...state.todos];
      updatedTodos[todoIndex] = {
        ...todo,
        completed: false,
        completedAt: undefined,
      };

      return {
        ...state,
        todos: updatedTodos,
      };
    }

    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload),
      };
    }

    case 'LOSE_HEART': {
      const newHearts = Math.max(0, state.hearts - 1);

      if (newHearts === 0) {
        addNotification({
          type: 'warning',
          title: 'ハートがなくなった!',
          message: 'ショップで回復しよう',
          icon: '💔',
        });
      }

      return {
        ...state,
        hearts: newHearts,
      };
    }

    case 'REFILL_HEARTS': {
      return {
        ...state,
        hearts: state.maxHearts,
      };
    }

    case 'USE_STREAK_FREEZE': {
      if (state.inventory.streakFreezes <= 0) return state;

      addNotification({
        type: 'streak',
        title: 'ストリークフリーズ使用!',
        message: 'ストリークが保護されました',
        icon: '🧊',
      });

      return {
        ...state,
        inventory: {
          ...state.inventory,
          streakFreezes: state.inventory.streakFreezes - 1,
        },
        streakFreezeUsed: true,
      };
    }

    case 'BUY_ITEM': {
      const item = action.payload;
      if (state.gems < item.price) return state;

      let newInventory = { ...state.inventory };

      switch (item.type) {
        case 'streak_freeze':
          newInventory.streakFreezes += 1;
          break;
        case 'heart_refill':
          return {
            ...state,
            gems: state.gems - item.price,
            hearts: state.maxHearts,
          };
        case 'double_xp':
          // Will be activated separately
          break;
      }

      addNotification({
        type: 'gem',
        title: '購入完了!',
        message: item.name,
        icon: '🛒',
      });

      return {
        ...state,
        gems: state.gems - item.price,
        inventory: newInventory,
      };
    }

    case 'USE_DOUBLE_XP': {
      if (state.inventory.doubleXPActive) return state;

      addNotification({
        type: 'xp',
        title: 'ダブルXP発動!',
        message: '15分間XP2倍',
        icon: '⚡',
      });

      return {
        ...state,
        inventory: {
          ...state.inventory,
          doubleXPActive: true,
          doubleXPEndTime: Date.now() + 15 * 60 * 1000,
        },
      };
    }

    case 'CHECK_STREAK': {
      const today = getToday();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Check if streak is broken
      if (state.lastActiveDate && state.lastActiveDate !== today && state.lastActiveDate !== yesterdayStr) {
        // Streak broken (unless freeze was used)
        if (!state.streakFreezeUsed) {
          addNotification({
            type: 'warning',
            title: 'ストリーク終了',
            message: `${state.currentStreak}日の記録が途切れました`,
            icon: '💔',
          });

          return {
            ...state,
            currentStreak: 0,
            streakFreezeUsed: false,
          };
        }
      }

      // Check if week changed
      const currentWeekStart = getWeekStart();
      if (state.weekStartDate !== currentWeekStart) {
        // Award weekly gems based on league
        const leagueBonus = LEAGUES[state.league].gemBonus;

        addNotification({
          type: 'gem',
          title: '週間報酬!',
          message: `${LEAGUES[state.league].name}リーグ報酬: ${leagueBonus}ジェム`,
          icon: LEAGUES[state.league].icon,
        });

        return {
          ...state,
          gems: state.gems + leagueBonus,
          weeklyXP: 0,
          weekStartDate: currentWeekStart,
          streakFreezeUsed: false,
        };
      }

      // Refresh daily challenges if needed
      if (state.lastChallengeRefresh !== today) {
        return {
          ...state,
          dailyChallenges: generateDailyChallenges(),
          lastChallengeRefresh: today,
          todayCompletedCount: 0,
          todayXPEarned: 0,
          streakFreezeUsed: false,
        };
      }

      return state;
    }

    case 'CHECK_LEAGUE_PROMOTION': {
      const newLeague = determineLeague(state.weeklyXP);

      if (newLeague !== state.league) {
        const leagueOrder: League[] = ['bronze', 'silver', 'gold', 'diamond', 'obsidian', 'legendary'];
        const oldIndex = leagueOrder.indexOf(state.league);
        const newIndex = leagueOrder.indexOf(newLeague);

        if (newIndex > oldIndex) {
          addNotification({
            type: 'league',
            title: 'リーグ昇格!',
            message: `${LEAGUES[newLeague].name}リーグへようこそ!`,
            icon: LEAGUES[newLeague].icon,
          });
        }

        return {
          ...state,
          league: newLeague,
        };
      }

      return state;
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const achievementId = action.payload;
      const achievementIndex = state.achievements.findIndex(a => a.id === achievementId);

      if (achievementIndex === -1) return state;
      if (state.achievements[achievementIndex].unlocked) return state;

      const achievement = state.achievements[achievementIndex];

      addNotification({
        type: 'achievement',
        title: 'アチーブメント解除!',
        message: achievement.title,
        icon: achievement.icon,
      });

      const updatedAchievements = [...state.achievements];
      updatedAchievements[achievementIndex] = {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now(),
      };

      // Award gems for achievement
      const gemReward = 25;

      return {
        ...state,
        achievements: updatedAchievements,
        gems: state.gems + gemReward,
      };
    }

    case 'UPDATE_DAILY_CHALLENGE': {
      const { id, increment } = action.payload;
      const challengeIndex = state.dailyChallenges.findIndex(c => c.id === id);

      if (challengeIndex === -1) return state;

      const challenge = state.dailyChallenges[challengeIndex];
      if (challenge.completed) return state;

      const newCurrent = Math.min(challenge.current + increment, challenge.target);
      const isCompleted = newCurrent >= challenge.target;

      const updatedChallenges = [...state.dailyChallenges];
      updatedChallenges[challengeIndex] = {
        ...challenge,
        current: newCurrent,
        completed: isCompleted,
      };

      let newState = {
        ...state,
        dailyChallenges: updatedChallenges,
      };

      if (isCompleted) {
        addNotification({
          type: 'achievement',
          title: 'チャレンジ完了!',
          message: `${challenge.title} - +${challenge.xpReward}XP, +${challenge.gemReward}ジェム`,
          icon: '🎯',
        });

        const newTotalXP = state.totalXP + challenge.xpReward;

        newState = {
          ...newState,
          totalXP: newTotalXP,
          xp: getXPForCurrentLevel(newTotalXP),
          level: calculateLevel(newTotalXP),
          gems: state.gems + challenge.gemReward,
          weeklyXP: state.weeklyXP + challenge.xpReward,
        };
      }

      return newState;
    }

    case 'RESET_COMBO': {
      return {
        ...state,
        currentCombo: 0,
      };
    }

    case 'TOGGLE_SOUND': {
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      };
    }

    case 'LOAD_STATE': {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

// Provider
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    // Load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...createInitialState(), ...parsed };
      } catch {
        return createInitialState();
      }
    }
    return createInitialState();
  });

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Check streak and challenges on mount and periodically
  useEffect(() => {
    dispatch({ type: 'CHECK_STREAK' });
    dispatch({ type: 'CHECK_LEAGUE_PROMOTION' });

    const interval = setInterval(() => {
      dispatch({ type: 'CHECK_STREAK' });
      dispatch({ type: 'CHECK_LEAGUE_PROMOTION' });

      // Check if double XP expired
      if (state.inventory.doubleXPActive && state.inventory.doubleXPEndTime && Date.now() >= state.inventory.doubleXPEndTime) {
        dispatch({ type: 'LOAD_STATE', payload: {
          inventory: {
            ...state.inventory,
            doubleXPActive: false,
            doubleXPEndTime: undefined,
          }
        }});
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Check achievements
  useEffect(() => {
    // Streak achievements
    state.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      switch (achievement.category) {
        case 'streak':
          if (state.currentStreak >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;
        case 'xp':
          if (state.totalXP >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;
        case 'tasks':
          if (state.completedTodosCount >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;
        case 'special':
          if (achievement.id === 'combo_5' && state.maxCombo >= 5) {
            shouldUnlock = true;
          }
          if (achievement.id === 'perfect_day' && state.todayCompletedCount >= 10) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id });
      }
    });
  }, [state.currentStreak, state.totalXP, state.completedTodosCount, state.maxCombo, state.todayCompletedCount]);

  // Update daily challenges on task completion
  useEffect(() => {
    const completedToday = state.todos.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt).toISOString().split('T')[0];
      return completedDate === getToday();
    });

    const hardCompletedToday = completedToday.filter(t => t.priority === 'hard' || t.priority === 'epic');

    // Update challenges
    state.dailyChallenges.forEach(challenge => {
      if (challenge.completed) return;

      let newCurrent = 0;

      switch (challenge.type) {
        case 'complete_tasks':
        case 'perfect_day':
          newCurrent = completedToday.length;
          break;
        case 'complete_hard':
          newCurrent = hardCompletedToday.length;
          break;
      }

      if (newCurrent !== challenge.current) {
        dispatch({
          type: 'UPDATE_DAILY_CHALLENGE',
          payload: { id: challenge.id, increment: newCurrent - challenge.current },
        });
      }
    });
  }, [state.todos]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { addNotification };
