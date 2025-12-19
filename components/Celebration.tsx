
import React, { useEffect, useState } from 'react';

interface Props {
  type?: 'confetti' | 'success' | 'burst';
  active: boolean;
  onComplete?: () => void;
}

const Celebration: React.FC<Props> = ({ type = 'success', active, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {/* Partículas de Confeti */}
      {(type === 'confetti' || type === 'burst') && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-sm animate-confetti`}
              style={{
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Mensaje de Éxito */}
      {type === 'success' && (
        <div className="animate-success-pop flex flex-col items-center">
          <div className="text-7xl mb-4 drop-shadow-2xl">🏆</div>
          <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
            ¡EXCELENTE!
          </h2>
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes success-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
        .animate-success-pop {
          animation: success-pop 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default Celebration;
