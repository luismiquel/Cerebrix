
import { LOCAL_RIDDLES, LOCAL_STORIES } from './localDataService';

/**
 * Genera un acertijo creativo desde la base de datos local.
 */
export async function generateRiddle() {
  // Simulamos una pequeña latencia para mejorar la sensación de "generación"
  await new Promise(resolve => setTimeout(resolve, 300));
  const randomIndex = Math.floor(Math.random() * LOCAL_RIDDLES.length);
  return LOCAL_RIDDLES[randomIndex];
}

/**
 * Determina el mejor movimiento de ajedrez usando un motor heurístico local.
 */
export async function getBestChessMove(fen: string, possibleMoves: string[]) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Lógica de "IA" Local:
  // 1. Prioriza capturas (movimientos que contienen 'x')
  const captures = possibleMoves.filter(m => m.includes('x'));
  if (captures.length > 0) return captures[Math.floor(Math.random() * captures.length)];
  
  // 2. Prioriza enroque (O-O)
  const castling = possibleMoves.filter(m => m.includes('O-O'));
  if (castling.length > 0) return castling[0];
  
  // 3. Si no, movimiento aleatorio
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

/**
 * Genera un crucigrama desde plantillas locales.
 */
export async function generateCrossword() {
  await new Promise(resolve => setTimeout(resolve, 400));
  const crosswords = [
    {
      grid: ["GATO#", "O#R#S", "LUNA#", "#A#L#", "MESA#"],
      clues: [
        { id: "1", direction: "Horizontal", text: "Felino doméstico común" },
        { id: "3", direction: "Horizontal", text: "Satélite natural de la Tierra" },
        { id: "5", direction: "Horizontal", text: "Mueble principal para comer" },
        { id: "1", direction: "Vertical", text: "Tantos anotados en un partido (al revés)" }
      ]
    },
    {
      grid: ["SOL##", "A#C#A", "LAGO#", "A#S#A", "#MAR#"],
      clues: [
        { id: "1", direction: "Horizontal", text: "Estrella central del sistema" },
        { id: "3", direction: "Horizontal", text: "Cuerpo de agua dulce" },
        { id: "5", direction: "Horizontal", text: "Cuerpo de agua salada" }
      ]
    }
  ];
  return crosswords[Math.floor(Math.random() * crosswords.length)];
}
