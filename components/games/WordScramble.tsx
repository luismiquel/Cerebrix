
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const WORDS = ['CEREBRO', 'LOGICA', 'MEMORIA', 'ENIGMA', 'CIENCIA', 'FUTURO', 'VELOZ', 'PENSAR', 'GENIO', 'NEURONA', 'SABIO', 'CALCULO', 'SISTEMA', 'MENTE', 'BRILLANTE'];

const WordScramble: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  
  // Tiempo inicial ajustado
  const initialTime = isSeniorMode ? 90 : (difficulty === 'easy' ? 60 : (difficulty === 'hard' ? 25 : 45));
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const nextWord = useCallback(() => {
    const next = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(next);
    setScrambled(next.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
  }, []);

  useEffect(() => {
    nextWord();
    const timer = setInterval(() => setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(timer);
        onGameOver(score * (difficulty === 'hard' ? 75 : 50));
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [nextWord, score, onGameOver, difficulty]);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === word) {
      setScore(s => s + 1);
      // Bono de tiempo
      let bonus = 5;
      if (isSeniorMode) bonus = 15;
      if (difficulty === 'easy') bonus = 10;
      if (difficulty === 'hard') bonus = 3;

      setTimeLeft(t => t + bonus);
      nextWord();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 text-center">
      <div className="flex justify-between w-full max-w-xs font-bold">
        <span className={`text-teal-400 ${(isSeniorMode || fontSize === 'large') ? 'text-3xl' : 'text-xl'}`}>Puntos: {score}</span>
        <span className={`text-rose-500 ${(isSeniorMode || fontSize === 'large') ? 'text-3xl' : 'text-xl'}`}>{timeLeft}s</span>
      </div>

      <div className="py-12 px-8 bg-slate-900/50 border border-slate-700 rounded-3xl w-full">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Ordena las letras</h3>
        <div className={`font-black tracking-[0.2em] text-white ${(isSeniorMode || fontSize === 'large') ? 'text-6xl' : 'text-5xl'}`}>
          {scrambled}
        </div>
      </div>

      <form onSubmit={check} className="w-full max-w-xs space-y-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe la palabra..."
          className={`w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center text-white font-bold uppercase outline-none focus:border-teal-500 ${(isSeniorMode || fontSize === 'large') ? 'text-2xl' : 'text-xl'}`}
          autoFocus
        />
        <button className={`w-full bg-teal-500 rounded-2xl font-bold text-white shadow-lg ${(isSeniorMode || fontSize === 'large') ? 'py-6 text-xl' : 'py-4'}`}>
          COMPROBAR
        </button>
      </form>
    </div>
  );
};

export default WordScramble;
