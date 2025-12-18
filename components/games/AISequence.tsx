
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const AISequence: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'preparing' | 'memorizing' | 'recalling' | 'failed' | 'success'>('preparing');
  const [activePad, setActivePad] = useState<number | null>(null);
  const [message, setMessage] = useState('Preparando...');

  const padCount = difficulty === 'master' ? 8 : (difficulty === 'hard' ? 6 : 4);
  const activePads = COLORS.slice(0, padCount);

  const vibrate = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

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
  }, [padCount]);

  const playSequence = async (seq: number[]) => {
    setGameState('memorizing');
    setMessage('OBSERVA...');
    let displayTime = 600;
    let gapTime = 400;
    if (difficulty === 'master') { displayTime = 250; gapTime = 100; }
    else if (difficulty === 'hard') { displayTime = 400; gapTime = 200; }
    
    await new Promise(r => setTimeout(r, 800));
    for (let i = 0; i < seq.length; i++) {
      setActivePad(seq[i]);
      vibrate(15);
      await new Promise(r => setTimeout(r, displayTime));
      setActivePad(null);
      await new Promise(r => setTimeout(r, gapTime));
    }
    setGameState('recalling');
    setMessage('¡TU TURNO!');
  };

  const handlePadClick = (id: number) => {
    if (gameState !== 'recalling') return;
    
    setActivePad(id);
    vibrate(10);
    setTimeout(() => setActivePad(null), 150);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    if (id !== sequence[newUserSeq.length - 1]) {
      setGameState('failed');
      vibrate([50, 50, 50]);
      setTimeout(() => onGameOver(score), 1000);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setGameState('success');
      vibrate(40);
      setScore(s => s + (sequence.length * 200));
      setTimeout(() => { 
        setLevel(l => l + 1); 
        generateNextLevel(sequence); 
      }, 800);
    }
  };

  useEffect(() => {
    generateNextLevel([]);
  }, [generateNextLevel]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-4 select-none">
      <div className="flex justify-between w-full max-w-sm">
        <span className="text-purple-400 font-black text-2xl">{score.toLocaleString()}</span>
        <span className="bg-purple-500/10 text-purple-300 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{message}</span>
        <span className="text-white font-black text-2xl">Lvl {level}</span>
      </div>

      <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
        {activePads.map((pad, idx) => {
          const angle = (idx * (360 / padCount)) - 90;
          const isActive = activePad === pad.id;
          
          return (
            <button
              key={pad.id}
              onPointerDown={(e) => { e.preventDefault(); handlePadClick(pad.id); }}
              disabled={gameState !== 'recalling'}
              className={`absolute w-24 h-24 rounded-[2rem] transition-all duration-100 border-4 active:scale-90 ${isActive ? 'scale-110 z-20 opacity-100' : 'opacity-60 border-transparent'}`}
              style={{
                backgroundColor: pad.hex,
                boxShadow: isActive ? `0 0 50px ${pad.hex}` : 'none',
                left: `calc(50% + ${Math.cos(angle * (Math.PI / 180)) * 38}% - 48px)`,
                top: `calc(50% + ${Math.sin(angle * (Math.PI / 180)) * 38}% - 48px)`,
              }}
            >
                <div className="w-full h-full bg-white/10 rounded-[2rem] flex items-center justify-center">
                   <div className="w-3 h-3 bg-white/40 rounded-full" />
                </div>
            </button>
          );
        })}
        {/* Centro del cerebro */}
        <div className="w-16 h-16 bg-slate-900 rounded-full border-4 border-slate-800 flex items-center justify-center">
           <div className={`w-2 h-2 rounded-full ${gameState === 'recalling' ? 'bg-purple-500 animate-pulse' : 'bg-slate-700'}`} />
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-center max-w-xs">
        {gameState === 'recalling' ? 'Toca la secuencia para activar tus neuronas' : 'Memoriza el pulso de color'}
      </p>
    </div>
  );
};

export default AISequence;
