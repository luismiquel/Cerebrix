
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
    if (difficulty === 'master') { displayTime = 300; gapTime = 150; }
    else if (difficulty === 'hard') { displayTime = 450; gapTime = 250; }
    
    await new Promise(r => setTimeout(r, 800));
    for (let i = 0; i < seq.length; i++) {
      const padId = seq[i];
      setActivePad(padId);
      // Vibración de pitch táctil: aumenta duración según el pad
      triggerVibrate(20 + (padId * 8)); 
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
    // Vibración corta de impacto firme
    triggerVibrate(30 + (id * 5)); 
    setTimeout(() => setActivePad(null), 150);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    if (id !== sequence[newUserSeq.length - 1]) {
      setGameState('failed');
      triggerVibrate([100, 50, 100]); // Vibración pesada para fallo
      setTimeout(() => onGameOver(score), 1000);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setGameState('success');
      triggerVibrate([40, 30, 40]); // Doble vibración corta para éxito de nivel
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
    <div className="flex flex-col items-center justify-center gap-8 md:gap-12 p-4 select-none touch-none h-full pb-10">
      <div className="flex justify-between w-full max-w-sm px-4">
        <span className="text-purple-400 font-black text-3xl italic tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] leading-tight">{score.toLocaleString()}</span>
        <span className="text-white font-black text-3xl italic tracking-tighter leading-tight">LVL {level}</span>
      </div>

      <div className="relative w-full aspect-square max-w-[340px] md:max-w-[420px] flex items-center justify-center">
        <div className="absolute inset-0 bg-white/5 rounded-full border-4 border-white/5 animate-pulse" />
        
        {activePads.map((pad, idx) => {
          const angle = (idx * (360 / padCount)) - 90;
          const isActive = activePad === pad.id;
          const padSize = padCount > 6 ? 'w-24 h-24 md:w-30 md:h-30' : 'w-28 h-28 md:w-34 md:h-34';
          
          return (
            <button
              key={pad.id}
              onPointerDown={(e) => { e.preventDefault(); handlePadClick(pad.id); }}
              disabled={gameState !== 'recalling'}
              className={`absolute rounded-[2.5rem] transition-all duration-150 border-[6px] md:border-[8px] active:scale-90 active:shadow-[0_0_40px_white] touch-none select-none ${padSize} ${isActive ? 'scale-115 z-20 opacity-100 border-white shadow-[0_0_60px_white]' : 'opacity-80 border-transparent shadow-2xl hover:opacity-100'}`}
              style={{
                backgroundColor: pad.hex,
                boxShadow: isActive ? `0 0 80px ${pad.hex}` : '0 20px 45px rgba(0,0,0,0.7)',
                left: `calc(50% + ${Math.cos(angle * (Math.PI / 180)) * 36}% - ${padCount > 6 ? (window.innerWidth < 768 ? '48' : '60') : (window.innerWidth < 768 ? '56' : '68')}px)`,
                top: `calc(50% + ${Math.sin(angle * (Math.PI / 180)) * 36}% - ${padCount > 6 ? (window.innerWidth < 768 ? '48' : '60') : (window.innerWidth < 768 ? '56' : '68')}px)`,
                WebkitTapHighlightColor: 'transparent'
              }}
            >
                <div className="w-full h-full bg-white/10 rounded-[2.5rem] flex items-center justify-center">
                   <div className="w-10 h-10 md:w-14 md:h-14 bg-white/25 rounded-full blur-[1px] animate-pulse" />
                </div>
            </button>
          );
        })}
        <div className="w-24 h-24 md:w-36 md:h-36 bg-slate-900 rounded-full border-8 border-slate-800 flex flex-col items-center justify-center shadow-inner z-10">
           <span className={`text-[12px] font-black uppercase tracking-tighter text-center transition-colors leading-none ${gameState === 'recalling' ? 'text-violet-400' : 'text-slate-600'}`}>
               {gameState === 'recalling' ? 'TU TURNO' : 'MIRA'}
           </span>
        </div>
      </div>

      <p className="text-base text-slate-500 font-black uppercase tracking-widest text-center max-w-xs mt-6 h-8 italic">
        {gameState === 'failed' ? '¡ERROR!' : gameState === 'success' ? '¡GENIAL!' : message}
      </p>
    </div>
  );
};

export default PatternMaster;
