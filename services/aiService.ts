
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative riddle in Spanish using the Gemini model.
 */
export async function generateRiddle() {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Genera un acertijo creativo en español con su respuesta corta y directa (una sola palabra si es posible).',
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riddle: {
            type: Type.STRING,
            description: 'El texto del acertijo que se le presentará al usuario.',
          },
          answer: {
            type: Type.STRING,
            description: 'La solución del acertijo.',
          }
        },
        required: ['riddle', 'answer'],
        propertyOrdering: ['riddle', 'answer'],
      },
    },
  });

  try {
    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (e) {
    console.error("Error generating riddle with Gemini:", e);
    // Return a fallback riddle in case of error.
    return { riddle: "¿Qué tiene ciudades pero no casas, montañas pero no árboles, y agua pero no peces?", answer: "Mapa" };
  }
}

/**
 * Uses Gemini Pro to determine the best chess move based on the current board position (FEN).
 */
export async function getBestChessMove(fen: string, possibleMoves: string[]) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Actúa como un Gran Maestro de Ajedrez experto. FEN actual: ${fen}. Los movimientos legales son: ${possibleMoves.join(', ')}. ¿Cuál es el mejor movimiento? Responde estrictamente con el movimiento en notación algebraica estándar (ej: e4, Nf3, O-O). No incluyas explicaciones.`,
  });

  const suggestedMove = response.text?.trim() || '';
  
  // Validate the suggested move against the provided list of possible moves.
  if (possibleMoves.includes(suggestedMove)) {
    return suggestedMove;
  }
  
  // Fallback: try case-insensitive match for robustness.
  const match = possibleMoves.find(m => m.toLowerCase() === suggestedMove.toLowerCase());
  if (match) return match;

  // Final fallback to the first possible move if the model returns an invalid string.
  return possibleMoves[0];
}

/**
 * Generates a complete crossword puzzle including the grid and clues using the Gemini model.
 */
export async function generateCrossword() {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Genera un crucigrama de 5x5 en español de alta calidad. El grid debe ser un array de 5 strings, cada uno de exactamente 5 caracteres. Usa el carácter "#" para representar las casillas bloqueadas. Asegúrate de que las palabras sean reales y las pistas sean precisas.',
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          grid: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'El tablero de 5x5 representado como un array de strings.',
          },
          clues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                direction: { type: Type.STRING, description: 'Horizontal o Vertical' },
                text: { type: Type.STRING, description: 'La pista para la palabra correspondiente.' }
              },
              required: ['id', 'direction', 'text']
            }
          }
        },
        required: ['grid', 'clues'],
        propertyOrdering: ['grid', 'clues'],
      },
    },
  });

  try {
    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (e) {
    console.error("Error generating crossword with Gemini:", e);
    // Fallback crossword data for the 5x5 grid.
    return {
      grid: ["GATO#", "O#R#S", "LUNA#", "#A#L#", "MESA#"],
      clues: [
        { id: "1", direction: "Horizontal", text: "Felino doméstico común" },
        { id: "3", direction: "Horizontal", text: "Satélite natural de la Tierra" },
        { id: "5", direction: "Horizontal", text: "Mueble principal donde se sirven las comidas" },
        { id: "1", direction: "Vertical", text: "Tantos anotados en un partido (al revés)" }
      ]
    };
  }
}
