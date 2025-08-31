import 'package:flutter/material.dart';

class LogicChallengeScreen extends StatelessWidget {
  const LogicChallengeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reto de Lógica')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '¿Qué número sigue en la secuencia?\n\n2, 4, 8, 16, ?',
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => _mostrarResultado(context, false),
              child: const Text('30'),
            ),
            ElevatedButton(
              onPressed: () => _mostrarResultado(context, false),
              child: const Text('20'),
            ),
            ElevatedButton(
              onPressed: () => _mostrarResultado(context, true),
              child: const Text('32'),
            ),
            ElevatedButton(
              onPressed: () => _mostrarResultado(context, false),
              child: const Text('24'),
            ),
          ],
        ),
      ),
    );
  }

  void _mostrarResultado(BuildContext context, bool correcto) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(correcto ? '¡Correcto!' : 'Incorrecto'),
        content: Text(correcto
            ? '¡Muy bien! 2, 4, 8, 16, 32 es una secuencia que se duplica.'
            : 'Inténtalo de nuevo.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    );
  }
}
