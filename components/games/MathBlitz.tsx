
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const MathBlitz: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, isDailyChallenge, currentRound = 1 }) => {
  // En Reto Diario, el objetivo es llegar a 10 aciertos por ronda
  const TARGET = 10;
  const [score, setScore] = useState(0);
  
  const getInitialTime = () => {
    let baseTime = 30;
    if (difficulty === 'master') baseTime = 15;
    if (isSeniorMode) baseTime *= 1.5;
    
    // Cada ronda del reto diario quita 5 segundos al tiempo inicial
    if (isDailyChallenge) {
      baseTime = Math.max(12, 35 - (currentRound * 6));
    }
    return baseTime;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [userInput, setUserInput] = useState('');
  const [showCorrect, setShowCorrect] = useState(false);

  const generateProblem = useCallback(() => {
    // La dificultad sube según la ronda del reto diario
    let level = isDailyChallenge ? currentRound : Math.floor(score / 5) + 1;
    let maxVal = 10 * level;
    
    const a = Math.floor(Math.random() * maxVal) + 2;
    const b = Math.floor(Math.random() * maxVal) + 2;
    
    const ops = ['+', '-'];
    if (level >= 2) ops.push('*');
    if (level >= 3) ops.push('/');

    const op = ops[Math.floor(Math.random() * ops.length)];
    let q = '', res = 0;

    if (op === '+') { q = `${a} + ${b}`; res = a + b; }
    else if (op === '-') { q = `${Math.max(a, b)} - ${Math.min(a, b)}`; res = Math.max(a, b) - Math.min(a, b); }
    else if (op === '*') { q = `${(a % 10) + 2} × ${(b % 10) + 2}`; res = ((a % 10) + 2) * ((b % 10) + 2); }
    else { 
        const divisor = (b % 10) + 2;
        const quotient = (a % 10) + 2;
        q = `${divisor * quotient} / ${divisor}`; 
        res = quotient; 
    }

    setProblem({ q, a: res });
    setUserInput('');
    setShowCorrect(false);
  }, [score, isDailyChallenge, currentRound]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else {
      // Fin del tiempo
      if (isDailyChallenge) {
        onGameOver(score * 20, score >= TARGET);
      } else {
        onGameOver(score * 25);
      }
    }
  }, [timeLeft, onGameOver, score, isDailyChallenge]);

  const handleInput = (val: string) => {
    const nextInput = userInput + val;
    setUserInput(nextInput);
    if (parseInt(nextInput) === problem.a) {
      setScore(s => {
        const nextScore = s + 1;
        // Si llegamos al objetivo en reto diario, terminamos la ronda con éxito
        if (isDailyChallenge && nextScore >= TARGET) {
          setTimeout(() => onGameOver(nextScore * 100, true), 500);
        }
        return nextScore;
      });
      setShowCorrect(true);
      setTimeLeft(t => Math.min(t + 2, 45));
      setTimeout(generateProblem, 200);
    } else if (nextInput.length >= problem.a.toString().length) {
      setTimeout(() => setUserInput(''), 150);
    }
  };

  return (
    <div className="text-center space-y-8 p-4 flex flex-col justify-center min-h-[450px]">
      <div className="flex justify-between items-center max-w-md mx-auto w-full px-6">
        <div className="flex flex-col items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aciertos</span>
            <div className="font-black text-emerald-500 text-3xl">
              {score}{isDailyChallenge && <span className="text-slate-400 text-sm ml-1">/ {TARGET}</span>}
            </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiempo</span>
            <div className={`font-mono font-bold ${timeLeft < 6 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} text-3xl`}>
                {timeLeft}s
            </div>
        </div>
      </div>

      <div className={`relative font-black my-4 py-16 glass rounded-[3rem] shadow-2xl border-2 transition-all duration-300 ${showCorrect ? 'border-emerald-500 scale-105' : 'border-white/5'} text-6xl dark:text-white`}>
        {problem.q}
        {showCorrect && <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 rounded-[3rem] animate-ping" />}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="rounded-2xl glass border-2 border-slate-200 dark:border-white/5 font-black hover:bg-emerald-500 hover:text-white transition-all active:scale-90 h-16 text-2xl dark:text-white">{n}</button>
        ))}
        <button onClick={() => setUserInput('')} className="col-span-2 rounded-2xl bg-rose-500/10 text-rose-500 font-black border-2 border-rose-500/20 active:scale-95 transition-all uppercase h-16 text-sm">BORRAR</button>
      </div>
      
      {isDailyChallenge && (
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Consigue {TARGET} para pasar a la Ronda {currentRound === 3 ? 'Final' : currentRound + 1}
        </div>
      )}
    </div>
  );
};

export default MathBlitz;
