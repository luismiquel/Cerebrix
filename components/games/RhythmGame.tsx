
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameProps } from '../../types';

interface Note {
  id: number;
  lane: number;
  top: number;
  hit: boolean;
  type: 'normal' | 'power';
}

const LANES = [0, 1, 2, 3];
const LANE_KEYS = ['D', 'F', 'J', 'K'];
const LANE_COLORS = ['#f43f5e', '#0ea5e9', '#10b981', '#f59e0b'];
const HIT_ZONE_Y = 82;

const RhythmGame: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isSpeedRush, setIsSpeedRush] = useState(false);
  
  const getInitialTime = () => {
    if (isSpeedRush) return 30;
    if (difficulty === 'hard') return 40;
    if (difficulty === 'easy') return 60;
    return isSeniorMode ? 60 : 45;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [notes, setNotes] = useState<Note[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string, color: string, id: number } | null>(null);
  const [laneFlash, setLaneFlash] = useState<boolean[]>([false, false, false, false]);
  const [bgPulse, setBgPulse] = useState(false);
  
  const requestRef = useRef<number>(0);
  const nextNoteId = useRef(0);
  const lastSpawnTime = useRef(0);

  const triggerVibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const getSpawnRate = () => {
    if (isSpeedRush) return 250;
    let rate = 650;
    if (difficulty === 'easy') rate = 900;
    if (difficulty === 'hard') rate = 450;
    if (isSeniorMode) rate = 1300;
    return rate;
  };

  const getNoteSpeed = () => {
    if (isSpeedRush) return 1.3 + (combo * 0.005);
    let speed = 0.6;
    if (difficulty === 'easy') speed = 0.4;
    if (difficulty === 'hard') speed = 0.9;
    if (isSeniorMode) speed = 0.3;
    return speed;
  };

  const gameLoop = useCallback((time: number) => {
    if (timeLeft <= 0) return;

    const currentRate = getSpawnRate();
    if (time - lastSpawnTime.current > currentRate) {
      const lane = Math.floor(Math.random() * 4);
      const isPower = Math.random() > 0.96;
      setNotes(prev => [...prev, {
        id: nextNoteId.current++,
        lane,
        top: -10,
        hit: false,
        type: isPower ? 'power' : 'normal'
      }]);
      lastSpawnTime.current = time;
    }

    setNotes(prev => {
      const nextNotes: Note[] = [];
      let missed = false;

      prev.forEach(note => {
        const newTop = note.top + getNoteSpeed();
        if (newTop > 100) {
          if (!note.hit) missed = true;
        } else {
          nextNotes.push({ ...note, top: newTop });
        }
      });

      if (missed) {
        setCombo(0);
        showFeedback('MISS', 'text-rose-500');
        triggerVibrate(35);
      }
      return nextNotes;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [timeLeft, score, difficulty, isSpeedRush, combo, isSeniorMode]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameLoop]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameOver(Math.floor(score * 15));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onGameOver, score]);

  const showFeedback = (msg: string, color: string) => {
    setFeedback({ msg, color, id: Date.now() });
    setBgPulse(msg.includes('PERFECT') || msg.includes('GREAT'));
    setTimeout(() => {
        setFeedback(null);
        setBgPulse(false);
    }, 400);
  };

  const handleLaneAction = (laneIndex: number) => {
    setLaneFlash(prev => {
      const next = [...prev];
      next[laneIndex] = true;
      return next;
    });
    setTimeout(() => {
      setLaneFlash(prev => {
        const next = [...prev];
        next[laneIndex] = false;
        return next;
      });
    }, 100);

    setNotes(prev => {
      const scanRange = isSeniorMode ? 20 : 12;
      const targetIdx = prev.findIndex(n => 
        n.lane === laneIndex && !n.hit && Math.abs(n.top - HIT_ZONE_Y) < scanRange
      );

      if (targetIdx !== -1) {
        const note = prev[targetIdx];
        const distance = Math.abs(note.top - HIT_ZONE_Y);
        
        const newNotes = [...prev];
        newNotes[targetIdx].hit = true;
        newNotes[targetIdx].top = 200; // Sacar de pantalla

        if (distance < scanRange / 3) {
          setScore(s => s + (note.type === 'power' ? 100 : 50));
          setCombo(c => {
            const nc = c + 1;
            if (nc > maxCombo) setMaxCombo(nc);
            return nc;
          });
          showFeedback('PERFECT!', 'text-pink-400');
          triggerVibrate(20);
        } else if (distance < scanRange * 0.7) {
          setScore(s => s + 25);
          setCombo(c => c + 1);
          showFeedback('GREAT', 'text-cyan-400');
          triggerVibrate(15);
        } else {
          setScore(s => s + 10);
          setCombo(c => c + 1);
          showFeedback('GOOD', 'text-emerald-400');
          triggerVibrate(10);
        }
        return newNotes;
      }
      return prev;
    });
  };

  return (
    <div className={`flex flex-col items-center justify-between h-full p-4 w-full max-w-lg mx-auto overflow-hidden relative transition-colors duration-300 select-none ${bgPulse ? 'bg-white/5' : ''}`}>
      
      <div className="flex justify-between w-full items-end z-20">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Puntos</span>
          <div className={`font-black text-pink-500 ${fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>
            {score.toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
            {feedback && (
                <span key={feedback.id} className={`font-black uppercase tracking-tighter animate-ping ${feedback.color} ${fontSize === 'large' ? 'text-3xl' : 'text-xl'}`}>
                    {feedback.msg}
                </span>
            )}
            {combo > 1 && <span className="text-white font-black text-lg">{combo}x Combo</span>}
        </div>

        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Tiempo</span>
           <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-300'} ${fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>
             {timeLeft}s
           </span>
        </div>
      </div>

      {/* Área de Juego */}
      <div className="relative flex-1 w-full mt-4 mb-4 bg-slate-900/60 rounded-3xl border-2 border-slate-800 overflow-hidden perspective-500">
        {/* Carriles */}
        <div className="absolute inset-0 flex justify-between px-[12.5%]">
          {[1, 2, 3].map(i => <div key={i} className="h-full w-px bg-slate-800" />)}
        </div>

        {/* Zona de Hit */}
        <div 
            className="absolute w-full h-1 bg-white/20 z-10"
            style={{ top: `${HIT_ZONE_Y}%` }}
        />

        {/* Notas */}
        {notes.map(note => !note.hit && (
            <div
                key={note.id}
                className={`absolute w-[20%] rounded-full shadow-lg z-20`}
                style={{
                    top: `${note.top}%`,
                    left: `${(note.lane * 25) + 2.5}%`,
                    height: note.type === 'power' ? '8%' : '5%',
                    backgroundColor: LANE_COLORS[note.lane],
                    boxShadow: `0 0 20px ${LANE_COLORS[note.lane]}`,
                    transform: `scale(${1 + (note.top / 400)})`
                }}
            />
        ))}

        {/* Flashes de Carril */}
        {LANES.map(lane => (
          <div 
            key={lane}
            className={`absolute h-full w-[25%] transition-opacity duration-150 ${laneFlash[lane] ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              left: `${lane * 25}%`,
              background: `linear-gradient(to top, ${LANE_COLORS[lane]}44, transparent)`
            }}
          />
        ))}
      </div>

      {/* MANDOS TÁCTILES ERGONÓMICOS */}
      <div className="grid grid-cols-4 gap-3 w-full h-24">
        {LANES.map((lane, idx) => (
            <button
                key={lane}
                onPointerDown={(e) => { e.preventDefault(); handleLaneAction(lane); }}
                className={`
                    rounded-2xl flex flex-col items-center justify-center transition-all duration-75 border-b-8 active:translate-y-2 active:border-b-0
                    ${laneFlash[lane] ? 'bg-slate-700 border-slate-600' : 'bg-slate-800 border-slate-950'}
                `}
            >
                <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: LANE_COLORS[idx] }} />
                <span className={`font-black text-xl ${laneFlash[lane] ? 'text-white' : 'text-slate-500'}`}>
                  {LANE_KEYS[idx]}
                </span>
            </button>
        ))}
      </div>
    </div>
  );
};

export default RhythmGame;
