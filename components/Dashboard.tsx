
import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  stats: UserStats;
  onStartChallenge: () => void;
}

const Dashboard: React.FC<Props> = ({ stats, onStartChallenge }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const radarData = [
    { category: 'Lógica', score: stats.categoryScores['Lógica'] || 0 },
    { category: 'Memoria', score: stats.categoryScores['Memoria'] || 0 },
    { category: 'Cálculo', score: stats.categoryScores['Cálculo'] || 0 },
    { category: 'Atención', score: stats.categoryScores['Atención'] || 0 },
    { category: 'Lenguaje', score: stats.categoryScores['Lenguaje'] || 0 },
  ];

  const today = new Date().toDateString();
  const challengeDone = stats.dailyChallenge?.date === today && stats.dailyChallenge?.isFinished;
  const challengeProgress = stats.dailyChallenge?.date === today ? stats.dailyChallenge.screensCompleted : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 glass rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center border-l-8 border-l-emerald-500 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="flex-1 w-full space-y-4">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">ESTADO MENTAL</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Entrenamiento de <span className="text-emerald-500 font-black">{stats.daysPlayedCount} días</span>. 
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 dark:text-orange-400 text-[10px] font-black">
              🔥 RACHA: {stats.dailyStreak} DÍAS
            </div>
            <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-black">
              ✨ NIVEL: {Math.floor(stats.totalScore / 5000) + 1}
            </div>
          </div>
        </div>
        <div className="w-full h-64 md:h-64 md:w-64 min-h-[240px] flex items-center justify-center">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#475569" strokeWidth={0.5} />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: '900' }} />
                <Radar name="Puntos" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <div className="w-full h-full bg-slate-800/10 animate-pulse rounded-full" />}
        </div>
      </div>

      <div className={`glass rounded-[2.5rem] p-8 flex flex-col justify-between space-y-6 shadow-2xl border-2 transition-all duration-500 ${challengeDone ? 'border-emerald-500 bg-emerald-500/10' : 'border-indigo-500/20'}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">Reto Diario</h3>
            {challengeDone && <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">HECHO</span>}
          </div>
          
          {challengeDone ? (
            <div className="space-y-2 animate-in fade-in zoom-in duration-700 text-center py-4">
              <span className="text-5xl">🏆</span>
              <p className="text-2xl font-black text-emerald-500 italic uppercase">¡Completado!</p>
              <p className="text-xs text-slate-500">Has ganado +5,000 puntos de bonus hoy.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{challengeProgress}/3</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Rondas Superadas</span>
                </div>
              </div>
              <div className="flex gap-1.5 h-3">
                {[1, 2, 3].map(step => (
                  <div 
                    key={step} 
                    className={`flex-1 rounded-full transition-all duration-500 ${challengeProgress >= step ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase italic text-center">Gana 3 niveles seguidos para completar</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={onStartChallenge}
          disabled={challengeDone}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${challengeDone ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-gradient-to-br from-indigo-600 to-emerald-500 text-white hover:shadow-indigo-500/30'}`}
        >
          {challengeDone ? 'Vuelve Mañana' : challengeProgress > 0 ? 'Siguiente Ronda' : 'Empezar Reto'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
