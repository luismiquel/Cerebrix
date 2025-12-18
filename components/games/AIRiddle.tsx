
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { generateRiddle } from '../../services/geminiService';

const AIRiddle: React.FC<GameProps> = ({ onGameOver, fontSize }) => {
  const [data, setData] = useState<{ riddle: string, answer: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'loading' | 'playing' | 'solved'>('loading');
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadLevel();
  }, []);

  const loadLevel = async () => {
    setLoading(true);
    setStatus('loading');
    setFeedback('');
    setInput('');
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
      setStatus('solved');
      const points = 100 + (streak * 10);
      setScore(s => s + points);
      setStreak(s => s + 1);
      setFeedback(`¡Acierto! +${points} pts`);
      setTimeout(loadLevel, 1500);
    } else {
      setFeedback('No es correcto.');
      setStreak(0);
      setTimeout(() => setFeedback(''), 1200);
    }
  };

  const handleSkip = () => {
    if (status !== 'playing') return;
    setScore(s => Math.max(0, s - 20));
    setStreak(0);
    loadLevel();
  };

  const handleReveal = () => {
    if (!data || status !== 'playing') return;
    setFeedback(`La respuesta era: ${data.answer}`);
    setScore(s => Math.max(0, s - 50));
    setStreak(0);
    setStatus('solved');
    setTimeout(loadLevel, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between w-full items-end border-b border-white/10 pb-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">Puntuación</span>
          <span className={`font-black text-cyan-400 ${fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">Racha</span>
          <div className="flex gap-1">
            <span className={`font-bold text-white ${fontSize === 'large' ? 'text-xl' : ''}`}>{streak}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full space-y-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-cyan-500/20 shadow-xl">
            <div className="text-4xl mb-4 text-center">❓</div>
            <p className={`text-center font-medium text-slate-100 leading-relaxed italic ${fontSize === 'large' ? 'text-2xl' : 'text-xl'}`}>
              "{data?.riddle}"
            </p>
          </div>
        )}

        <div className="h-8 flex items-center justify-center">
          {feedback && (
            <span className={`font-bold uppercase tracking-widest ${feedback.includes('Acierto') ? 'text-emerald-400' : 'text-rose-400'} ${fontSize === 'large' ? 'text-lg' : ''}`}>
              {feedback}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== 'playing'}
            placeholder="Responde aquí..."
            className={`w-full bg-slate-900 border-2 border-slate-700 rounded-2xl py-4 pl-6 pr-16 text-white outline-none transition-all ${fontSize === 'large' ? 'text-2xl' : 'text-lg'}`}
            autoFocus
          />
          <button
            type="submit"
            disabled={status !== 'playing' || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
          >
            ➜
          </button>
        </form>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleSkip}
            disabled={status !== 'playing'}
            className="py-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest"
          >
            Saltar (-20)
          </button>
          <button
            onClick={handleReveal}
            disabled={status !== 'playing'}
            className="py-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest"
          >
            Revelar (-50)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIRiddle;
