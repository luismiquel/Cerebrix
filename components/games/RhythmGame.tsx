
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameProps } from '../../types';

interface Note { id: number; lane: number; top: number; hit: boolean; }
const LANES = [0, 1, 2, 3];
const LANE_COLORS = ['#f43f5e', '#0ea5e9', '#10b981', '#f59e0b'];

const RhythmGame: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, isDailyChallenge, currentRound = 1 }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(isDailyChallenge ? 30 : 45);
  const [notes, setNotes] = useState<Note[]>([]);
  const [laneFlash, setLaneFlash] = useState<boolean[]>([false, false, false, false]);
  const [lastHitStatus, setLastHitStatus] = useState<string | null>(null);
  
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef(0);
  const nextNoteId = useRef(0);

  const TARGET_SCORE = (difficulty === 'master' ? 3000 : 1500) * currentRound;
  
  const triggerVibrate = (ms: number | number[]) => { 
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms); 
  };

  const gameLoop = useCallback((time: number) => {
    if (timeLeft <= 0) return;
    
    // Frecuencia de aparición (ms)
    const baseRate = isDailyChallenge ? 1000 - (currentRound * 150) : 800;
    let rate = difficulty === 'hard' ? 400 : baseRate;
    if (difficulty === 'master') rate = 280; 

    if (time - lastSpawnTime.current > rate) {
      setNotes(prev => [...prev, { id: nextNoteId.current++, lane: Math.floor(Math.random() * 4), top: -10, hit: false }]);
      lastSpawnTime.current = time;
    }

    setNotes(prev => {
      // Velocidad de caída
      const speed = isDailyChallenge ? 0.8 + (currentRound * 0.2) : 1.0;
      let finalSpeed = difficulty === 'hard' ? 1.6 : speed;
      if (difficulty === 'master') finalSpeed = 2.4; 
      
      return prev.map(n => ({ ...n, top: n.top + finalSpeed })).filter(n => n.top < 110);
    });
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [timeLeft, difficulty, isDailyChallenge, currentRound]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => { cancelAnimationFrame(requestRef.current); clearInterval(timer); };
  }, [gameLoop]);

  useEffect(() => { 
    if (timeLeft === 0) {
        onGameOver(score, isDailyChallenge ? score >= TARGET_SCORE : true);
    } 
  }, [timeLeft, score, isDailyChallenge, TARGET_SCORE, onGameOver]);

  const handleAction = (lane: number) => {
    // Feedback visual instantáneo
    setLaneFlash(prev => { const n = [...prev]; n[lane] = true; return n; });
    setTimeout(() => setLaneFlash(prev => { const n = [...prev]; n[lane] = false; return n; }), 150);
    
    setNotes(prev => {
      // Ventanas de impacto
      const hitThreshold = difficulty === 'master' ? 10 : 18;
      const perfectThreshold = difficulty === 'master' ? 4 : 7;
      const scoreMult = difficulty === 'master' ? 2.5 : 1;

      const targetIdx = prev.findIndex(n => n.lane === lane && !n.hit && Math.abs(n.top - 85) < hitThreshold);
      
      if (targetIdx !== -1) {
        const precision = Math.abs(prev[targetIdx].top - 85);
        if (precision < perfectThreshold) {
            setLastHitStatus('¡PERFECTO!');
            triggerVibrate([30, 20, 40]);
            setScore(s => s + Math.round(100 * scoreMult));
        } else {
            setLastHitStatus('BIEN');
            triggerVibrate(20);
            setScore(s => s + Math.round(50 * scoreMult));
        }
        setTimeout(() => setLastHitStatus(null), 400);
        const updated = [...prev];
        updated[targetIdx].hit = true;
        updated[targetIdx].top = 200; 
        return updated;
      } else {
        if (difficulty === 'master') {
            triggerVibrate([40, 30]);
            setScore(s => Math.max(0, s - 25));
        } else {
            triggerVibrate(15);
        }
      }
      return prev;
    });
  };

  return (
    <div className="flex flex-col items-center h-full w-full max-w-lg mx-auto overflow-hidden relative select-none touch-none pb-4">
      <div className="flex justify-between w-full px-6 mb-4 z-20">
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Puntos</span>
            <span className={`text-4xl font-black ${difficulty === 'master' ? 'text-indigo-400' : 'text-pink-500'}`}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Tiempo</span>
            <span className={`text-3xl font-mono ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className={`relative flex-1 w-full bg-slate-950/60 rounded-[3rem] border-4 overflow-hidden shadow-inner transition-colors duration-500 ${difficulty === 'master' ? 'border-indigo-500/30 shadow-indigo-500/10' : 'border-slate-800'}`}>
        {LANES.map(l => (
            <div key={l} className={`absolute h-full w-[25%] transition-opacity duration-150 ${laneFlash[l] ? 'opacity-40' : 'opacity-0'}`} style={{ left: `${l*25}%`, background: `linear-gradient(to top, ${LANE_COLORS[l]}, transparent)` }} />
        ))}
        
        <div className="absolute w-full h-1 bg-white/20 top-[85%] z-10" />
        <div className="absolute w-full h-16 bg-white/5 top-[78%] pointer-events-none" />

        {lastHitStatus && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <span className={`text-6xl font-black italic uppercase animate-ping ${lastHitStatus === '¡PERFECTO!' ? 'text-yellow-400' : 'text-white'}`}>
                    {lastHitStatus}
                </span>
            </div>
        )}

        {notes.map(n => !n.hit && (
          <div 
            key={n.id} 
            className={`absolute w-[22%] h-[6%] rounded-full shadow-2xl transition-transform ${difficulty === 'master' ? 'opacity-90' : ''}`} 
            style={{ 
                top: `${n.top}%`, 
                left: `${(n.lane*25)+1.5}%`, 
                backgroundColor: LANE_COLORS[n.lane], 
                boxShadow: `0 0 ${difficulty === 'master' ? '40' : '25'}px ${LANE_COLORS[n.lane]}`,
                transform: `scale(${n.top > 82 && n.top < 88 ? 1.4 : 1})`
            }} 
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 w-full h-36 mt-6 px-2">
        {LANES.map(l => (
          <button 
            key={l} 
            onPointerDown={(e) => { e.preventDefault(); handleAction(l); }} 
            className={`h-full rounded-[2.5rem] bg-slate-800 border-b-[10px] active:scale-90 active:translate-y-2 active:border-b-4 active:bg-slate-700 transition-all flex items-center justify-center shadow-2xl border-slate-950 touch-none select-none`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className={`w-14 h-14 rounded-full border-4 border-white/30 flex items-center justify-center ${difficulty === 'master' ? 'scale-110' : ''}`} style={{ backgroundColor: LANE_COLORS[l] }}>
                <div className="w-4 h-4 rounded-full bg-white/40 animate-pulse" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RhythmGame;
