import 'package:aftarobotlibrary4/maps/distance_estimator_page.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    print(
        '\n🍏 🍎 🍏 🍎  MyApp: RouteBuilder starting: ✈️ ✈️ ✈️  ✈️ ✈️ ✈️ ${DateTime.now().toIso8601String()}\n');
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        appBarTheme: AppBarTheme(color: Colors.indigo[300]),
        fontFamily: 'Raleway',
      ),
      home: EstimationPage(),
    );
  }
}
