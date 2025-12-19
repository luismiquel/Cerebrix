
import React from 'react';
import { UserStats } from '../types';
import Logo from './Logo';

interface Props {
  stats: UserStats;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

const Header: React.FC<Props> = ({ stats, theme, onToggleTheme, onOpenSettings, onGoHome }) => {
  return (
    <header className="fixed top-0 left-0 right-0 glass z-40 transition-all duration-300 border-b border-white/5 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo - Clic para ir a Home */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 hover:opacity-90 transition-all active:scale-95 group"
          aria-label="Ir a Inicio"
        >
          <div className="group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all transform group-hover:scale-105">
            <Logo className="w-10 h-10 md:w-11 md:h-11 shadow-md border-2 border-slate-300 dark:border-slate-700" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-blue-800 dark:from-emerald-400 dark:to-blue-500 hidden sm:block drop-shadow-sm transition-all leading-none">
              CEREBRIX
            </h1>
            <span className="text-[7px] font-bold text-slate-600 dark:text-slate-400 hidden md:block uppercase tracking-[0.2em] mt-1 transition-colors">
              GIMNASIO MENTAL PROFESIONAL
            </span>
          </div>
        </button>
        
        <div className="flex items-center gap-3 md:gap-6">
          {/* Contador de Puntos (Versión Desktop) */}
          <div className="hidden sm:flex flex-col items-end pointer-events-none select-none px-5 py-2 bg-white/80 dark:bg-slate-800/80 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm transition-colors">
            <span className="text-[9px] text-slate-700 dark:text-slate-300 uppercase font-black tracking-[0.15em] leading-none mb-1">Puntos</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">{stats.totalScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleTheme}
              className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center hover:scale-105 hover:border-teal-500 dark:hover:border-teal-400 transition-all shadow-md group active:scale-90"
              aria-label="Alternar tema"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform drop-shadow-sm filter saturate-150">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>

            {/* Perfil - Clic para ir a Ajustes */}
            <button 
              onClick={onOpenSettings}
              className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 hover:scale-105 transition-all active:scale-90 overflow-hidden shadow-md group"
              aria-label="Abrir Ajustes y Perfil"
            >
              <span className="text-xl group-hover:scale-110 transition-transform drop-shadow-sm filter saturate-150">👤</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
