
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
    <header className="fixed top-0 left-0 right-0 glass z-40 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo - Clic para ir a Home */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 hover:opacity-80 transition-all active:scale-95 group"
          aria-label="Ir a Inicio"
        >
          {stats.customLogo ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-emerald-500/40">
              <img src={stats.customLogo} alt="Cerebrix Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all transform group-hover:scale-105">
              <Logo />
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-700 dark:from-emerald-400 dark:to-blue-500 hidden sm:block drop-shadow-sm transition-all">
            CEREBRIX
          </h1>
        </button>
        
        <div className="flex items-center gap-3 md:gap-6">
          {/* Contador de Puntos (Versión Desktop) */}
          <div className="hidden sm:flex flex-col items-end pointer-events-none select-none px-4 py-1.5 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-black tracking-widest leading-none mb-0.5">Puntos Totales</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">{stats.totalScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleTheme}
              className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center hover:scale-105 hover:border-teal-500 dark:hover:border-teal-400 transition-all shadow-md group"
              aria-label="Alternar tema"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform drop-shadow-sm">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>

            {/* Perfil - Clic para ir a Ajustes */}
            <button 
              onClick={onOpenSettings}
              className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 hover:scale-105 transition-all active:scale-95 overflow-hidden shadow-md group"
              aria-label="Abrir Ajustes y Perfil"
            >
              <span className="text-xl group-hover:scale-110 transition-transform drop-shadow-sm">👤</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
