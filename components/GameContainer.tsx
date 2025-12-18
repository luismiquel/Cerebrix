
import React, { useState } from 'react';
import { GameMetadata, DifficultyLevel } from '../types';
import MathBlitz from './games/MathBlitz';
import MemoryMatch from './games/MemoryMatch';
import StroopTest from './games/StroopTest';
import InfiniteMaze from './games/InfiniteMaze';
import WordScramble from './games/WordScramble';
import SequenceRecall from './games/SequenceRecall';
import NumberNinja from './games/NumberNinja';
import OddOneOut from './games/OddOneOut';
import VisualMemory from './games/VisualMemory';
import AICrossword from './games/AICrossword';
import AIRiddle from './games/AIRiddle';
import SpeedTraining from './games/SpeedTraining';
import AIConcentration from './games/AIConcentration';
import RhythmGame from './games/RhythmGame';
import AITetris from './games/AITetris';
import AISequence from './games/AISequence';
import SudokuMini from './games/SudokuMini';
import StoryMaster from './games/StoryMaster';
import ArtCritic from './games/ArtCritic';
import ReactionTime from './games/ReactionTime';
import Calculadora from './games/Calculadora';
import AIChess from './games/AIChess';
import GenericPlaceholder from './games/GenericPlaceholder';
import GamePoster from './GamePoster';

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
  game, 
  onGameOver, 
  onExit, 
  isSeniorMode = false, 
  globalDifficulty = 'medium',
  fontSize = 'normal', 
  isDailyChallenge = false,
  currentRound = 1
}) => {
  const [isReady, setIsReady] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    isDailyChallenge ? 'medium' : (isSeniorMode ? 'easy' : globalDifficulty)
  );

  const commonProps = {
    onGameOver,
    onExit,
    isSeniorMode,
    difficulty,
    fontSize,
    isDailyChallenge,
    currentRound
  };

  const renderGame = () => {
    switch (game.id) {
      // --- MATEMÁTICAS ---
      case 'math-blitz':
      case 'math-pyramid':
      case 'fast-count':
        return <MathBlitz {...commonProps} />;
      case 'calculadora':
        return <Calculadora {...commonProps} />;

      // --- MEMORIA ---
      case 'memory-match':
        return <MemoryMatch {...commonProps} />;
      case 'visual-memory':
      case 'detective-visual':
        return <VisualMemory {...commonProps} />;
      case 'secuencia-maestra':
      case 'memoria-patrones':
      case 'sequence-recall':
      case 'eco-mental':
      case 'digit-span':
        return <SequenceRecall {...commonProps} />;
      case 'ai-sequence':
        return <AISequence {...commonProps} />;

      // --- ATENCIÓN / REACCIÓN ---
      case 'stroop-test':
        return <StroopTest {...commonProps} />;
      case 'reaction-time':
      case 'reflejos':
        return <ReactionTime {...commonProps} />;
      case 'speed-training':
        return <SpeedTraining {...commonProps} />;
      case 'concentracion-total':
        return <AIConcentration {...commonProps} />;
      case 'number-ninja':
        return <NumberNinja {...commonProps} />;
      case 'rhythm-game':
      case 'ritmo-melodico':
        return <RhythmGame {...commonProps} />;

      // --- LÓGICA ---
      case 'tetris':
      case 'block-stack':
        return <AITetris {...commonProps} />;
      case 'infinite-maze':
      case 'path-finder':
        return <InfiniteMaze {...commonProps} />;
      case 'odd-one-out':
      case 'color-count':
        return <OddOneOut {...commonProps} />;
      case 'puzzle-logico':
      case 'brain-riddle':
      case 'logic-grid':
      case 'shape-rotation':
      case 'symbol-logic':
      case 'misterio-logico':
      case 'trivia-master':
        return <AIRiddle {...commonProps} />;
      case 'sudoku-mini':
        return <SudokuMini {...commonProps} />;
      case 'ajedrez':
        return <AIChess {...commonProps} />;

      // --- LENGUAJE ---
      case 'word-scramble':
      case 'lexis':
      case 'anagram-master':
      case 'poesia-zen':
        return <WordScramble {...commonProps} />;
      case 'crucigrama':
      case 'hidden-words':
        return <AICrossword {...commonProps} />;
      case 'story-master':
        return <StoryMaster {...commonProps} />;
      case 'art-critic':
        return <ArtCritic {...commonProps} />;

      default:
        return <GenericPlaceholder game={game} {...commonProps} />;
    }
  };

  if (!isReady) {
    return (
      <div className="max-w-3xl mx-auto glass rounded-[3rem] p-10 flex flex-col items-center text-center animate-in fade-in duration-700 shadow-2xl">
        <div className="w-full max-w-xs mb-8">
          <GamePoster prompt={game.name} className="w-full aspect-square" />
        </div>
        <h2 className="text-4xl font-black mb-2 dark:text-white uppercase italic tracking-tighter">
          {isDailyChallenge ? `Reto Diario: Ronda ${currentRound}` : game.name}
        </h2>
        <p className={`text-slate-500 dark:text-slate-400 mb-8 max-w-md ${isSeniorMode ? 'text-2xl' : 'text-lg'}`}>
          {isDailyChallenge 
            ? `Supera esta ronda (${currentRound}/3) para completar tu entrenamiento diario.` 
            : game.description}
        </p>
        
        {!isDailyChallenge && (
          <div className="mb-10 w-full max-w-sm">
            <div className="flex flex-wrap p-1 bg-slate-200 dark:bg-slate-800 rounded-3xl gap-1">
              {(['easy', 'medium', 'hard', 'master'] as DifficultyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    difficulty === level ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xl' : 'text-slate-400'
                  }`}
                >
                  {level === 'master' ? '👑 Maestro' : level}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-xs space-y-4">
          <button onClick={() => setIsReady(true)} className="w-full py-5 bg-emerald-500 rounded-2xl font-black text-white shadow-2xl uppercase tracking-widest text-lg hover:scale-105 active:scale-95 transition-all">
            {isDailyChallenge ? `INICIAR RONDA ${currentRound}` : "JUGAR AHORA"}
          </button>
          <button onClick={onExit} className="w-full py-2 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-rose-500 transition-colors">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto glass rounded-[3rem] p-8 relative flex flex-col min-h-[650px] shadow-2xl overflow-hidden border-2 border-white/5">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${game.color} rounded-xl flex items-center justify-center text-2xl text-white shadow-lg`}>
            {game.icon}
          </div>
          <div>
            <h2 className={`font-black uppercase italic tracking-tighter dark:text-white ${isSeniorMode ? 'text-3xl' : 'text-xl'}`}>
              {game.name}
            </h2>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full font-black uppercase">{difficulty}</span>
              {isDailyChallenge && (
                <span className="text-[10px] px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full font-black uppercase italic">
                  RONDA {currentRound} DE 3
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onExit} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-500 text-white flex items-center justify-center transition-colors">✕</button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {renderGame()}
      </div>
    </div>
  );
};

export default GameContainer;
