
export enum GameCategory {
  LOGIC = 'Lógica',
  MEMORY = 'Memoria',
  MATH = 'Cálculo',
  ATTENTION = 'Atención',
  LANGUAGE = 'Lenguaje'
}

export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  icon: string;
  color: string;
  splashPrompt?: string;
}

export interface DailyChallengeState {
  date: string;
  gameId: string;
  screensCompleted: number;
  isFinished: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  totalScore: number;
  categoryScores: Record<string, number>;
  dailyStreak: number;
  lastPlayedDate: string | null;
  daysPlayedCount: number;
  history: {date: string, score: number, gameId: string}[];
  unlockedAchievements: string[]; 
  dailyChallenge?: DailyChallengeState;
  customLogo?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  bonusPoints: number;
  condition: (stats: UserStats, lastScore: number) => boolean;
}

export interface DynamicAchievement extends Achievement {
  isDynamic: boolean;
  dynamicType: 'accumulation' | 'consecutive' | 'milestone';
  targetValue: number;
  gameId?: string; // Opcional, para logros de juegos específicos
  getCurrentProgress: (stats: UserStats) => number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'master';

export interface GameProps {
  onGameOver: (score: number, levelCompleted?: boolean) => void;
  onExit: () => void;
  isSeniorMode?: boolean;
  difficulty: DifficultyLevel;
  fontSize?: 'small' | 'normal' | 'large';
  isDailyChallenge?: boolean;
  currentRound?: number;
  game?: GameMetadata;
}
