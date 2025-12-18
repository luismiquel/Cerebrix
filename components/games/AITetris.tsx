
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameProps } from '../../types';

const TETROMINOS = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: 'bg-cyan-400' },
  J: { shape: [[2, 0, 0], [2, 2, 2], [0, 0, 0]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 3], [3, 3, 3], [0, 0, 0]], color: 'bg-orange-500' },
  O: { shape: [[4, 4], [4, 4]], color: 'bg-yellow-400' },
  S: { shape: [[0, 5, 5], [5, 5, 0], [0, 0, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 6, 0], [6, 6, 6], [0, 0, 0]], color: 'bg-purple-500' },
  Z: { shape: [[7, 7, 0], [0, 7, 7], [0, 0, 0]], color: 'bg-rose-500' },
  P1: { shape: [[8, 8], [8, 8], [8, 0]], color: 'bg-white shadow-[0_0_10px_white]' },
  P2: { shape: [[9, 9, 9], [0, 9, 0], [0, 9, 0]], color: 'bg-indigo-300 shadow-[0_0_10px_indigo]' }
};

const COLS = 10;
const ROWS = 20;

const createGrid = () => Array.from(Array(ROWS), () => Array(COLS).fill(0));

const AITetris: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode, fontSize }) => {
  const [grid, setGrid] = useState<number[][]>(createGrid());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][], color: string, type: string } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState<{ shape: number[][], color: string, type: string } | null>(null);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);

  const vibrate = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
  };

  const getDropInterval = () => {
    let base = 800;
    if (difficulty === 'hard') base = 500;
    if (difficulty === 'master') base = 350;
    if (isSeniorMode) base = 1500;
    return Math.max(100, base - (level - 1) * 50);
  };

  const generateNewPiece = useCallback(() => {
    const keys = difficulty === 'master' ? 'IJLOSTZP1P2' : 'IJLOSTZ';
    const rand = keys[Math.floor(Math.random() * keys.length)];
    // @ts-ignore
    return { ...TETROMINOS[rand], type: rand };
  }, [difficulty]);

  const checkCollision = useCallback((pieceShape: number[][], position: { x: number, y: number }, board: number[][]) => {
    for (let y = 0; y < pieceShape.length; y++) {
      for (let x = 0; x < pieceShape[y].length; x++) {
        if (pieceShape[y][x] !== 0) {
          const newY = position.y + y;
          const newX = position.x + x;
          if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && board[newY][newX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const spawnPiece = useCallback((piece: any) => {
    const startPos = { x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2), y: 0 };
    setCurrentPiece(piece);
    setPos(startPos);
    
    if (checkCollision(piece.shape, startPos, grid)) {
      setGameOver(true);
      onGameOver(score);
    }
    setNextPiece(generateNewPiece());
  }, [grid, checkCollision, generateNewPiece, onGameOver, score]);

  useEffect(() => {
    const first = generateNewPiece();
    setNextPiece(generateNewPiece());
    spawnPiece(first);
  }, []);

  const move = (dirX: number) => {
    if (!currentPiece || gameOver) return;
    const nextPos = { x: pos.x + dirX, y: pos.y };
    if (!checkCollision(currentPiece.shape, nextPos, grid)) {
      setPos(nextPos);
      vibrate(10);
    } else {
        vibrate([5, 10]);
    }
  };

  const rotate = () => {
    if (!currentPiece || gameOver) return;
    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    let offset = 0;
    if (checkCollision(rotated, pos, grid)) {
      offset = pos.x > COLS / 2 ? -1 : 1;
      if (checkCollision(rotated, { ...pos, x: pos.x + offset }, grid)) return;
    }
    setPos(prev => ({ ...prev, x: prev.x + offset }));
    setCurrentPiece(prev => ({ ...prev!, shape: rotated }));
    vibrate(25);
  };

  const lockPiece = () => {
    if(!currentPiece) return;
    const newGrid = grid.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const ny = pos.y + y;
          const nx = pos.x + x;
          if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
              const typeIndex = 'IJLOSTZPG'.indexOf(currentPiece.type[0]) + 1;
              newGrid[ny][nx] = typeIndex || 1;
          }
        }
      });
    });

    let cleared = 0;
    const finalGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) cleared++;
      return !isFull;
    });

    while (finalGrid.length < ROWS) finalGrid.unshift(Array(COLS).fill(0));
    setGrid(finalGrid);
    
    if (cleared > 0) {
      vibrate([40, 30, 80]);
      const points = [0, 100, 300, 500, 800, 1200];
      setScore(s => s + points[cleared] * level * (difficulty === 'master' ? 3 : 1));
      setLines(l => {
          const nl = l + cleared;
          if (Math.floor(nl / 10) > Math.floor(l / 10)) setLevel(lv => lv + 1);
          return nl;
      });
    } else {
      vibrate(15);
    }
    if (nextPiece) spawnPiece(nextPiece);
  };

  const drop = () => {
    if (!currentPiece || gameOver) return;
    if (!checkCollision(currentPiece.shape, { x: pos.x, y: pos.y + 1 }, grid)) {
      setPos(prev => ({ ...prev, y: prev.y + 1 }));
      dropCounterRef.current = 0;
    } else {
      lockPiece();
    }
  };

  const hardDrop = () => {
    if (!currentPiece || gameOver) return;
    let tempY = pos.y;
    while (!checkCollision(currentPiece.shape, { x: pos.x, y: tempY + 1 }, grid)) {
      tempY++;
    }
    setPos(p => ({ ...p, y: tempY }));
    lockPiece();
    vibrate([30, 20, 30]);
  };

  const update = (time: number) => {
    if (gameOver) return;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;
    if (dropCounterRef.current > getDropInterval()) drop();
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [currentPiece, pos, grid, gameOver, level]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotate();
      if (e.key === ' ') hardDrop();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPiece, pos, grid, gameOver]);

  const getColorClass = (val: number) => {
    if (val === 0) return 'bg-slate-900/40';
    if (val === 10) return 'bg-slate-600 grayscale animate-pulse';
    const types = ['bg-cyan-400', 'bg-blue-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500', 'bg-rose-500', 'bg-white', 'bg-indigo-300'];
    return types[val - 1] || 'bg-slate-500';
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full max-w-md mx-auto select-none touch-none">
      
      <div className="flex justify-between w-full px-4 items-center">
        <div>
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Puntos</span>
           <span className="text-2xl font-black text-blue-400 italic">{score.toLocaleString()}</span>
        </div>
        <div className="flex gap-4">
            <div className="text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Líneas</span>
                <span className="text-xl font-bold text-white">{lines}</span>
            </div>
            <div className="text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Nivel</span>
                <span className="text-xl font-bold text-indigo-400">{level}</span>
            </div>
        </div>
      </div>

      <div className="relative flex gap-4 items-start">
        <div 
          className={`bg-slate-950 border-4 ${difficulty === 'master' ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/20' : 'border-slate-800'} p-1 rounded-2xl relative overflow-hidden`}
          style={{ width: 'min(55vw, 220px)', height: 'min(110vw, 440px)' }}
        >
           <div className="grid grid-cols-10 grid-rows-20 w-full h-full gap-px">
              {grid.map((row, y) => row.map((cell, x) => (
                  <div key={`${y}-${x}`} className={`w-full h-full rounded-sm ${getColorClass(cell)}`} />
              )))}
           </div>

           {currentPiece && currentPiece.shape.map((row, py) => row.map((cell, px) => {
              if (cell !== 0) {
                 const finalY = (pos.y + py) * 5;
                 const finalX = (pos.x + px) * 10;
                 if (pos.y + py >= 0) {
                    return (
                        <div 
                            key={`p-${py}-${px}`}
                            className={`absolute rounded-sm border border-black/10 shadow-lg ${currentPiece.color}`}
                            style={{ top: `${finalY}%`, left: `${finalX}%`, width: '10%', height: '5%' }}
                        />
                    );
                 }
              }
              return null;
           }))}
        </div>

        <div className="hidden sm:flex flex-col gap-4">
            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Siguiente</span>
                <div className="w-16 h-16 flex items-center justify-center">
                    {nextPiece && (
                         <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)`, width: '100%' }}>
                             {nextPiece.shape.flat().map((c, i) => (
                                 <div key={i} className={`aspect-square rounded-[2px] ${c ? nextPiece.color : 'bg-transparent'}`} />
                             ))}
                         </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="w-full px-2 mt-auto pb-4">
        <div className="flex gap-4 items-end">
            <div className="grid grid-cols-3 gap-3 flex-1">
                <div />
                <button 
                  onPointerDown={(e) => { e.preventDefault(); rotate(); }}
                  className="h-20 rounded-3xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-3xl active:translate-y-2 active:border-b-0 active:bg-indigo-600 transition-all shadow-xl"
                >↻</button>
                <div />
                
                <button 
                  onPointerDown={(e) => { e.preventDefault(); move(-1); }}
                  className="h-20 rounded-3xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-4xl active:translate-y-2 active:border-b-0 active:bg-indigo-600 transition-all shadow-xl"
                >←</button>
                <button 
                  onPointerDown={(e) => { e.preventDefault(); drop(); }}
                  className="h-20 rounded-3xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-4xl active:translate-y-2 active:border-b-0 active:bg-indigo-600 transition-all shadow-xl"
                >↓</button>
                <button 
                  onPointerDown={(e) => { e.preventDefault(); move(1); }}
                  className="h-20 rounded-3xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-4xl active:translate-y-2 active:border-b-0 active:bg-indigo-600 transition-all shadow-xl"
                >→</button>
            </div>

            <div className="w-28">
                <button 
                  onPointerDown={(e) => { e.preventDefault(); hardDrop(); }}
                  className="w-full h-28 rounded-full bg-indigo-600 border-b-8 border-indigo-900 flex flex-col items-center justify-center shadow-2xl active:translate-y-2 active:border-b-0 transition-all"
                >
                   <span className="text-4xl text-white">⇊</span>
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-tighter mt-1">Gota</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AITetris;
