
import { GameMetadata, GameCategory, Achievement, DynamicAchievement, UserStats } from './types';

export const GAME_REGISTRY: GameMetadata[] = [
  // Existentes (13)
  { id: 'tetris', name: 'Tetris Pro', description: 'Ordena bloques para limpiar líneas y entrenar tu visión espacial.', category: GameCategory.LOGIC, icon: '🧱', color: 'bg-blue-700' },
  { id: 'memory-sequence', name: 'Secuencia Maestra', description: 'Memoriza y repite secuencias de luces y sonidos.', category: GameCategory.MEMORY, icon: '💡', color: 'bg-purple-700' },
  { id: 'math-blitz', name: 'Cálculo Mental', description: 'Operaciones rápidas contra el reloj.', category: GameCategory.MATH, icon: '🧮', color: 'bg-emerald-500' },
  { id: 'ritmo-melodico', name: 'Ritmo Melódico', description: 'Completa melodías en un entorno dinámico.', category: GameCategory.MEMORY, icon: '🎷', color: 'bg-indigo-700' },
  { id: 'infinite-maze', name: 'Laberinto Infinito', description: 'Navega por laberintos generados al azar.', category: GameCategory.LOGIC, icon: '🗺️', color: 'bg-yellow-500' },
  { id: 'visual-memory', name: 'Memoria Visual', description: 'Recordando la posición de las imágenes.', category: GameCategory.MEMORY, icon: '🖼️', color: 'bg-blue-400' },
  { id: 'odd-one-out', name: 'El Intruso', description: 'Encuentra el símbolo diferente entre la multitud.', category: GameCategory.LOGIC, icon: '🎯', color: 'bg-orange-500' },
  { id: 'crucigrama', name: 'Crucigrama Maestro', description: 'Completa palabras cruzadas clásicas.', category: GameCategory.LANGUAGE, icon: '🔡', color: 'bg-indigo-500' },
  { id: 'story-master', name: 'Cuentacuentos', description: 'Comprensión lectora avanzada con historias dinámicas.', category: GameCategory.LANGUAGE, icon: '📖', color: 'bg-indigo-600' },
  { id: 'ajedrez', name: 'Ajedrez Pro', description: 'Juega contra un motor de ajedrez local.', category: GameCategory.LOGIC, icon: '♟️', color: 'bg-purple-600' },
  { id: 'concentracion-total', name: 'Enfoque Total', description: 'Entrena tu atención sostenida buscando objetivos.', category: GameCategory.ATTENTION, icon: '👁️', color: 'bg-violet-500' },
  { id: 'brain-riddle', name: 'Enigma Diario', description: 'Acertijos lógicos que desafían tu pensamiento lateral.', category: GameCategory.LOGIC, icon: '❓', color: 'bg-stone-500' },
  { id: 'sudoku-mini', name: 'Sudoku Mini', description: 'Completa la cuadrícula 4x4 sin repetir números.', category: GameCategory.LOGIC, icon: '🔢', color: 'bg-blue-900' },
  
  // Nuevos Juegos (27 para llegar a 40)
  { id: 'find-pair', name: 'Parejas Clásicas', description: 'Encuentra todas las parejas de cartas en el menor tiempo.', category: GameCategory.MEMORY, icon: '🧩', color: 'bg-rose-500' },
  { id: 'speed-sum', name: 'Suma Veloz', description: 'Suma los números que aparecen antes de que desaparezcan.', category: GameCategory.MATH, icon: '⚡', color: 'bg-yellow-600' },
  { id: 'word-search', name: 'Sopa de Letras', description: 'Encuentra las palabras ocultas en la cuadrícula.', category: GameCategory.LANGUAGE, icon: '🔍', color: 'bg-teal-600' },
  { id: 'symbol-match', name: 'Caza de Símbolos', description: 'Identifica si dos símbolos son idénticos rápidamente.', category: GameCategory.ATTENTION, icon: '🆔', color: 'bg-cyan-500' },
  { id: 'pattern-recall', name: 'Patrones Grid', description: 'Reproduce el patrón de celdas iluminadas.', category: GameCategory.MEMORY, icon: '🔳', color: 'bg-fuchsia-600' },
  { id: 'schulte-table', name: 'Tabla de Schulte', description: 'Toca los números en orden ascendente lo más rápido posible.', category: GameCategory.ATTENTION, icon: '🔢', color: 'bg-blue-500' },
  { id: 'missing-op', name: 'Signo Perdido', description: 'Adivina si la operación es suma, resta o multiplicación.', category: GameCategory.MATH, icon: '❓', color: 'bg-orange-600' },
  { id: 'anagrams', name: 'Anagramas', description: 'Reordena las letras para formar una palabra válida.', category: GameCategory.LANGUAGE, icon: '🔠', color: 'bg-pink-600' },
  { id: 'shape-patterns', name: 'Sucesión de Formas', description: 'Identifica qué figura sigue en la secuencia lógica.', category: GameCategory.LOGIC, icon: '🔺', color: 'bg-indigo-400' },
  { id: 'bubble-pop', name: 'Burbujas de Atención', description: 'Explota las burbujas en el orden indicado.', category: GameCategory.ATTENTION, icon: '🫧', color: 'bg-sky-400' },
  { id: 'object-count', name: 'Conteo Rápido', description: 'Cuenta cuántos objetos de un tipo hay en pantalla.', category: GameCategory.MATH, icon: '🧺', color: 'bg-lime-600' },
  { id: 'synonyms', name: 'Sinónimos', description: 'Encuentra la palabra con el mismo significado.', category: GameCategory.LANGUAGE, icon: '🔗', color: 'bg-emerald-700' },
  { id: 'spatial-logic', name: 'Rotación Espacial', description: 'Indica cómo se vería la figura tras girarla.', category: GameCategory.LOGIC, icon: '🔃', color: 'bg-violet-700' },
  { id: 'path-connect', name: 'Conexión de Nodos', description: 'Conecta los puntos sin cruzar las líneas.', category: GameCategory.LOGIC, icon: '📍', color: 'bg-amber-600' },
  { id: 'sound-memory', name: 'Memoria Sonora', description: 'Identifica y repite la secuencia de sonidos.', category: GameCategory.MEMORY, icon: '🎵', color: 'bg-rose-400' },
  { id: 'balance-scale', name: 'Balanza Mental', description: 'Determina qué lado de la balanza pesa más.', category: GameCategory.MATH, icon: '⚖️', color: 'bg-slate-600' },
  { id: 'hidden-object', name: 'Objeto Oculto', description: 'Encuentra el objeto específico en una escena saturada.', category: GameCategory.ATTENTION, icon: '🕵️', color: 'bg-amber-800' },
  { id: 'logic-puzzles', name: 'Puzzle de Enlaces', description: 'Resuelve acertijos de tuberías y conexiones.', category: GameCategory.LOGIC, icon: '💡', color: 'bg-yellow-400' },
  { id: 'card-memory', name: 'Cartas de Memoria', description: 'Recuerda el valor de las cartas boca abajo.', category: GameCategory.MEMORY, icon: '🃏', color: 'bg-red-700' },
  { id: 'letter-rain', name: 'Lluvia de Letras', description: 'Escribe las letras antes de que toquen el suelo.', category: GameCategory.LANGUAGE, icon: '🌧️', color: 'bg-blue-300' },
  { id: 'mirror-match', name: 'Espejo Lógico', description: 'Encuentra el reflejo correcto de la imagen.', category: GameCategory.LOGIC, icon: '🪞', color: 'bg-indigo-300' },
  { id: 'pair-sum', name: 'Pareja Suma', description: 'Encuentra los dos números que suman el objetivo.', category: GameCategory.MATH, icon: '➕', color: 'bg-teal-500' },
  { id: 'grid-path', name: 'Camino en Red', description: 'Recuerda el camino trazado en la cuadrícula.', category: GameCategory.MEMORY, icon: '🏁', color: 'bg-emerald-400' },
  { id: 'category-sort', name: 'Clasificador', description: 'Ordena los objetos en sus categorías correctas.', category: GameCategory.LOGIC, icon: '📂', color: 'bg-blue-800' },
  { id: 'rhyme-finder', name: 'Buscador de Rimas', description: 'Selecciona las palabras que riman con el ejemplo.', category: GameCategory.LANGUAGE, icon: '🎼', color: 'bg-purple-400' },
  { id: 'reflex-trainer', name: 'Entrenador de Reflejos', description: 'Toca la pantalla justo cuando cambie el color.', category: GameCategory.ATTENTION, icon: '🏎️', color: 'bg-red-600' },
  { id: 'mental-map', name: 'Mapa Mental', description: 'Ubica los puntos cardinales de los objetos memorizados.', category: GameCategory.MEMORY, icon: '🗺️', color: 'bg-stone-600' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first-steps', 
    name: 'Primeros Pasos', 
    description: 'Completa tu primer juego.', 
    icon: '👟', 
    bonusPoints: 50, 
    condition: (stats) => stats.gamesPlayed >= 1 
  }
];

export const DYNAMIC_ACHIEVEMENTS: DynamicAchievement[] = [
  {
    id: 'logic-master',
    name: 'Estratega Supremo',
    description: 'Acumula 2,000 puntos en la categoría de Lógica.',
    icon: '🧠',
    bonusPoints: 500,
    isDynamic: true,
    dynamicType: 'accumulation',
    targetValue: 2000,
    condition: (stats) => (stats.categoryScores[GameCategory.LOGIC] || 0) >= 2000,
    getCurrentProgress: (stats) => stats.categoryScores[GameCategory.LOGIC] || 0
  },
  {
    id: 'math-addict',
    name: 'Calculador Obsesivo',
    description: 'Juega 5 veces seguidas a Cálculo Mental.',
    icon: '🧮',
    bonusPoints: 1000,
    isDynamic: true,
    dynamicType: 'consecutive',
    targetValue: 5,
    gameId: 'math-blitz',
    condition: (stats) => {
      if (stats.history.length < 5) return false;
      const lastFive = stats.history.slice(0, 5);
      return lastFive.every(h => h.gameId === 'math-blitz');
    },
    getCurrentProgress: (stats) => {
      let count = 0;
      for (const h of stats.history) {
        if (h.gameId === 'math-blitz') count++;
        else break;
      }
      return count;
    }
  },
  {
    id: 'veteran-gamer',
    name: 'Veterano de Cerebrix',
    description: 'Completa un total de 25 sesiones de entrenamiento.',
    icon: '🎖️',
    bonusPoints: 2000,
    isDynamic: true,
    dynamicType: 'milestone',
    targetValue: 25,
    condition: (stats) => stats.gamesPlayed >= 25,
    getCurrentProgress: (stats) => stats.gamesPlayed
  }
];
