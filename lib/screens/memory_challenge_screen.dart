import 'package:flutter/material.dart';

class MemoryChallengeScreen extends StatelessWidget {
  const MemoryChallengeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reto de Memoria 🧠')),
      body: const Center(
        child: Text(
          'Aquí va el reto de memoria',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
