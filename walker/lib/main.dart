import 'package:flutter/material.dart';
import 'package:walker/ui/route_viewer_page.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    print('\n\n🍏 🍎 🍏 🍎  RouteBuilder starting: ✈️ ✈️ ✈️  ✈️ ✈️ ✈️ ${DateTime.now().toIso8601String()}\n\n');
    return MaterialApp(
      title: 'RouteBuilder',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        appBarTheme: AppBarTheme(color: Colors.indigo[300]),
        fontFamily: 'Raleway',
      ),
      home: RouteViewerPage(),
    );
  }
}
