import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:route_walker/ui/route_viewer_page.dart';

void main() async {
  await DotEnv().load('.env');
  print('🌸 DotEnv has been created. Check content of variables');
  var status = DotEnv().env['status'];
  var devURL = DotEnv().env['devURL'];
  var prodURL = DotEnv().env['prodURL'];
  print(
      '🌸 properties from .env : 🌸  status: $status 🌸  devURL: $devURL 🍏 prodURL: $prodURL 🍏 ');
  runApp(MyApp());
}

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
      home: RouteViewerPage(),
//      home: EstimationPage(),
    );
  }
}
