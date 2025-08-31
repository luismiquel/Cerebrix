import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cerebrix ⚡ Retos mentales')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _ChallengeCard('🤔 Reto de lógica', '/logica'),
          _ChallengeCard('🧠 Reto de memoria', '/memoria'),
          _ChallengeCard('🧐 Reto de atención', '/atencion'),
          _ChallengeCard('⚡ Reto de velocidad', '/velocidad'),
          _ChallengeCard('🎯 Reto de coordinación', '/coordinacion'),
          _ChallengeCard('👀 Reto de observación', '/observacion'),
          _ChallengeCard('➗ Reto de matemáticas', '/matematicas'),
          _ChallengeCard('📖 Reto de lenguaje', '/lenguaje'),
          _ChallengeCard('🎨 Reto de creatividad', '/creatividad'),
          _ChallengeCard('👤 Perfil', '/perfil'),
        ],
      ),
    );
  }
}

class _ChallengeCard extends StatelessWidget {
  final String title;
  final String route;
  const _ChallengeCard(this.title, this.route, {super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward),
        onTap: () => Navigator.pushNamed(context, route),
      ),
    );
  }
}
