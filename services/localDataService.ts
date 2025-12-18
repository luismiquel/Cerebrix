
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const LOCAL_STORIES = [
  {
    id: 1,
    story: "Ana encontró una llave antigua bajo el cerezo. Al girarla en la puerta del desván, un mundo de colores se abrió ante ella.",
    question: "¿Dónde estaba la llave?",
    options: ["Bajo un cerezo", "En el desván", "En su bolsillo"],
    correctAnswer: "Bajo un cerezo"
  },
  {
    id: 2,
    story: "El capitán del barco divisó una isla que no aparecía en los mapas. Al desembarcar, descubrió que las piedras eran de cristal.",
    question: "¿De qué eran las piedras?",
    options: ["Oro", "Cristal", "Arena"],
    correctAnswer: "Cristal"
  },
  {
    id: 3,
    story: "Marta compró un reloj en un mercadillo. El reloj no marcaba las horas, sino los latidos del corazón de quien lo sostenía.",
    question: "¿Qué medía realmente el reloj?",
    options: ["El tiempo", "Los latidos", "La presión"],
    correctAnswer: "Los latidos"
  }
];

export const LOCAL_RIDDLES = [
  { riddle: "Soy alto cuando soy joven y bajo cuando soy viejo. ¿Qué soy?", answer: "Vela" },
  { riddle: "¿Qué tiene ciudades, pero no casas; montañas, pero no árboles?", answer: "Mapa" },
  { riddle: "Tengo agujeros arriba y abajo, pero aún así retengo el agua. ¿Qué soy?", answer: "Esponja" },
  { riddle: "Si me nombras, me rompes. ¿Qué soy?", answer: "Silencio" },
  { riddle: "¿Qué tiene cuello pero no cabeza?", answer: "Camisa" }
];

export const getLocalRiddle = () => {
  return LOCAL_RIDDLES[Math.floor(Math.random() * LOCAL_RIDDLES.length)];
};

export const getLocalStory = () => {
  return LOCAL_STORIES[Math.floor(Math.random() * LOCAL_STORIES.length)];
};

export const evaluateLocalArtText = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  const score = Math.min(100, words * 10);
  return {
    score,
    feedback: score > 70 ? "¡Excelente descripción detallada!" : "Intenta ser más específico en tu descripción."
  };
};

export const LOCAL_CROSSWORDS = [
  {
    grid: ["GATO#", "O#R#S", "LUNA#", "#A#L#", "MESA#"],
    clues: [
      { id: "1", direction: "Horizontal", text: "Felino doméstico" },
      { id: "3", direction: "Horizontal", text: "Satélite terrestre" },
      { id: "5", direction: "Horizontal", text: "Mueble para comer" },
      { id: "1", direction: "Vertical", text: "Goles (inv)" }
    ]
  }
];

export const getLocalCrossword = () => {
  return LOCAL_CROSSWORDS[0];
};
