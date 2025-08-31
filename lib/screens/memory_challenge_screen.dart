import 'package:flutter/material.dart';
import 'dart:math';

class MemoryChallengeScreen extends StatefulWidget {
  const MemoryChallengeScreen({super.key});

  @override
  State<MemoryChallengeScreen> createState() => _MemoryChallengeScreenState();
}

class _MemoryChallengeScreenState extends State<MemoryChallengeScreen> {
  final List<Color> _colors = [Colors.red, Colors.green, Colors.blue, Colors.yellow];
  late List<Color> _sequence;
  late List<Color> _userSelection;
  bool _showSequence = true;

  @override
  void initState() {
    super.initState();
    _generateSequence();
  }

  void _generateSequence() {
    final random = Random();
    _sequence = List.generate(4, (_) => _colors[random.nextInt(_colors.length)]);
    _userSelection = [];
    _showSequence = true;

    Future.delayed(const Duration(seconds: 2), () {
      setState(() => _showSequence = false);
    });
  }

  void _selectColor(Color color) {
    if (_showSequence) return;
    setState(() {
      _userSelection.add(color);
      if (_userSelection.length == _sequence.length) {
        final isCorrect = _userSelection.join() == _sequence.join();
        _showResult(isCorrect);
      }
    });
  }

  void _showResult(bool correct) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(correct ? '¡Correcto!' : 'Incorrecto'),
        content: Text(correct
            ? '¡Buena memoria! Has repetido la secuencia correctamente.'
            : 'La secuencia no es correcta. Intenta de nuevo.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _generateSequence();
              setState(() {});
            },
            child: const Text('Reintentar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reto de Memoria')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text(
              _showSequence ? 'Memoriza la secuencia:' : 'Repite la secuencia:',
              style: const TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 20),
            Wrap(
              spacing: 10,
              children: (_showSequence ? _sequence : _colors)
                  .map(
                    (color) => GestureDetector(
                      onTap: () => _selectColor(color),
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: color,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}
