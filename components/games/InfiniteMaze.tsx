
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

interface Cell {
  r: number;
  c: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
}

const InfiniteMaze: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode }) => {
  const getInitialSize = () => {
    switch (difficulty) {
      case 'easy': return 6;
      case 'master': return 15;
      case 'hard': return 10;
      case 'medium': default: return 8;
    }
  };

  const [size, setSize] = useState(getInitialSize());
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [targetPos, setTargetPos] = useState({ r: 0, c: 0 });
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const triggerVibrate = (ms: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const generateMaze = useCallback((s: number) => {
    const grid: Cell[][] = [];
    for (let r = 0; r < s; r++) {
      grid[r] = [];
      for (let c = 0; c < s; c++) {
        grid[r][c] = {
          r, c,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false
        };
      }
    }

    const stack: Cell[] = [];
    const startCell = grid[0][0];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors: { cell: Cell; dir: string }[] = [];
      const { r, c } = current;
      if (r > 0 && !grid[r - 1][c].visited) neighbors.push({ cell: grid[r - 1][c], dir: 'top' });
      if (r < s - 1 && !grid[r + 1][c].visited) neighbors.push({ cell: grid[r + 1][c], dir: 'bottom' });
      if (c > 0 && !grid[r][c - 1].visited) neighbors.push({ cell: grid[r][c - 1], dir: 'left' });
      if (c < s - 1 && !grid[r][c + 1].visited) neighbors.push({ cell: grid[r][c + 1], dir: 'right' });

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (next.dir === 'top') { current.walls.top = false; next.cell.walls.bottom = false; }
        if (next.dir === 'bottom') { current.walls.bottom = false; next.cell.walls.top = false; }
        if (next.dir === 'left') { current.walls.left = false; next.cell.walls.right = false; }
        if (next.dir === 'right') { current.walls.right = false; next.cell.walls.left = false; }
        next.cell.visited = true;
        stack.push(next.cell);
      } else {
        stack.pop();
      }
    }

    setMaze(grid);
    setPlayerPos({ r: 0, c: 0 });
    setTargetPos({ r: s - 1, c: s - 1 });
  }, []);

  useEffect(() => {
    generateMaze(size);
  }, [size, generateMaze]);

  const movePlayer = (dr: number, dc: number) => {
    const { r, c } = playerPos;
    if (maze.length === 0) return;
    const currentCell = maze[r][c];
    if (dr === -1 && currentCell.walls.top) return;
    if (dr === 1 && currentCell.walls.bottom) return;
    if (dc === -1 && currentCell.walls.left) return;
    if (dc === 1 && currentCell.walls.right) return;

    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      setPlayerPos({ r: nr, c: nc });
      triggerVibrate(10);
      if (nr === targetPos.r && nc === targetPos.c) {
        triggerVibrate(50);
        const points = size * 15;
        setTotalScore(s => s + points);
        setLevel(l => l + 1);
        if (size < 22) setSize(s => s + 1);
        else generateMaze(size);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') movePlayer(-1, 0);
      if (e.key === 'ArrowDown') movePlayer(1, 0);
      if (e.key === 'ArrowLeft') movePlayer(0, -1);
      if (e.key === 'ArrowRight') movePlayer(0, 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playerPos, maze, size]);

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 select-none">
      <div className="flex justify-between w-full max-w-xs text-lg font-bold">
        <span className="text-teal-400 font-black">Lvl: {level}</span>
        <span className="text-yellow-500 font-black italic">{totalScore.toLocaleString()}</span>
      </div>

      {/* Rejilla del Laberinto */}
      <div 
        className="grid gap-0 bg-slate-950 border-4 p-1 rounded-2xl shadow-2xl relative"
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: 'min(85vw, 400px)',
          height: 'min(85vw, 400px)'
        }}
      >
        {maze.flat().map((cell, idx) => (
          <div 
            key={idx}
            className="relative flex items-center justify-center transition-all duration-300"
            style={{
              borderTopWidth: cell.walls.top ? 1 : 0,
              borderRightWidth: cell.walls.right ? 1 : 0,
              borderBottomWidth: cell.walls.bottom ? 1 : 0,
              borderLeftWidth: cell.walls.left ? 1 : 0,
              borderColor: '#334155'
            }}
          >
            {playerPos.r === cell.r && playerPos.c === cell.c && (
              <div className="w-full h-full rounded-sm bg-teal-500 shadow-[0_0_12px_#14b8a6] scale-90 z-20" />
            )}
            {targetPos.r === cell.r && targetPos.c === cell.c && (
              <div className="text-[12px] animate-pulse z-10">🏁</div>
            )}
          </div>
        ))}
      </div>

      {/* D-PAD TÁCTIL ERGONÓMICO */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px] mt-6">
        <div />
        <button 
          onPointerDown={(e) => { e.preventDefault(); movePlayer(-1, 0); }}
          className="h-16 rounded-2xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-2xl active:translate-y-2 active:border-b-0 active:bg-teal-600 transition-all"
        >
          ↑
        </button>
        <div />
        
        <button 
          onPointerDown={(e) => { e.preventDefault(); movePlayer(0, -1); }}
          className="h-16 rounded-2xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-2xl active:translate-y-2 active:border-b-0 active:bg-teal-600 transition-all"
        >
          ←
        </button>
        <button 
          onPointerDown={(e) => { e.preventDefault(); movePlayer(1, 0); }}
          className="h-16 rounded-2xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-2xl active:translate-y-2 active:border-b-0 active:bg-teal-600 transition-all"
        >
          ↓
        </button>
        <button 
          onPointerDown={(e) => { e.preventDefault(); movePlayer(0, 1); }}
          className="h-16 rounded-2xl bg-slate-800 border-b-8 border-slate-950 flex items-center justify-center text-2xl active:translate-y-2 active:border-b-0 active:bg-teal-600 transition-all"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default InfiniteMaze;
