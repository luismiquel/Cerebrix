
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
      case 'hard': return 90;
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
            onGameOver(50);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, timeLeft, onGameOver]);

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
           setMessage('¡Jaque Mate! ¡Ganaste!');
           const finalScore = 1000 + (timeLeft * 10) + (difficulty === 'hard' ? 500 : 0);
           setTimeout(() => onGameOver(finalScore), 3000);
        } else {
           setMessage('¡Jaque Mate!');
           setTimeout(() => onGameOver(100), 3000);
        }
      } else {
        setStatus('draw');
        setMessage('Tablas.');
        setTimeout(() => onGameOver(500), 3000);
      }
      return;
    }

    if (game.turn() === 'b') {
      setStatus('ai');
      setMessage('Pensando...');
      makeAIMove();
    } else {
      setStatus('player');
      setMessage('Tu turno');
    }
  }, [onGameOver, timeLeft, difficulty]);

  const makeAIMove = async () => {
    const game = chessRef.current;
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    await new Promise(r => setTimeout(r, 500));
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

  const handleReset = () => {
    chessRef.current.reset(); 
    setFen(chessRef.current.fen()); 
    setStatus('player'); 
    setMessage('Nueva Partida');
    setTimeLeft(getInitialTime());
  };

  const renderBoard = () => {
    const board = chessRef.current.board();
    const squares = [];
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        const piece = board[rowIndex][colIndex];
        const file = String.fromCharCode(97 + colIndex);
        const rank = 8 - rowIndex;
        const squareId = `${file}${rank}`;
        const isDark = (rowIndex + colIndex) % 2 === 1;
        const isSelected = selectedSquare === squareId;
        const isValidMove = validMoves.includes(squareId);
        squares.push(
          <div
            key={squareId}
            onClick={() => handleSquareClick(squareId)}
            className={`relative flex items-center justify-center text-3xl sm:text-4xl select-none cursor-pointer transition-colors ${isDark ? 'bg-slate-600' : 'bg-slate-300'} ${isSelected ? '!bg-teal-500/60' : ''} ${isValidMove ? '!bg-yellow-400/50' : ''}`}
            style={{ width: '100%', aspectRatio: '1/1' }}
          >
            {colIndex === 0 && <span className={`absolute top-0.5 left-0.5 text-[8px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{rank}</span>}
            {rowIndex === 7 && <span className={`absolute bottom-0 right-1 text-[8px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{file}</span>}
            {isValidMove && !piece && <div className="w-3 h-3 rounded-full bg-black/20"></div>}
            {isValidMove && piece && <div className="absolute inset-0 border-4 border-rose-500/50 rounded-none"></div>}
            {piece && (
              <span className={`transform transition-transform hover:scale-110 ${piece.color === 'w' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]'}`}>
                {PIECE_SYMBOLS[`${piece.color}-${piece.type}`]}
              </span>
            )}
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-lg mx-auto">
      <div className="flex justify-between w-full items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono font-bold text-xl ${timeLeft < 30 ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-200'}`}>
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className={`flex-1 px-4 py-2 rounded-xl border text-center ${status === 'player' ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
          <span className="text-xs font-bold uppercase tracking-widest truncate block">{message}</span>
        </div>
      </div>
      <div className="w-full aspect-square bg-slate-800 rounded-lg overflow-hidden shadow-2xl border-4 border-slate-700">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {renderBoard()}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
         <div className="text-xs text-slate-500 font-medium max-w-[200px]">
           Blancas (♔). Gana antes de que el tiempo se agote.
         </div>
         <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase transition-colors">Reiniciar</button>
      </div>
    </div>
  );
};

export default AIChess;
