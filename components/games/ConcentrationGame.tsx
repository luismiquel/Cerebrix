
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const ConcentrationGame: React.FC<GameProps> = ({ onGameOver, difficulty }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [target, setTarget] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const startLevel = () => {
    setGridSize(level > 5 ? 4 : 3);
    setTarget(Math.floor(Math.random() * (gridSize * gridSize)));
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
      setScore(s => s + 100);
      setLevel(l => l + 1);
    } else {
      setTimeLeft(t => Math.max(0, t - 3));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-xs font-bold">
        <span>Nivel: {level}</span>
        <span className="text-rose-500">{timeLeft}s</span>
      </div>
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleBoxClick(i)}
            className={`w-20 h-20 rounded-xl transition-all ${target === i ? 'bg-teal-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ConcentrationGame;
