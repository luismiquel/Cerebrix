
import React, { useState } from 'react';
import { GameMetadata } from '../types';

interface Props {
  games: GameMetadata[];
  onSelect: (game: GameMetadata) => void;
}

const GameGrid: React.FC<Props> = ({ games, onSelect }) => {
  const [page, setPage] = useState(0);
  const gamesPerPage = 20;
  const totalPages = Math.ceil(games.length / gamesPerPage);
  
  const currentGames = games.slice(page * gamesPerPage, (page + 1) * gamesPerPage);

  return (
    <div className="space-y-8">
      <div className="game-grid min-h-[600px]">
        {currentGames.map(game => (
          <button
            key={game.id}
            onClick={() => onSelect(game)}
            className="group relative flex flex-col items-center p-6 rounded-3xl glass transition-all hover:scale-105 active:scale-95 border-2 border-transparent hover:border-emerald-500/30 shadow-sm"
          >
            <div className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:rotate-12 transition-transform text-white`}>
              {game.icon}
            </div>
            <h3 className="font-bold text-base mb-1 text-slate-800 dark:text-white text-center leading-tight">{game.name}</h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{game.category}</span>
          </button>
        ))}
      </div>

      {/* Paginación Estilizada */}
      <div className="flex items-center justify-center gap-4 pt-6">
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center glass border-2 transition-all ${page === 0 ? 'opacity-30' : 'hover:border-emerald-500 active:scale-90'}`}
        >
          <span className="text-xl">←</span>
        </button>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${page === i ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
            />
          ))}
        </div>
        <button 
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center glass border-2 transition-all ${page === totalPages - 1 ? 'opacity-30' : 'hover:border-emerald-500 active:scale-90'}`}
        >
          <span className="text-xl">→</span>
        </button>
      </div>
      
      <p className="text-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
        Mostrando pantalla {page + 1} de {totalPages} • 40 Juegos disponibles
      </p>
    </div>
  );
};

export default GameGrid;
