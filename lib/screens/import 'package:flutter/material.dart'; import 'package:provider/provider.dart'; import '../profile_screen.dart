import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../score_manager.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final score = Provider.of<ScoreManager>(context).score;

    return Scaffold(
      appBar: AppBar(title: const Text('Perfil 👤')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Puntuación total: $score',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Provider.of<ScoreManager>(context, listen: false).reset();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Puntuación reiniciada ✅')),
                );
              },
              child: const Text('Reiniciar puntuación'),
            ),
          ],
        ),
      ),
    );
  }
}
