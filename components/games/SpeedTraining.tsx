
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../../types';

const SpeedTraining: React.FC<GameProps> = ({ onGameOver, fontSize, difficulty }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [combo, setCombo] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const GRID_SIZE = 9;

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (appearTimerRef.current) clearTimeout(appearTimerRef.current);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setGameStatus('playing');
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { endGame(); return 0; }
        return prev - 1;
      });
    }, 1000);
    spawnTarget();
  };

  const endGame = () => {
    clearTimers();
    setGameStatus('ended');
    const mult = difficulty === 'master' ? 300 : (difficulty === 'hard' ? 75 : 50);
    onGameOver(score * mult);
  };

  const spawnTarget = () => {
    if (appearTimerRef.current) clearTimeout(appearTimerRef.current);
    let next = Math.floor(Math.random() * GRID_SIZE);
    if (next === activeCell) next = (next + 1) % GRID_SIZE;
    setActiveCell(next);

    let minSpeed = 400;
    let maxSpeed = 1200;
    if (difficulty === 'master') { minSpeed = 200; maxSpeed = 600; }
    else if (difficulty === 'hard') { minSpeed = 300; maxSpeed = 900; }

    const speed = Math.max(minSpeed, maxSpeed - (score * 5));
    appearTimerRef.current = setTimeout(() => {
      setCombo(0);
      spawnTarget();
    }, speed);
  };

  const handleClick = (index: number) => {
    if (gameStatus !== 'playing') return;
    if (index === activeCell) {
      setScore(s => s + 1);
      setCombo(c => c + 1);
      if ((score + 1) % 15 === 0) setTimeLeft(t => t + 2);
      spawnTarget();
    } else {
      setCombo(0);
      if (difficulty === 'master') setTimeLeft(t => Math.max(0, t - 1));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-sm">
        <span className="text-red-500 font-black text-3xl">{score}</span>
        {combo > 5 && <span className="text-orange-400 font-bold animate-bounce">{combo}x!</span>}
        <span className="font-mono text-white text-3xl">{timeLeft}s</span>
      </div>

      <div className="relative">
        {gameStatus === 'ready' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 rounded-2xl">
            <button onClick={startGame} className="bg-red-600 px-8 py-4 text-white font-black rounded-2xl animate-pulse">¡INICIAR!</button>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800 rounded-3xl" style={{ width: '300px', height: '300px' }}>
          {Array.from({ length: GRID_SIZE }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`rounded-xl transition-all ${activeCell === idx ? 'bg-red-500 shadow-[0_0_20px_red]' : 'bg-slate-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeedTraining;
