
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const EMOJI_PAIRS = [
  ['😀', '😃'], ['😄', '😆'], ['🚀', '✈️'], ['🌙', '🌛'], 
  ['🐱', '🐯'], ['🍎', '🍅'], ['⚽', '🏀'], ['🔒', '🔓'],
  ['🔎', '🔍'], ['🏠', '🏡'], ['🚗', '🚕'], ['✔️', '☑️'],
  ['❤️', '🧡'], ['👍', '👊'], ['👓', '🕶️'], ['🔔', '🔕'],
  ['💿', '📀'], ['🕰️', '⏰'], ['📷', '📸'], ['🕯️', '💡'],
  ['🔨', '🪓'], ['🗝️', '🗡️'], ['🩸', '💧'], ['🦠', '🧬'],
  ['🟢', '🔵'], ['🟧', '🟥'], ['👻', '💀'], ['🤖', '👽']
];

const HINTS = [
  "Fíjate en los detalles pequeños...",
  "Mira la forma de los ojos o la boca.",
  "Uno de ellos tiene una orientación distinta.",
  "No te apresures, observa bien.",
  "¡Casi! Busca diferencias sutiles."
];

const OddOneOut: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  
  const initialTime = isSeniorMode ? 60 : (difficulty === 'easy' ? 45 : (difficulty === 'hard' ? 20 : 30));
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  const [gridSize, setGridSize] = useState(2);
  const [items, setItems] = useState<string[]>([]);
  const [oddIndex, setOddIndex] = useState(0);
  
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('¡Encuentra el diferente!');
  const [feedbackColor, setFeedbackColor] = useState('text-slate-500');

  useEffect(() => {
    let sizeGrowthRate = 3;
    if (isSeniorMode || difficulty === 'easy') sizeGrowthRate = 5;
    if (difficulty === 'hard') sizeGrowthRate = 2;

    const size = Math.min(6, Math.floor((level - 1) / sizeGrowthRate) + 2);
    setGridSize(size);
    
    const pair = EMOJI_PAIRS[Math.floor(Math.random() * EMOJI_PAIRS.length)];
    const [common, odd] = Math.random() > 0.5 ? pair : [pair[1], pair[0]];
    
    const total = size * size;
    const newItems = Array(total).fill(common);
    const oddIdx = Math.floor(Math.random() * total);
    newItems[oddIdx] = odd;
    
    setItems(newItems);
    setOddIndex(oddIdx);
    setFeedbackMsg('¡Encuentra el diferente!');
    setFeedbackColor('text-slate-500');
  }, [level, isSeniorMode, difficulty]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score * 50);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onGameOver]);

  const handleItemClick = (index: number) => {
    if (wrongIndex !== null) return;

    if (index === oddIndex) {
      setScore(s => s + 1);
      const bonus = Math.max(1, (isSeniorMode ? 5 : 3) - Math.floor(level / 5));
      setTimeLeft(t => Math.min(t + bonus, 60));
      setLevel(l => l + 1);
      setWrongIndex(null);
    } else {
      setWrongIndex(index);
      const penalty = difficulty === 'hard' ? 5 : (isSeniorMode ? 1 : 2);
      setTimeLeft(t => Math.max(0, t - penalty)); 
      
      setFeedbackMsg(HINTS[Math.floor(Math.random() * HINTS.length)]);
      setFeedbackColor('text-rose-400');

      setTimeout(() => setWrongIndex(null), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-6">
      <div className="flex justify-between w-full max-w-sm">
        <div className="flex flex-col">
           <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">Nivel</span>
           <span className={`font-bold text-white ${isSeniorMode || fontSize === 'large' ? 'text-3xl' : 'text-2xl'}`}>{level}</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">Puntos</span>
           <span className={`font-bold text-teal-400 ${isSeniorMode || fontSize === 'large' ? 'text-3xl' : 'text-2xl'}`}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">Tiempo</span>
           <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-300'} ${isSeniorMode || fontSize === 'large' ? 'text-3xl' : 'text-2xl'}`}>
             {timeLeft}s
           </span>
        </div>
      </div>
      
      <div 
        className="grid gap-3 bg-slate-800/50 p-4 rounded-[2rem] shadow-xl border border-white/5"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)'
        }}
      >
        {items.map((item, idx) => {
          const isWrong = wrongIndex === idx;
          const isTarget = idx === oddIndex;
          const showHint = wrongIndex !== null && isTarget;
          
          return (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`
                flex items-center justify-center rounded-2xl transition-all select-none shadow-lg 
                border-b-4 active:border-b-0 active:translate-y-1
                ${isWrong 
                  ? 'bg-red-600 border-red-800 animate-flash-red z-20 scale-110 shadow-[0_0_40px_rgba(220,38,38,0.8)]' 
                  : showHint
                    ? 'bg-slate-700 border-slate-900 ring-4 ring-amber-400/40 shadow-[0_0_50px_rgba(251,191,36,0.6)] z-10 scale-105 animate-hint-pulse' 
                    : 'bg-slate-700 hover:bg-slate-600 border-slate-900 active:scale-90'
                }
              `}
              style={{ fontSize: `min(8vw, ${50 - gridSize * 4}px)` }}
            >
              {item}
            </button>
          );
        })}
      </div>
      
      <p className={`uppercase tracking-widest font-bold transition-colors duration-300 h-4 ${feedbackColor} ${wrongIndex !== null ? 'animate-pulse' : ''} ${isSeniorMode || fontSize === 'large' ? 'text-sm' : 'text-xs'}`}>
        {feedbackMsg}
      </p>

      <style>{`
        @keyframes flash-red {
          0%, 100% { background-color: #dc2626; transform: scale(1.1); }
          10%, 30%, 50%, 70%, 90% { background-color: #ff0000; transform: scale(1.15) rotate(2deg); }
          20%, 40%, 60%, 80% { background-color: #b91c1c; transform: scale(1.1) rotate(-2deg); }
        }
        @keyframes hint-pulse {
          0%, 100% { transform: scale(1.05); box-shadow: 0 0 50px rgba(251,191,36,0.6); }
          50% { transform: scale(1.08); box-shadow: 0 0 80px rgba(251,191,36,0.8); }
        }
        .animate-flash-red { animation: flash-red 0.8s cubic-bezier(.36,.07,.19,.97) both; }
        .animate-hint-pulse { animation: hint-pulse 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default OddOneOut;
