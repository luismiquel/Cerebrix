
import React, { useState, useEffect, useCallback } from 'react';
import { GameMetadata, UserStats, DifficultyLevel } from './types';
import { GAME_REGISTRY } from './constants';
import GameContainer from './components/GameContainer';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import ActivityDetail from './components/ActivityDetail';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'games' | 'activity' | 'settings'>('games');
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);
  const [isChallengeActive, setIsChallengeActive] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('cerebrix_theme') as 'dark' | 'light') || 'dark';
  });

  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    return localStorage.getItem('cerebrix_senior_mode') === 'true';
  });

  const [globalDifficulty, setGlobalDifficulty] = useState<DifficultyLevel>(() => {
    return (localStorage.getItem('cerebrix_difficulty') as DifficultyLevel) || 'medium';
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('cerebrix_stats');
    const defaultStats: UserStats = {
      gamesPlayed: 0,
      totalScore: 0,
      categoryScores: {},
      dailyStreak: 0,
      lastPlayedDate: null,
      daysPlayedCount: 0,
      history: [],
      unlockedAchievements: [],
      dailyChallenge: { date: '', gameId: '', screensCompleted: 0, isFinished: false }
    };
    
    if (!saved) return defaultStats;
    try {
      const parsed = JSON.parse(saved);
      return { 
        ...defaultStats, 
        ...parsed,
        dailyChallenge: parsed.dailyChallenge || defaultStats.dailyChallenge
      };
    } catch (e) {
      return defaultStats;
    }
  });

  const getGameOfTheDay = useCallback(() => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % GAME_REGISTRY.length;
    return GAME_REGISTRY[index];
  }, []);

  const startDailyChallenge = () => {
    const today = new Date().toDateString();
    const game = getGameOfTheDay();
    
    setStats(prev => {
      const currentChallenge = prev.dailyChallenge;
      if (!currentChallenge || currentChallenge.date !== today) {
        return {
          ...prev,
          dailyChallenge: { date: today, gameId: game.id, screensCompleted: 0, isFinished: false }
        };
      }
      return prev;
    });
    
    setSelectedGame(game);
    setIsChallengeActive(true);
  };

  useEffect(() => {
    localStorage.setItem('cerebrix_stats', JSON.stringify(stats));
    localStorage.setItem('cerebrix_theme', theme);
    localStorage.setItem('cerebrix_senior_mode', String(isSeniorMode));
    localStorage.setItem('cerebrix_difficulty', globalDifficulty);
    
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [stats, theme, isSeniorMode, globalDifficulty]);

  const handleGameOver = (score: number, levelCompleted: boolean = true) => {
    if (!selectedGame) return;
    
    const todayISO = new Date().toISOString().split('T')[0];
    const isNewDay = stats.lastPlayedDate !== todayISO;

    setStats(prev => {
      let dailyUpdate = prev.dailyChallenge || { date: '', gameId: '', screensCompleted: 0, isFinished: false };
      let finalScore = score;
      let shouldExitGame = true;

      if (isChallengeActive) {
        if (levelCompleted) {
          const newCount = (dailyUpdate.screensCompleted || 0) + 1;
          const finished = newCount >= 3;
          
          dailyUpdate = {
            ...dailyUpdate,
            screensCompleted: newCount,
            isFinished: finished
          };

          if (finished) {
            finalScore += 5000;
            shouldExitGame = true;
          } else {
            shouldExitGame = false;
          }
        } else {
          shouldExitGame = true;
          alert("¡Casi! No has superado esta ronda del reto. Inténtalo de nuevo.");
        }
      }

      const updated = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalScore: prev.totalScore + finalScore,
        lastPlayedDate: todayISO,
        dailyStreak: isNewDay ? prev.dailyStreak + 1 : prev.dailyStreak,
        daysPlayedCount: isNewDay ? prev.daysPlayedCount + 1 : prev.daysPlayedCount,
        dailyChallenge: dailyUpdate,
        history: [{ date: new Date().toISOString(), score: finalScore, gameId: selectedGame.id }, ...prev.history].slice(0, 50)
      };

      if (shouldExitGame) {
        setIsChallengeActive(false);
        setSelectedGame(null);
      }

      return updated;
    });
  };

  return (
    <div className={`min-h-screen pb-24 md:pb-8 md:pt-20 ${isSeniorMode ? 'senior-mode-active' : ''}`}>
      <Header 
        stats={stats} 
        theme={theme} 
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenSettings={() => setView('settings')}
        onGoHome={() => { setView('home'); setSelectedGame(null); setIsChallengeActive(false); }}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {selectedGame ? (
          <GameContainer 
            key={`${selectedGame.id}-${stats.dailyChallenge?.screensCompleted || 0}`}
            game={selectedGame} 
            onGameOver={handleGameOver} 
            onExit={() => { setSelectedGame(null); setIsChallengeActive(false); }} 
            isSeniorMode={isSeniorMode}
            globalDifficulty={globalDifficulty}
            isDailyChallenge={isChallengeActive}
            currentRound={(stats.dailyChallenge?.screensCompleted || 0) + 1}
          />
        ) : (
          <>
            {view === 'home' && (
              <div className="space-y-8">
                <Dashboard stats={stats} onStartChallenge={startDailyChallenge} />
                <div className="glass rounded-[2rem] p-8 border-l-4 border-l-indigo-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white mb-1 uppercase tracking-tighter italic">Biblioteca Cerebrix</h3>
                    <p className="text-slate-500 text-sm">Entrenamiento cognitivo profesional en tu bolsillo.</p>
                  </div>
                  <button onClick={() => setView('games')} className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all uppercase tracking-widest text-xs">Ver Todos los Juegos</button>
                </div>
              </div>
            )}
            {view === 'games' && <GameGrid games={GAME_REGISTRY} onSelect={setSelectedGame} />}
            {view === 'activity' && <ActivityDetail stats={stats} />}
            {view === 'settings' && (
              <Settings 
                isSeniorMode={isSeniorMode} 
                onToggleSenior={() => setIsSeniorMode(!isSeniorMode)} 
                theme={theme} 
                onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
                difficulty={globalDifficulty}
                onSetDifficulty={setGlobalDifficulty}
                fontSize="normal" 
                onSetFontSize={() => {}} 
                onClearData={() => { localStorage.clear(); window.location.reload(); }} 
                stats={stats} 
              />
            )}
          </>
        )}
      </main>

      {!selectedGame && (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t-2 border-slate-300 dark:border-slate-800 flex justify-around items-center px-4 py-3 md:hidden z-50">
          <button onClick={() => setView('home')} className={`flex flex-col items-center flex-1 transition-colors ${view === 'home' ? 'text-emerald-500' : 'text-slate-400'}`}>
            <span className="text-2xl">🏠</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Inicio</span>
          </button>
          <button onClick={() => setView('games')} className={`flex flex-col items-center flex-1 transition-colors ${view === 'games' ? 'text-emerald-500' : 'text-slate-400'}`}>
            <span className="text-2xl">🎮</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Juegos</span>
          </button>
          <button onClick={() => setView('activity')} className={`flex flex-col items-center flex-1 transition-colors ${view === 'activity' ? 'text-emerald-500' : 'text-slate-400'}`}>
            <span className="text-2xl">📈</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Stats</span>
          </button>
          <button onClick={() => setView('settings')} className={`flex flex-col items-center flex-1 transition-colors ${view === 'settings' ? 'text-emerald-500' : 'text-slate-400'}`}>
            <span className="text-2xl">⚙️</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Ajustes</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
