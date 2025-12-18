
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { getStory } from '../../services/dataService';

const StoryMaster: React.FC<GameProps> = ({ onGameOver }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStory().then(story => {
      setData(story);
      setLoading(false);
    });
  }, []);

  const handleSelect = (opt: string) => {
    if (opt === data.correctAnswer) {
      onGameOver(500);
    } else {
      onGameOver(50);
    }
  };

  if (loading) return <div className="text-center animate-pulse">Cargando historia...</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-800 rounded-2xl italic text-lg leading-relaxed">"{data.story}"</div>
      <h4 className="font-bold text-teal-400 text-xl">{data.question}</h4>
      <div className="grid gap-3">
        {data.options.map((opt: string) => (
          <button key={opt} onClick={() => handleSelect(opt)} className="p-4 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">{opt}</button>
        ))}
      </div>
    </div>
  );
};

export default StoryMaster;
