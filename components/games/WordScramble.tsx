
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const EASY_WORDS = ['CASA', 'LUNA', 'GATO', 'SOL', 'PAN', 'MAR', 'FLOR', 'LIBRO'];
const HARD_WORDS = ['CEREBRO', 'LOGICA', 'MEMORIA', 'ENIGMA', 'CIENCIA', 'FUTURO', 'VELOZ', 'PENSAR', 'GENIO', 'NEURONA'];
const MASTER_WORDS = ['PARALELISMO', 'ALGORITMO', 'QUINTAESENCIA', 'SINESTESIA', 'ENTROPIA', 'HEURISTICA', 'CRIPTOGRAFIA', 'NEUROPLASTICIDAD'];

const WordScramble: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  
  const getInitialTime = () => {
    if (isSeniorMode) return 90;
    switch(difficulty) {
        case 'easy': return 60;
        case 'hard': return 35;
        case 'master': return 20;
        default: return 45;
    }
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());

  const triggerVibrate = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
  };

  const nextWord = useCallback(() => {
    let pool = HARD_WORDS;
    if (difficulty === 'easy' || isSeniorMode) pool = EASY_WORDS;
    if (difficulty === 'master') pool = MASTER_WORDS;

    const next = pool[Math.floor(Math.random() * pool.length)];
    setWord(next);
    
    // Scramble que asegura que no sea igual a la original
    let nextScrambled = '';
    do {
        nextScrambled = next.split('').sort(() => Math.random() - 0.5).join('');
    } while (nextScrambled === next && next.length > 1);
    
    setScrambled(nextScrambled);
    setInput('');
  }, [difficulty, isSeniorMode]);

  useEffect(() => {
    nextWord();
    const timer = setInterval(() => setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(timer);
        onGameOver(score * (difficulty === 'master' ? 250 : 50));
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [nextWord, score, onGameOver, difficulty]);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === word) {
      triggerVibrate([15, 10, 15]);
      setScore(s => s + (difficulty === 'master' ? 5 : 1));
      
      let bonus = 5;
      if (isSeniorMode) bonus = 12;
      if (difficulty === 'master') bonus = 3;

      setTimeLeft(t => Math.min(t + bonus, 90));
      nextWord();
    } else {
        triggerVibrate(50);
        if (difficulty === 'master') {
            setTimeLeft(t => Math.max(0, t - 3)); // Penalización Maestro
        }
        setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 text-center select-none touch-none">
      <div className="flex justify-between w-full max-w-xs font-black">
        <span className={`text-teal-400 ${(isSeniorMode || fontSize === 'large') ? 'text-3xl' : 'text-xl'}`}>Puntos: {score}</span>
        <span className={`font-mono ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-300'} ${(isSeniorMode || fontSize === 'large') ? 'text-3xl' : 'text-xl'}`}>{timeLeft}s</span>
      </div>

      <div className="py-12 px-8 glass rounded-[3rem] border-4 border-white/5 w-full shadow-2xl relative overflow-hidden">
        {difficulty === 'master' && <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-rose-500 uppercase tracking-widest opacity-50">COMPLEJIDAD MÁXIMA</div>}
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Reconstruye la palabra</h3>
        <div className={`font-black tracking-[0.15em] text-white uppercase italic ${(isSeniorMode || fontSize === 'large') ? 'text-4xl' : (difficulty === 'master' ? 'text-2xl' : 'text-4xl')}`}>
          {scrambled}
        </div>
      </div>

      <form onSubmit={check} className="w-full max-w-xs space-y-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          className={`w-full bg-slate-900 border-4 border-slate-700 rounded-3xl p-5 text-center text-white font-black uppercase outline-none focus:border-teal-500 transition-all ${(isSeniorMode || fontSize === 'large') ? 'text-2xl' : 'text-xl'}`}
          autoFocus
        />
        <button className={`w-full bg-indigo-600 rounded-3xl font-black text-white shadow-xl active:translate-y-1 border-b-8 border-indigo-950 transition-all uppercase tracking-widest ${(isSeniorMode || fontSize === 'large') ? 'py-6 text-xl' : 'py-4'}`}>
          COMPROBAR
        </button>
      </form>
    </div>
  );
};

export default WordScramble;
