
import { GameMetadata, GameCategory, Achievement, DynamicAchievement } from './types';

export const GAME_REGISTRY: GameMetadata[] = [
  { id: 'tetris', name: 'Tetris Pro', description: 'Ordena bloques que caen para limpiar líneas y superar niveles.', category: GameCategory.LOGIC, icon: '🧱', color: 'bg-blue-700' },
  { id: 'memory-sequence', name: 'Secuencia Maestra', description: 'Memoriza y repite secuencias de luces y sonidos.', category: GameCategory.MEMORY, icon: '💡', color: 'bg-purple-700' },
  { id: 'math-blitz', name: 'Cálculo Mental', description: 'Operaciones rápidas contra el reloj.', category: GameCategory.MATH, icon: '🧮', color: 'bg-emerald-500' },
  { id: 'ritmo-melodico', name: 'Ritmo Melódico', description: 'Completa melodías en un entorno dinámico.', category: GameCategory.MEMORY, icon: '🎷', color: 'bg-indigo-700' },
  { id: 'infinite-maze', name: 'Laberinto Infinito', description: 'Navega por laberintos generados al azar.', category: GameCategory.LOGIC, icon: '🗺️', color: 'bg-yellow-500' },
  { id: 'visual-memory', name: 'Memoria Visual', description: 'Recordando la posición de las imágenes.', category: GameCategory.MEMORY, icon: '🖼️', color: 'bg-blue-400' },
  { id: 'odd-one-out', name: 'El Intruso', description: 'Encuentra el símbolo diferente.', category: GameCategory.LOGIC, icon: '🎯', color: 'bg-orange-500' },
  { id: 'crucigrama', name: 'Crucigrama Maestro', description: 'Completa palabras cruzadas clásicas.', category: GameCategory.LANGUAGE, icon: '🔡', color: 'bg-indigo-500' },
  { id: 'story-master', name: 'Cuentacuentos', description: 'Comprensión lectora avanzada.', category: GameCategory.LANGUAGE, icon: '📖', color: 'bg-indigo-600' },
  { id: 'art-critic', name: 'Visión Creativa', description: 'Describe y analiza escenas visuales.', category: GameCategory.LANGUAGE, icon: '🎨', color: 'bg-pink-500' },
  { id: 'ajedrez', name: 'Ajedrez Pro', description: 'Juega contra un motor de ajedrez local.', category: GameCategory.LOGIC, icon: '♟️', color: 'bg-purple-600' },
  { id: 'concentracion-total', name: 'Enfoque Total', description: 'Entrena tu atención sostenida.', category: GameCategory.ATTENTION, icon: '👁️', color: 'bg-violet-500' },
  { id: 'brain-riddle', name: 'Enigma Diario', description: 'Acertijos lógicos ingeniosos.', category: GameCategory.LOGIC, icon: '❓', color: 'bg-stone-500' },
  { id: 'sudoku-mini', name: 'Sudoku Mini', description: 'Completa la cuadrícula sin repetir números.', category: GameCategory.LOGIC, icon: '🔢', color: 'bg-blue-900' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', name: 'Primeros Pasos', description: 'Completa tu primer juego.', icon: '👟', bonusPoints: 50, condition: (stats) => stats.gamesPlayed >= 1 },
  { id: 'master-unlocked', name: 'Maestro Ascendido', description: 'Juega una partida en dificultad Maestro.', icon: '👑', bonusPoints: 500, condition: (stats) => stats.gamesPlayed >= 5 }
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
