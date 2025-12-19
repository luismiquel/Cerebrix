
import React, { useState, useMemo, useEffect } from 'react';
import { UserStats } from '../types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { GAME_REGISTRY } from '../constants';

interface Props {
  stats: UserStats;
}

const getRelativeDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = t.getTime() - d.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
};

const ActivityDetail: React.FC<Props> = ({ stats }) => {
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Retraso de 200ms para asegurar que el layout se ha estabilizado antes de renderizar gráficos
    const timer = setTimeout(() => setIsClient(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(new Date().getDate() - 7);

  const dailyHistory = useMemo(() => {
    return stats.history.reduce((acc: any[], curr) => {
      const day = curr.date.split('T')[0];
      const existing = acc.find(a => a.name === day);
      if (existing) {
        existing.puntos += curr.score;
      } else {
        acc.push({ name: day, puntos: curr.score });
      }
      return acc;
    }, []).sort((a, b) => a.name.localeCompare(b.name)).slice(-7);
  }, [stats.history]);

  const gamePerformance = useMemo(() => {
    return stats.history
      .filter(item => new Date(item.date) >= sevenDaysAgo)
      .reduce((acc: { name: string, score: number, color: string }[], curr) => {
        const game = GAME_REGISTRY.find(g => g.id === curr.gameId);
        const gameName = game?.name || 'Otro';
        const existing = acc.find(a => a.name === gameName);
        if (existing) {
          existing.score += curr.score;
        } else {
          acc.push({ 
            name: gameName, 
            score: curr.score,
            color: game?.color.replace('bg-', '') || 'teal-500' 
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.score - a.score);
  }, [stats.history]);

  const groupedHistory = useMemo(() => {
    const groups: Record<string, { date: string, totalScore: number, games: typeof stats.history }> = {};
    let sourceHistory = stats.history;
    if (filterDate) {
      sourceHistory = sourceHistory.filter(item => item.date.startsWith(filterDate));
    }
    sourceHistory.forEach(item => {
      const dateKey = item.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = { date: dateKey, totalScore: 0, games: [] };
      }
      groups[dateKey].games.push(item);
      groups[dateKey].totalScore += item.score;
    });
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [stats.history, filterDate]);

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedDate = data.activePayload[0].payload.name;
      setFilterDate(prev => prev === clickedDate ? null : clickedDate);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 glass rounded-[2rem] p-8 border-t-4 border-t-teal-500">
          <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Constancia</h3>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-white">{stats.daysPlayedCount}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">días</span>
          </div>
        </div>
        <div className="flex-1 glass rounded-[2rem] p-8 border-t-4 border-t-orange-500">
          <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Racha Actual</h3>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-white">🔥 {stats.dailyStreak}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">días</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2rem] p-8 min-h-[400px] flex flex-col">
          <h2 className="text-xl font-bold mb-8 text-slate-800 dark:text-white">Actividad Semanal</h2>
          <div className="flex-1 w-full" style={{ minHeight: '250px' }}>
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                <AreaChart data={dailyHistory} onClick={handleChartClick}>
                  <defs>
                    <linearGradient id="colorPuntos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString('es-ES', { weekday: 'short' })} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="puntos" stroke="#2dd4bf" strokeWidth={3} fill="url(#colorPuntos)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="w-full h-full bg-slate-800/20 animate-pulse rounded-2xl" />}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 min-h-[400px] flex flex-col">
          <h2 className="text-xl font-bold mb-8 text-slate-800 dark:text-white">Especialización</h2>
          <div className="flex-1 w-full" style={{ minHeight: '250px' }}>
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                <BarChart data={gamePerformance} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={15}>
                    {gamePerformance.map((entry, index) => <Cell key={`cell-${index}`} fill="#3b82f6" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="w-full h-full bg-slate-800/20 animate-pulse rounded-2xl" />}
          </div>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-8" id="training-history">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Historial</h2>
          {filterDate && <button onClick={() => setFilterDate(null)} className="text-xs font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full uppercase">Limpiar Filtro ✕</button>}
        </div>
        <div className="space-y-6">
          {groupedHistory.length > 0 ? groupedHistory.map((dayGroup, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <div className="flex items-center gap-4 sticky top-16 bg-[#0f172a]/80 backdrop-blur py-2 z-10">
                <span className="text-sm font-black uppercase text-slate-500">{getRelativeDateLabel(dayGroup.date)}</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-bold text-emerald-500">+{dayGroup.totalScore}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayGroup.games.map((item, idx) => {
                  const game = GAME_REGISTRY.find(g => g.id === item.gameId);
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{game?.icon || '🎮'}</span>
                        <span className="font-bold text-sm dark:text-slate-200">{game?.name}</span>
                      </div>
                      <span className="font-black text-emerald-500">+{item.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-500 font-bold uppercase tracking-widest italic">No hay actividad registrada</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
