
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation,
  useParams,
  Link
} from 'react-router-dom';
import { GameMetadata, UserStats, DifficultyLevel, Achievement, DynamicAchievement } from './types';
import { GAME_REGISTRY, ACHIEVEMENTS, DYNAMIC_ACHIEVEMENTS } from './constants';
import GameContainer from './components/GameContainer';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import ActivityDetail from './components/ActivityDetail';
import Settings from './components/Settings';
import AchievementToast from './components/AchievementToast';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

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

  // Efecto crítico para aplicar el tema al HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cerebrix_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cerebrix_stats', JSON.stringify(stats));
    localStorage.setItem('cerebrix_senior_mode', String(isSeniorMode));
    localStorage.setItem('cerebrix_difficulty', globalDifficulty);
  }, [stats, isSeniorMode, globalDifficulty]);

  const checkAchievements = useCallback((updatedStats: UserStats, lastScore: number) => {
    const allAvailable = [...ACHIEVEMENTS, ...DYNAMIC_ACHIEVEMENTS];
    const newlyUnlocked: Achievement[] = [];

    allAvailable.forEach(ach => {
      if (!updatedStats.unlockedAchievements.includes(ach.id)) {
        if (ach.condition(updatedStats, lastScore)) {
          newlyUnlocked.push(ach);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setStats(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked.map(a => a.id)],
        totalScore: prev.totalScore + newlyUnlocked.reduce((acc, a) => acc + a.bonusPoints, 0)
      }));
      setActiveAchievement(newlyUnlocked[0]);
    }
  }, []);

  const handleGameOver = (score: number, levelCompleted: boolean = true) => {
    const gameId = location.pathname.split('/').pop();
    const selectedGame = GAME_REGISTRY.find(g => g.id === gameId);
    if (!selectedGame) return;
    
    const todayISO = new Date().toISOString().split('T')[0];
    const isNewDay = stats.lastPlayedDate !== todayISO;

    let dailyUpdate = stats.dailyChallenge || { date: '', gameId: '', screensCompleted: 0, isFinished: false };
    let finalScore = score;
    let shouldExitGame = true;

    if (isChallengeActive) {
      if (levelCompleted) {
        const newCount = (dailyUpdate.screensCompleted || 0) + 1;
        const finished = newCount >= 3;
        dailyUpdate = { ...dailyUpdate, screensCompleted: newCount, isFinished: finished };
        
        if (finished) { 
          finalScore += 5000; 
          shouldExitGame = true; 
        } 
        else { 
          shouldExitGame = false; 
        }
      } else {
        shouldExitGame = true;
        setIsChallengeActive(false);
        dailyUpdate = { ...dailyUpdate, isFinished: true }; 
      }
    }

    const updatedCategoryScores = { ...stats.categoryScores };
    const cat = selectedGame.category;
    updatedCategoryScores[cat] = (updatedCategoryScores[cat] || 0) + finalScore;

    const newHistoryEntry = { date: new Date().toISOString(), score: finalScore, gameId: selectedGame.id };
    const updatedHistory = [newHistoryEntry, ...stats.history].slice(0, 50);

    const updatedStats: UserStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      totalScore: stats.totalScore + finalScore,
      categoryScores: updatedCategoryScores,
      lastPlayedDate: todayISO,
      dailyStreak: isNewDay ? stats.dailyStreak + 1 : stats.dailyStreak,
      daysPlayedCount: isNewDay ? stats.daysPlayedCount + 1 : stats.daysPlayedCount,
      dailyChallenge: dailyUpdate,
      history: updatedHistory
    };

    setStats(updatedStats);
    checkAchievements(updatedStats, finalScore);

    if (shouldExitGame) {
      setIsChallengeActive(false);
      navigate('/home');
    }
  };

  const startDailyChallenge = () => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = today.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % GAME_REGISTRY.length;
    const game = GAME_REGISTRY[index];
    
    setStats(prev => ({
      ...prev,
      dailyChallenge: prev.dailyChallenge?.date === today ? prev.dailyChallenge : { date: today, gameId: game.id, screensCompleted: 0, isFinished: false }
    }));
    
    setIsChallengeActive(true);
    navigate(`/game/${game.id}`);
  };

  const isPlaying = location.pathname.startsWith('/game/');

  return (
    <div className={`min-h-screen pb-24 md:pb-8 md:pt-20 text-slate-900 dark:text-white ${isSeniorMode ? 'senior-mode-active' : ''}`}>
      <Header 
        stats={stats} 
        theme={theme} 
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenSettings={() => navigate('/settings')}
        onGoHome={() => { navigate('/home'); setIsChallengeActive(false); }}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={
            <div className="space-y-8">
              <Dashboard stats={stats} onStartChallenge={startDailyChallenge} />
              <div className="glass rounded-[2rem] p-8 border-l-4 border-l-indigo-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5">
                <div>
                  <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter italic">Biblioteca Cerebrix</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Entrenamiento cognitivo profesional en tu bolsillo.</p>
                </div>
                <button onClick={() => navigate('/games')} className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">Ver Todos los Juegos</button>
              </div>
            </div>
          } />
          
          <Route path="/games" element={<GameGrid games={GAME_REGISTRY} onSelect={(game) => navigate(`/game/${game.id}`)} />} />
          
          <Route path="/activity" element={<ActivityDetail stats={stats} />} />
          
          <Route path="/settings" element={
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
          } />

          <Route path="/game/:gameId" element={<GameWrapper onGameOver={handleGameOver} isSeniorMode={isSeniorMode} globalDifficulty={globalDifficulty} isChallengeActive={isChallengeActive} screensCompleted={stats.dailyChallenge?.screensCompleted || 0} setIsChallengeActive={setIsChallengeActive} />} />
        </Routes>
      </main>

      {activeAchievement && (
        <AchievementToast 
          achievement={activeAchievement} 
          onClose={() => setActiveAchievement(null)} 
        />
      )}

      {!isPlaying && (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t-2 border-slate-300 dark:border-slate-800 flex justify-around items-center px-4 py-3 md:hidden z-50">
          <NavButton to="/home" emoji="🏠" label="Inicio" active={location.pathname === '/home'} />
          <NavButton to="/games" emoji="🎮" label="Juegos" active={location.pathname === '/games'} />
          <NavButton to="/activity" emoji="📈" label="Stats" active={location.pathname === '/activity'} />
          <NavButton to="/settings" emoji="⚙️" label="Ajustes" active={location.pathname === '/settings'} />
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{ to: string, emoji: string, label: string, active: boolean }> = ({ to, emoji, label, active }) => (
  <Link to={to} className={`flex flex-col items-center flex-1 transition-colors ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
    <span className="text-2xl">{emoji}</span>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </Link>
);

const GameWrapper: React.FC<{ 
  onGameOver: (score: number, levelCompleted?: boolean) => void,
  isSeniorMode: boolean,
  globalDifficulty: DifficultyLevel,
  isChallengeActive: boolean,
  screensCompleted: number,
  setIsChallengeActive: (val: boolean) => void
}> = ({ onGameOver, isSeniorMode, globalDifficulty, isChallengeActive, screensCompleted, setIsChallengeActive }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = useMemo(() => GAME_REGISTRY.find(g => g.id === gameId), [gameId]);

  if (!game) return <Navigate to="/games" replace />;

  return (
    <GameContainer 
      key={`${game.id}-${screensCompleted}`}
      game={game} 
      onGameOver={onGameOver} 
      onExit={() => { setIsChallengeActive(false); navigate('/home'); }} 
      isSeniorMode={isSeniorMode}
      globalDifficulty={globalDifficulty}
      isDailyChallenge={isChallengeActive}
      currentRound={screensCompleted + 1}
    />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
