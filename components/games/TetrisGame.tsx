
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameProps } from '../../types';

const TETROMINOS = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: 'bg-cyan-400' },
  J: { shape: [[2, 0, 0], [2, 2, 2], [0, 0, 0]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 3], [3, 3, 3], [0, 0, 0]], color: 'bg-orange-500' },
  O: { shape: [[4, 4], [4, 4]], color: 'bg-yellow-400' },
  S: { shape: [[0, 5, 5], [5, 5, 0], [0, 0, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 6, 0], [6, 6, 6], [0, 0, 0]], color: 'bg-purple-500' },
  Z: { shape: [[7, 7, 0], [0, 7, 7], [0, 0, 0]], color: 'bg-rose-500' }
};

const COLS = 10;
const ROWS = 20;

const TetrisGame: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode, isDailyChallenge, currentRound = 1 }) => {
  const [grid, setGrid] = useState<number[][]>(Array.from(Array(ROWS), () => Array(COLS).fill(0)));
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [pos, setPos] = useState({ x: 3, y: 0 });

  const dropInterval = isSeniorMode ? 1200 : (difficulty === 'master' ? 200 : (difficulty === 'hard' ? 400 : 800));
  const TARGET_LINES = 5;

  const triggerVibrate = (pattern: number | number[]) => { 
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); 
  };

  const checkCollision = useCallback((pShape: number[][], pPos: { x: number, y: number }, board: number[][]) => {
    for (let y = 0; y < pShape.length; y++) {
      for (let x = 0; x < pShape[y].length; x++) {
        if (pShape[y][x] !== 0) {
          if (!board[y + pPos.y] || board[y + pPos.y][x + pPos.x] === undefined || board[y + pPos.y][x + pPos.x] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const spawn = useCallback(() => {
    const keys = 'IJLOSTZ';
    const rand = keys[Math.floor(Math.random() * keys.length)];
    const piece = { ...TETROMINOS[rand as keyof typeof TETROMINOS], type: rand };
    const pPos = { x: 3, y: 0 };
    if (checkCollision(piece.shape, pPos, grid)) {
      setGameOver(true);
      onGameOver(score, false);
    } else {
      setCurrentPiece(piece);
      setPos(pPos);
    }
  }, [grid, checkCollision, score, onGameOver]);

  useEffect(() => { spawn(); }, [spawn]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    const newGrid = grid.map(row => [...row]);
    currentPiece.shape.forEach((row: number[], y: number) => {
      row.forEach((v, x) => { if (v !== 0) newGrid[y + pos.y][x + pos.x] = v; });
    });
    let cleared = 0;
    const filtered = newGrid.filter(row => {
      const isFull = row.every(c => c !== 0);
      if (isFull) cleared++;
      return !isFull;
    });
    while (filtered.length < ROWS) filtered.unshift(Array(COLS).fill(0));
    setGrid(filtered);
    
    if (cleared > 0) {
        triggerVibrate([60, 40, 120, 20, 40]);
        setScore(s => s + (cleared * 100));
        setLinesCleared(l => {
            const total = l + cleared;
            if (isDailyChallenge && total >= TARGET_LINES) {
                setGameOver(true);
                setTimeout(() => onGameOver(score + 1000, true), 500);
            }
            return total;
        });
    } else {
        triggerVibrate(15);
    }
    spawn();
  }, [currentPiece, pos, grid, isDailyChallenge, score, onGameOver, spawn]);

  useEffect(() => {
    if (gameOver || !currentPiece) return;
    const interval = setInterval(() => {
      if (!checkCollision(currentPiece.shape, { x: pos.x, y: pos.y + 1 }, grid)) {
        setPos(p => ({ ...p, y: p.y + 1 }));
      } else {
        lockPiece();
      }
    }, dropInterval);
    return () => clearInterval(interval);
  }, [currentPiece, pos, grid, gameOver, checkCollision, dropInterval, lockPiece]);

  const move = (dx: number) => {
    if (!currentPiece) return;
    if (!checkCollision(currentPiece.shape, { x: pos.x + dx, y: pos.y }, grid)) {
      setPos(p => ({ ...p, x: p.x + dx }));
      triggerVibrate(8);
    } else {
      triggerVibrate(5);
    }
  };

  const rotate = () => {
    if (!currentPiece) return;
    const rotated = currentPiece.shape[0].map((_: any, i: number) => currentPiece.shape.map((row: any) => row[i]).reverse());
    if (!checkCollision(rotated, pos, grid)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
      triggerVibrate(25);
    } else {
      triggerVibrate([5, 10]);
    }
  };

  const hardDrop = () => {
    if (!currentPiece) return;
    let tempY = pos.y;
    while (!checkCollision(currentPiece.shape, { x: pos.x, y: tempY + 1 }, grid)) {
      tempY++;
    }
    setPos(p => ({ ...p, y: tempY }));
    triggerVibrate([50, 30, 80]);
    lockPiece();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full select-none touch-none pb-2">
      <div className="flex justify-between w-full px-4 mb-2">
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Puntos</span>
            <div className="text-2xl font-black text-blue-400 italic">{score.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="bg-slate-950 p-1 border-4 border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-10 grid-rows-20 w-[180px] h-[360px] gap-px">
          {grid.map((row, y) => row.map((cell, x) => {
            let color = 'bg-slate-900/40';
            if (cell !== 0) {
              const types = ['bg-cyan-400', 'bg-blue-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500', 'bg-rose-500'];
              color = types[cell - 1];
            }
            if (currentPiece) {
              const py = y - pos.y;
              const px = x - pos.x;
              if (py >= 0 && py < currentPiece.shape.length && px >= 0 && px < currentPiece.shape[0].length) {
                if (currentPiece.shape[py][px] !== 0) color = currentPiece.color;
              }
            }
            return <div key={`${y}-${x}`} className={`w-full h-full rounded-sm ${color}`} />;
          }))}
        </div>
      </div>

      <div className="w-full flex justify-between gap-4 px-2 mt-6 h-48">
        <div className="grid grid-cols-2 gap-3 flex-1">
            <button onPointerDown={(e) => { e.preventDefault(); move(-1); }} className="h-full bg-slate-800/80 rounded-[2rem] border-b-8 border-slate-950 flex items-center justify-center text-5xl active:scale-95 active:translate-y-1 active:border-b-4 transition-all shadow-xl text-white touch-none select-none">←</button>
            <button onPointerDown={(e) => { e.preventDefault(); move(1); }} className="h-full bg-slate-800/80 rounded-[2rem] border-b-8 border-slate-950 flex items-center justify-center text-5xl active:scale-95 active:translate-y-1 active:border-b-4 transition-all shadow-xl text-white touch-none select-none">→</button>
            <button onPointerDown={(e) => { e.preventDefault(); hardDrop(); }} className="col-span-2 h-20 bg-emerald-600 rounded-[2rem] border-b-8 border-emerald-900 flex items-center justify-center text-2xl font-black active:scale-95 active:translate-y-1 active:border-b-4 transition-all shadow-lg text-white uppercase tracking-widest italic touch-none select-none">DROP</button>
        </div>
        
        <div className="w-1/3 flex flex-col">
            <button onPointerDown={(e) => { e.preventDefault(); rotate(); }} className="h-full bg-indigo-600 rounded-[2.5rem] border-b-8 border-indigo-950 flex flex-col items-center justify-center active:scale-90 active:translate-y-1 active:border-b-4 transition-all shadow-xl shadow-indigo-500/20 touch-none select-none">
                <span className="text-6xl text-white">↻</span>
                <span className="text-[10px] font-black uppercase text-white/50 tracking-widest mt-2">ROTAR</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
