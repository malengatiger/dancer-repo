import 'package:aftarobotlibrary4/geo/geofencer.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;
import 'package:route_walker/ui/route_list_page.dart';

// Headless task
void backgroundGeolocationHeadlessTask(bg.HeadlessEvent event) async {
  p('[backgroundGeolocationHeadlessTask] 🎽 🎽 🎽 🎽 headless task fired with event 🎽 ${event.name} 🎽');
  HeadlessEventProcessor.processEvent(
      headlessEvent: event, caller: 'RouteBuilderApp');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());

  // Register to receive BackgroundGeolocation events after app is terminated.
  // Requires {stopOnTerminate: false, enableHeadless: true}
  bool isRegistered = await bg.BackgroundGeolocation.registerHeadlessTask(
      backgroundGeolocationHeadlessTask);
  p('main: 🥦 🥦 🥦 🥦 bg.BackgroundGeolocation.registerHeadlessTask:  🍎 isRegistered: $isRegistered  🍎  🥦 🥦 🥦 🥦');
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
      home: RouteListPage(),
//      home: EstimationPage(),
    );
  }
}
