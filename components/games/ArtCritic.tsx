
import React, { useState } from 'react';
import { GameProps } from '../../types';
import { evaluateArtPrompt } from '../../services/geminiService';
import AIImage from '../AIImage';

const ArtCritic: React.FC<GameProps> = ({ onGameOver }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ score: number, feedback: string, finalPrompt: string } | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const evaluation = await evaluateArtPrompt(prompt);
      setResult({
        score: evaluation.score,
        feedback: evaluation.feedback,
        finalPrompt: prompt
      });
      setTotalScore(s => s + evaluation.score);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setPrompt('');
  };

  if (result) {
    return (
      <div className="flex flex-col items-center gap-6 p-4 animate-in zoom-in-95 duration-500">
        <div className="w-full max-w-sm aspect-square relative group">
          <AIImage prompt={result.finalPrompt} className="w-full h-full shadow-2xl" />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <span className="text-yellow-400 font-black text-xl">{result.score}</span>
            <span className="text-xs text-white/60 ml-1 font-bold">PTS</span>
          </div>
        </div>

        <div className="text-center space-y-2 max-w-xs">
          <h4 className="text-teal-400 font-bold uppercase tracking-widest text-xs">Análisis de la IA</h4>
          <p className="text-slate-200 font-medium italic">"{result.feedback}"</p>
        </div>

        <div className="flex gap-4 w-full max-w-xs">
          <button 
            onClick={reset}
            className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            NUEVA IDEA
          </button>
          <button 
            onClick={() => onGameOver(totalScore)}
            className="flex-1 py-4 bg-teal-500 rounded-2xl font-bold text-white shadow-lg shadow-teal-500/20"
          >
            FINALIZAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Crea tu Obra Maestra</h3>
        <p className="text-slate-400 text-sm">
          Describe una imagen con el mayor detalle posible. Cuanto más rico sea tu vocabulario, mayor puntuación obtendrás.
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Un gato cyber-punk con gafas de sol neón sentado en un trono de circuitos en una ciudad futurista lluviosa..."
          className="w-full h-40 bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white placeholder:text-slate-600 focus:border-teal-500 outline-none transition-all resize-none shadow-inner"
        />

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-5 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl transition-all ${
            isGenerating 
              ? 'bg-slate-700 animate-pulse' 
              : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:scale-105 active:scale-95'
          }`}
        >
          {isGenerating ? '🎨 Analizando Estética...' : '✨ GENERAR ARTE'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Puntos Totales</span>
          <span className="text-xl font-bold text-white">{totalScore}</span>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Bonus IA</span>
          <span className="text-xl font-bold text-teal-400">+10%</span>
        </div>
      </div>
    </div>
  );
};

export default ArtCritic;
