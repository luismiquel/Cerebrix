
import React, { useState } from 'react';
import { GameProps } from '../../types';
import { evaluateText } from '../../services/dataService';
import GamePoster from '../GamePoster';

const ArtCritic: React.FC<GameProps> = ({ onGameOver }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ score: number, feedback: string, finalPrompt: string } | null>(null);

  const handleEvaluate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const evaluation = evaluateText(prompt);
      setResult({
        score: evaluation.score,
        feedback: evaluation.feedback,
        finalPrompt: prompt
      });
      setIsProcessing(false);
    }, 800);
  };

  if (result) {
    return (
      <div className="flex flex-col items-center gap-6 p-4 animate-in zoom-in-95">
        <GamePoster prompt={result.finalPrompt} className="w-full max-w-sm aspect-square" />
        <div className="text-center">
           <div className="text-4xl font-black text-emerald-500 mb-2">{result.score} pts</div>
           <p className="text-slate-300 italic">"{result.feedback}"</p>
        </div>
        <button onClick={() => onGameOver(result.score)} className="w-full py-4 bg-teal-500 rounded-2xl font-bold text-white">FINALIZAR</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white text-center">Describe una escena creativa</h3>
      <textarea 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-40 bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white outline-none"
        placeholder="Describe un paisaje, personaje o idea..."
      />
      <button 
        onClick={handleEvaluate}
        disabled={isProcessing}
        className="w-full py-4 bg-emerald-500 rounded-2xl font-black text-white"
      >
        {isProcessing ? "EVALUANDO..." : "EVALUAR DESCRIPCIÓN"}
      </button>
    </div>
  );
};

export default ArtCritic;
