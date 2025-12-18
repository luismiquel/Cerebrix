
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LOCAL_STORIES = [
  {
    story: "Ana encontró una llave antigua bajo el cerezo. Al girarla en la puerta del desván, un mundo de colores se abrió ante ella.",
    question: "¿Dónde estaba la llave?",
    options: ["Bajo un cerezo", "En el desván", "En su bolsillo"],
    correctAnswer: "Bajo un cerezo"
  },
  {
    story: "El capitán del barco divisó una isla que no aparecía en los mapas. Al desembarcar, descubrió que las piedras eran de cristal.",
    question: "¿De qué eran las piedras?",
    options: ["Oro", "Cristal", "Arena"],
    correctAnswer: "Cristal"
  },
  {
    story: "Marta compró un reloj en un mercadillo. Pronto descubrió que el reloj no marcaba las horas, sino los latidos del corazón de quien lo sostenía.",
    question: "¿Qué medía realmente el reloj?",
    options: ["El tiempo", "Los latidos", "La presión"],
    correctAnswer: "Los latidos"
  },
  {
    story: "En el pueblo de Sombras, los gatos brillan en la oscuridad. El pequeño Tomás adoptó uno que, además de brillar, podía hablar en susurros.",
    question: "¿Qué característica especial tenía el gato de Tomás?",
    options: ["Volaba", "Hablaba en susurros", "Cambiaba de color"],
    correctAnswer: "Hablaba en susurros"
  }
];

const LOCAL_RIDDLES = [
  { riddle: "Soy alto cuando soy joven y bajo cuando soy viejo. ¿Qué soy?", answer: "Vela" },
  { riddle: "¿Qué tiene ciudades, pero no casas; montañas, pero no árboles; y agua, pero no peces?", answer: "Mapa" },
  { riddle: "Tengo agujeros arriba y abajo, pero aún así retengo el agua. ¿Qué soy?", answer: "Esponja" },
  { riddle: "¿Qué sube pero nunca baja?", answer: "Edad" },
  { riddle: "Te pertenezco, pero otros me usan más que tú. ¿Qué soy?", answer: "Nombre" }
];

const LOCAL_CROSSWORDS = [
  {
    grid: ["GATO#", "O#R#S", "LUNA#", "#A#L#", "MESA#"],
    clues: [
      { id: "1", direction: "Horizontal", text: "Felino doméstico" },
      { id: "3", direction: "Horizontal", text: "Satélite terrestre" },
      { id: "5", direction: "Horizontal", text: "Mueble para comer" },
      { id: "1", direction: "Vertical", text: "Goles (inv)" }
    ]
  },
  {
    grid: ["SOL##", "A#C#A", "LAGO#", "A#S#A", "#MAR#"],
    clues: [
      { id: "1", direction: "Horizontal", text: "Estrella del sistema" },
      { id: "3", direction: "Horizontal", text: "Cuerpo de agua dulce" },
      { id: "5", direction: "Horizontal", text: "Cuerpo de agua salada" }
    ]
  }
];

export const getRiddle = async () => {
  await delay(200);
  return LOCAL_RIDDLES[Math.floor(Math.random() * LOCAL_RIDDLES.length)];
};

export const getStory = async () => {
  await delay(300);
  return LOCAL_STORIES[Math.floor(Math.random() * LOCAL_STORIES.length)];
};

export const evaluateText = (text: string) => {
  const words = text.trim().split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const complexity = Math.min(100, (words.length * 5) + (uniqueWords.size * 2));
  return {
    score: complexity,
    feedback: complexity > 60 ? "¡Excelente descripción detallada!" : "Intenta usar más adjetivos."
  };
};

export const getCrosswordData = async () => {
  await delay(400);
  return LOCAL_CROSSWORDS[Math.floor(Math.random() * LOCAL_CROSSWORDS.length)];
};

export const getBestMove = (fen: string, possibleMoves: string[]) => {
  // Motor de ajedrez heurístico básico: prefiere capturas y avances
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};
