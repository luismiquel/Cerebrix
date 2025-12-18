
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

const createGrid = () => Array.from(Array(ROWS), () => Array(COLS).fill(0));

const TetrisGame: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode }) => {
  const [grid, setGrid] = useState<number[][]>(createGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const dropInterval = isSeniorMode ? 1200 : (difficulty === 'hard' ? 400 : 800);
  const timerRef = useRef<number>(0);

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
    // @ts-ignore
    const piece = { ...TETROMINOS[rand], type: rand };
    const pPos = { x: 3, y: 0 };
    if (checkCollision(piece.shape, pPos, grid)) {
      setGameOver(true);
      onGameOver(score);
    } else {
      setCurrentPiece(piece);
      setPos(pPos);
    }
  }, [grid, checkCollision, score, onGameOver]);

  useEffect(() => {
    spawn();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (!checkCollision(currentPiece.shape, { x: pos.x, y: pos.y + 1 }, grid)) {
        setPos(p => ({ ...p, y: p.y + 1 }));
      } else {
        // Lock
        const newGrid = grid.map(row => [...row]);
        currentPiece.shape.forEach((row: number[], y: number) => {
          row.forEach((v, x) => {
            if (v !== 0) newGrid[y + pos.y][x + pos.x] = v;
          });
        });
        
        // Clear lines
        let cleared = 0;
        const filtered = newGrid.filter(row => {
          if (row.every(c => c !== 0)) {
            cleared++;
            return false;
          }
          return true;
        });
        while (filtered.length < ROWS) filtered.unshift(Array(COLS).fill(0));
        
        setGrid(filtered);
        setScore(s => s + (cleared * 100));
        spawn();
      }
    }, dropInterval);
    return () => clearInterval(interval);
  }, [currentPiece, pos, grid, gameOver, spawn, checkCollision, dropInterval]);

  const move = (dx: number) => {
    if (!checkCollision(currentPiece.shape, { x: pos.x + dx, y: pos.y }, grid)) {
      setPos(p => ({ ...p, x: p.x + dx }));
    }
  };

  const rotate = () => {
    const rotated = currentPiece.shape[0].map((_: any, i: number) => currentPiece.shape.map((row: any) => row[i]).reverse());
    if (!checkCollision(rotated, pos, grid)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-bold">Puntos: {score}</div>
      <div className="bg-slate-950 p-1 border-4 border-slate-800 rounded-xl">
        <div className="grid grid-cols-10 grid-rows-20 w-48 h-96 gap-px">
          {grid.map((row, y) => row.map((cell, x) => {
            let color = 'bg-slate-900';
            if (cell !== 0) {
              const types = ['bg-cyan-400', 'bg-blue-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500', 'bg-rose-500'];
              color = types[cell - 1];
            }
            // Pieza actual activa
            if (currentPiece) {
              const py = y - pos.y;
              const px = x - pos.x;
              if (py >= 0 && py < currentPiece.shape.length && px >= 0 && px < currentPiece.shape[0].length) {
                if (currentPiece.shape[py][px] !== 0) color = currentPiece.color;
              }
            }
            return <div key={`${y}-${x}`} className={`w-full h-full ${color}`} />;
          }))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-48">
        <button onClick={() => move(-1)} className="p-4 bg-slate-700 rounded-xl">←</button>
        <button onClick={rotate} className="p-4 bg-slate-700 rounded-xl">↻</button>
        <button onClick={() => move(1)} className="p-4 bg-slate-700 rounded-xl">→</button>
      </div>
    </div>
  );
};

export default TetrisGame;
