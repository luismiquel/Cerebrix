
export const LOCAL_STORIES = [
  { story: "Ana encontró una llave bajo el cerezo. Al girarla, el desván se iluminó de azul.", question: "¿De qué color se iluminó?", options: ["Rojo", "Azul", "Verde"], correctAnswer: "Azul" },
  { story: "El capitán del barco descubrió una isla de cristal donde las nubes eran de algodón.", question: "¿De qué eran las nubes?", options: ["Agua", "Algodón", "Hielo"], correctAnswer: "Algodón" },
  { story: "Marta compró un reloj que marcaba los latidos del corazón en lugar de las horas.", question: "¿Qué marcaba el reloj?", options: ["Horas", "Latidos", "Pasos"], correctAnswer: "Latidos" },
  { story: "Un robot llamado Bip plantó girasoles en Marte hasta que el planeta fue amarillo.", question: "¿Qué planta usó Bip?", options: ["Rosas", "Girasoles", "Tulipanes"], correctAnswer: "Girasoles" }
];

export const LOCAL_RIDDLES = [
  { riddle: "Soy alto joven, bajo viejo y brillo al quemarme. ¿Qué soy?", answer: "Vela" },
  { riddle: "Tengo ciudades pero no casas, y agua pero no peces. ¿Qué soy?", answer: "Mapa" },
  { riddle: "Si me nombras, me rompes. ¿Qué soy?", answer: "Silencio" },
  { riddle: "Tengo cuello pero no cabeza. ¿Qué soy?", answer: "Camisa" },
  { riddle: "Vuelo sin alas y lloro sin ojos. ¿Qué soy?", answer: "Nube" }
];

export const CATEGORY_ITEMS = {
  "Animales": ["Gato", "Perro", "Elefante", "León", "Cebra"],
  "Frutas": ["Manzana", "Pera", "Plátano", "Uva", "Fresa"],
  "Colores": ["Rojo", "Azul", "Verde", "Amarillo", "Rosa"],
  "Países": ["España", "México", "Francia", "Italia", "Japón"]
};

export const SYNONYMS_DATA = [
  { word: "Rápido", options: ["Veloz", "Lento", "Fuerte"], answer: "Veloz" },
  { word: "Feliz", options: ["Triste", "Contento", "Enojado"], answer: "Contento" },
  { word: "Grande", options: ["Enorme", "Chico", "Flaco"], answer: "Enorme" }
];

export const getLocalRiddle = () => LOCAL_RIDDLES[Math.floor(Math.random() * LOCAL_RIDDLES.length)];
export const getLocalStory = () => LOCAL_STORIES[Math.floor(Math.random() * LOCAL_STORIES.length)];
