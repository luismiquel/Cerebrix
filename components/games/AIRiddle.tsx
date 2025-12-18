
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { generateRiddle } from '../../services/aiService';

const AIRiddle: React.FC<GameProps> = ({ onGameOver, fontSize, difficulty }) => {
  const [data, setData] = useState<{ riddle: string, answer: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'loading' | 'playing' | 'solved'>('loading');
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    loadLevel();
  }, []);

  useEffect(() => {
    if (difficulty === 'master' && status === 'playing' && timeLeft > 0) {
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    } else if (difficulty === 'master' && status === 'playing' && timeLeft <= 0) {
        onGameOver(score);
    }
  }, [timeLeft, status, difficulty]);

  const loadLevel = async () => {
    setLoading(true);
    setStatus('loading');
    setFeedback('');
    setInput('');
    setTimeLeft(15);
    try {
      const result = await generateRiddle();
      setData(result);
      setStatus('playing');
    } catch (error) {
      setData({ 
        riddle: "Soy alto cuando soy joven y bajo cuando soy viejo. ¿Qué soy?", 
        answer: "Vela" 
      });
      setStatus('playing');
    } finally {
      setLoading(false);
    }
  };

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data || status !== 'playing' || !input.trim()) return;
    const userAnswer = normalize(input);
    const correctAnswer = normalize(data.answer);
    if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer)) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      setStatus('solved');
      const points = (difficulty === 'master' ? 250 : 100) + (streak * 20);
      setScore(s => s + points);
      setStreak(s => s + 1);
      setFeedback(`¡Acierto! +${points} pts`);
      setTimeout(loadLevel, 1200);
    } else {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      setFeedback('No es correcto.');
      setStreak(0);
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto p-6 space-y-8 animate-in fade-in duration-500 select-none touch-none">
      <div className="flex justify-between w-full items-end border-b border-white/10 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1">Puntuación</span>
          <span className={`font-black text-cyan-400 ${fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>{score}</span>
        </div>
        {difficulty === 'master' && (
            <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase text-rose-500 font-black tracking-widest leading-none mb-1">Tiempo</span>
                <span className={`font-mono font-bold text-2xl ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
            </div>
        )}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-slate-500 font-black tracking-widest leading-none mb-1">Racha</span>
          <span className={`font-black text-white ${fontSize === 'large' ? 'text-2xl' : 'text-xl'}`}>{streak}🔥</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center w-full space-y-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">Generando acertijo...</span>
          </div>
        ) : (
          <div className="glass p-8 rounded-[3rem] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-3xl rounded-full" />
            <div className="text-4xl mb-4 text-center opacity-40">❓</div>
            <p className={`text-center font-bold text-slate-200 leading-relaxed italic ${fontSize === 'large' ? 'text-2xl' : 'text-xl'}`}>
              "{data?.riddle}"
            </p>
          </div>
        )}

        <div className="h-6 flex items-center justify-center">
          {feedback && <span className={`font-black uppercase tracking-widest ${feedback.includes('Acierto') ? 'text-emerald-400' : 'text-rose-400'} text-xs`}>{feedback}</span>}
        </div>

        <form onSubmit={handleSubmit} className="w-full relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== 'playing'}
            placeholder="Responde aquí..."
            className={`w-full bg-slate-900 border-4 border-slate-700 rounded-3xl py-5 pl-8 pr-20 text-white outline-none focus:border-cyan-500 transition-all font-black shadow-inner ${fontSize === 'large' ? 'text-2xl' : 'text-xl'}`}
            autoFocus
          />
          <button 
            type="submit" 
            disabled={status !== 'playing' || !input.trim()} 
            className="absolute right-3 top-3 bottom-3 aspect-square bg-cyan-600 rounded-2xl flex items-center justify-center text-white active:scale-90 disabled:opacity-30 transition-all shadow-lg"
          >
            ➜
          </button>
        </form>

        <div className="grid grid-cols-2 gap-4">
          <button onPointerDown={loadLevel} disabled={status !== 'playing'} className="py-3 rounded-2xl bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Saltar (-25)</button>
          <button onPointerDown={() => onGameOver(score)} className="py-3 rounded-2xl bg-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors">Retirarse</button>
        </div>
      </div>
    </div>
  );
};

export default AIRiddle;
