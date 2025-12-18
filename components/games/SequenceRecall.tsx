
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const SequenceRecall: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, isDailyChallenge, currentRound = 1 }) => {
  // En Reto Diario, el objetivo depende de la ronda: Ronda 1=5, 2=7, 3=9
  const TARGET = isDailyChallenge ? (3 + currentRound * 2) : 10;
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [message, setMessage] = useState('RECUERDA');

  const startNextLevel = (prevSeq: number[] = []) => {
    if (isDailyChallenge && prevSeq.length >= TARGET) {
      setMessage('¡RONDA COMPLETADA!');
      setTimeout(() => onGameOver(prevSeq.length * 500, true), 1000);
      return;
    }

    const nextSeq = [...prevSeq, Math.floor(Math.random() * 9)];
    setSequence(nextSeq);
    setUserSequence([]);
    playSequence(nextSeq);
  };

  const playSequence = async (seq: number[]) => {
    setPlaying(true);
    setMessage('MIRA...');
    
    // Velocidad según ronda
    let displayTime = Math.max(250, 600 - (currentRound * 100));
    let gapTime = Math.max(150, 400 - (currentRound * 50));

    if (isSeniorMode) {
        displayTime = 800;
        gapTime = 500;
    }

    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < seq.length; i++) {
      setActiveBtn(seq[i]);
      await new Promise(r => setTimeout(r, displayTime));
      setActiveBtn(null);
      await new Promise(r => setTimeout(r, gapTime));
    }
    setPlaying(false);
    setMessage('¡TU TURNO!');
  };

  const handleBtnClick = (idx: number) => {
    if (playing) return;
    
    setActiveBtn(idx);
    setTimeout(() => setActiveBtn(null), 200);

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);

    if (idx !== sequence[newUserSeq.length - 1]) {
      setMessage('ERROR');
      // En Reto Diario si fallas antes del target, pierdes la ronda
      setTimeout(() => onGameOver((sequence.length - 1) * 100, sequence.length - 1 >= TARGET), 1000);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setMessage('¡BIEN!');
      setTimeout(() => startNextLevel(sequence), 800);
    }
  };

  useEffect(() => {
    // Empezar en longitud 3 si es ronda 2 o 3 del reto
    const startLen = isDailyChallenge ? (currentRound + 1) : 1;
    const initialSeq = Array.from({ length: startLen }, () => Math.floor(Math.random() * 9));
    setSequence(initialSeq);
    playSequence(initialSeq);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="text-center">
        <h3 className={`font-black italic tracking-tighter uppercase ${playing ? 'text-amber-500' : 'text-teal-400'} text-2xl`}>
          {message}
        </h3>
        <div className="flex gap-4 justify-center items-center mt-2">
           <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
             Progreso: {sequence.length} / {TARGET}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {[...Array(9)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleBtnClick(i)}
            disabled={playing}
            className={`aspect-square rounded-2xl transition-all duration-200 border-2 ${
              activeBtn === i 
                ? 'bg-teal-400 border-teal-300 scale-95 shadow-[0_0_20px_rgba(45,212,191,0.8)]' 
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
            }`}
          />
        ))}
      </div>
      
      {isDailyChallenge && (
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
          Supera la longitud {TARGET} para avanzar
        </p>
      )}
    </div>
  );
};

export default SequenceRecall;
