
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../../types';

const AIConcentration: React.FC<GameProps> = ({ onGameOver, isSeniorMode, fontSize, difficulty }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gridSize, setGridSize] = useState(2); // Empieza 2x2
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [gameState, setGameState] = useState<'watching' | 'playing' | 'gameover'>('watching');
  const [highlightedTile, setHighlightedTile] = useState<number | null>(null);
  const [message, setMessage] = useState('Observa el Patrón');

  const [flashColor, setFlashColor] = useState('bg-violet-500');

  useEffect(() => {
    startLevel();
  }, [level]);

  const startLevel = async () => {
    // Calcular tamaño del grid basado en el nivel y dificultad
    let size = 2;
    // En difícil crece un poco más rápido
    const growthThreshold = difficulty === 'hard' ? 2 : (difficulty === 'easy' ? 4 : 3);
    
    if (isSeniorMode) {
        if (level > 5) size = 3;
        if (level > 12) size = 4;
    } else {
        if (level > growthThreshold) size = 3;
        if (level > growthThreshold * 2.5) size = 4;
    }
    setGridSize(size);

    setGameState('watching');
    setMessage(`Nivel ${level}: Observa`);
    setUserStep(0);
    
    // Generar secuencia.
    const baseLength = isSeniorMode ? 2 : (difficulty === 'hard' ? 3 : 2);
    const growthRate = isSeniorMode ? 3 : 2; 
    const sequenceLength = baseLength + Math.floor((level - 1) / growthRate);
    
    const newSequence: number[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * (size * size)));
    }
    setSequence(newSequence);

    // Reproducir secuencia
    await new Promise(r => setTimeout(r, isSeniorMode ? 1500 : 1000));
    
    for (let i = 0; i < newSequence.length; i++) {
      setHighlightedTile(newSequence[i]);
      setFlashColor('bg-violet-400 shadow-[0_0_30px_rgba(167,139,250,0.8)]');
      
      // Velocidad basada en dificultad
      let baseSpeed = 600;
      if (difficulty === 'hard') baseSpeed = 400;
      if (difficulty === 'easy') baseSpeed = 800;
      if (isSeniorMode) baseSpeed = 1000;

      let speed = Math.max(200, baseSpeed - (level * 25));
      
      await new Promise(r => setTimeout(r, speed));
      
      setHighlightedTile(null);
      await new Promise(r => setTimeout(r, isSeniorMode ? 300 : 150));
    }

    setGameState('playing');
    setMessage('¡Tu Turno!');
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;

    setHighlightedTile(index);
    setFlashColor('bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]');
    setTimeout(() => setHighlightedTile(null), 200);

    if (index === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        setGameState('watching');
        setScore(s => s + (sequence.length * 100));
        setMessage('¡Correcto!');
        setTimeout(() => setLevel(l => l + 1), 1000);
      }
    } else {
      setGameState('gameover');
      setMessage('Patrón Incorrecto');
      setFlashColor('bg-rose-500');
      setHighlightedTile(index);
      setTimeout(() => onGameOver(score), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      <div className="flex justify-between w-full max-w-sm items-end border-b border-violet-500/20 pb-4">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Nivel</span>
          <div className={`font-black text-white ${isSeniorMode || fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>{level}</div>
        </div>
        <div className="flex flex-col items-center">
            <span className={`font-bold uppercase tracking-widest px-4 py-1 rounded-full ${gameState === 'playing' ? 'bg-violet-500/20 text-violet-300 animate-pulse' : 'text-slate-500'} ${isSeniorMode || fontSize === 'large' ? 'text-lg' : 'text-xs'}`}>
                {message}
            </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Puntos</span>
          <div className={`font-black text-violet-400 ${isSeniorMode || fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>{score}</div>
        </div>
      </div>

      <div 
        className="grid gap-3 p-4 bg-slate-900/50 rounded-[2rem] border border-violet-500/30 shadow-2xl transition-all duration-500"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: 'min(85vw, 400px)',
          height: 'min(85vw, 400px)'
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            disabled={gameState !== 'playing'}
            className={`
              relative rounded-2xl transition-all duration-100 border border-white/5
              ${highlightedTile === idx 
                ? `${flashColor} scale-95 z-10` 
                : 'bg-slate-800 hover:bg-slate-700 active:scale-95'
              }
            `}
          >
            <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white/10" />
            <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-white/10" />
          </button>
        ))}
      </div>

      <div className="text-center max-w-xs">
        <p className={`text-slate-500 font-bold uppercase tracking-widest ${isSeniorMode || fontSize === 'large' ? 'text-sm' : 'text-xs'}`}>
            Reproduce la secuencia generada por la IA.
        </p>
      </div>
    </div>
  );
};

export default AIConcentration;
