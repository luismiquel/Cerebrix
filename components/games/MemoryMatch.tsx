
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';

const ICONS = ['🔥', '💧', '⚡', '🌟', '🍀', '🍎', '🍄', '🏀', '🚗', '🚀', '🎸', '🍦', '🛸', '💎', '🌈', '🍕', '🦄', '🐲', '🪐', '🥨'];

const MemoryMatch: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [cards, setCards] = useState<{ id: number, emoji: string, isFlipped: boolean, isMatched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [consecutiveFails, setConsecutiveFails] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const initBoard = useCallback(() => {
    let pairsCount = 8;
    if (difficulty === 'master') pairsCount = 10;
    
    const pairIcons = [...ICONS.slice(0, pairsCount), ...ICONS.slice(0, pairsCount)];
    const shuffled = pairIcons
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));
    setCards(shuffled);
  }, [difficulty]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  const handleMasterShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
        setCards(prev => {
            const unmatched = prev.filter(c => !c.isMatched);
            const matched = prev.filter(c => c.isMatched);
            const shuffledUnmatched = unmatched
                .sort(() => Math.random() - 0.5)
                .map((c, i) => ({ ...c, id: matched.length + i }));
            
            // Reasignar IDs para evitar conflictos
            return [...matched, ...shuffledUnmatched].map((c, i) => ({ ...c, id: i }));
        });
        setIsShuffling(false);
        setConsecutiveFails(0);
    }, 600);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      setMoves(m => m + 1);
      
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(c => 
          (c.id === first || c.id === second) ? { ...c, isMatched: true } : c
        ));
        setScore(s => s + (difficulty === 'master' ? 300 : 100));
        setFlipped([]);
        setConsecutiveFails(0);
      } else {
        setConsecutiveFails(f => f + 1);
        let flipBackDelay = 600;
        if (isSeniorMode) flipBackDelay = 1500;
        else if (difficulty === 'master') flipBackDelay = 300;

        setTimeout(() => {
            setFlipped([]);
            if (difficulty === 'master' && consecutiveFails >= 1) {
                handleMasterShuffle();
            }
        }, flipBackDelay);
      }
    }
  }, [flipped, cards, isSeniorMode, difficulty, consecutiveFails]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      onGameOver(score);
    }
  }, [cards, score, onGameOver]);

  const handleFlip = (id: number) => {
    if (flipped.length < 2 && !flipped.includes(id) && !cards[id].isMatched && !isShuffling) {
      setFlipped(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-2">
      <div className={`flex justify-between w-full font-bold ${fontSize === 'large' ? 'text-2xl' : 'text-lg'}`}>
        <span className="text-teal-400">Puntos: {score}</span>
        {difficulty === 'master' && consecutiveFails > 0 && (
            <span className="text-rose-500 animate-pulse text-xs uppercase">¡Cuidado! Se mezclarán</span>
        )}
      </div>
      
      <div className={`grid gap-2 w-full max-w-sm transition-opacity duration-300 ${isShuffling ? 'opacity-0 scale-95' : 'opacity-100'} ${difficulty === 'master' ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-300 transform ${
                isFlipped ? 'bg-indigo-600 rotate-0' : 'bg-slate-800 rotate-y-180 border border-slate-700'
              }`}
            >
              {isFlipped ? card.emoji : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryMatch;
