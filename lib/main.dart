import 'package:flutter/material.dart';
import 'dart:math';

void main() => runApp(CerebrixApp());

class CerebrixApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cerebrix',
      theme: ThemeData(primarySwatch: Colors.deepPurple),
      home: WelcomeScreen(),
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.deepPurple[50],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('🧠 Cerebrix', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            SizedBox(height: 20),
            Text('Desafía tu mente cada día con retos únicos y divertidos. ¡Todo 100% gratis!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18)),
            SizedBox(height: 40),
            ElevatedButton(
              onPressed: () {},
              child: Text('Comenzar'),
            ),
          ],
        ),
      ),
    );
  }
}
