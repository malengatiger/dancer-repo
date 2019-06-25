//import 'dart:async';
//
//import 'package:aftarobotlibrary4/api/list_api.dart';
//import 'package:aftarobotlibrary4/api/location_bloc.dart';
//import 'package:aftarobotlibrary4/data/associationdto.dart';
//import 'package:aftarobotlibrary4/data/landmarkdto.dart';
//import 'package:aftarobotlibrary4/data/routedto.dart';
//import 'package:aftarobotlibrary4/data/userdto.dart';
//import 'package:aftarobotlibrary4/data/vehicle_location.dart';
//import 'package:aftarobotlibrary4/data/vehicledto.dart';
//import 'package:cloud_firestore/cloud_firestore.dart';
//import 'package:firebase_core/firebase_core.dart';
//import 'package:firebase_database/firebase_database.dart';
//
///*
//  The Migrator, all Powerful, all Seeing!
// */
//abstract class MigrationListener {
//  onRouteAdded(RouteDTO route);
//  onLandmarkAdded(LandmarkDTO landmark);
//  onComplete();
//}
//
//class RouteMigration implements LocationBlocListener {
//  final FirebaseOptions options = FirebaseOptions(
//      projectID: 'aftarobot-production',
//      databaseURL: "https://aftarobot-production.firebaseio.com",
//      storageBucket: "aftarobot-production.appspot.com",
//      apiKey: 'AIzaSyC5-hoDv-8lveX0VQwp2-nNitkvNThjJ9o',
//      googleAppID: 'aftarobot-production');
//
//  Firestore fs = Firestore.instance;
//  List<RouteDTO> oldRoutes = List();
//
//  Future<List<RouteDTO>> _getOldRoutes() async {
//    print(
//        '🎁 🎁  AftaRobotMigrationdex.getOldRoutes ++++ ###################### start databases ..........');
//
//    asses = await ListAPI.getAssociations();
//    print('🧩 🧩 Associations that are valid: 🌽 🌽 ${asses.length}');
//    final FirebaseApp app = await FirebaseApp.configure(
//      name: 'oldAftaRobotProd',
//      options: options,
//    );
//    assert(app != null);
//    oldRoutes.clear();
//    FirebaseDatabase firebaseDatabase = FirebaseDatabase(app: app);
//    DataSnapshot dataSnapshot2 =
//        await firebaseDatabase.reference().child('routes').once();
//
//    for (var value in dataSnapshot2.value.values) {
//      RouteDTO route = RouteDTO.fromJson(value);
//      oldRoutes.add(route);
//    }
//    print('\n🎁 🎁 🎁 🎁 getOldRoutes, '
//        'total routes, unfiltered: 🧩 🧩 🧩  ${oldRoutes.length}');
//    await _getFilteredRoutes();
//    return filteredRoutes;
//  }
//
//  List<AssociationDTO> asses = List();
//  /*
//    Migrates all the old AftaRobot data from Firebase Realtime DB to Firestore
//   */
//  Future<FirebaseDatabase> _getDatabase() async {
//    final FirebaseApp app = await FirebaseApp.configure(
//      name: 'oldAftaRobotProd',
//      options: options,
//    );
//    assert(app != null);
//    FirebaseDatabase firebaseDatabase = FirebaseDatabase(app: app);
//    return firebaseDatabase;
//  }
//
//  List<RouteDTO> filteredRoutes = List();
//
//  Future<List<RouteDTO>> _getFilteredRoutes() async {
//    List<RouteDTO> mRoutes = List();
//    print(
//        'filtering ${oldRoutes.length} old routes... assocs: ${asses.length} 🌽 🌽 🌽 🌽 ');
//    oldRoutes.forEach((r) {
//      asses.forEach((ass) {
//        if (ass.associationID == r.associationID) {
//          mRoutes.add(r);
//        }
//      });
//    });
//
//    filteredRoutes = mRoutes;
//    print(' 💖  💖  💖  getFilteredRoutes - new routes:  💖 '
//        '${filteredRoutes.length} from old routes ${oldRoutes.length}');
//    return filteredRoutes;
//  }
//
//  int landmarkCount = 0, routeCount = 0;
//  MigrationListener migrationListener;
//  List<RouteDTO> newRoutes = List();
//
//  Future migrateRoutes({MigrationListener mListener}) async {
//    await _getOldRoutes();
//    print(
//        '\n\n️✈️✈️✈️  migrateRoutes 🧩  migrating ${filteredRoutes.length} routes to Firestore  ✈️  ✈️  ✈️');
//    if (mListener != null) {
//      migrationListener = mListener;
//    }
//    var start = DateTime.now();
//    await _getAllOldLandmarks();
//
//    newRoutes.clear();
//    for (var route in filteredRoutes) {
//      route.countryName = 'South Africa';
//      route.countryID = '74db1a10-1805-11e9-9d61-9782237dd406';
//      var list = await _getRouteLandmarks(route);
//      if (list.isNotEmpty) {
//        var routeWithPath = await _writeRoute(route);
//        newRoutes.add(routeWithPath);
//      }
//    }
//    //do landmarks
//    for (var route in newRoutes) {
//      List<LandmarkDTO> landmarks = await _getRouteLandmarks(route);
//      if (landmarks.isNotEmpty) {
//        landmarks.forEach((m) {
//          m.routePath = route.path;
//        });
//        print(
//            '\n 🍀 🍀 migrateRoutes  🅿️ @@@@@ write 🧩 ${landmarks.length} landmarks'
//            'for route: ${route.name} - assoc: ${route.associationName} path: ${route.path}\n\n');
//        await _writeLandmarks(landmarks);
//      }
//    }
//    var end = DateTime.now();
//    print(
//        ' 💖  💖  💖  💖  💖 .migrateRoutes -- COMPLETED, 🧩 🧩 elapsed ${end.difference(start).inSeconds} seconds. '
//        'processed 🧩 $routeCount routes and 🧩 $landmarkCount landmarks ');
//
//    if (mListener != null) {
//      mListener.onComplete();
//    }
//    return 0;
//  }
//
//  Future<List<LandmarkDTO>> _writeLandmarks(List<LandmarkDTO> marks) async {
//    print(
//        '\n🧩 🧩 🧩 AftaRobotMigration._writeLandmarks *** ️⚠️ writing  batch of landmarks: ${marks.length}');
//
//    for (var m in marks) {
//      if (m.landmarkName.toLowerCase().contains('virtual')) {
//        print('**** ⚠️ ignore virtual landmark **** ${m.landmarkName}');
//      } else {
//        await _writeLandmark(m);
//      }
//    }
//
//    return marks;
//  }
//
//  LandmarkAndVehicleLocationBloc bloc;
//  Future _addGeoQueryLocation(LandmarkDTO landmark) async {
//    print(
//        ' 🔵  🔵  start ADD GEO QUERY LOCATION for : ${landmark.landmarkName} geo query location .... ........................');
//    try {
//      if (bloc == null) {
//        bloc = LandmarkAndVehicleLocationBloc(this);
//      }
//      await bloc.updateLandmarkLocation(landmark);
//      print(
//          ' 💖 Landmark position cool!: 🧩 🧩 🧩 ${landmark.associationID} ${landmark.landmarkName}');
//    } catch (e) {
//      print(e);
//    }
//    return null;
//  }
//
//  Future<List<LandmarkDTO>> _getRouteLandmarks(RouteDTO route) async {
//    print(
//        ' 🍀 🍀 getRouteLandmarks .... filter from big list ...🧩 ${landmarks.length}');
//    List<LandmarkDTO> marks = List();
//    if (route == null || route.routeID == null) return marks;
//    landmarks.forEach((m) {
//      if (m != null && route != null) {
//        if (m.routeID == route.routeID) {
//          m.associationID = route.associationID;
//          m.associationName = route.associationName;
//          m.countryID = route.countryID;
//          marks.add(m);
//        }
//      }
//    });
//    print(' 🍀 🍀 getRouteLandmarks: landmarks: 🧩 ${marks.length}');
//    return marks;
//  }
//
//  Future<List<LandmarkDTO>> _getAllOldLandmarks() async {
//    print('\n🎁 🎁  AftaRobotMigration._getAllLandmarks ️⚠️ ️⚠️ ️⚠️ ....  ...');
//    landmarks = List();
//    FirebaseDatabase firebaseDatabase = await _getDatabase();
//    DataSnapshot dataSnapshot2 =
//        await firebaseDatabase.reference().child('landmarks').once();
//    for (var value in dataSnapshot2.value.values) {
//      var mark = LandmarkDTO.fromJson(value);
//      landmarks.add(mark);
//    }
//
//    print(
//        '🎁 🎁 🎁 🎁  RouteLandmarks ️⚠️  landmarks: 🧩 ${landmarks.length}\n');
//    return landmarks;
//  }
//
//  Future<RouteDTO> _writeRoute(RouteDTO route) async {
//    await fs
//        .collection('routes')
//        .document(route.routeID)
//        .setData(route.toJson());
//    print(
//        ' 💖  💖  💖 route written 🧩 ${route.routeID} 🎁 ${route.name} - 🧩 ${route.associationName}');
//
//    routeCount++;
//    print(
//        '\n🧩 🧩 🧩 processRoute -- ++++++ route #$routeCount added to Firestore: ${route.name}');
//    migrationListener.onRouteAdded(route);
//    print('AftaRobotMigration._writeRoute saved ${route.name} in local cache');
//    return route;
//  }
//
//  Future<LandmarkDTO> _writeLandmark(LandmarkDTO m) async {
//    await fs.collection('landmarks').document(m.landmarkID).setData(m.toJson());
//    print(
//        ' 🅿️  🅿️  🅿️ landmark written: 🎁 ${m.landmarkID} - 🧩 ${m.landmarkName}');
//    await _addGeoQueryLocation(m);
//    landmarkCount++;
//    migrationListener.onLandmarkAdded(m);
//    return m;
//  }
//
//  List<LandmarkDTO> landmarks = List();
//
//  @override
//  onLandmarksFound(List<LandmarkDTO> landmarks) {
//    return null;
//  }
//
//  @override
//  onVehicleLocationsFound(List<VehicleLocation> vehicleLocations) {
//    return null;
//  }
//}
//
//class UserPage {
//  List<UserDTO> users;
//  int pageNumber;
//
//  UserPage({this.users, this.pageNumber});
//}
//
//class VehiclePage {
//  List<VehicleDTO> cars;
//  int pageNumber;
//
//  VehiclePage({this.cars, this.pageNumber});
//}
