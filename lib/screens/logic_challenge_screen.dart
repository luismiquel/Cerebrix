import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../score_manager.dart';

class LogicChallengeScreen extends StatelessWidget {
  const LogicChallengeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reto de Lógica 🤔')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Si 2 gatos atrapan 2 ratones en 2 minutos,\n¿cuántos gatos hacen falta para atrapar 100 ratones en 100 minutos?',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Provider.of<ScoreManager>(context, listen: false).addPoints(10);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('¡Correcto! +10 puntos 🎉')),
                );
              },
              child: const Text('Responder'),
            ),
          ],
        ),
      ),
    );
  }
}
