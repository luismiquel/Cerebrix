
import React, { useMemo } from 'react';

interface Props {
  prompt: string;
  className?: string;
}

const GamePoster: React.FC<Props> = ({ prompt, className }) => {
  const artStyle = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const c1 = `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
    const c2 = `hsl(${Math.abs((hash >> 8) % 360)}, 80%, 40%)`;
    const c3 = `hsl(${Math.abs((hash >> 16) % 360)}, 60%, 50%)`;
    
    const type = Math.abs(hash % 3);
    
    let background = '';
    if (type === 0) {
        background = `linear-gradient(${hash % 360}deg, ${c1}, ${c2}, ${c3})`;
    } else if (type === 1) {
        background = `radial-gradient(circle at ${Math.abs(hash % 100)}% ${Math.abs((hash >> 4) % 100)}%, ${c1}, ${c3}, ${c2})`;
    } else {
        background = `conic-gradient(from ${hash % 360}deg, ${c1}, ${c2}, ${c3}, ${c1})`;
    }

    return { background };
  }, [prompt]);

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center rounded-2xl shadow-2xl ${className}`}
      style={artStyle}
    >
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="text-6xl md:text-8xl drop-shadow-lg opacity-80 mix-blend-screen filter blur-[1px]">
           {prompt.includes('maze') ? '🗺️' : 
            prompt.includes('chess') ? '♟️' :
            prompt.includes('eye') ? '👁️' :
            prompt.includes('book') ? '📖' :
            prompt.includes('tetris') ? '🧱' :
            '✨'}
        </div>
    </div>
  );
};

export default GamePoster;
