
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const MathBlitz: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, isDailyChallenge, currentRound = 1 }) => {
  const TARGET = 10;
  const [score, setScore] = useState(0);
  
  const getInitialTime = () => {
    let baseTime = 30;
    if (difficulty === 'master') baseTime = 10; // Reducido para mayor intensidad
    if (isSeniorMode) baseTime *= 1.5;
    if (isDailyChallenge) baseTime = Math.max(10, 35 - (currentRound * 6));
    return baseTime;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [userInput, setUserInput] = useState('');
  const [showCorrect, setShowCorrect] = useState(false);

  const triggerVibrate = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const generateProblem = useCallback(() => {
    let level = isDailyChallenge ? currentRound : Math.floor(score / 5) + 1;
    let maxVal = 10 * level;
    
    if (difficulty === 'master') {
        // Maestro: Operaciones de 3 términos con números más grandes
        const a = Math.floor(Math.random() * 40) + 15;
        const b = Math.floor(Math.random() * 30) + 10;
        const c = Math.floor(Math.random() * 20) + 5;
        const ops = ['+', '-'];
        const op1 = ops[Math.floor(Math.random() * ops.length)];
        const op2 = ops[Math.floor(Math.random() * ops.length)];
        
        let res = a;
        if (op1 === '+') res += b; else res -= b;
        if (op2 === '+') res += c; else res -= c;
        
        // Evitar resultados negativos en maestro para mantener el flujo rápido
        if (res < 0) { generateProblem(); return; }

        setProblem({ q: `${a} ${op1} ${b} ${op2} ${c}`, a: res });
    } else {
        const a = Math.floor(Math.random() * maxVal) + 2;
        const b = Math.floor(Math.random() * maxVal) + 2;
        const ops = ['+', '-'];
        if (level >= 2) ops.push('*');
        const op = ops[Math.floor(Math.random() * ops.length)];
        let q = '', res = 0;
        if (op === '+') { q = `${a} + ${b}`; res = a + b; }
        else if (op === '-') { q = `${Math.max(a, b)} - ${Math.min(a, b)}`; res = Math.max(a, b) - Math.min(a, b); }
        else { q = `${(a % 10) + 2} × ${(b % 10) + 2}`; res = ((a % 10) + 2) * ((b % 10) + 2); }
        setProblem({ q, a: res });
    }
    setUserInput('');
    setShowCorrect(false);
  }, [score, isDailyChallenge, currentRound, difficulty]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (timeLeft > 0) {
      // Cronómetro de precisión (decisegundos) para modo Maestro
      const timer = setInterval(() => setTimeLeft(t => Number((t - 0.1).toFixed(1))), 100);
      return () => clearInterval(timer);
    } else {
      onGameOver(score * (difficulty === 'master' ? 150 : 25), isDailyChallenge ? score >= TARGET : true);
    }
  }, [timeLeft, onGameOver, score, isDailyChallenge, difficulty]);

  const handleInput = (val: string) => {
    const nextInput = userInput + val;
    setUserInput(nextInput);
    if (parseInt(nextInput) === problem.a) {
      triggerVibrate(15);
      setScore(s => {
        const nextScore = s + 1;
        if (isDailyChallenge && nextScore >= TARGET) {
          setTimeout(() => onGameOver(nextScore * 100, true), 500);
        }
        return nextScore;
      });
      setShowCorrect(true);
      // Bono de tiempo drásticamente reducido en modo Maestro
      const timeBonus = difficulty === 'master' ? 0.7 : (isSeniorMode ? 3 : 2);
      setTimeLeft(t => Math.min(t + timeBonus, 45));
      setTimeout(generateProblem, 150);
    } else if (nextInput.length >= problem.a.toString().length) {
      triggerVibrate([5, 20]);
      setTimeout(() => setUserInput(''), 150);
    }
  };

  return (
    <div className="text-center space-y-6 p-4 flex flex-col justify-center min-h-[500px] select-none touch-none">
      <div className="flex justify-between items-center max-w-md mx-auto w-full px-6">
        <div className="flex flex-col items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Aciertos</span>
            <div className="font-black text-emerald-500 text-3xl italic">{score}</div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Tiempo</span>
            <div className={`font-mono font-bold ${timeLeft < 4 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} text-3xl`}>
              {timeLeft.toFixed(1)}s
            </div>
        </div>
      </div>

      <div className={`relative font-black my-4 py-12 glass rounded-[3rem] shadow-2xl border-2 transition-all duration-300 ${showCorrect ? 'border-emerald-500 scale-105' : 'border-white/5'} ${difficulty === 'master' ? 'text-4xl sm:text-5xl' : 'text-6xl'} dark:text-white flex items-center justify-center min-h-[160px]`}>
        {problem.q}
        {showCorrect && <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 rounded-[3rem] animate-ping" />}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button 
            key={n} 
            onPointerDown={(e) => { e.preventDefault(); handleInput(n.toString()); }} 
            className="h-20 rounded-3xl bg-slate-800/80 border-b-8 border-slate-950 font-black text-white active:translate-y-2 active:border-b-0 active:bg-emerald-600 transition-all shadow-xl text-3xl"
          >
            {n}
          </button>
        ))}
        <button 
          onPointerDown={(e) => { e.preventDefault(); setUserInput(''); }} 
          className="h-20 rounded-3xl bg-rose-500/10 text-rose-500 font-black border-b-8 border-rose-900 active:translate-y-2 active:border-b-0 transition-all uppercase text-sm"
        >
          DEL
        </button>
        <button 
          onPointerDown={(e) => { e.preventDefault(); handleInput('0'); }} 
          className="h-20 rounded-3xl bg-slate-800/80 border-b-8 border-slate-950 font-black text-white active:translate-y-2 active:border-b-0 active:bg-emerald-600 transition-all shadow-xl text-3xl"
        >
          0
        </button>
        <div className="h-20 flex items-center justify-center">
            {difficulty === 'master' && <span className="text-[10px] font-black text-rose-500 uppercase animate-pulse leading-none text-center">Modo<br/>Maestro</span>}
        </div>
      </div>
    </div>
  );
};

export default MathBlitz;
