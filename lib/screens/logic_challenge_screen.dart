import 'package:flutter/material.dart';

class LogicChallengeScreen extends StatelessWidget {
  const LogicChallengeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reto de Lógica 🤔')),
      body: const Center(
        child: Text(
          'Aquí va el reto de lógica',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
