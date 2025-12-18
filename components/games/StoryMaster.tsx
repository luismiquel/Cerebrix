
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { getStory } from '../../services/dataService';

const StoryMaster: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const getReadTime = () => {
    if (isSeniorMode) return 20;
    if (difficulty === 'master') return 4; // Cruelmente corto
    if (difficulty === 'hard') return 8;
    return 12;
  };

  const [readTimeLeft, setReadTimeLeft] = useState(getReadTime());
  const [showStory, setShowStory] = useState(true);

  useEffect(() => {
    getStory().then(story => {
      setData(story);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && showStory) {
      const timer = setInterval(() => {
        setReadTimeLeft(prev => {
          if (prev <= 1) {
            setShowStory(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, showStory]);

  const handleSelect = (opt: string) => {
    if (opt === data.correctAnswer) {
      onGameOver(difficulty === 'master' ? 1200 : 500);
    } else {
      onGameOver(difficulty === 'master' ? 0 : 50);
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse font-black text-slate-500 uppercase tracking-widest italic">Descifrando historia...</div>;

  return (
    <div className="space-y-8 p-4 select-none touch-none">
      <div className="flex justify-between items-center mb-2">
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comprensión Lectora</span>
         <span className={`font-mono font-bold ${readTimeLeft < 3 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
            {showStory ? `Tiempo: ${readTimeLeft}s` : '¡Responde ahora!'}
         </span>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
              className={`h-full bg-indigo-500 transition-all duration-1000 ${!showStory ? 'w-0' : 'w-full'}`}
              style={{ width: `${(readTimeLeft / getReadTime()) * 100}%` }}
          />
      </div>
      
      <div className="relative min-h-[160px]">
        {showStory ? (
            <div className={`p-8 glass rounded-[2.5rem] italic leading-relaxed animate-in fade-in duration-500 border border-white/5 shadow-2xl ${isSeniorMode ? 'text-2xl' : 'text-lg text-slate-200'}`}>
                "{data.story}"
            </div>
        ) : (
            <div className="p-8 bg-slate-950 border-4 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-600 italic text-center gap-2">
                <span className="text-4xl opacity-20">😶‍🌫️</span>
                <p>La historia se ha desvanecido.<br/>Usa tu memoria fotográfica.</p>
            </div>
        )}
      </div>

      {!showStory && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h4 className="font-black text-teal-400 text-xl uppercase tracking-tighter italic text-center">
                {data.question}
            </h4>
            <div className="grid gap-3">
                {data.options.map((opt: string) => (
                <button 
                    key={opt} 
                    onPointerDown={(e) => { e.preventDefault(); handleSelect(opt); }} 
                    className="p-5 bg-slate-800 rounded-3xl border-b-4 border-slate-950 hover:bg-slate-700 active:translate-y-1 active:border-b-0 transition-all text-left font-bold text-slate-200 shadow-lg"
                >
                    {opt}
                </button>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default StoryMaster;
