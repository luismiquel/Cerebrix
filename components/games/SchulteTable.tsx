
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const SchulteTable: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode }) => {
  const size = difficulty === 'master' ? 6 : (difficulty === 'hard' ? 5 : (isSeniorMode ? 3 : 4));
  const total = size * size;
  
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<number | null>(null);

  const init = useCallback(() => {
    const arr = Array.from({ length: total }, (_, i) => i + 1);
    setNumbers(arr.sort(() => Math.random() - 0.5));
    setNextExpected(1);
  }, [total]);

  useEffect(() => { init(); }, [init]);

  const handleClick = (n: number) => {
    if (n === nextExpected) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
      if (n === total) {
        const timeTaken = (Date.now() - startTime) / 1000;
        const score = Math.max(100, Math.floor(2000 - timeTaken * 20));
        onGameOver(score);
      } else {
        setNextExpected(n + 1);
      }
    } else {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      setFeedback(n);
      setTimeout(() => setFeedback(null), 300);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-indigo-400 uppercase tracking-tighter italic">Busca el número {nextExpected}</h3>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Toca los números en orden ascendente</p>
      </div>

      <div 
        className="grid gap-2 p-2 glass rounded-[2rem] border-4 border-slate-800"
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: 'min(90vw, 380px)',
          height: 'min(90vw, 380px)'
        }}
      >
        {numbers.map(n => (
          <button
            key={n}
            onClick={() => handleClick(n)}
            className={`
              rounded-xl font-black transition-all flex items-center justify-center
              ${n < nextExpected ? 'bg-slate-900 text-slate-700 opacity-20' : 
                feedback === n ? 'bg-rose-500 text-white scale-95' : 
                'bg-slate-800 text-white hover:bg-indigo-600 active:scale-90 border-b-4 border-slate-950'}
              ${size > 4 ? 'text-lg' : 'text-2xl'}
            `}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchulteTable;
