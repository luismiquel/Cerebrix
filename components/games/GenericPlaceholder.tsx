
import React, { useState, useEffect } from 'react';
import { GameMetadata, GameProps } from '../../types';
import { generateRiddle } from '../../services/geminiService';

interface Props extends GameProps {
  game: GameMetadata;
}

const GenericPlaceholder: React.FC<Props> = ({ game, onGameOver }) => {
  const [loading, setLoading] = useState(false);
  const [riddle, setRiddle] = useState<{riddle: string, answer: string} | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (game.id === 'brain-riddle') {
      loadRiddle();
    }
  }, [game.id]);

  const loadRiddle = async () => {
    setLoading(true);
    try {
      const data = await generateRiddle();
      setRiddle(data);
    } catch (e) {
      setRiddle({ riddle: "¿Qué tiene ciudades pero no casas, montañas pero no árboles, y agua pero no peces?", answer: "Mapa" });
    }
    setLoading(false);
  };

  const checkAnswer = () => {
    if (!riddle) return;
    if (userInput.toLowerCase().trim() === riddle.answer.toLowerCase().trim() || userInput.toLowerCase().includes(riddle.answer.toLowerCase())) {
      setFeedback('¡Correcto! 🧠');
      setTimeout(() => onGameOver(500), 1500);
    } else {
      setFeedback('Casi... ¡Inténtalo de nuevo!');
    }
  };

  if (game.id === 'brain-riddle') {
    return (
      <div className="text-center p-8 space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-medium leading-relaxed italic text-slate-200">
              "{riddle?.riddle}"
            </div>
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-center focus:border-teal-500 outline-none text-white"
            />
            <button 
              onClick={checkAnswer}
              className="w-full py-4 bg-teal-500 rounded-2xl font-bold text-white shadow-lg shadow-teal-500/20"
            >
              ENVIAR RESPUESTA
            </button>
            {feedback && <div className="text-teal-400 font-bold animate-bounce">{feedback}</div>}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-6xl mb-6 grayscale opacity-50">🛠️</div>
      <h3 className="text-2xl font-bold mb-2">Optimizando {game.name}...</h3>
      <p className="text-slate-400 mb-8 max-w-xs">
        Este juego está siendo configurado para niveles infinitos. ¡Vuelve pronto!
      </p>
      <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-teal-500 w-2/3 animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
      <button 
        onClick={() => onGameOver(50)}
        className="mt-8 px-8 py-3 glass rounded-xl text-slate-400 hover:text-white transition-colors"
      >
        MODO PRUEBA
      </button>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default GenericPlaceholder;
