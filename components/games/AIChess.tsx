
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { GameProps } from '../../types';
import { getBestChessMove } from '../../services/aiService';

const PIECE_SYMBOLS: Record<string, string> = {
  'w-k': '♔', 'w-q': '♕', 'w-r': '♖', 'w-b': '♗', 'w-n': '♘', 'w-p': '♙',
  'b-k': '♚', 'b-q': '♛', 'b-r': '♜', 'b-b': '♝', 'b-n': '♞', 'b-p': '♟'
};

const AIChess: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode }) => {
  const getInitialTime = () => {
    if (isSeniorMode) return 600; 
    switch (difficulty) {
      case 'easy': return 300;
      case 'hard': return 120;
      case 'master': return 60; // Blitz Extremo
      default: return 180;
    }
  };

  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [status, setStatus] = useState<'player' | 'ai' | 'checkmate' | 'draw' | 'timeout'>('player');
  const [message, setMessage] = useState('Tu turno (Blancas)');
  
  const [timeLeft, setTimeLeft] = useState(getInitialTime());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === 'player' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('timeout');
            setMessage('¡Tiempo agotado!');
            onGameOver(scoreFromTime(0));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, timeLeft]);

  const scoreFromTime = (time: number) => {
    const base = difficulty === 'master' ? 2000 : 500;
    return base + (time * 10);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateGameState = useCallback(() => {
    const game = chessRef.current;
    setFen(game.fen());
    
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setStatus('checkmate');
        const isPlayerWin = game.turn() === 'b'; 
        if (isPlayerWin) {
           setMessage('¡JAQUE MATE! VICTORIA');
           setTimeout(() => onGameOver(scoreFromTime(timeLeft)), 2000);
        } else {
           setMessage('DERROTA POR MATE');
           setTimeout(() => onGameOver(100), 2000);
        }
      } else {
        setStatus('draw');
        setMessage('TABLAS.');
        setTimeout(() => onGameOver(500), 2000);
      }
      return;
    }

    if (game.turn() === 'b') {
      setStatus('ai');
      setMessage('IA PENSANDO...');
      makeAIMove();
    } else {
      setStatus('player');
      setMessage('TU TURNO');
    }
  }, [onGameOver, timeLeft, difficulty]);

  const makeAIMove = async () => {
    const game = chessRef.current;
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    
    // Simular tiempo de IA según dificultad
    const aiThinkTime = difficulty === 'master' ? 300 : 1000;
    await new Promise(r => setTimeout(r, aiThinkTime));
    
    try {
      const bestMove = await getBestChessMove(game.fen(), possibleMoves);
      game.move(bestMove);
      updateGameState();
    } catch (e) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      game.move(randomMove);
      updateGameState();
    }
  };

  const handleSquareClick = (square: string) => {
    if (status !== 'player') return;
    const game = chessRef.current;
    if (selectedSquare) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });
        if (move) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
          setSelectedSquare(null);
          setValidMoves([]);
          updateGameState();
          return;
        }
      } catch (e) {}
    }
    const piece = game.get(square as any);
    if (piece && piece.color === 'w') {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as any, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-lg mx-auto select-none touch-none">
      <div className="flex justify-between w-full items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-4 font-mono font-black text-xl transition-all ${timeLeft < 20 ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-200'}`}>
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className={`flex-1 px-4 py-2 rounded-2xl border-2 text-center transition-all ${status === 'player' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          <span className="text-[10px] font-black uppercase tracking-widest truncate block">{message}</span>
        </div>
      </div>

      <div className="w-full aspect-square bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-800 p-2">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-2xl overflow-hidden border-2 border-white/5">
          {chessRef.current.board().flat().map((piece, idx) => {
            const r = Math.floor(idx / 8);
            const c = idx % 8;
            const file = String.fromCharCode(97 + c);
            const rank = 8 - r;
            const squareId = `${file}${rank}`;
            const isDark = (r + c) % 2 === 1;
            const isSelected = selectedSquare === squareId;
            const isValidMove = validMoves.includes(squareId);
            
            return (
              <div
                key={squareId}
                onPointerDown={(e) => { e.preventDefault(); handleSquareClick(squareId); }}
                className={`relative flex items-center justify-center text-4xl cursor-pointer transition-all ${isDark ? 'bg-slate-700' : 'bg-slate-400'} ${isSelected ? '!bg-indigo-500/80' : ''} ${isValidMove ? '!bg-emerald-500/40' : ''}`}
                style={{ width: '100%', aspectRatio: '1/1' }}
              >
                {isValidMove && !piece && <div className="w-3 h-3 rounded-full bg-white/40"></div>}
                {piece && (
                  <span className={`transform transition-transform ${piece.color === 'w' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]'} ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                    {PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
         <div className="text-[10px] text-slate-500 font-black uppercase tracking-tighter max-w-[200px]">
           Blancas (♔). Dificultad: {difficulty.toUpperCase()}
         </div>
         <button onClick={() => onGameOver(scoreFromTime(0))} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500 text-white text-[10px] font-black uppercase transition-all shadow-lg">Rendirse</button>
      </div>
    </div>
  );
};

export default AIChess;
