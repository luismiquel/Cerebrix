
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { GameProps } from '../../types';
import { getBestMove } from '../../services/dataService';

const PIECE_SYMBOLS: Record<string, string> = {
  'w-k': '♔', 'w-q': '♕', 'w-r': '♖', 'w-b': '♗', 'w-n': '♘', 'w-p': '♙',
  'b-k': '♚', 'b-q': '♛', 'b-r': '♜', 'b-b': '♝', 'b-n': '♞', 'b-p': '♟'
};

const ChessGame: React.FC<GameProps> = ({ onGameOver, difficulty, isSeniorMode }) => {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [status, setStatus] = useState<'player' | 'ai'>('player');
  const [message, setMessage] = useState('Tu turno (Blancas)');

  const updateGameState = useCallback(() => {
    const game = chessRef.current;
    setFen(game.fen());
    if (game.isGameOver()) {
      setMessage(game.isCheckmate() ? '¡Jaque Mate!' : 'Tablas.');
      setTimeout(() => onGameOver(game.isCheckmate() ? 1000 : 500), 3000);
      return;
    }
    if (game.turn() === 'b') {
      setStatus('ai');
      setMessage('Calculando jugada...');
      setTimeout(makeMove, 1000);
    } else {
      setStatus('player');
      setMessage('Tu turno');
    }
  }, [onGameOver]);

  const makeMove = () => {
    const game = chessRef.current;
    const moves = game.moves();
    const move = getBestMove(game.fen(), moves);
    game.move(move);
    updateGameState();
  };

  const handleSquareClick = (square: string) => {
    if (status !== 'player') return;
    const game = chessRef.current;
    if (selectedSquare) {
      try {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
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
      setValidMoves(game.moves({ square: square as any, verbose: true }).map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="p-4 bg-slate-800 rounded-xl text-teal-400 font-bold uppercase text-xs tracking-widest">{message}</div>
      <div className="grid grid-cols-8 grid-rows-8 w-80 h-80 bg-slate-800 border-4 border-slate-700">
        {chessRef.current.board().map((row, r) => row.map((piece, c) => {
          const square = String.fromCharCode(97 + c) + (8 - r);
          const isDark = (r + c) % 2 === 1;
          const isSelected = selectedSquare === square;
          const isValid = validMoves.includes(square);
          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              className={`w-10 h-10 flex items-center justify-center text-2xl cursor-pointer ${isDark ? 'bg-slate-600' : 'bg-slate-300'} ${isSelected ? 'bg-teal-500' : ''} ${isValid ? 'bg-yellow-400/50' : ''}`}
            >
              {piece ? PIECE_SYMBOLS[`${piece.color}-${piece.type}`] : isValid ? '•' : ''}
            </div>
          );
        }))}
      </div>
      <button onClick={() => { chessRef.current.reset(); setFen(chessRef.current.fen()); setMessage('Nueva Partida'); }} className="px-4 py-2 bg-slate-700 rounded-lg text-white font-bold">Reiniciar</button>
    </div>
  );
};

export default ChessGame;
