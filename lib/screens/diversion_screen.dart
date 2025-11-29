// lib/screens/diversion_screen.dart

import 'package:flutter/material.dart';
import '../models/diversion_question.dart';

class DiversionScreen extends StatefulWidget {
  const DiversionScreen({super.key});

  @override
  State<DiversionScreen> createState() => _DiversionScreenState();
}

class _DiversionScreenState extends State<DiversionScreen> {
  int _indicePregunta = 0;
  int _aciertos = 0;
  bool _haRespondido = false;
  int? _opcionSeleccionada;

  DiversionQuestion get _preguntaActual =>
      diversionQuestions[_indicePregunta];

  void _seleccionarOpcion(int indice) {
    if (_haRespondido) return;

    setState(() {
      _haRespondido = true;
      _opcionSeleccionada = indice;
      if (indice == _preguntaActual.indiceCorrecta) {
        _aciertos++;
      }
    });
  }

  void _siguientePregunta() {
    if (_indicePregunta < diversionQuestions.length - 1) {
      setState(() {
        _indicePregunta++;
        _haRespondido = false;
        _opcionSeleccionada = null;
      });
    } else {
      _mostrarResultadoFinal();
    }
  }

  void _reiniciar() {
    setState(() {
      _indicePregunta = 0;
      _aciertos = 0;
      _haRespondido = false;
      _opcionSeleccionada = null;
    });
  }

  void _mostrarResultadoFinal() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Resultado'),
          content: Text(
            'Has acertado $_aciertos de ${diversionQuestions.length} preguntas.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                _reiniciar();
              },
              child: const Text('Reintentar'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop(); // Volver atrás
              },
              child: const Text('Salir'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final pregunta = _preguntaActual;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Modo Diversión'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Indicador de progreso
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Pregunta ${_indicePregunta + 1} de ${diversionQuestions.length}',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
            const SizedBox(height: 16),

            // Enunciado
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  pregunta.enunciado,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Opciones
            Expanded(
              child: ListView.separated(
                itemCount: pregunta.opciones.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final textoOpcion = pregunta.opciones[index];

                  Color? colorFondo;
                  if (_haRespondido) {
                    if (index == pregunta.indiceCorrecta) {
                      colorFondo = Colors.green.withOpacity(0.2);
                    } else if (index == _opcionSeleccionada) {
                      colorFondo = Colors.red.withOpacity(0.2);
                    }
                  }

                  return InkWell(
                    onTap: () => _seleccionarOpcion(index),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.grey.shade400,
                        ),
                        color: colorFondo,
                      ),
                      child: Row(
                        children: [
                          Text(
                            String.fromCharCode(65 + index), // A, B, C, D...
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(textoOpcion),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // Botón siguiente
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _haRespondido ? _siguientePregunta : null,
                child: Text(
                  _indicePregunta < diversionQuestions.length - 1
                      ? 'Siguiente'
                      : 'Ver resultado',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
