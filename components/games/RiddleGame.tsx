
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { getLocalRiddle } from '../../services/localDataService';

const RiddleGame: React.FC<GameProps> = ({ onGameOver, difficulty }) => {
  const [data, setData] = useState<any>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setData(getLocalRiddle());
  }, []);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    
    const isCorrect = input.toLowerCase().trim() === data.answer.toLowerCase().trim() || 
                      input.toLowerCase().includes(data.answer.toLowerCase());

    if (isCorrect) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
      setFeedback('¡Correcto!');
      setTimeout(() => onGameOver(difficulty === 'master' ? 600 : 300), 1000);
    } else {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      setFeedback('Inténtalo de nuevo...');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  if (!data) return null;

  return (
    <div className="text-center space-y-8 p-4">
      <div className="glass p-8 rounded-[3rem] border border-white/10 shadow-inner">
        <p className="text-2xl italic text-slate-200 leading-relaxed font-medium">"{data.riddle}"</p>
      </div>
      <form onSubmit={check} className="space-y-4 max-w-sm mx-auto">
        <input 
          type="text" 
          autoFocus
          value={input} 
          onChange={e => setInput(e.target.value)}
          className="w-full bg-slate-900 border-4 border-slate-700 p-5 rounded-3xl text-center text-xl text-white focus:border-indigo-500 outline-none transition-all uppercase font-black"
          placeholder="Tu respuesta..."
        />
        <button className="w-full py-5 bg-indigo-600 rounded-3xl font-black text-white shadow-xl hover:bg-indigo-500 transition-all uppercase tracking-widest">COMPROBAR</button>
        {feedback && <div className="text-teal-400 font-bold animate-bounce uppercase tracking-widest text-sm">{feedback}</div>}
      </form>
    </div>
  );
};

export default RiddleGame;
