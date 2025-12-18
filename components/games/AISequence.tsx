
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const COLORS = [
  { id: 0, name: 'Red', hex: '#ef4444' },
  { id: 1, name: 'Blue', hex: '#3b82f6' },
  { id: 2, name: 'Green', hex: '#22c55e' },
  { id: 3, name: 'Yellow', hex: '#eab308' },
  { id: 4, name: 'Purple', hex: '#a855f7' },
  { id: 5, name: 'Cyan', hex: '#06b6d4' },
  { id: 6, name: 'Pink', hex: '#ec4899' },
  { id: 7, name: 'Orange', hex: '#f97316' }
];

const PatternMaster: React.FC<GameProps> = ({ onGameOver, difficulty }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'preparing' | 'memorizing' | 'recalling' | 'failed' | 'success'>('preparing');
  const [activePad, setActivePad] = useState<number | null>(null);
  const [message, setMessage] = useState('Preparando...');

  const padCount = difficulty === 'master' ? 8 : (difficulty === 'hard' ? 6 : 4);
  const activePads = COLORS.slice(0, padCount);

  const triggerVibrate = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
  };

  const playSequence = useCallback(async (seq: number[]) => {
    setGameState('memorizing');
    setMessage('OBSERVA EL PATRÓN');
    let displayTime = 600;
    let gapTime = 400;
    if (difficulty === 'master') { displayTime = 250; gapTime = 100; }
    else if (difficulty === 'hard') { displayTime = 400; gapTime = 200; }
    
    await new Promise(r => setTimeout(r, 800));
    for (let i = 0; i < seq.length; i++) {
      const padId = seq[i];
      setActivePad(padId);
      triggerVibrate(15 + (padId * 5)); 
      await new Promise(r => setTimeout(r, displayTime));
      setActivePad(null);
      await new Promise(r => setTimeout(r, gapTime));
    }
    setGameState('recalling');
    setMessage('¡TU TURNO!');
  }, [difficulty]);

  const generateNextLevel = useCallback((prevSeq: number[]) => {
    setGameState('preparing');
    setMessage('Generando...');
    setTimeout(() => {
      const nextId = Math.floor(Math.random() * padCount);
      const newSeq = [...prevSeq, nextId];
      setSequence(newSeq);
      setUserSequence([]);
      playSequence(newSeq);
    }, 800);
  }, [padCount, playSequence]);

  const handlePadClick = (id: number) => {
    if (gameState !== 'recalling') return;
    
    setActivePad(id);
    triggerVibrate(15 + (id * 5));
    setTimeout(() => setActivePad(null), 150);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    if (id !== sequence[newUserSeq.length - 1]) {
      setGameState('failed');
      triggerVibrate([60, 40, 60]);
      setTimeout(() => onGameOver(score), 1000);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setGameState('success');
      triggerVibrate([30, 20, 30]);
      setScore(s => s + (sequence.length * 200));
      setTimeout(() => { 
        setLevel(l => l + 1); 
        generateNextLevel(sequence); 
      }, 1000);
    }
  };

  useEffect(() => {
    generateNextLevel([]);
  }, [generateNextLevel]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-4 select-none touch-none h-full">
      <div className="flex justify-between w-full max-w-sm px-4">
        <span className="text-purple-400 font-black text-2xl italic tracking-tighter">{score.toLocaleString()}</span>
        <span className="text-white font-black text-2xl italic tracking-tighter">LVL {level}</span>
      </div>

      <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center">
        <div className="absolute inset-0 bg-white/5 rounded-full border-2 border-white/5 animate-pulse" />
        
        {activePads.map((pad, idx) => {
          const angle = (idx * (360 / padCount)) - 90;
          const isActive = activePad === pad.id;
          const padSize = padCount > 6 ? 'w-24 h-24' : 'w-28 h-28';
          
          return (
            <button
              key={pad.id}
              onPointerDown={(e) => { e.preventDefault(); handlePadClick(pad.id); }}
              disabled={gameState !== 'recalling'}
              className={`absolute rounded-[2.5rem] transition-all duration-100 border-4 active:scale-90 ${padSize} ${isActive ? 'scale-110 z-20 opacity-100 border-white shadow-[0_0_60px_white]' : 'opacity-70 border-transparent shadow-2xl'}`}
              style={{
                backgroundColor: pad.hex,
                boxShadow: isActive ? `0 0 50px ${pad.hex}` : '0 10px 25px rgba(0,0,0,0.4)',
                left: `calc(50% + ${Math.cos(angle * (Math.PI / 180)) * 34}% - 56px)`,
                top: `calc(50% + ${Math.sin(angle * (Math.PI / 180)) * 34}% - 56px)`,
              }}
            >
                <div className="w-full h-full bg-white/10 rounded-[2.5rem] flex items-center justify-center">
                   <div className="w-6 h-6 bg-white/30 rounded-full blur-[1px]" />
                </div>
            </button>
          );
        })}
        <div className="w-24 h-24 bg-slate-900 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center shadow-inner z-10">
           <span className={`text-[10px] font-black uppercase tracking-tighter text-center transition-colors ${gameState === 'recalling' ? 'text-violet-400' : 'text-slate-600'}`}>
               {gameState === 'recalling' ? 'TU TURNO' : 'MIRA'}
           </span>
        </div>
      </div>

      <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center max-w-xs mt-4 h-4 italic">
        {gameState === 'failed' ? 'ERROR' : gameState === 'success' ? '¡GENIAL!' : message}
      </p>
    </div>
  );
};

export default PatternMaster;
