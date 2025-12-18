
import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { generateStoryChallenge } from '../../services/geminiService';

const StoryMaster: React.FC<GameProps> = ({ onGameOver, isDailyChallenge, currentRound = 1 }) => {
  // Ajustado a 10 preguntas fijas como solicitó el usuario para una ronda completa
  const TARGET = 10; 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ story: string, question: string, options: string[], correctAnswer: string } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const loadNewChallenge = async () => {
    setLoading(true);
    setFeedback(null);
    setSelected(null);
    try {
      const challenge = await generateStoryChallenge();
      setData(challenge);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNewChallenge();
  }, []);

  const handleSelect = (option: string) => {
    if (feedback) return;
    setSelected(option);
    
    if (option === data?.correctAnswer) {
      setFeedback('correct');
      const newCorrectCount = correctCount + 1;
      setScore(s => s + 200);
      
      // Pequeño delay para que el usuario vea el feedback antes de pasar o terminar
      setTimeout(() => {
        if (newCorrectCount >= TARGET) {
          onGameOver(score + 200, true);
        } else {
          setCorrectCount(newCorrectCount);
          loadNewChallenge();
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      // En Reto Diario, un fallo te obliga a repetir la ronda desde 0
      setTimeout(() => onGameOver(score, false), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 animate-pulse p-8">
        <div className="text-5xl">✍️</div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Preparando siguiente historia...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-black text-slate-500 uppercase">Pregunta {correctCount + 1} de {TARGET}</span>
        {isDailyChallenge && <span className="text-xs font-black text-indigo-500 uppercase italic">Ronda {currentRound}</span>}
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] shadow-inner transition-all">
        <p className="text-xl md:text-2xl leading-relaxed text-slate-200 italic font-medium">
          "{data?.story}"
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
          <span>❓</span> {data?.question}
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {data?.options.map(opt => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!feedback}
              className={`p-5 rounded-2xl text-left font-medium transition-all border-2 ${
                selected === opt 
                  ? feedback === 'correct' 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {selected === opt && (
                  <span>{feedback === 'correct' ? '✅' : '❌'}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <div className="flex gap-2 justify-center mb-2">
          {[...Array(TARGET)].map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-4 rounded-full transition-all duration-500 ${i < correctCount ? 'bg-emerald-500' : 'bg-slate-800'}`} 
            />
          ))}
        </div>
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
          Acierta {TARGET} para completar la ronda
        </span>
      </div>
    </div>
  );
};

export default StoryMaster;
