import 'package:flutter/material.dart';
import '../widgets/challenge_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cerebrix - Retos Mentales')),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: const [
          ChallengeCard(
            title: 'Reto de lógica',
            description: 'Pon a prueba tu razonamiento con acertijos.',
            routeName: '/logica',
          ),
          ChallengeCard(
            title: 'Reto de memoria',
            description: 'Ejercita tu memoria con juegos visuales.',
            routeName: '/memoria',
          ),
        ],
      ),
    );
  }
}
