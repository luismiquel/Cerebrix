
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const MemorySequence: React.FC<GameProps> = ({ onGameOver }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [state, setState] = useState<'watch' | 'play'>('watch');

  const playSequence = async (seq: number[]) => {
    setState('watch');
    for (const id of seq) {
      await new Promise(r => setTimeout(r, 400));
      setActive(id);
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

  useEffect(() => {
    nextLevel();
  }, []);

  const handleClick = (id: number) => {
    if (state !== 'play') return;
    const nextUser = [...userSeq, id];
    setUserSeq(nextUser);
    if (id !== sequence[nextUser.length - 1]) {
      onGameOver(sequence.length * 100);
      return;
    }
    if (nextUser.length === sequence.length) {
      setTimeout(nextLevel, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-xl font-bold">{state === 'watch' ? 'MEMORIZA' : 'TU TURNO'}</div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-32 h-32 rounded-3xl transition-all ${
              active === i ? 'bg-white scale-95 shadow-lg' : 
              i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MemorySequence;
