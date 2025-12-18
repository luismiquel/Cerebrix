
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const ConcentrationGame: React.FC<GameProps> = ({ onGameOver, difficulty }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(difficulty === 'master' ? 4 : 3);
  const [target, setTarget] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'master' ? 15 : 30);

  const startLevel = () => {
    const nextSize = difficulty === 'master' 
      ? (level > 8 ? 5 : 4)
      : (level > 5 ? 4 : 3);
    setGridSize(nextSize);
    setTarget(Math.floor(Math.random() * (nextSize * nextSize)));
  };

  useEffect(() => {
    startLevel();
    const timer = setInterval(() => setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(timer);
        onGameOver(score);
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [level]);

  const handleBoxClick = (idx: number) => {
    if (idx === target) {
      setScore(s => s + (difficulty === 'master' ? 200 : 100));
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - (difficulty === 'master' ? 5 : 3)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-xs font-bold px-4">
        <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-500">Nivel</span>
            <span className="text-2xl text-white">{level}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-slate-500">Tiempo</span>
            <span className={`text-2xl ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-200'}`}>{timeLeft}s</span>
        </div>
      </div>
      <div 
        className="grid gap-2"
        style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: 'min(80vw, 320px)',
            height: 'min(80vw, 320px)'
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <button
            key={i}
            onPointerDown={(e) => { e.preventDefault(); handleBoxClick(i); }}
            className={`w-full h-full rounded-2xl transition-all ${target === i ? 'bg-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.6)]' : 'bg-slate-700 active:bg-slate-600'}`}
          />
        ))}
      </div>
      {difficulty === 'master' && <p className="text-[10px] text-rose-500 font-black uppercase">Modo Maestro: Error = -5s</p>}
    </div>
  );
};

export default ConcentrationGame;
