
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { getRiddle } from '../../services/dataService';

const RiddleGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [data, setData] = useState<any>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    getRiddle().then(setData);
  }, []);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase().includes(data.answer.toLowerCase())) {
      onGameOver(300);
    } else {
      alert("Casi... ¡Prueba otra vez!");
    }
  };

  if (!data) return null;

  return (
    <div className="text-center space-y-6">
      <p className="text-2xl italic text-white">"{data.riddle}"</p>
      <form onSubmit={check} className="space-y-4">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          className="w-full bg-slate-900 p-4 rounded-xl text-center"
          placeholder="Tu respuesta..."
        />
        <button className="w-full py-4 bg-indigo-600 rounded-xl font-bold">ENVIAR</button>
      </form>
    </div>
  );
};

export default RiddleGame;
