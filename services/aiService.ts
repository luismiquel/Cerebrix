
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
  },
  {
    story: "Un robot llamado Bip fue enviado a Marte para plantar girasoles. Tras un año, el planeta rojo se volvió amarillo por las flores.",
    question: "¿De qué color se volvió Marte?",
    options: ["Rojo", "Verde", "Amarillo"],
    correctAnswer: "Amarillo"
  },
  {
    story: "Lucía encontró un libro cuyas páginas estaban en blanco, pero al leerlo en voz alta, las palabras aparecían como magia.",
    question: "¿Cómo aparecían las palabras?",
    options: ["Con tinta invisible", "Al leer en voz alta", "Con el calor"],
    correctAnswer: "Al leer en voz alta"
  },
  {
    story: "El panadero del reino hacía pan con harina de estrellas. Quien lo probaba, soñaba que podía volar durante toda la noche.",
    question: "¿Con qué harina se hacía el pan?",
    options: ["Trigo", "Maíz", "Estrellas"],
    correctAnswer: "Estrellas"
  },
  {
    story: "Un inventor creó un paraguas que, en lugar de proteger de la lluvia, creaba una pequeña nube personal que llovía chocolate.",
    question: "¿De qué llovía el paraguas?",
    options: ["Agua", "Caramelo", "Chocolate"],
    correctAnswer: "Chocolate"
  },
  {
    story: "En la biblioteca prohibida, los libros vuelan para evitar ser leídos por personas que no tienen corazón puro.",
    question: "¿Por qué volaban los libros?",
    options: ["Para jugar", "Para no ser leídos", "Para buscar luz"],
    correctAnswer: "Para no ser leídos"
  },
  {
    story: "El explorador Marco llegó a una cueva donde el eco respondía antes de que él hablara, como si conociera sus pensamientos.",
    question: "¿Cuándo respondía el eco?",
    options: ["Después de hablar", "Antes de hablar", "Nunca"],
    correctAnswer: "Antes de hablar"
  },
  {
    story: "Sofía plantó una semilla de plata en su jardín. Al mes, creció un árbol cuyas hojas eran monedas de diez céntimos.",
    question: "¿De qué metal era la semilla?",
    options: ["Oro", "Bronce", "Plata"],
    correctAnswer: "Plata"
  },
  {
    story: "Un dragón pequeño llamado Flama prefería comer cubitos de hielo en lugar de escupir fuego, por eso vivía en una nevera.",
    question: "¿Dónde vivía el dragón?",
    options: ["En un volcán", "En una nevera", "En un bosque"],
    correctAnswer: "En una nevera"
  }
];

const LOCAL_RIDDLES = [
  { riddle: "Soy alto cuando soy joven y bajo cuando soy viejo. ¿Qué soy?", answer: "Vela" },
  { riddle: "¿Qué tiene ciudades, pero no casas; montañas, pero no árboles; y agua, pero no peces?", answer: "Mapa" },
  { riddle: "Tengo agujeros arriba y abajo, pero aún así retengo el agua. ¿Qué soy?", answer: "Esponja" },
  { riddle: "¿Qué sube pero nunca baja?", answer: "Edad" },
  { riddle: "Te pertenezco, pero otros me usan más que tú. ¿Qué soy?", answer: "Nombre" },
  { riddle: "Si me nombras, me rompes. ¿Qué soy?", answer: "Silencio" },
  { riddle: "¿Qué tiene cuello pero no cabeza?", answer: "Camisa" },
  { riddle: "Corre pero no camina, murmura pero no habla. ¿Qué es?", answer: "Rio" },
  { riddle: "Blanco por fuera, amarillo por dentro. Si quieres que te lo diga, espera.", answer: "Huevo" },
  { riddle: "Cinco hermanos muy unidos que no se pueden separar.", answer: "Dedos" },
  { riddle: "Tengo llaves pero no cerraduras. Tengo espacio pero no cuarto. Puedes entrar, pero no salir. ¿Qué soy?", answer: "Teclado" },
  { riddle: "Cuanto más hay, menos ves. ¿Qué soy?", answer: "Oscuridad" },
  { riddle: "Vuelo sin alas, lloro sin ojos. ¿Qué soy?", answer: "Nube" },
  { riddle: "Siempre estoy en el futuro, pero nunca llego. ¿Qué soy?", answer: "Mañana" }
];

export const generateRiddle = async () => {
  await delay(300);
  return LOCAL_RIDDLES[Math.floor(Math.random() * LOCAL_RIDDLES.length)];
};

export const generateStoryChallenge = async () => {
  await delay(400);
  return LOCAL_STORIES[Math.floor(Math.random() * LOCAL_STORIES.length)];
};

export const evaluateArtPrompt = async (prompt: string) => {
  await delay(500);
  const score = Math.min(100, prompt.length * 2 + Math.floor(Math.random() * 30));
  return { score, feedback: score > 70 ? "¡Gran descripción visual!" : "Añade más detalles la próxima vez." };
};

export const getBestChessMove = async (fen: string, possibleMoves: string[]) => {
  await delay(200);
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};

export const generateCrossword = async () => {
  await delay(500);
  return {
    grid: ["GATO#", "O#R#S", "LUNA#", "#A#L#", "MESA#"],
    clues: [
      { id: "1", direction: "Horizontal", text: "Felino doméstico" },
      { id: "3", direction: "Horizontal", text: "Satélite terrestre" },
      { id: "5", direction: "Horizontal", text: "Mueble para comer" },
      { id: "1", direction: "Vertical", text: "Goles (inv)" }
    ]
  };
};
