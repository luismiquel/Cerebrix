
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const NumberNinja: React.FC<GameProps> = ({ onGameOver, difficulty }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'master' ? 15 : 20);
  const [score, setScore] = useState(0);

  const getConfig = () => {
    switch(difficulty) {
      case 'easy': return { count: 9, cols: 3 };
      case 'master': return { count: 25, cols: 5 };
      case 'hard': return { count: 16, cols: 4 };
      case 'medium': default: return { count: 12, cols: 3 };
    }
  };
  
  const { count, cols } = getConfig();

  const setupBoard = () => {
    const nums = Array.from({length: count}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setNumbers(nums);
    setNextExpected(1);
  };

  useEffect(() => {
    setupBoard();
    const timer = setInterval(() => setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(timer);
        onGameOver(score * (difficulty === 'master' ? 300 : (difficulty === 'hard' ? 150 : 100)));
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [score, onGameOver, difficulty]);

  const handleClick = (n: number) => {
    if (n === nextExpected) {
      if (n === count) {
        setScore(s => s + 1);
        let bonus = 5;
        if (difficulty === 'master') bonus = 10;
        setTimeLeft(t => Math.min(t + bonus, 30));
        setupBoard();
      } else {
        setNextExpected(n + 1);
      }
    } else {
      const penalty = difficulty === 'master' ? 4 : 2;
      setTimeLeft(t => Math.max(0, t - penalty));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="flex justify-between w-full max-w-sm items-center">
        <div className="text-teal-400 font-bold">🎯 Próximo: <span className="text-2xl">{nextExpected}</span></div>
        <div className={`font-mono text-2xl font-bold ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
      </div>

      <div 
        className="grid gap-2 w-full max-w-md"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {numbers.map(n => (
          <button
            key={n}
            onClick={() => handleClick(n)}
            disabled={n < nextExpected}
            className={`aspect-square rounded-xl text-xl font-black transition-all ${
              n < nextExpected 
                ? 'bg-slate-900 text-slate-700 opacity-20' 
                : 'bg-slate-800 text-white border-b-4 border-slate-950 active:bg-teal-500'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberNinja;
