
import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<Props> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    // Feedback háptico
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Auto-cierre
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Esperar animación de salida
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center pointer-events-none z-50 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Confeti BG (Simplificado) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-amber-400/20 to-transparent animate-pulse rounded-full blur-3xl"></div>
      </div>

      {/* Tarjeta de Logro */}
      <div className={`
        bg-slate-900 border-2 border-amber-400/50 shadow-[0_0_50px_rgba(251,191,36,0.4)] 
        rounded-3xl p-6 md:p-8 flex flex-col items-center text-center gap-4 max-w-sm mx-4
        transform transition-all duration-700 pointer-events-auto
        ${visible ? 'translate-y-0 scale-100 rotate-0' : 'translate-y-20 scale-90 rotate-6'}
      `}>
        <div className="relative">
            <div className="text-6xl animate-bounce">{achievement.icon}</div>
            <div className="absolute inset-0 blur-xl bg-amber-400/30 rounded-full -z-10 animate-pulse"></div>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-amber-400 font-bold uppercase tracking-widest text-xs animate-pulse">¡Logro Desbloqueado!</h4>
          <h2 className="text-2xl md:text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
            {achievement.name}
          </h2>
        </div>
        
        <p className="text-slate-300 text-sm font-medium leading-relaxed">
          {achievement.description}
        </p>
        
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-bold text-sm">
          +{achievement.bonusPoints} pts
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
