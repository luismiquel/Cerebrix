
import React, { useState } from 'react';
import { UserStats, DynamicAchievement, DifficultyLevel } from '../types';
import { ACHIEVEMENTS, DYNAMIC_ACHIEVEMENTS } from '../constants';
import Logo from './Logo';

interface Props {
  isSeniorMode: boolean;
  onToggleSenior: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  difficulty: DifficultyLevel;
  onSetDifficulty: (d: DifficultyLevel) => void;
  fontSize: 'small' | 'normal' | 'large';
  onSetFontSize: (size: 'small' | 'normal' | 'large') => void;
  onClearData: () => void;
  stats: UserStats;
  onUpdateStats?: (newStats: UserStats) => void;
}

const Settings: React.FC<Props> = ({ 
  isSeniorMode, 
  onToggleSenior, 
  theme, 
  onToggleTheme,
  difficulty,
  onSetDifficulty,
  fontSize,
  onSetFontSize,
  onClearData,
  stats,
  onUpdateStats
}) => {
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);
  const [seniorAnimate, setSeniorAnimate] = useState(false);
  const [themeAnimate, setThemeAnimate] = useState(false);

  const handleToggle = (action: () => void, type: 'senior' | 'theme') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'senior') {
        navigator.vibrate([15, 40, 15]);
        setSeniorAnimate(true);
        setTimeout(() => setSeniorAnimate(false), 300);
      } else {
        navigator.vibrate(20);
        setThemeAnimate(true);
        setTimeout(() => setThemeAnimate(false), 300);
      }
    }
    action();
  };

  const allAchievements = [...ACHIEVEMENTS, ...DYNAMIC_ACHIEVEMENTS];
  const unlockedCount = stats.unlockedAchievements?.length || 0;
  const totalCount = allAchievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const difficultyOptions: { id: DifficultyLevel; label: string }[] = [
    { id: 'easy', label: 'Fácil' },
    { id: 'medium', label: 'Normal' },
    { id: 'hard', label: 'Difícil' },
    { id: 'master', label: 'Maestro' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Perfil del Jugador */}
      <div className="glass rounded-[2.5rem] p-8 flex flex-col items-center text-center border-b-4 border-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-50" />
        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl mb-4 shadow-xl border-4 border-white dark:border-slate-700 z-10 overflow-hidden relative">
          <Logo className="w-full h-full" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter z-10">Cerebro Maestro</h2>
        
        <div className="flex gap-4 mt-6 z-10 w-full justify-center flex-wrap">
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10 min-w-[100px]">
            <span className="text-2xl font-black text-emerald-500">{stats.totalScore.toLocaleString()}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Puntos</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10 min-w-[100px]">
            <span className="text-2xl font-black text-blue-500">{stats.daysPlayedCount}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Días</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10 min-w-[100px]">
            <span className="text-2xl font-black text-amber-500">{unlockedCount}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Logros</span>
          </div>
        </div>
      </div>

      {/* Colección de Logros */}
      <div className="glass rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Colección de Logros</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Desbloquea desafíos para ganar bonus</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-500">{unlockedCount}</span>
            <span className="text-slate-400 font-bold text-lg"> / {totalCount}</span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 pt-4">
          {allAchievements.map(ach => {
            const isUnlocked = stats.unlockedAchievements?.includes(ach.id);
            const isSelected = selectedAchievementId === ach.id;
            
            return (
              <button
                key={ach.id}
                onClick={() => setSelectedAchievementId(isSelected ? null : ach.id)}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all relative
                  ${isUnlocked 
                    ? 'bg-amber-400/10 border-2 border-amber-400/50 shadow-lg shadow-amber-400/10 scale-100' 
                    : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 opacity-40 scale-95 grayscale'
                  }
                  ${isSelected ? 'ring-4 ring-white dark:ring-slate-400 z-10 scale-110 shadow-2xl' : ''}
                `}
                title={ach.name}
              >
                {ach.icon}
                {isUnlocked && <span className="absolute -top-1 -right-1 text-[10px]">✨</span>}
              </button>
            );
          })}
        </div>

        {/* Detalle del Logro Seleccionado */}
        <div className={`transition-all duration-300 overflow-hidden ${selectedAchievementId ? 'max-h-[300px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          {selectedAchievementId && (() => {
            const ach = allAchievements.find(a => a.id === selectedAchievementId);
            const unlocked = stats.unlockedAchievements?.includes(ach?.id || '');
            const isDynamic = 'isDynamic' in (ach || {});
            
            let progress = 0;
            let currentVal = 0;
            let targetVal = 0;

            if (isDynamic && ach) {
              const dynAch = ach as DynamicAchievement;
              currentVal = dynAch.getCurrentProgress(stats);
              targetVal = dynAch.targetValue;
              progress = Math.min(100, Math.round((currentVal / targetVal) * 100));
            }

            return (
              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col gap-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{ach?.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-black uppercase tracking-tight ${unlocked ? 'text-amber-500' : 'text-slate-500'}`}>
                        {ach?.name} {unlocked ? '🏆' : '🔒'}
                      </h4>
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                        +{ach?.bonusPoints} PTS
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ach?.description}</p>
                  </div>
                </div>

                {isDynamic && !unlocked && (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Progreso del Desafío</span>
                      <span>{currentVal} / {targetVal}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Ajustes de Interfaz */}
      <div className="space-y-4">
        <h3 className="px-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Preferencias de Interfaz</h3>
        
        {/* Interruptor Modo Senior */}
        <div 
          onClick={() => handleToggle(onToggleSenior, 'senior')}
          className={`glass rounded-3xl p-6 flex items-center justify-between group cursor-pointer border-2 transition-all duration-300 active:scale-95 ${seniorAnimate ? 'scale-105' : ''} ${isSeniorMode ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10' : 'border-transparent hover:border-slate-400/50'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${seniorAnimate ? 'scale-110' : ''} ${isSeniorMode ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700'}`}>
              👴
            </div>
            <div>
              <span className="block font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Modo Senior</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Juegos adaptados y mayor claridad visual.</span>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${isSeniorMode ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isSeniorMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Dificultad Global (Solo si Modo Senior está OFF) */}
        <div className={`glass rounded-3xl p-6 space-y-4 transition-all duration-300 ${isSeniorMode ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-slate-200 dark:bg-slate-800">
              🎯
            </div>
            <div className="flex-1">
              <span className="block font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Dificultad Global</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isSeniorMode ? 'Inhabilitado en Modo Senior (Fijado en Fácil).' : 'Nivel de desafío predeterminado para los juegos.'}
              </span>
            </div>
          </div>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
            {difficultyOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSetDifficulty(opt.id)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${difficulty === opt.id ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tamaño de Fuente */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-slate-200 dark:bg-slate-800">
              Aa
            </div>
            <div>
              <span className="block font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Tamaño de Fuente</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Ajusta la legibilidad global de la plataforma.</span>
            </div>
          </div>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['small', 'normal', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => onSetFontSize(size)}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${fontSize === size ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {size === 'small' ? 'Pequeño' : size === 'normal' ? 'Normal' : 'Grande'}
              </button>
            ))}
          </div>
        </div>

        {/* Tema Visual */}
        <div 
          onClick={() => handleToggle(onToggleTheme, 'theme')}
          className={`glass rounded-3xl p-6 flex items-center justify-between group cursor-pointer border-2 border-transparent hover:border-teal-500/30 transition-all active:scale-95 ${themeAnimate ? 'scale-105' : ''}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${themeAnimate ? 'scale-110' : ''} bg-slate-100 dark:bg-slate-800`}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
            <div>
              <span className="block font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Tema Visual</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Alternar entre modo {theme === 'dark' ? 'claro' : 'oscuro'}.</span>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${theme === 'dark' ? 'bg-teal-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center gap-4">
        <button 
          onClick={onClearData}
          className="text-rose-500 font-bold text-xs uppercase tracking-widest hover:underline opacity-60 hover:opacity-100"
        >
          Borrar Historial de Entrenamiento
        </button>
        <p className="text-[10px] text-slate-500 font-medium">CEREBRIX ENGINE v2.6 • PERSONAL COGNITIVE PARTNER</p>
      </div>
    </div>
  );
};

export default Settings;
