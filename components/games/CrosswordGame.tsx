
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../../types';
import { getCrosswordData } from '../../services/dataService';

const CrosswordGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [data, setData] = useState<any>(null);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    loadLevel();
  }, []);

  const loadLevel = async () => {
    setLoading(true);
    setMessage('');
    try {
      const crossword = await getCrosswordData();
      setData(crossword);
      const initialGrid = crossword.grid.map((row: string) => 
        row.split('').map((char: string) => char === '#' ? '#' : '')
      );
      setUserGrid(initialGrid);
      inputRefs.current = Array(5).fill(null).map(() => Array(5).fill(null));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (r: number, c: number, val: string) => {
    const newVal = val.slice(-1).toUpperCase();
    if (newVal && !/[A-ZÑ]/.test(newVal)) return;
    const newGrid = [...userGrid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = newVal;
    setUserGrid(newGrid);
    if (newVal && c < 4 && data?.grid[r][c + 1] !== '#') {
      inputRefs.current[r][c + 1]?.focus();
    }
  };

  const checkSolution = () => {
    if (!data) return;
    let isCorrect = true;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (data.grid[r][c] !== '#' && userGrid[r][c] !== data.grid[r][c]) {
          isCorrect = false;
        }
      }
    }
    if (isCorrect) {
      setScore(s => s + 500);
      setMessage('¡Correcto!');
      setTimeout(loadLevel, 2000);
    } else {
      setMessage('Hay errores en la cuadrícula.');
    }
  };

  if (loading) return <div className="text-center">Cargando desafío...</div>;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="grid grid-cols-5 gap-1 bg-slate-900 p-2 rounded-xl border-4 border-slate-700">
        {userGrid.map((row, r) => row.map((cell, c) => (
          data.grid[r][c] === '#' ? (
            <div key={`${r}-${c}`} className="w-12 h-12 bg-slate-800 rounded-md" />
          ) : (
            <input
              key={`${r}-${c}`}
              ref={el => { if(inputRefs.current[r]) inputRefs.current[r][c] = el; }}
              type="text"
              value={cell}
              onChange={e => handleInputChange(r, c, e.target.value)}
              className="w-12 h-12 text-center text-xl font-bold bg-white text-slate-900 rounded-md border-2 border-slate-300 focus:border-teal-500 outline-none uppercase"
            />
          )
        )))}
      </div>
      <div className="w-full max-w-sm space-y-4">
        <h4 className="text-teal-400 font-bold uppercase text-xs">Pistas</h4>
        <ul className="text-sm space-y-2 text-slate-300">
          {data.clues.map((clue: any, i: number) => (
            <li key={i}>{clue.id}. ({clue.direction}) {clue.text}</li>
          ))}
        </ul>
      </div>
      {message && <div className="text-emerald-400 font-bold">{message}</div>}
      <button onClick={checkSolution} className="w-full py-4 bg-teal-500 rounded-2xl font-bold text-white uppercase">Comprobar</button>
    </div>
  );
};

export default CrosswordGame;
