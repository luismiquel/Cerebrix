
import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';
import Celebration from '../Celebration';

const ICONS = ['🔥', '💧', '⚡', '🌟', '🍀', '🍎', '🍄', '🏀', '🎨', '🚗', '🚀', '🎸', '🍦', '🛸', '💎', '🌈', '🍕', '🦄', '🐲', '🪐', '🥨'];

const MemoryMatch: React.FC<GameProps> = ({ onGameOver, isSeniorMode, difficulty, fontSize }) => {
  const [cards, setCards] = useState<{ id: number, emoji: string, isFlipped: boolean, isMatched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(c => 
          (c.id === first || c.id === second) ? { ...c, isMatched: true } : c
        ));
        setScore(s => s + (difficulty === 'master' ? 300 : 100));
        setFlipped([]);
      } else {
        let flipBackDelay = isSeniorMode ? 1500 : (difficulty === 'master' ? 300 : 600);
        setTimeout(() => setFlipped([]), flipBackDelay);
      }
    }
  }, [flipped, cards, isSeniorMode, difficulty]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setShowCelebration(true);
      setTimeout(() => onGameOver(score, true), 1600);
    }
  }, [cards, score, onGameOver]);

  const handleFlip = (id: number) => {
    if (flipped.length < 2 && !flipped.includes(id) && !cards[id].isMatched && !isShuffling) {
      setFlipped(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-2">
      <Celebration active={showCelebration} type="confetti" />
      <div className={`flex justify-between w-full font-bold ${fontSize === 'large' ? 'text-2xl' : 'text-lg'}`}>
        <span className="text-teal-400 italic uppercase tracking-tighter">Puntos: {score}</span>
      </div>
      
      <div className={`grid gap-2 w-full max-w-sm transition-all duration-300 ${isShuffling ? 'opacity-0 scale-95' : 'opacity-100'} ${difficulty === 'master' ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 transform ${
                isFlipped ? 'bg-indigo-600 rotate-0 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 rotate-y-180 border-2 border-slate-700/50'
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
