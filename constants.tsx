
import { GameMetadata, GameCategory, Achievement, DynamicAchievement } from './types';

export const GAME_REGISTRY: GameMetadata[] = [
  { id: 'tetris', name: 'Tetris Pro', description: 'Ordena bloques que caen para limpiar líneas y superar niveles.', category: GameCategory.LOGIC, icon: '🧱', color: 'bg-blue-700' },
  { id: 'secuencia-maestra', name: 'Secuencia Maestra', description: 'Memoriza y repite secuencias de luces y sonidos rítmicos.', category: GameCategory.MEMORY, icon: '💡', color: 'bg-purple-700' },
  { id: 'memoria-patrones', name: 'Memoria de Patrones', description: 'Repite la secuencia de colores que parpadean.', category: GameCategory.MEMORY, icon: '💡', color: 'bg-purple-700' },
  { id: 'math-blitz', name: 'Cálculo Mental', description: 'Operaciones rápidas contra el reloj.', category: GameCategory.MATH, icon: '🧮', color: 'bg-emerald-500' },
  { id: 'trivia-master', name: 'Trivia Local', description: 'Conocimiento sobre cultura, ciencia y arte.', category: GameCategory.LANGUAGE, icon: '🧠', color: 'bg-amber-600' },
  { id: 'ritmo-melodico', name: 'Ritmo Melódico', description: 'Completa melodías en un entorno dinámico.', category: GameCategory.MEMORY, icon: '🎷', color: 'bg-indigo-700' },
  { id: 'detective-visual', name: 'Detective Visual', description: 'Encuentra las anomalías en imágenes.', category: GameCategory.ATTENTION, icon: '🕵️', color: 'bg-rose-700' },
  { id: 'poesia-zen', name: 'Poesía Zen', description: 'Domina el lenguaje creando poemas.', category: GameCategory.LANGUAGE, icon: '🌸', color: 'bg-teal-800' },
  { id: 'misterio-logico', name: 'Misterio Lógico', description: 'Resuelve crímenes mediante acertijos.', category: GameCategory.LOGIC, icon: '🔍', color: 'bg-slate-700' },
  { id: 'infinite-maze', name: 'Laberinto Infinito', description: 'Navega por laberintos generados al azar.', category: GameCategory.LOGIC, icon: '🗺️', color: 'bg-yellow-500' },
  { id: 'visual-memory', name: 'Memoria Visual', description: 'Recordando la posición de las imágenes.', category: GameCategory.MEMORY, icon: '🖼️', color: 'bg-blue-400' },
  { id: 'odd-one-out', name: 'El Intruso', description: 'Encuentra el símbolo diferente.', category: GameCategory.LOGIC, icon: '🎯', color: 'bg-orange-500' },
  { id: 'crucigrama', name: 'Crucigrama', description: 'Completa palabras cruzadas clásicas.', category: GameCategory.LANGUAGE, icon: '🔡', color: 'bg-indigo-500' },
  { id: 'puzzle-logico', name: 'Puzzle Lógico', description: 'Resuelve acertijos de ingenio.', category: GameCategory.LOGIC, icon: '🧩', color: 'bg-cyan-600' },
  { id: 'speed-training', name: 'Reacción', description: 'Pulsa rápido los objetivos.', category: GameCategory.ATTENTION, icon: '⚡', color: 'bg-red-500' },
  { id: 'story-master', name: 'Cuentacuentos', description: 'Comprensión lectora avanzada.', category: GameCategory.LANGUAGE, icon: '📖', color: 'bg-indigo-600' },
  { id: 'art-critic', name: 'Visión Creativa', description: 'Describe y analiza escenas visuales.', category: GameCategory.LANGUAGE, icon: '🎨', color: 'bg-pink-500' },
  { id: 'ajedrez', name: 'Ajedrez', description: 'Juega contra un motor de ajedrez local.', category: GameCategory.LOGIC, icon: '♟️', color: 'bg-purple-600' },
  { id: 'concentracion-total', name: 'Concentración', description: 'Entrena tu atención sostenida.', category: GameCategory.ATTENTION, icon: '👁️', color: 'bg-violet-500' },
  { id: 'rhythm-game', name: 'Juego de Ritmo', description: 'Sigue el compás con precisión.', category: GameCategory.ATTENTION, icon: '🎶', color: 'bg-pink-500' },
  { id: 'calculadora', name: 'Calculadora', description: 'Practica operaciones velozmente.', category: GameCategory.MATH, icon: '🧮', color: 'bg-green-500' },
  { id: 'memory-match', name: 'Parejas', description: 'Encuentra los símbolos ocultos.', category: GameCategory.MEMORY, icon: '🧠', color: 'bg-purple-500' },
  { id: 'stroop-test', name: 'Choque Color', description: 'Ignora el texto, di el color.', category: GameCategory.ATTENTION, icon: '🎨', color: 'bg-rose-500' },
  { id: 'sequence-recall', name: 'Eco Mental', description: 'Repite secuencias luminosas.', category: GameCategory.MEMORY, icon: '🔊', color: 'bg-indigo-500' },
  { id: 'logic-grid', name: 'Pulso Lógico', description: 'Identifica el patrón siguiente.', category: GameCategory.LOGIC, icon: '🔍', color: 'bg-cyan-500' },
  { id: 'reaction-time', name: 'Reflejos', description: 'Toca en cuanto veas la señal.', category: GameCategory.ATTENTION, icon: '⚡', color: 'bg-amber-500' },
  { id: 'word-scramble', name: 'Lexis', description: 'Ordena letras bajo presión.', category: GameCategory.LANGUAGE, icon: '📝', color: 'bg-blue-500' },
  { id: 'number-ninja', name: 'Orden Numérico', description: 'Toca números en orden.', category: GameCategory.ATTENTION, icon: '🔢', color: 'bg-pink-500' },
  { id: 'brain-riddle', name: 'Enigma', description: 'Acertijos lógicos ingeniosos.', category: GameCategory.LOGIC, icon: '❓', color: 'bg-stone-500' },
  { id: 'color-count', name: 'Foco Visual', description: 'Cuenta elementos específicos.', category: GameCategory.ATTENTION, icon: '👁️', color: 'bg-violet-500' },
  { id: 'math-pyramid', name: 'Pirámide', description: 'Completa la base lógica.', category: GameCategory.MATH, icon: '🔺', color: 'bg-teal-600' },
  { id: 'anagram-master', name: 'Anagramas', description: 'Crea nuevas palabras.', category: GameCategory.LANGUAGE, icon: '🔡', color: 'bg-sky-500' },
  { id: 'shape-rotation', name: 'Giro Espacial', description: 'Identifica figuras rotadas.', category: GameCategory.LOGIC, icon: '🔄', color: 'bg-lime-500' },
  { id: 'digit-span', name: 'Retención', description: 'Recuerda series numéricas.', category: GameCategory.MEMORY, icon: '📱', color: 'bg-fuchsia-500' },
  { id: 'path-finder', name: 'Ruta Óptima', description: 'Encuentra el camino corto.', category: GameCategory.LOGIC, icon: '🛤️', color: 'bg-emerald-700' },
  { id: 'fast-count', name: 'Conteo Rápido', description: 'Calcula cantidades sin dedos.', category: GameCategory.MATH, icon: '⏱️', color: 'bg-rose-600' },
  // Nuevos juegos para llegar a 40
  { id: 'sudoku-mini', name: 'Sudoku Mini', description: 'Completa la cuadrícula sin repetir números.', category: GameCategory.LOGIC, icon: '🔢', color: 'bg-blue-900' },
  { id: 'block-stack', name: 'Apilado', description: 'Encaja piezas para formar bloques perfectos.', category: GameCategory.LOGIC, icon: '🧱', color: 'bg-orange-600' },
  { id: 'symbol-logic', name: 'Símbolos', description: 'Descifra el código oculto tras los iconos.', category: GameCategory.LOGIC, icon: '💠', color: 'bg-indigo-900' },
  { id: 'hidden-words', name: 'Sopa de Letras', description: 'Busca palabras ocultas en la cuadrícula.', category: GameCategory.LANGUAGE, icon: '🔎', color: 'bg-emerald-900' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', name: 'Primeros Pasos', description: 'Completa tu primer juego.', icon: '👟', bonusPoints: 50, condition: (stats) => stats.gamesPlayed >= 1 },
  { id: 'master-unlocked', name: 'Maestro Ascendido', description: 'Juega una partida en dificultad Maestro.', icon: '👑', bonusPoints: 500, condition: (stats) => stats.gamesPlayed >= 5 },
  { id: 'senior-care', name: 'Mente Eterna', description: 'Completa un juego en Modo Senior.', icon: '👴', bonusPoints: 100, condition: (stats) => stats.gamesPlayed >= 1 }
];

export const DYNAMIC_ACHIEVEMENTS: DynamicAchievement[] = [
  {
    id: 'logic-master',
    name: 'Maestro de Lógica',
    description: 'Acumula 2,000 puntos en juegos de Lógica.',
    icon: '♟️',
    bonusPoints: 1500,
    isDynamic: true,
    dynamicType: 'accumulation',
    targetValue: 2000,
    condition: (stats) => (stats.categoryScores[GameCategory.LOGIC] || 0) >= 2000,
    getCurrentProgress: (stats) => stats.categoryScores[GameCategory.LOGIC] || 0
  }
];
