import type { LeagueInfo, Achievement, ShopItem, DailyChallenge } from '../types';

// XP and Level constants
export const XP_PER_LEVEL = 100;
export const COMBO_TIMEOUT_MS = 30000; // 30 seconds to maintain combo
export const MAX_COMBO_MULTIPLIER = 5;

// Priority XP rewards
export const PRIORITY_XP: Record<string, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
  epic: 50,
};

// Priority gem rewards
export const PRIORITY_GEMS: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 5,
  epic: 10,
};

// League definitions
export const LEAGUES: Record<string, LeagueInfo> = {
  bronze: {
    name: 'ブロンズ',
    icon: '🥉',
    color: '#CD7F32',
    minXP: 0,
    gemBonus: 5,
  },
  silver: {
    name: 'シルバー',
    icon: '🥈',
    color: '#C0C0C0',
    minXP: 200,
    gemBonus: 10,
  },
  gold: {
    name: 'ゴールド',
    icon: '🥇',
    color: '#FFD700',
    minXP: 500,
    gemBonus: 20,
  },
  diamond: {
    name: 'ダイヤモンド',
    icon: '💎',
    color: '#B9F2FF',
    minXP: 1000,
    gemBonus: 35,
  },
  obsidian: {
    name: 'オブシディアン',
    icon: '🖤',
    color: '#3D3D3D',
    minXP: 2000,
    gemBonus: 50,
  },
  legendary: {
    name: 'レジェンダリー',
    icon: '👑',
    color: '#FFD700',
    minXP: 5000,
    gemBonus: 100,
  },
};

// Shop items
export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak_freeze',
    name: 'ストリークフリーズ',
    description: '1日休んでもストリークを維持できます',
    icon: '🧊',
    price: 200,
    type: 'streak_freeze',
    owned: 0,
    maxOwn: 5,
  },
  {
    id: 'double_xp',
    name: 'ダブルXPブースト',
    description: '15分間、獲得XPが2倍になります',
    icon: '⚡',
    price: 300,
    type: 'double_xp',
    owned: 0,
    maxOwn: 3,
  },
  {
    id: 'heart_refill',
    name: 'ハート回復',
    description: 'ハートを全回復します',
    icon: '💖',
    price: 350,
    type: 'heart_refill',
    owned: 0,
  },
];

// Default achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_3',
    title: '炎の始まり',
    description: '3日連続でタスクを完了',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_7',
    title: '一週間の戦士',
    description: '7日連続でタスクを完了',
    icon: '⚔️',
    category: 'streak',
    requirement: 7,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_30',
    title: '伝説の継続者',
    description: '30日連続でタスクを完了',
    icon: '🏆',
    category: 'streak',
    requirement: 30,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_100',
    title: '不屈の精神',
    description: '100日連続でタスクを完了',
    icon: '💎',
    category: 'streak',
    requirement: 100,
    unlocked: false,
    progress: 0,
  },
  // XP achievements
  {
    id: 'xp_500',
    title: 'XPコレクター',
    description: '累計500XPを獲得',
    icon: '⭐',
    category: 'xp',
    requirement: 500,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'xp_2000',
    title: 'XPマスター',
    description: '累計2000XPを獲得',
    icon: '🌟',
    category: 'xp',
    requirement: 2000,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'xp_10000',
    title: 'XPレジェンド',
    description: '累計10000XPを獲得',
    icon: '✨',
    category: 'xp',
    requirement: 10000,
    unlocked: false,
    progress: 0,
  },
  // Task achievements
  {
    id: 'tasks_10',
    title: 'タスクハンター',
    description: '10個のタスクを完了',
    icon: '📝',
    category: 'tasks',
    requirement: 10,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'tasks_50',
    title: 'タスクスレイヤー',
    description: '50個のタスクを完了',
    icon: '🗡️',
    category: 'tasks',
    requirement: 50,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'tasks_100',
    title: 'タスクチャンピオン',
    description: '100個のタスクを完了',
    icon: '🏅',
    category: 'tasks',
    requirement: 100,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'tasks_500',
    title: 'タスク神',
    description: '500個のタスクを完了',
    icon: '👑',
    category: 'tasks',
    requirement: 500,
    unlocked: false,
    progress: 0,
  },
  // League achievements
  {
    id: 'league_silver',
    title: 'シルバー昇格',
    description: 'シルバーリーグに到達',
    icon: '🥈',
    category: 'league',
    requirement: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'league_gold',
    title: 'ゴールド昇格',
    description: 'ゴールドリーグに到達',
    icon: '🥇',
    category: 'league',
    requirement: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'league_diamond',
    title: 'ダイヤモンド昇格',
    description: 'ダイヤモンドリーグに到達',
    icon: '💎',
    category: 'league',
    requirement: 1,
    unlocked: false,
    progress: 0,
  },
  // Special achievements
  {
    id: 'combo_5',
    title: 'コンボマスター',
    description: '5コンボを達成',
    icon: '🎯',
    category: 'special',
    requirement: 5,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'perfect_day',
    title: 'パーフェクトデイ',
    description: '1日で10タスクを完了',
    icon: '🌈',
    category: 'special',
    requirement: 10,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'epic_hunter',
    title: 'エピックハンター',
    description: 'エピックタスクを10個完了',
    icon: '🐉',
    category: 'special',
    requirement: 10,
    unlocked: false,
    progress: 0,
  },
];

// Generate daily challenges
export const generateDailyChallenges = (): DailyChallenge[] => {
  return [
    {
      id: 'daily_complete_3',
      title: '3タスク完了',
      description: '今日3つのタスクを完了しよう',
      target: 3,
      current: 0,
      xpReward: 30,
      gemReward: 5,
      completed: false,
      type: 'complete_tasks',
    },
    {
      id: 'daily_complete_hard',
      title: 'ハードタスクに挑戦',
      description: 'ハードまたはエピックタスクを1つ完了',
      target: 1,
      current: 0,
      xpReward: 25,
      gemReward: 8,
      completed: false,
      type: 'complete_hard',
    },
    {
      id: 'daily_perfect',
      title: 'パーフェクトデイ',
      description: '5つのタスクを完了しよう',
      target: 5,
      current: 0,
      xpReward: 50,
      gemReward: 15,
      completed: false,
      type: 'perfect_day',
    },
  ];
};

// Mascot messages
export const MASCOT_MESSAGES = {
  idle: [
    'タスクを追加してみよう!',
    '今日も一緒に頑張ろう!',
    'やることリストをチェック!',
    '準備はいい?',
  ],
  encouragement: [
    'その調子!',
    'すごい! 続けて!',
    'ナイス! もう少し!',
    '君ならできる!',
  ],
  taskComplete: [
    'やったね!',
    '素晴らしい!',
    'パーフェクト!',
    'グッジョブ!',
    '最高!',
  ],
  streakWarning: [
    'ストリークが危ない!',
    '今日のタスクを忘れないで!',
    'あと少しで記録が途切れるよ!',
  ],
  levelUp: [
    'レベルアップ! おめでとう!',
    '新しいレベルに到達!',
    'すごい成長だね!',
  ],
  achievement: [
    'アチーブメント解除!',
    '新しい称号をゲット!',
    '素晴らしい功績だ!',
  ],
  comeback: [
    'おかえり!',
    'また会えて嬉しいよ!',
    '一緒に頑張ろう!',
  ],
};

// Priority colors
export const PRIORITY_COLORS: Record<string, string> = {
  easy: '#58CC02', // Green
  medium: '#1CB0F6', // Blue
  hard: '#FF9600', // Orange
  epic: '#CE82FF', // Purple
};

// Priority labels
export const PRIORITY_LABELS: Record<string, string> = {
  easy: 'イージー',
  medium: 'ノーマル',
  hard: 'ハード',
  epic: 'エピック',
};
