
import React, { useState, Suspense, lazy, useMemo } from 'react';
import { GameMetadata, DifficultyLevel } from '../types';
import GamePoster from './GamePoster';

const Games = {
  MathBlitz: lazy(() => import('./games/MathBlitz')),
  Calculadora: lazy(() => import('./games/Calculadora')),
  MemoryMatch: lazy(() => import('./games/MemoryMatch')),
  VisualMemory: lazy(() => import('./games/VisualMemory')),
  RhythmGame: lazy(() => import('./games/RhythmGame')),
  TetrisGame: lazy(() => import('./games/TetrisGame')),
  InfiniteMaze: lazy(() => import('./games/InfiniteMaze')),
  OddOneOut: lazy(() => import('./games/OddOneOut')),
  RiddleGame: lazy(() => import('./games/RiddleGame')),
  SudokuMini: lazy(() => import('./games/SudokuMini')),
  ChessGame: lazy(() => import('./games/ChessGame')),
  WordScramble: lazy(() => import('./games/WordScramble')),
  CrosswordGame: lazy(() => import('./games/CrosswordGame')),
  StoryMaster: lazy(() => import('./games/StoryMaster')),
  ReactionTime: lazy(() => import('./games/ReactionTime')),
  SpeedTraining: lazy(() => import('./games/SpeedTraining')),
  ConcentrationGame: lazy(() => import('./games/ConcentrationGame')),
  NumberNinja: lazy(() => import('./games/NumberNinja')),
  AISequence: lazy(() => import('./games/AISequence')), // Se mantiene lógica local de secuencia
  GenericPlaceholder: lazy(() => import('./games/GenericPlaceholder'))
};

interface Props {
  game: GameMetadata;
  onGameOver: (score: number, levelCompleted?: boolean) => void;
  onExit: () => void;
  isSeniorMode?: boolean;
  globalDifficulty: DifficultyLevel;
  fontSize?: 'small' | 'normal' | 'large';
  isDailyChallenge?: boolean;
  currentRound?: number;
}

const GameContainer: React.FC<Props> = ({ 
  game, onGameOver, onExit, isSeniorMode = false, globalDifficulty = 'medium',
  fontSize = 'normal', isDailyChallenge = false, currentRound = 1
}) => {
  const [isReady, setIsReady] = useState(false);
  const difficulty = useMemo(() => isDailyChallenge ? 'medium' : (isSeniorMode ? 'easy' : globalDifficulty), [isDailyChallenge, isSeniorMode, globalDifficulty]);

  const commonProps = { onGameOver, onExit, isSeniorMode, difficulty, fontSize, isDailyChallenge, currentRound };

  const GameComponent = useMemo(() => {
    switch (game.id) {
      case 'math-blitz': case 'speed-sum': return Games.MathBlitz;
      case 'calculadora': case 'missing-op': case 'pair-sum': return Games.Calculadora;
      case 'memory-match': case 'find-pair': case 'card-memory': return Games.MemoryMatch;
      case 'visual-memory': case 'pattern-recall': case 'grid-path': return Games.VisualMemory;
      case 'memory-sequence': case 'sound-memory': return Games.AISequence;
      case 'reaction-time': case 'reflex-trainer': return Games.ReactionTime;
      case 'speed-training': case 'bubble-pop': return Games.SpeedTraining;
      case 'concentracion-total': case 'hidden-object': return Games.ConcentrationGame;
      case 'number-ninja': case 'schulte-table': return Games.NumberNinja;
      case 'rhythm-game': return Games.RhythmGame;
      case 'tetris': return Games.TetrisGame;
      case 'infinite-maze': return Games.InfiniteMaze;
      case 'odd-one-out': return Games.OddOneOut;
      case 'brain-riddle': return Games.RiddleGame;
      case 'sudoku-mini': return Games.SudokuMini;
      case 'ajedrez': return Games.ChessGame;
      case 'anagrams': return Games.WordScramble;
      case 'crucigrama': case 'word-search': return Games.CrosswordGame;
      case 'story-master': case 'synonyms': case 'rhyme-finder': return Games.StoryMaster;
      default: return Games.GenericPlaceholder;
    }
  }, [game.id]);

  if (!isReady) {
    return (
      <div className="max-w-3xl mx-auto glass rounded-[3rem] p-10 flex flex-col items-center text-center animate-in fade-in duration-700 shadow-2xl border border-white/10">
        <div className="w-full max-w-xs mb-8">
          <GamePoster prompt={game.name} className="w-full aspect-square" />
        </div>
        <h2 className="text-4xl font-black mb-2 dark:text-white uppercase italic tracking-tighter">{game.name}</h2>
        <p className={`text-slate-500 dark:text-slate-400 mb-8 max-w-md ${isSeniorMode ? 'text-2xl' : 'text-lg'}`}>{game.description}</p>
        <button onClick={() => setIsReady(true)} className="w-full py-5 bg-emerald-500 rounded-2xl font-black text-white shadow-2xl uppercase tracking-widest text-lg hover:scale-105 active:scale-95 transition-all">EMPEZAR</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto glass rounded-[3rem] p-8 flex flex-col min-h-[650px] shadow-2xl">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${game.color} rounded-xl flex items-center justify-center text-2xl text-white`}>{game.icon}</div>
          <h2 className={`font-black uppercase italic tracking-tighter dark:text-white ${isSeniorMode ? 'text-3xl' : 'text-xl'}`}>{game.name}</h2>
        </div>
        <button onClick={onExit} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-500 text-white flex items-center justify-center">✕</button>
      </div>
      <Suspense fallback={<div className="text-center py-20 animate-pulse text-slate-500">Cargando...</div>}>
        <GameComponent {...commonProps} game={game} />
      </Suspense>
    </div>
  );
};

export default GameContainer;
