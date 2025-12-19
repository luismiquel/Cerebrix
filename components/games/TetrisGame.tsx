
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

  const dropInterval = isSeniorMode ? 1200 : (difficulty === 'master' ? 250 : (difficulty === 'hard' ? 450 : 800));
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
        triggerVibrate([50, 40, 100]); // Vibración rítmica para limpieza
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
        triggerVibrate(20); // Vibración corta para bloqueo
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
    if (!currentPiece || gameOver) return;
    if (!checkCollision(currentPiece.shape, { x: pos.x + dx, y: pos.y }, grid)) {
      setPos(p => ({ ...p, x: p.x + dx }));
      triggerVibrate(15);
    } else {
      triggerVibrate([5, 10]);
    }
  };

  const rotate = () => {
    if (!currentPiece || gameOver) return;
    const rotated = currentPiece.shape[0].map((_: any, i: number) => currentPiece.shape.map((row: any) => row[i]).reverse());
    if (!checkCollision(rotated, pos, grid)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
      triggerVibrate(35);
    } else {
      triggerVibrate([10, 20]);
    }
  };

  const hardDrop = () => {
    if (!currentPiece || gameOver) return;
    let tempY = pos.y;
    while (!checkCollision(currentPiece.shape, { x: pos.x, y: tempY + 1 }, grid)) {
      tempY++;
    }
    setPos(p => ({ ...p, y: tempY }));
    triggerVibrate([40, 20, 60]); // Vibración rítmica para caída
    lockPiece();
  };

  const ControlBtn = ({ onAction, children, className }: any) => (
    <button 
      onPointerDown={(e) => { e.preventDefault(); onAction(); }}
      className={`rounded-2xl border-b-[8px] transition-all flex items-center justify-center select-none touch-none active:translate-y-2 active:border-b-0 ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-between h-full select-none touch-none pb-4">
      <div className="flex justify-between w-full px-4 mb-2">
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Puntos</span>
            <div className="text-2xl font-black text-blue-400 italic leading-tight">{score.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="bg-slate-950 p-1 border-4 border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-10 grid-rows-20 w-[180px] md:w-[220px] h-[360px] md:h-[440px] gap-px">
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

      <div className="w-full grid grid-cols-4 gap-3 px-2 mt-6 h-36">
        <ControlBtn 
          onAction={() => move(-1)}
          className="bg-slate-800 border-slate-950 text-white text-4xl active:bg-indigo-600 shadow-lg"
        >←</ControlBtn>
        <ControlBtn 
          onAction={() => rotate()}
          className="col-span-2 bg-indigo-600 border-indigo-950 text-white shadow-xl active:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl leading-none">↻</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">ROTAR</span>
          </div>
        </ControlBtn>
        <ControlBtn 
          onAction={() => move(1)}
          className="bg-slate-800 border-slate-950 text-white text-4xl active:bg-indigo-600 shadow-lg"
        >→</ControlBtn>
        <ControlBtn 
          onAction={() => hardDrop()}
          className="col-span-4 h-16 bg-emerald-600 border-emerald-900 text-white text-lg font-black uppercase tracking-widest italic shadow-xl active:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
        >BAJADA RÁPIDA (DROP)</ControlBtn>
      </div>
    </div>
  );
};

export default TetrisGame;
