import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';

class Houston {
  static Future<List<Map>> getOldLandmarks(BuildContext context) async {
    var marks =
        await DefaultAssetBundle.of(context).loadString('files/landmarks.json');
    Map marksMap = json.decode(marks);
    List<Map> list = List();
    marksMap.forEach((k, v) {
      list.add(v);
      //prettyPrint(v, '\n\n🍏 🍎 🍏 🍎 Landmark ::  ${v['landmarkName']}');
    });
    print('\n\n🧩 🧩 🧩 🧩 🧩 Found landmarks .... 🧩 ${list.length}');
    return list;
  }

  static Future<List<Map>> getOldRoutes(BuildContext context) async {
    var x =
        await DefaultAssetBundle.of(context).loadString('files/routes.json');
    Map routesMap = json.decode(x);
    List<Map> list = List();
    routesMap.forEach((k, v) {
      list.add(v);
      debugPrint('\n🍏 🍎  route:  🧡  ${v['name']}');
    });
    print('🧩 🧩 🧩 🧩 🧩 Found routes .... 🧩 ${list.length} 🧩🧩🧩🧩🧩🧩\n');

    return list;
  }

  static Future<String> loadCities(BuildContext context) async {
    return await DefaultAssetBundle.of(context).loadString('files/cities.json');
  }
}
