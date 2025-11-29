// lib/models/diversion_question.dart

class DiversionQuestion {
  final String id;
  final String enunciado;
  final List<String> opciones;
  final int indiceCorrecta;

  const DiversionQuestion({
    required this.id,
    required this.enunciado,
    required this.opciones,
    required this.indiceCorrecta,
  });
}

/// Lista de preguntas de diversión / juegos rápidos
const diversionQuestions = <DiversionQuestion>[
  DiversionQuestion(
    id: 'q1',
    enunciado: 'Si un gato tiene 4 patas, ¿cuántas patas ves si hay 3 gatos?',
    opciones: ['6', '8', '10', '12'],
    indiceCorrecta: 3, // 12
  ),
  DiversionQuestion(
    id: 'q2',
    enunciado: '¿Cuál de estos NO es un día de la semana?',
    opciones: ['Lunes', 'Martes', 'Domingo', 'Feriado'],
    indiceCorrecta: 3,
  ),
  DiversionQuestion(
    id: 'q3',
    enunciado: 'Si hoy es martes, ¿qué día será dentro de 2 días?',
    opciones: ['Lunes', 'Jueves', 'Domingo', 'Jueves'],
    indiceCorrecta: 1, // Jueves
  ),
  DiversionQuestion(
    id: 'q4',
    enunciado: '¿Qué número falta? 2, 4, 6, __, 10',
    opciones: ['7', '8', '9', '11'],
    indiceCorrecta: 1, // 8
  ),
  DiversionQuestion(
    id: 'q5',
    enunciado: 'Elige el emoji que no encaja: 😀 😃 😄 🚗',
    opciones: ['😀', '😃', '😄', '🚗'],
    indiceCorrecta: 3,
  ),
  DiversionQuestion(
    id: 'q6',
    enunciado: 'Si tienes 5 caramelos y comes 2, ¿cuántos te quedan?',
    opciones: ['1', '2', '3', '4'],
    indiceCorrecta: 2, // 3
  ),
  DiversionQuestion(
    id: 'q7',
    enunciado: 'Si son las tres y media y pasan 30 minutos, ¿qué hora es?',
    opciones: ['Cuatro en punto', 'Cuatro y media', 'Tres en punto', 'Cinco'],
    indiceCorrecta: 0,
  ),
  DiversionQuestion(
    id: 'q8',
    enunciado: '¿Cuál pesa más?',
    opciones: [
      '1 kilo de hierro',
      '1 kilo de plumas',
      'Pesan lo mismo',
      'Ninguno'
    ],
    indiceCorrecta: 2,
  ),
];
