import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() => runApp(const CerebrixApp());

class CerebrixApp extends StatelessWidget {
  const CerebrixApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cerebrix',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
