
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const COLORS = [
  { name: 'Rojo', hex: '#ef4444' },
  { name: 'Azul', hex: '#3b82f6' },
  { name: 'Verde', hex: '#22c55e' },
  { name: 'Amarillo', hex: '#eab308' },
  { name: 'Morado', hex: '#a855f7' },
  { name: 'Naranja', hex: '#f97316' }
];

const StroopTest: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty }) => {
  const [current, setCurrent] = useState({ text: '', textColor: '', options: [] as any[] });
  const [score, setScore] = useState(0);
  
  const initialTime = isSeniorMode ? 45 : (difficulty === 'master' ? 10 : (difficulty === 'hard' ? 20 : 30));
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  const generateRound = useCallback(() => {
    const textIdx = Math.floor(Math.random() * COLORS.length);
    const colorIdx = Math.floor(Math.random() * COLORS.length);
    const options = [...COLORS].sort(() => Math.random() - 0.5);
    
    setCurrent({
      text: COLORS[textIdx].name,
      textColor: COLORS[colorIdx].hex,
      options
    });
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0) {
      setIsActive(false);
      onGameOver(score * (difficulty === 'master' ? 100 : 15));
    }
  }, [timeLeft, isActive, score, onGameOver, difficulty]);

  const handleChoice = (hex: string) => {
    if (hex === current.textColor) {
      setScore(s => s + 1);
      if (isSeniorMode) setTimeLeft(t => Math.min(t + 1, initialTime));
      if (difficulty === 'master') setTimeLeft(t => Math.min(t + 0.5, 10)); // Mínimo margen
      generateRound();
    } else {
      const penalty = difficulty === 'master' ? 5 : (isSeniorMode ? 0 : 2);
      setTimeLeft(t => Math.max(0, t - penalty)); 
      generateRound();
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center">
        <div className={`font-mono mb-2 ${timeLeft < 5 ? 'text-rose-500 animate-bounce' : 'text-white'} ${isSeniorMode ? 'text-6xl' : 'text-5xl'}`}>{timeLeft}s</div>
        <div className="text-slate-400 text-sm uppercase tracking-widest font-bold">Toca el COLOR de la palabra</div>
      </div>

      <div className="h-40 flex items-center justify-center">
        <h2 
          className="text-8xl font-black transition-all transform duration-75"
          style={{ color: current.textColor }}
        >
          {current.text}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {current.options.map(opt => (
          <button
            key={opt.name}
            onClick={() => handleChoice(opt.hex)}
            className={`rounded-2xl glass border border-slate-700 hover:border-teal-400 transition-all font-bold uppercase ${isSeniorMode ? 'py-8 text-2xl' : 'py-6 text-xl'}`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StroopTest;
