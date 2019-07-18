import 'dart:async';
import 'dart:convert';

import 'package:aftarobotlibrary4/api/list_api.dart';
import 'package:aftarobotlibrary4/api/location_bloc.dart';
import 'package:aftarobotlibrary4/data/associationdto.dart';
import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/countrydto.dart';
import 'package:aftarobotlibrary4/data/landmarkdto.dart';
import 'package:aftarobotlibrary4/data/routedto.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:geoflutterfire/geoflutterfire.dart';

import 'houston.dart';

class LandmarkFix {
  static Firestore fs = Firestore.instance;
  static Geoflutterfire _geo = Geoflutterfire();
  static var countryID = "LtHNgQD0gj2kj2RFLIhc";
  static var countryName = 'South Africa';

  static Future getLandmarks() async {
    print(
        '\n\nLandmarkFix: ................ getLandmarkss getLandmarkss 🧩 🧩 🧩 🧩 🧩 🧩');

//    var list = await ListAPI.getRouteLandmarks('-KVnZVSIg8UMl_gFtswm');
//
//    print(
//        '\n\n🍎 🍎 🍎 🍎 LandmarkFix: We received ${list.length} landmarks for route:  🥦  -KVMNOSs4YMwl3WUpYjH');
//    list.forEach((doc) {
//      prettyPrint(doc.toJson(),
//          '\n🍎 🧡 🧡  🥦 🥦 🥦 🥦   🧩 ${doc.landmarkName} 🧩   🥦 🥦 🥦 🥦  🧡 ');
//    });
  }

  static Future getRoutes() async {
    print(
        '\n\n.🧡 🧡 LandmarkFix: ............... getRoutes getRoutes 🧩 🧩 🧩 🧩 🧩 🧩');
    var list = await ListAPI.getRoutesByAssociation('-KTzcm79kpPSSJlNQuFQ');
    print(
        '\n\n🍎 🍎 🍎 🍎 LandmarkFix: We received  🧡  ${list.length}   🧡  routes for association:  🍎  -KTzcm79kpPSSJlNQuFQ');
    list.forEach((doc) {
      prettyPrint(doc.toJson(),
          '\n🍎 🧩 🧩 🧩 🧩 🧩 🧩  🍎  ${doc.name}  🍎  🧩 🧩 🧩 🧩 🧩 🧩');
    });
  }

  static Future fixRoutes(BuildContext context) async {
//    await fixCountries();
    print('\n\n................ fixRoutes fixRoutes 🧩 🧩 🧩 🧩 🧩 🧩');
    var qs3 = await fs.collection('associations').getDocuments();

    List<AssociationDTO> assocs = List();
    qs3.documents.forEach((doc) {
      var a = AssociationDTO.fromJson(doc.data);
      assocs.add(a);
      prettyPrint(a.toJson(), '🧩🧩🧩🧩🧩🧩  Association  🧩🧩🧩🧩🧩🧩');
    });
    List<Map> list = await Houston.getOldRoutes(context);
    var cnt = 0;
    for (var r in list) {
      var newRoute = RouteDTO();
      for (var a in assocs) {
        if (r['associationName'] == a.associationName) {
          if (r['routeID'] != null) {
            newRoute.associationIDs = List();
            newRoute.associationDetails = List();
            newRoute.associationIDs.add(a.associationID);
            newRoute.associationDetails.add(a.associationName);
            newRoute.countryID = countryID;
            newRoute.countryName = countryName;
            newRoute.routeNumber = 'TBD';
            newRoute.color = RouteMap.colorAzure;
            newRoute.routeID = r['routeID'];
            newRoute.name = r['name'];
            newRoute.isActive = true;
            newRoute.created = DateTime.now().toUtc().toIso8601String();
            newRoute.activationDate = DateTime.now().toUtc().toIso8601String();
            prettyPrint(newRoute.toJson(),
                '♻️ ♻️ ♻️ ♻️ ♻️ ♻  New Route ♻️ ♻️ ♻️ ♻️ ♻️ ♻');
            await fs
                .collection(Constants.ROUTES)
                .document(newRoute.routeID)
                .setData(newRoute.toJson());
            cnt++;
            debugPrint(
                '\n♻️ ♻️ route #$cnt  added,  🧩 ${newRoute.name} 🧩 associations: ${newRoute.associationIDs.length}');
          } else {
            debugPrint(
                '🍏🍏🍏🍏🍏🍏🍏🍏 Houston we got a null routeID 🧡  ${r['name']} 🧡 ${r['associationName']}');
          }
        }
      }
    }
    debugPrint('\n♻️ ♻️ ♻️ ♻️ Routes added to newRoutes: 🧡 $cnt 🧡 ');
  }

  static Future fixLandmarks(BuildContext context) async {
    debugPrint('\n\n♻️ ♻️ ♻️ ♻️ ♻️ ♻️ Starting route & landmark fix ....\n');

    var start = DateTime.now().millisecondsSinceEpoch;
    var qsRoutes = await fs.collection(Constants.ROUTES).getDocuments();
    List<RouteDTO> routes = List();

    for (var doc in qsRoutes.documents) {
      routes.add(RouteDTO.fromJson(doc.data));
    }

    List<Map> marks = await Houston.getOldLandmarks(context);
    debugPrint('\n\n❤️ ❤️ ❤️  old landmarks: ${marks.length}   ❤️ ❤️ ');

    var cnt = 0;

    for (var m in marks) {
      if (m['isVirtualLandmark'] == true) {
        print('♻️ ♻️ ♻️ ♻️ ♻️  ignoring virtual landmark ....');
      } else {
        for (var route in routes) {
          if (route.name == m['routeName']) {
            var mark = LandmarkDTO();
            mark.landmarkID = m['landmarkID'];
            mark.latitude = m['latitude'];
            mark.longitude = m['longitude'];
            mark.landmarkName = m['landmarkName'];
            mark.distance = "0";
            GeoFirePoint point =
                _geo.point(latitude: mark.latitude, longitude: mark.longitude);
            if (point == null) {
              throw new Exception('Ffffuck!');
            }
            mark.position = point.data;
            mark.geo = {
              'type': 'Point',
              'coordinates': [mark.longitude, mark.latitude],
            };
            mark.routeIDs = List();
            mark.routeDetails = List();
            mark.routeIDs.add(route.routeID);
            mark.routeDetails.add(RouteInfo(
              routeID: route.routeID,
              name: route.name,
            ));

            await fs
                .collection('newLandmarks')
                .document(mark.landmarkID)
                .setData(mark.toJson());
            cnt++;
            debugPrint(
                '🔵 🔵 #$cnt  🧩  ${mark.landmarkName} has been added,  ❤️  routes: ${mark.routeIDs.length}');
          }
        }
      }
    }

    var end = DateTime.now().millisecondsSinceEpoch;
    var elapsed = (end - start) / 1000;
    debugPrint(
        '❤️ 🧡 💛   Total new Landmarks added:  🧩🧩🧩  $cnt   🧩🧩🧩 $elapsed seconds');
    return null;
  }

  static Future fixCountries() async {
    var qs = await fs.collection('countries').getDocuments();
    for (var doc in qs.documents) {
      var c = CountryDTO.fromJson(doc.data);
      var c2 = CountryDTO();
      c2.countryID = c.countryID;
      c2.name = c.name;
      c2.countryCode = 'ZA';
      c2.countryID = doc.reference.documentID;
      await doc.reference.setData(c2.toJson());
      print('country 🧡  ${c2.name}  🧡  updated  🧩🧩🧩');
    }
    return null;
  }

  static Future loadCities(BuildContext context) async {
    var start = DateTime.now().millisecondsSinceEpoch;
    var s = await Houston.loadCities(context);
    Map jsonMap = json.decode(s);
    List<Map> list = List();
    jsonMap.forEach((k, v) {
      list.add(v);
    });
    debugPrint('\n\n❤️ ❤️ ❤️  old cities from file: ${list.length}   ❤️ ❤️\n');
    var cnt = 0;
    for (var m in list) {
      if (m['latitude'] != null && m['latitude'] != null) {
        var city = CityDTO();
        city.cityID = m['cityID'];
        city.countryID = countryID;
        city.countryName = countryName;
        city.provinceName = m['provinceName'];
        if (m['latitude'] is int) {
          city.latitude = m['latitude'] * 1.0;
        } else {
          city.latitude = m['latitude'];
        }
        if (m['longitude'] is int) {
          city.longitude = m['longitude'] * 1.0;
        } else {
          city.longitude = m['longitude'];
        }
        city.geo = {
          'type': 'Point',
          'coordinates': [city.longitude, city.latitude],
        };
        GeoFirePoint point =
            _geo.point(latitude: city.latitude, longitude: city.longitude);

        city.position = point.data;
        city.name = m['name'];

        await fs
            .collection('cities')
            .document(city.cityID)
            .setData(city.toJson());
        cnt++;
        debugPrint(
            '\n❤️ ❤️  city added: #$cnt 🧩🧩🧩 ${city.name}  👽👽  ${city.provinceName}  ❤️ ❤️ ');
      }
    }
    var end = DateTime.now().millisecondsSinceEpoch;
    var elapsed = (end - start) / 1000;
    debugPrint(
        '\n\n👽👽👽👽 ❤️ 👽👽👽👽  -  🧩 $cnt cities added to Firestore. 🔵 🔵   $elapsed seconds elapsed\n\n');
  }

  static Future findCities() async {
    LocationFinderBloc locationFinderBloc = LocationFinderBloc(null);

    var qs = await fs
        .collection('cities')
        .where('provinceName', isNull: true)
        .getDocuments();
    debugPrint('\n🧩🧩🧩 ${qs.documents.length} cities with no province');
    for (var doc in qs.documents) {
      await doc.reference.delete();
      debugPrint('🧩🧩🧩 city deleted: 🍎  ${doc['name']}  🍎 ');
    }
    var start = DateTime.now().millisecondsSinceEpoch;
    debugPrint('\n\n🔵 🔵 🔵 🔵 searching for cities .... 🔵 🔵 🔵 🔵 ');
    await locationFinderBloc
        .findCitiesByLocation(
            latitude: -26.021290019616625,
            longitude: 28.003131821751595,
            radiusInKM: 2)
        .then((result) {
      var end = DateTime.now().millisecondsSinceEpoch;
      var elapsed = (end - start) / 1000;
      if (result != null) {
        debugPrint(
            '\n🧡 💛 Received  ❤️  ${result.length}  🧩🧩🧩  cities from findCitiesByLocation(): elapsed: ${elapsed} seconds');
      }
    });
  }
}
