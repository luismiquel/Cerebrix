
import React, { useState, Suspense, lazy, useMemo } from 'react';
import { GameMetadata, DifficultyLevel } from '../types';
import GamePoster from './GamePoster';

// Motores de Juego Locales
const Games = {
  MathBlitz: lazy(() => import('./games/MathBlitz')),
  Calculadora: lazy(() => import('./games/Calculadora')),
  MemoryMatch: lazy(() => import('./games/MemoryMatch')),
  VisualMemory: lazy(() => import('./games/VisualMemory')),
  PatternMaster: lazy(() => import('./games/AISequence')),
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
  StroopTest: lazy(() => import('./games/StroopTest')),
  SequenceRecall: lazy(() => import('./games/SequenceRecall')),
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

  const commonProps = { onGameOver, onExit, isSeniorMode, difficulty, fontSize, isDailyChallenge, currentRound, game };

  const GameComponent = useMemo(() => {
    switch (game.id) {
      // CÁLCULO
      case 'math-blitz': case 'speed-sum': case 'object-count': return Games.MathBlitz;
      case 'calculadora': case 'missing-op': case 'pair-sum': case 'balance-scale': return Games.Calculadora;
      
      // MEMORIA
      case 'memory-match': case 'find-pair': case 'card-memory': return Games.MemoryMatch;
      case 'visual-memory': case 'pattern-recall': case 'grid-path': case 'mental-map': return Games.VisualMemory;
      case 'memory-sequence': case 'sound-memory': return Games.PatternMaster;
      case 'ritmo-melodico': return Games.RhythmGame;
      case 'sequence-recall': return Games.SequenceRecall;
      
      // LÓGICA
      case 'tetris': return Games.TetrisGame;
      case 'infinite-maze': case 'spatial-logic': case 'path-connect': case 'logic-puzzles': return Games.InfiniteMaze;
      case 'odd-one-out': case 'category-sort': case 'mirror-match': return Games.OddOneOut;
      case 'brain-riddle': return Games.RiddleGame;
      case 'sudoku-mini': return Games.SudokuMini;
      case 'ajedrez': return Games.ChessGame;
      
      // ATENCIÓN
      case 'concentracion-total': case 'hidden-object': return Games.ConcentrationGame;
      case 'reflex-trainer': case 'reaction-time': return Games.ReactionTime;
      case 'enfoque-total': case 'bubble-pop': return Games.SpeedTraining;
      case 'schulte-table': case 'number-ninja': return Games.NumberNinja;
      case 'symbol-match': return Games.StroopTest; // El Stroop Test es ideal para control inhibitorio
      
      // LENGUAJE
      case 'anagrams': case 'word-scramble': case 'letter-rain': return Games.WordScramble;
      case 'crucigrama': case 'word-search': return Games.CrosswordGame;
      case 'story-master': case 'synonyms': case 'rhyme-finder': return Games.StoryMaster;
      
      default: return Games.InfiniteMaze;
    }
  }, [game.id]);

  if (!isReady) {
    return (
      <div className="max-w-3xl mx-auto glass rounded-[3rem] p-10 flex flex-col items-center text-center animate-in fade-in duration-700 shadow-2xl border border-white/10">
        <div className="w-full max-w-xs mb-8">
          <GamePoster prompt={game.name} className="w-full aspect-square" />
        </div>
        <h2 className="text-4xl font-black mb-2 dark:text-white uppercase italic tracking-tighter leading-none">{game.name}</h2>
        <p className={`text-slate-500 dark:text-slate-400 mb-8 max-w-md ${isSeniorMode ? 'text-2xl' : 'text-lg'}`}>{game.description}</p>
        <button onClick={() => setIsReady(true)} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-white shadow-2xl uppercase tracking-widest text-lg hover:scale-105 active:scale-95 transition-all">EMPEZAR</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto glass rounded-[3rem] p-4 md:p-8 flex flex-col min-h-[650px] shadow-2xl border border-white/5">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${game.color} rounded-xl flex items-center justify-center text-2xl text-white shadow-lg`}>{game.icon}</div>
          <h2 className={`font-black uppercase italic tracking-tighter dark:text-white ${isSeniorMode ? 'text-2xl' : 'text-xl'}`}>{game.name}</h2>
        </div>
        <button onClick={onExit} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-500 text-white flex items-center justify-center transition-colors">✕</button>
      </div>
      <Suspense fallback={<div className="flex items-center justify-center py-40 animate-pulse text-slate-500 font-black uppercase tracking-widest italic">Iniciando Motor...</div>}>
        <GameComponent {...commonProps} />
      </Suspense>
    </div>
  );
};

export default GameContainer;
