
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';
import Celebration from '../Celebration';

const Calculadora: React.FC<GameProps> = ({ onGameOver, fontSize, difficulty, isSeniorMode, isDailyChallenge, currentRound = 1 }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [problem, setProblem] = useState({ expression: '', answer: 0, isAlgebra: false });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showCelebration, setShowCelebration] = useState(false);

  const TARGET = 10;

  const vibrate = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
  };

  const generateProblem = useCallback((currentScore: number) => {
    let baseDifficulty = 1;
    switch (difficulty) {
      case 'easy': baseDifficulty = 1; break;
      case 'medium': baseDifficulty = 3; break;
      case 'hard': baseDifficulty = 6; break;
      case 'master': baseDifficulty = 12; break;
    }

    if (isDailyChallenge) baseDifficulty += (currentRound - 1) * 4;
    const level = baseDifficulty + Math.floor(currentScore / 100);

    if (difficulty === 'master' && Math.random() > 0.4) {
        const a = Math.floor(Math.random() * 20) + 5;
        const x = Math.floor(Math.random() * 20) + 2;
        const operators = ['+', '-', '*'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        
        let expr = '';
        let ans = x;
        
        if (op === '+') { expr = `x + ${a} = ${x + a}`; }
        else if (op === '-') { expr = `x - ${a} = ${x - a}`; }
        else { expr = `x * ${a} = ${x * a}`; }

        setProblem({ expression: expr, answer: ans, isAlgebra: true });
    } else {
        const operators = ['+', '-'];
        if (level > 2) operators.push('*');
        if (level > 5) operators.push('/');

        const operator = operators[Math.floor(Math.random() * operators.length)];
        let a = 0, b = 0, ans = 0;
        let maxVal = 10 + (level * 5);
        if (isSeniorMode) maxVal = Math.max(10, Math.floor(maxVal * 0.6));

        switch (operator) {
            case '+': a = Math.floor(Math.random() * maxVal) + 1; b = Math.floor(Math.random() * maxVal) + 1; ans = a + b; break;
            case '-': a = Math.floor(Math.random() * maxVal) + 1; b = Math.floor(Math.random() * maxVal) + 1; if (a < b) [a, b] = [b, a]; ans = a - b; break;
            case '*': a = Math.floor(Math.random() * (level + 5)) + 2; b = Math.floor(Math.random() * 10) + 2; ans = a * b; break;
            case '/': b = Math.floor(Math.random() * 10) + 2; ans = Math.floor(Math.random() * (level + 5)) + 2; a = b * ans; break;
        }
        setProblem({ expression: `${a} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${b}`, answer: ans, isAlgebra: false });
    }
    
    setInput('');
    setFeedback('none');
  }, [difficulty, isSeniorMode, isDailyChallenge, currentRound]);

  useEffect(() => {
    generateProblem(0);
  }, [generateProblem]);

  const handleInput = (val: string) => {
    if (feedback !== 'none') return;
    vibrate(10);
    setInput(prev => (prev.length > 5 ? prev : prev + val));
  };

  const handleBackspace = () => {
    if (feedback !== 'none') return;
    vibrate(15);
    setInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (feedback !== 'none' || !input) return;
    const val = parseInt(input);
    if (val === problem.answer) {
        vibrate(30);
        setFeedback('correct');
        const newScore = score + (problem.isAlgebra ? 25 : 10);
        setScore(newScore);
        const correctAnswers = Math.floor(newScore / 10);
        if (isDailyChallenge && correctAnswers >= TARGET) {
          setShowCelebration(true);
          vibrate([40, 30, 80]);
          setTimeout(() => onGameOver(newScore + 500, true), 1200);
        } else {
          setTimeout(() => generateProblem(newScore), 600);
        }
    } else {
        vibrate([30, 30, 30]);
        setFeedback('wrong');
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
            setTimeout(() => onGameOver(score, false), 1000);
        } else {
            setTimeout(() => { setInput(''); setFeedback('none'); }, 800);
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none relative">
      <Celebration active={showCelebration} type="success" />
      <div className={`flex justify-between w-full font-bold mb-4 ${fontSize === 'large' ? 'text-2xl' : 'text-xl'}`}>
        <div className="flex items-center gap-2">
            <span className="text-rose-500">❤️</span>
            <span className={lives === 1 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}>{lives}</span>
        </div>
        <div className="text-emerald-400 font-black italic">
           {problem.isAlgebra && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full mr-2">MAESTRO x2</span>}
           {score.toLocaleString()}
        </div>
      </div>

      <div className={`
        w-full h-36 bg-slate-900/80 rounded-[2.5rem] border-4 flex flex-col items-end justify-center p-8 gap-1 mb-6
        ${feedback === 'correct' ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20' : 
          feedback === 'wrong' ? 'border-rose-500 shadow-2xl shadow-rose-500/20' : 
          'border-slate-800'}
        transition-all duration-300
      `}>
        <div className="text-slate-600 text-[10px] font-black tracking-widest uppercase">
            {problem.isAlgebra ? 'Encuentra el valor de X' : 'Operación'}
        </div>
        <div className={`text-slate-400 font-mono font-bold tracking-tighter ${fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>{problem.expression}</div>
        <div className={`text-white font-mono font-black ${fontSize === 'large' ? 'text-6xl' : 'text-5xl'}`}>{input || '?'}</div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full mt-auto">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(n => (
            <button 
                key={n}
                onPointerDown={(e) => { e.preventDefault(); handleInput(n.toString()); }}
                className="bg-slate-800/80 h-20 rounded-3xl font-black text-white shadow-lg active:scale-95 active:bg-indigo-600 border-b-4 border-slate-950 transition-all text-3xl touch-none"
            >
                {n}
            </button>
        ))}
        <button 
          onPointerDown={(e) => { e.preventDefault(); handleBackspace(); }}
          className="bg-rose-500/20 h-20 rounded-3xl text-rose-500 border-b-4 border-rose-900 active:scale-95 text-2xl font-black"
        >
          ⌫
        </button>
        <button 
          onPointerDown={(e) => { e.preventDefault(); handleInput('0'); }}
          className="bg-slate-800/80 h-20 rounded-3xl font-black text-white shadow-lg active:scale-95 active:bg-indigo-600 border-b-4 border-slate-950 transition-all text-3xl"
        >
          0
        </button>
        <button 
          onPointerDown={(e) => { e.preventDefault(); handleSubmit(); }}
          className="bg-emerald-500 h-20 rounded-3xl text-white font-black border-b-4 border-emerald-800 text-4xl shadow-xl active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default Calculadora;
