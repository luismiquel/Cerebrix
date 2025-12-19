
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import Celebration from '../Celebration';

const SudokuMini: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [initial, setInitial] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const generateBoard = () => {
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    setSolution(shuffled);

    let emptyCount = 4;
    if (difficulty === 'medium') emptyCount = 6;
    if (difficulty === 'hard') emptyCount = 9;
    if (difficulty === 'master') emptyCount = 12;
    if (isSeniorMode) emptyCount = 3;

    const newGrid = shuffled.map(row => [...row]);
    const newInitial = Array(4).fill(null).map(() => Array(4).fill(true));

    let removed = 0;
    while (removed < emptyCount) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);
      if (newGrid[r][c] !== 0) {
        newGrid[r][c] = 0;
        newInitial[r][c] = false;
        removed++;
      }
    }
    setGrid(newGrid);
    setInitial(newInitial);
    setShowCelebration(false);
  };

  useEffect(() => {
    generateBoard();
  }, [difficulty, isSeniorMode]);

  const handleInput = (num: number) => {
    if (!selected) return;
    const [r, c] = selected;
    if (initial[r][c]) return;

    const newGrid = [...grid];
    newGrid[r][c] = num;
    setGrid(newGrid);

    const isFull = newGrid.every(row => row.every(cell => cell !== 0));
    if (isFull) {
      const isCorrect = newGrid.every((row, r) => row.every((cell, c) => cell === solution[r][c]));
      if (isCorrect) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 10, 20]);
        setScore(s => s + (difficulty === 'master' ? 800 : 400));
        setShowCelebration(true);
        setTimeout(() => {
          generateBoard();
          setSelected(null);
        }, 1500);
      } else {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 select-none touch-none relative">
      <Celebration active={showCelebration} type="success" />
      <div className="flex justify-between w-full max-w-xs items-center mb-2">
         <span className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Puntos: {score}</span>
         {difficulty === 'master' && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">MAESTRO</span>}
      </div>

      <div className="grid grid-cols-4 gap-2 bg-slate-900 p-3 rounded-2xl border-4 border-slate-700 shadow-2xl">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onPointerDown={(e) => { e.preventDefault(); setSelected([r, c]); }}
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black transition-all border-2 ${
              initial[r][c] ? 'bg-slate-800 text-slate-500 border-transparent' : 
              selected?.[0] === r && selected?.[1] === c ? 'bg-indigo-500 text-white border-white scale-105 z-10' : 'bg-slate-700 text-white border-white/5'
            }`}
          >
            {cell !== 0 ? cell : ''}
          </button>
        )))}
      </div>
      
      <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onPointerDown={(e) => { e.preventDefault(); handleInput(n); }}
            className="h-16 bg-indigo-600 rounded-2xl font-black text-white text-2xl active:translate-y-2 border-b-4 border-indigo-950 transition-all shadow-lg hover:bg-indigo-500"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SudokuMini;
