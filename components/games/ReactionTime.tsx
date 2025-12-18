
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../../types';

const ReactionTime: React.FC<GameProps> = ({ onGameOver }) => {
  const [state, setState] = useState<'waiting' | 'ready' | 'result' | 'early'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  // Fix: Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout to resolve namespace errors in browser-only environments.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTest = () => {
    setState('waiting');
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  useEffect(() => {
    startTest();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
    } else if (state === 'ready') {
      const now = Date.now();
      const time = now - startTime;
      setReactionTime(time);
      setState('result');
    }
  };

  const handleNext = () => {
    if (state === 'result') {
      // Puntuación basada en la velocidad (ej: 300ms = buen score)
      const score = Math.max(0, 1000 - reactionTime);
      onGameOver(score);
    } else {
      startTest();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-4">
      <button 
        onClick={handleClick}
        className={`w-full aspect-square md:aspect-video rounded-[2.5rem] flex flex-col items-center justify-center transition-colors duration-200 shadow-2xl ${
          state === 'waiting' ? 'bg-rose-600' : 
          state === 'ready' ? 'bg-emerald-500' : 
          state === 'early' ? 'bg-amber-500' : 'bg-indigo-600'
        }`}
      >
        <span className="text-6xl mb-4">
          {state === 'waiting' ? '🔴' : state === 'ready' ? '🟢' : state === 'early' ? '⚠️' : '⚡'}
        </span>
        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          {state === 'waiting' ? 'ESPERA AL VERDE' : 
           state === 'ready' ? '¡YA!' : 
           state === 'early' ? 'DEMASIADO PRONTO' : `${reactionTime}ms`}
        </h3>
      </button>

      {(state === 'result' || state === 'early') && (
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl font-bold text-white hover:bg-white/20 transition-all"
        >
          {state === 'result' ? 'GUARDAR PUNTUACIÓN' : 'REINTENTAR'}
        </button>
      )}
    </div>
  );
};

export default ReactionTime;
