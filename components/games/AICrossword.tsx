
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../../types';
import { generateCrossword } from '../../services/geminiService';

interface CrosswordData {
  grid: string[]; // Array de strings, ej: ["ABC##", "D#E.."]
  clues: { id: string; direction: string; text: string }[];
}

const AICrossword: React.FC<GameProps> = ({ onGameOver }) => {
  const [data, setData] = useState<CrosswordData | null>(null);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  
  // Referencias para manejo de foco
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    loadLevel();
  }, []);

  const loadLevel = async () => {
    setLoading(true);
    setMessage('');
    try {
      const crossword = await generateCrossword();
      setData(crossword);
      
      // Inicializar grid del usuario vacío (o con #)
      const initialGrid = crossword.grid.map((row: string) => 
        row.split('').map((char: string) => char === '#' ? '#' : '')
      );
      setUserGrid(initialGrid);
      
      // Inicializar matriz de refs
      inputRefs.current = Array(5).fill(null).map(() => Array(5).fill(null));
      
    } catch (e) {
      console.error("Error generating crossword", e);
      // Fallback simple por si falla la API
      const fallbackData = {
        grid: ["GATO#", "O#R#S", "LUNA#", "#A#L#", "MESA#"],
        clues: [
          { id: "1", direction: "Horizontal", text: "Animal doméstico que maulla" },
          { id: "3", direction: "Horizontal", text: "Satélite natural de la Tierra" },
          { id: "5", direction: "Horizontal", text: "Mueble para comer" },
          { id: "1", direction: "Vertical", text: "Deporte con porterías (inv)" }
        ]
      };
      setData(fallbackData);
      setUserGrid(fallbackData.grid.map(r => r.split('').map(c => c === '#' ? '#' : '')));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (r: number, c: number, val: string) => {
    const newVal = val.slice(-1).toUpperCase();
    
    // Solo permitir letras
    if (newVal && !/[A-ZÑ]/.test(newVal)) return;

    const newGrid = [...userGrid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = newVal;
    setUserGrid(newGrid);

    // Auto-avance simple (derecha si hay espacio, sino abajo)
    if (newVal) {
      if (c < 4 && data?.grid[r][c + 1] !== '#') {
        inputRefs.current[r][c + 1]?.focus();
      } else if (r < 4 && data?.grid[r + 1][c] !== '#') {
        // Si llegamos al final de la fila, intentar bajar
        // inputRefs.current[r + 1][c]?.focus(); // Opcional, a veces confunde
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key === 'Backspace') {
       if (userGrid[r][c] === '') {
         // Si está vacío, retroceder
         if (c > 0 && data?.grid[r][c - 1] !== '#') {
           inputRefs.current[r][c - 1]?.focus();
         }
       }
    } else if (e.key === 'ArrowRight') {
      if (c < 4) inputRefs.current[r][c + 1]?.focus();
    } else if (e.key === 'ArrowLeft') {
      if (c > 0) inputRefs.current[r][c - 1]?.focus();
    } else if (e.key === 'ArrowDown') {
      if (r < 4) inputRefs.current[r + 1][c]?.focus();
    } else if (e.key === 'ArrowUp') {
      if (r > 0) inputRefs.current[r - 1][c]?.focus();
    }
  };

  const checkSolution = () => {
    if (!data) return;
    
    let isCorrect = true;
    let correctCount = 0;
    let totalLetters = 0;

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (data.grid[r][c] !== '#') {
          totalLetters++;
          if (userGrid[r][c] !== data.grid[r][c]) {
            isCorrect = false;
          } else {
            correctCount++;
          }
        }
      }
    }

    if (isCorrect) {
      const levelScore = 500;
      setScore(s => s + levelScore);
      setMessage('¡Correcto! Generando siguiente nivel...');
      setTimeout(() => {
        loadLevel();
      }, 2000);
    } else {
      setMessage(`Faltan corregir letras. (${correctCount}/${totalLetters})`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-6xl animate-bounce">🧩</div>
        <p className="text-teal-400 font-bold uppercase tracking-widest animate-pulse">Diseñando Crucigrama...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-2xl mx-auto">
      <div className="flex justify-between w-full items-center">
        <span className="text-teal-400 font-bold text-xl">Puntos: {score}</span>
        <button 
          onClick={loadLevel}
          className="text-xs font-bold text-slate-500 uppercase hover:text-white transition-colors"
        >
          Saltar Nivel
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
        {/* Tablero */}
        <div 
          className="grid grid-cols-5 gap-1 bg-slate-900 p-2 rounded-xl border-4 border-slate-700 shadow-2xl mx-auto"
          style={{ width: 'min(90vw, 300px)', aspectRatio: '1/1' }}
        >
          {userGrid.map((row, r) => (
            row.map((cell, c) => {
              const isBlock = data?.grid[r][c] === '#';
              return (
                <div key={`${r}-${c}`} className="relative w-full h-full">
                  {isBlock ? (
                    <div className="w-full h-full bg-slate-800 rounded-md border border-slate-700/50" />
                  ) : (
                    <input
                      ref={(el) => { inputRefs.current[r][c] = el; }}
                      type="text"
                      maxLength={1}
                      value={cell}
                      onChange={(e) => handleInputChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className="w-full h-full text-center text-xl md:text-2xl font-bold bg-white text-slate-900 rounded-md border-2 border-slate-300 focus:border-teal-500 focus:outline-none focus:bg-teal-50 transition-colors uppercase caret-transparent"
                    />
                  )}
                </div>
              );
            })
          ))}
        </div>

        {/* Pistas */}
        <div className="flex-1 w-full space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar bg-slate-800/30 p-4 rounded-2xl border border-white/5">
          <div>
            <h4 className="text-teal-400 font-bold uppercase text-xs tracking-widest mb-2 border-b border-teal-500/20 pb-1">Horizontales</h4>
            <ul className="space-y-2">
              {data?.clues.filter(c => c.direction === 'Horizontal').map((clue, i) => (
                <li key={i} className="text-sm text-slate-300">
                  <span className="font-bold text-teal-600 mr-2">{clue.id}.</span>
                  {clue.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2 border-b border-blue-500/20 pb-1">Verticales</h4>
            <ul className="space-y-2">
              {data?.clues.filter(c => c.direction === 'Vertical').map((clue, i) => (
                <li key={i} className="text-sm text-slate-300">
                  <span className="font-bold text-blue-600 mr-2">{clue.id}.</span>
                  {clue.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        {message && (
          <div className={`text-sm font-bold uppercase tracking-wider ${message.includes('Correcto') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {message}
          </div>
        )}
        <button
          onClick={checkSolution}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all uppercase tracking-widest"
        >
          Comprobar
        </button>
      </div>
    </div>
  );
};

export default AICrossword;
