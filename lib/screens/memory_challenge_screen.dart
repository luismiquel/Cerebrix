import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../score_manager.dart';

class MemoryChallengeScreen extends StatelessWidget {
  const MemoryChallengeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reto de Memoria 🧠')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Recuerda este número: 3947',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Provider.of<ScoreManager>(context, listen: false).addPoints(10);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('¡Bien hecho! +10 puntos 🎉')),
                );
              },
              child: const Text('He recordado el número'),
            ),
          ],
        ),
      ),
    );
  }
}
