
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameProps } from '../../types';

interface Note { id: number; lane: number; top: number; hit: boolean; }
const LANES = [0, 1, 2, 3];
const LANE_COLORS = ['#f43f5e', '#0ea5e9', '#10b981', '#f59e0b'];

const RhythmGame: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [notes, setNotes] = useState<Note[]>([]);
  const [laneFlash, setLaneFlash] = useState<boolean[]>([false, false, false, false]);
  const [lastHitStatus, setLastHitStatus] = useState<string | null>(null);
  
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef(0);
  const nextNoteId = useRef(0);

  const vibrate = (ms: number | number[]) => { if (navigator.vibrate) navigator.vibrate(ms); };

  const gameLoop = useCallback((time: number) => {
    if (timeLeft <= 0) return;
    const rate = difficulty === 'hard' ? 400 : 800;
    if (time - lastSpawnTime.current > rate) {
      setNotes(prev => [...prev, { id: nextNoteId.current++, lane: Math.floor(Math.random() * 4), top: -10, hit: false }]);
      lastSpawnTime.current = time;
    }
    setNotes(prev => {
      const next = prev.map(n => ({ ...n, top: n.top + (difficulty === 'hard' ? 1.4 : 1.0) })).filter(n => n.top < 110);
      return next;
    });
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [timeLeft, difficulty]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => { cancelAnimationFrame(requestRef.current); clearInterval(timer); };
  }, [gameLoop]);

  useEffect(() => { if (timeLeft === 0) onGameOver(score); }, [timeLeft, score]);

  const handleAction = (lane: number) => {
    setLaneFlash(prev => { const n = [...prev]; n[lane] = true; return n; });
    setTimeout(() => setLaneFlash(prev => { const n = [...prev]; n[lane] = false; return n; }), 100);
    
    setNotes(prev => {
      const targetIdx = prev.findIndex(n => n.lane === lane && !n.hit && Math.abs(n.top - 85) < 18);
      if (targetIdx !== -1) {
        const precision = Math.abs(prev[targetIdx].top - 85);
        if (precision < 5) {
            setLastHitStatus('¡PERFECTO!');
            vibrate([20, 10, 20]);
            setScore(s => s + 100);
        } else {
            setLastHitStatus('BIEN');
            vibrate(15);
            setScore(s => s + 50);
        }
        setTimeout(() => setLastHitStatus(null), 500);
        const updated = [...prev];
        updated[targetIdx].hit = true;
        updated[targetIdx].top = 200; // Eliminar visualmente
        return updated;
      }
      return prev;
    });
  };

  return (
    <div className="flex flex-col items-center h-full w-full max-w-lg mx-auto overflow-hidden relative select-none touch-none">
      <div className="flex justify-between w-full px-6 mb-4 z-20">
        <span className="text-4xl font-black text-pink-500 drop-shadow-lg">{score}</span>
        <span className="text-3xl font-mono text-slate-400">{timeLeft}s</span>
      </div>

      <div className="relative flex-1 w-full bg-slate-900/60 rounded-[3rem] border-4 border-slate-800 overflow-hidden shadow-2xl">
        {LANES.map(l => (
            <div key={l} className={`absolute h-full w-[25%] transition-opacity duration-150 ${laneFlash[l] ? 'opacity-40' : 'opacity-0'}`} style={{ left: `${l*25}%`, background: `linear-gradient(to top, ${LANE_COLORS[l]}, transparent)` }} />
        ))}
        
        {/* Marcador de Tiempo de Golpe (Strike Zone) */}
        <div className="absolute w-full h-1 bg-white/40 top-[85%] z-10" />
        <div className="absolute w-full h-12 bg-white/5 top-[80%] pointer-events-none" />

        {/* Mensaje de feedback visual central */}
        {lastHitStatus && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <span className={`text-5xl font-black italic uppercase animate-ping ${lastHitStatus === '¡PERFECTO!' ? 'text-yellow-400' : 'text-white'}`}>
                    {lastHitStatus}
                </span>
            </div>
        )}

        {notes.map(n => !n.hit && (
          <div 
            key={n.id} 
            className="absolute w-[20%] h-[5%] rounded-full shadow-2xl transition-transform" 
            style={{ 
                top: `${n.top}%`, 
                left: `${(n.lane*25)+2.5}%`, 
                backgroundColor: LANE_COLORS[n.lane], 
                boxShadow: `0 0 20px ${LANE_COLORS[n.lane]}`,
                transform: `scale(${n.top > 80 && n.top < 90 ? 1.2 : 1})`
            }} 
          />
        ))}
      </div>

      {/* CARRILERAS TÁCTILES ERGONÓMICAS */}
      <div className="grid grid-cols-4 gap-3 w-full h-32 mt-6">
        {LANES.map(l => (
          <button 
            key={l} 
            onPointerDown={(e) => { e.preventDefault(); handleAction(l); }} 
            className="h-full rounded-[2rem] bg-slate-800/80 border-b-8 border-slate-950 active:translate-y-3 active:border-b-0 active:bg-slate-700 transition-all flex items-center justify-center shadow-lg"
            aria-label={`Carril ${l+1}`}
          >
            <div className="w-10 h-10 rounded-full border-4 border-white/20" style={{ backgroundColor: LANE_COLORS[l] }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RhythmGame;
