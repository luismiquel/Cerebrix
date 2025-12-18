
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';

const SudokuMini: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [initial, setInitial] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);

  const generateBoard = () => {
    // Generador simplificado de 4x4
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];
    // Mezclar filas y columnas (simplificado)
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    setSolution(shuffled);

    let emptyCount = 4; // Easy
    if (difficulty === 'medium') emptyCount = 6;
    if (difficulty === 'hard') emptyCount = 8;
    if (difficulty === 'master') emptyCount = 10;
    if (isSeniorMode) emptyCount = Math.max(2, emptyCount - 2);

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

    // Verificar si completó
    const isFull = newGrid.every(row => row.every(cell => cell !== 0));
    if (isFull) {
      const isCorrect = newGrid.every((row, r) => row.every((cell, c) => cell === solution[r][c]));
      if (isCorrect) {
        setScore(s => s + 500);
        setTimeout(() => {
          generateBoard();
          setSelected(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="grid grid-cols-4 gap-2 bg-slate-900 p-3 rounded-2xl border-4 border-slate-700 shadow-2xl">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => setSelected([r, c])}
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black transition-all border-2 ${
              initial[r][c] ? 'bg-slate-800 text-slate-400 border-transparent' : 
              selected?.[0] === r && selected?.[1] === c ? 'bg-indigo-500 text-white border-white' : 'bg-slate-700 text-white border-white/5'
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
            onClick={() => handleInput(n)}
            className="h-14 bg-indigo-600 rounded-xl font-black text-white text-xl active:scale-90 transition-transform"
          >
            {n}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => onGameOver(score)}
        className="text-xs text-slate-500 font-bold uppercase hover:text-white"
      >
        Finalizar Entrenamiento
      </button>
    </div>
  );
};

export default SudokuMini;
