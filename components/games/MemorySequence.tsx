
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const MemorySequence: React.FC<GameProps> = ({ onGameOver }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [state, setState] = useState<'watch' | 'play'>('watch');

  const vibrate = (pattern: number | number[]) => { if (navigator.vibrate) navigator.vibrate(pattern); };

  const playSequence = async (seq: number[]) => {
    setState('watch');
    for (const id of seq) {
      await new Promise(r => setTimeout(r, 500));
      setActive(id);
      vibrate(10);
      await new Promise(r => setTimeout(r, 400));
      setActive(null);
    }
    setState('play');
    setUserSeq([]);
  };

  const nextLevel = () => {
    const next = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(next);
    playSequence(next);
  };

  useEffect(() => { nextLevel(); }, []);

  const handleClick = (id: number) => {
    if (state !== 'play') return;
    vibrate(15);
    const nextUser = [...userSeq, id];
    setUserSeq(nextUser);
    if (id !== sequence[nextUser.length - 1]) {
      vibrate([50, 50, 50]);
      onGameOver(sequence.length * 100);
      return;
    }
    if (nextUser.length === sequence.length) {
      setTimeout(nextLevel, 800);
    }
  };

  const COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
  const GLOWS = ['shadow-rose-500', 'shadow-blue-500', 'shadow-emerald-500', 'shadow-amber-500'];

  return (
    <div className="flex flex-col items-center gap-10 select-none">
      <div className="text-2xl font-black uppercase tracking-widest text-slate-400">
        {state === 'watch' ? 'MEMORIZA' : 'TU TURNO'}
      </div>
      <div className="grid grid-cols-2 gap-6 w-full max-w-[340px]">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onPointerDown={(e) => { e.preventDefault(); handleClick(i); }}
            className={`aspect-square rounded-[2.5rem] transition-all duration-150 border-b-8 border-black/30 ${
              active === i ? `bg-white scale-95 shadow-[0_0_40px_white]` : `${COLORS[i]} active:scale-95`
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Nivel: {sequence.length}</p>
    </div>
  );
};

export default MemorySequence;
