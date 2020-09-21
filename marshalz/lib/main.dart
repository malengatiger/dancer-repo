import 'package:flutter/material.dart';
import 'package:marshalz/ui/dashboard.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
      home: Dashboard(),
    );
  }
}

/*
decoration: BoxDecoration(
                      boxShadow: customShadow,
                      color: secondaryColor,
                      shape: BoxShape.circle),
                ),
 */
