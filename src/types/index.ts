// Duolingo-style Gamification Types

export type Priority = 'easy' | 'medium' | 'hard' | 'epic';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  completedAt?: number;
  dueDate?: number;
  xpReward: number;
  gemReward: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  gemReward: number;
  completed: boolean;
  type: 'complete_tasks' | 'complete_hard' | 'perfect_day' | 'early_bird';
}

export type League = 'bronze' | 'silver' | 'gold' | 'diamond' | 'obsidian' | 'legendary';

export interface LeagueInfo {
  name: string;
  icon: string;
  color: string;
  minXP: number;
  gemBonus: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'tasks' | 'league' | 'special';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: 'streak_freeze' | 'double_xp' | 'heart_refill' | 'theme' | 'mascot_outfit';
  owned: number;
  maxOwn?: number;
}

export interface Inventory {
  streakFreezes: number;
  doubleXPActive: boolean;
  doubleXPEndTime?: number;
  themes: string[];
  mascotOutfits: string[];
}

export interface GameState {
  // User stats
  xp: number;
  totalXP: number;
  level: number;
  gems: number;
  hearts: number;
  maxHearts: number;

  // Streak system
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakFreezeUsed: boolean;

  // Combo system
  currentCombo: number;
  maxCombo: number;
  lastCompletedAt?: number;

  // League
  league: League;
  weeklyXP: number;
  weekStartDate: string;

  // Inventory
  inventory: Inventory;

  // Todos
  todos: Todo[];
  completedTodosCount: number;

  // Daily challenges
  dailyChallenges: DailyChallenge[];
  lastChallengeRefresh: string;

  // Achievements
  achievements: Achievement[];

  // Settings
  currentTheme: string;
  currentMascotOutfit: string;
  soundEnabled: boolean;

  // Session
  todayCompletedCount: number;
  todayXPEarned: number;
}

export interface XPGainEvent {
  amount: number;
  source: string;
  bonus?: number;
  x: number;
  y: number;
}

export type NotificationType = 'xp' | 'gem' | 'level_up' | 'achievement' | 'streak' | 'combo' | 'league' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
}

// Action types
export type GameAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt' | 'xpReward' | 'gemReward'> }
  | { type: 'COMPLETE_TODO'; payload: { id: string; x: number; y: number } }
  | { type: 'UNCOMPLETE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'ADD_XP'; payload: { amount: number; source: string } }
  | { type: 'ADD_GEMS'; payload: number }
  | { type: 'LOSE_HEART'; payload?: undefined }
  | { type: 'REFILL_HEARTS'; payload?: undefined }
  | { type: 'USE_STREAK_FREEZE'; payload?: undefined }
  | { type: 'BUY_ITEM'; payload: ShopItem }
  | { type: 'USE_DOUBLE_XP'; payload?: undefined }
  | { type: 'CHECK_STREAK'; payload?: undefined }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_DAILY_CHALLENGE'; payload: { id: string; increment: number } }
  | { type: 'REFRESH_DAILY_CHALLENGES'; payload?: undefined }
  | { type: 'CHECK_LEAGUE_PROMOTION'; payload?: undefined }
  | { type: 'TOGGLE_SOUND'; payload?: undefined }
  | { type: 'RESET_COMBO'; payload?: undefined }
  | { type: 'LOAD_STATE'; payload: Partial<GameState> };
