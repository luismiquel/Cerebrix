
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const VisualMemory: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize, isDailyChallenge, currentRound = 1 }) => {
  const [level, setLevel] = useState(isDailyChallenge ? (currentRound - 1) * 3 + 1 : 1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gridSize, setGridSize] = useState(3);
  const [targets, setTargets] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState<'memorize' | 'recall' | 'success' | 'fail'>('memorize');
  const [wrongTile, setWrongTile] = useState<number | null>(null);

  const triggerVibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const startLevel = useCallback(() => {
    setStatus('memorize');
    setSelected([]);
    setWrongTile(null);

    let newSize = 3;
    if (level > 4) newSize = 4;
    if (level > 10) newSize = 5;
    if (level > 18) newSize = 6;
    
    setGridSize(newSize);

    const totalTiles = newSize * newSize;
    // Maestro: 50% más cuadros para memorizar
    const multiplier = difficulty === 'master' ? 1.5 : 1;
    const targetCount = Math.floor((3 + Math.floor((level - 1) / 2.5)) * multiplier);

    const newTargets = new Set<number>();
    while (newTargets.size < Math.min(targetCount, totalTiles - 1)) {
      newTargets.add(Math.floor(Math.random() * totalTiles));
    }
    setTargets(Array.from(newTargets));

    // Maestro: memorización más rápida
    const baseMemorizeTime = difficulty === 'master' ? 800 : 1200;
    const perTargetTime = difficulty === 'master' ? 250 : 400;
    const memorizeTime = baseMemorizeTime + (targetCount * perTargetTime); 
    
    const timer = setTimeout(() => {
      setStatus('recall');
      triggerVibrate(20);
    }, memorizeTime);

    return () => clearTimeout(timer);
  }, [level, difficulty]);

  useEffect(() => {
    startLevel();
  }, [level, startLevel]);

  const handleTileClick = (index: number) => {
    if (status !== 'recall' || selected.includes(index)) return;

    if (targets.includes(index)) {
      const newSelected = [...selected, index];
      setSelected(newSelected);
      triggerVibrate(10);

      if (newSelected.length === targets.length) {
        setStatus('success');
        triggerVibrate(30);
        setScore(s => s + (targets.length * (difficulty === 'master' ? 100 : 50)));
        setTimeout(() => setLevel(l => l + 1), 800);
      }
    } else {
      triggerVibrate([40, 20, 40]);
      setWrongTile(index);
      setStatus('fail');
      setLives(l => l - 1);
      
      if (lives - 1 <= 0) {
        setTimeout(() => onGameOver(score), 1000);
      } else {
        setTimeout(startLevel, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 w-full select-none">
      <div className="flex justify-between w-full max-w-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1">Puntos</span>
          <span className={`font-black text-teal-400 ${fontSize === 'large' ? 'text-3xl' : 'text-2xl'}`}>{score.toLocaleString()}</span>
        </div>
        <div className="flex gap-2 items-center">
          {[...Array(3)].map((_, i) => (
             <span key={i} className={`text-xl transition-all ${i < lives ? 'scale-110' : 'opacity-20 grayscale'}`}>❤️</span>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1">Nivel</span>
          <span className={`font-black text-white ${fontSize === 'large' ? 'text-3xl' : 'text-2xl'}`}>{level}</span>
        </div>
      </div>

      <div className="h-8 flex items-center justify-center">
        {status === 'memorize' && <span className="text-blue-400 font-black uppercase tracking-widest animate-pulse text-xs">Memoriza el patrón...</span>}
        {status === 'recall' && <span className="text-slate-400 font-black uppercase tracking-widest text-xs">¡Repite el patrón!</span>}
      </div>

      <div 
        className="grid gap-2 bg-slate-800/40 p-3 rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-300"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)'
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          let tileClass = "bg-slate-700 active:bg-slate-600";
          
          if (status === 'memorize') {
            if (targets.includes(idx)) tileClass = "bg-white shadow-[0_0_20px_white] scale-95";
          } else if (status === 'recall') {
            if (selected.includes(idx)) tileClass = "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-95 transition-none";
          } else if (status === 'success') {
            if (targets.includes(idx)) tileClass = "bg-emerald-500 scale-95 transition-none";
          } else if (status === 'fail') {
             if (idx === wrongTile) tileClass = "bg-rose-500 animate-shake";
             else if (targets.includes(idx)) tileClass = "bg-white/40";
          }

          return (
            <button
              key={idx}
              onPointerDown={(e) => { e.preventDefault(); handleTileClick(idx); }}
              disabled={status !== 'recall' || selected.includes(idx)}
              className={`rounded-xl transition-all duration-200 ${tileClass}`}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default VisualMemory;
