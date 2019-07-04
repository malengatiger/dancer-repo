import 'dart:async';

import 'package:aftarobotlibrary4/api/cloud_api.dart';
import 'package:aftarobotlibrary4/api/dancer_api.dart';
import 'package:aftarobotlibrary4/api/data_api.dart';
import 'package:aftarobotlibrary4/api/file_util.dart';
import 'package:aftarobotlibrary4/api/list_api.dart';
import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/location_bloc.dart';
import 'package:aftarobotlibrary4/api/mongo_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/association_bag.dart';
import 'package:aftarobotlibrary4/data/associationdto.dart';
import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/geofence_event.dart';
import 'package:aftarobotlibrary4/data/landmarkdto.dart';
import 'package:aftarobotlibrary4/data/routedto.dart';
import 'package:aftarobotlibrary4/data/routepointdto.dart';
import 'package:aftarobotlibrary4/data/vehicle_location.dart';
import 'package:aftarobotlibrary4/geofencing/locator.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/maps/snap_to_roads.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart';
import 'package:geoflutterfire/geoflutterfire.dart';
import 'package:meta/meta.dart';
import 'package:permission_handler/permission_handler.dart';

final RouteBuilderBloc routeBuilderBloc = RouteBuilderBloc();

class RouteBuilderModel {
  List<RouteDTO> _routes = List();
  List<LandmarkDTO> _landmarks = List();
  List<LandmarkDTO> _routeLandmarks = List();

  List<RoutePointDTO> _routePoints = List();
  List<VehicleGeofenceEvent> _geofenceEvents = List();
  List<AssociationDTO> _associations = List();
  List<AssociationBag> _associationBags = List();
  List<CityDTO> _cities = List();

  List<CityDTO> get cities => _cities;
  List<RouteDTO> get routes => _routes;
  List<LandmarkDTO> get landmarks => _landmarks;
  List<LandmarkDTO> get routeLandmarks => _routeLandmarks;
  List<RoutePointDTO> get routePoints => _routePoints;
  List<AssociationDTO> get associations => _associations;
  List<AssociationBag> get associationBags => _associationBags;
  List<VehicleGeofenceEvent> get geofenceEvents => _geofenceEvents;
}

/*
This class manages thd app's business logic and connects the model to a stream for a reactive effect
*/
class RouteBuilderBloc implements LocationBlocListener {
  final StreamController<RouteBuilderModel> _appModelController =
      StreamController<RouteBuilderModel>.broadcast();
  final StreamController<String> _errorController =
      StreamController<String>.broadcast();
  final StreamController<bg.Location> _currentLocationController =
      StreamController<bg.Location>.broadcast();
  final StreamController<bg.GeofenceEvent> _geofenceEventController =
      StreamController<bg.GeofenceEvent>.broadcast();
  final StreamController<List<LandmarkDTO>> _marksNearPointController =
      StreamController.broadcast();

  final StreamController<List<RoutePointDTO>> _routePointController =
      StreamController.broadcast();
  final StreamController<List<RoutePointDTO>> _rawRoutePointController =
      StreamController.broadcast();
  final StreamController<List<LandmarkDTO>> _routeLandmarksController =
      StreamController.broadcast();

  List<RoutePointDTO> _routePoints = List();
  List<RoutePointDTO> _rawRoutePoints = List();
  List<GeofenceEvent> _geofenceEvents = List();
  List<LandmarkDTO> _routeLandmarks = List();

  final RouteBuilderModel _appModel = RouteBuilderModel();
  final Firestore fs = Firestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  bg.Location _currentLocation;
  bg.Location get currentLocation => _currentLocation;
  RouteBuilderModel get model => _appModel;
  closeStream() {
    _appModelController.close();
    _errorController.close();
    _currentLocationController.close();
    _geofenceEventController.close();
    _marksNearPointController.close();
    _routePointController.close();
    _rawRoutePointController.close();
    _routeLandmarksController.close();
  }

  Stream get appModelStream => _appModelController.stream;
  Stream get currentLocationStream => _currentLocationController.stream;
  Stream get geofenceEventStream => _geofenceEventController.stream;
  Stream get landmarksNearPointStream => _marksNearPointController.stream;
  Stream get routePointsStream => _routePointController.stream;
  Stream get rawRoutePointsStream => _rawRoutePointController.stream;
  Stream get routeLandmarksStream => _routeLandmarksController.stream;

  List<RoutePointDTO> get routePoints => _routePoints;
  List<RoutePointDTO> get rawRoutePoints => _rawRoutePoints;
  List<LandmarkDTO> get routeLandmarks => _routeLandmarks;

  RouteBuilderBloc() {
    _initialize();
  }
  static const GEOFENCE_PROXIMITY_RADIUS = 5000, DISTANCE_FILTER = 10.0;
  _initialize() async {
    print(
        '\n\n\n 🔵  🔵  🔵  🔵  🔵 RouteBuilderBloc ️ ✳️ initializing ... 🔵  🔵  🔵  🔵  🔵 \n\n');

    await _signIn();
    await getAssociations();
  }

  Future _signIn() async {
    //todo - to be replaced by proper authentication
    debugPrint(
        '\n### ℹ️ sign in anonymously ...(to be replaced by real auth code)');
    var user = await _auth.currentUser();
    if (user == null) {
      await _auth.signInAnonymously();
    } else {
      debugPrint(' ✅ User already authenticated');
    }
    return null;
  }

  Future<bool> requestPermission() async {
    print('\n\n######################### requestPermission');
    try {
      Map<PermissionGroup, PermissionStatus> permissions =
          await PermissionHandler()
              .requestPermissions([PermissionGroup.location]);
      print(permissions);
      permissions.values.forEach((perm) {
        debugPrint('check for perm:: Permission status: $perm');
      });
      print("\n########### permission request for location is:  ✅ ");
      return true;
    } catch (e) {
      print(e);
    }
    return false;
  }

  Future<bool> checkPermission() async {
    try {
      PermissionStatus locationPermission = await PermissionHandler()
          .checkPermissionStatus(PermissionGroup.location);

      if (locationPermission == PermissionStatus.denied) {
        return false;
      } else {
        print(
            "\n ✅  ✅  location permission status is:  ✅  ✅ $locationPermission");
        return true;
      }
    } catch (e) {
      print(e);
      throw e;
    }
  }

  Future getAssociations() async {
    debugPrint(
        '### ℹ️  getAssociations: getting ALL Associations in Firestore ..........\n');
    var asses = await ListAPI.getAssociations();

    debugPrint(
        ' 📍📍📍📍 adding ${asses.length} Associations to  📎 model and stream sink ...');
    _appModel.associations.clear();
    _appModel.associations.addAll(asses);
    _appModelController.sink.add(_appModel);
    debugPrint('++++ ✅  Associations retrieved: ${asses.length}\n');
    return _appModel.associations;
  }

  Future getRoutesByAssociation(String associationID) async {
    debugPrint(
        '### ℹ️  getRoutes: getting association routes 🚨 $associationID  in Firestore ..........\n');
    var routes = await ListAPI.getRoutesByAssociation(associationID);

    debugPrint(
        ' 📍📍📍📍 adding ${routes.length} routes to  📎 model and stream sink ...');
    _appModel.routes.clear();
    _appModel.routes.addAll(routes);
    _appModel.routes.sort((a, b) => a.name.compareTo(b.name));
    _appModelController.sink.add(_appModel);
    debugPrint('++++ ✅  routes retrieved: ${routes.length}\n');

    return _appModel.routes;
  }

  Future addRoutesToMongo(List<RouteDTO> routes) async {
    for (var route in routes) {
      addRouteToMongo(route);
    }
  }

  Future addRouteToMongo(RouteDTO route) async {
    var res = await MongoAPI.addRoute(route);
    print(res);
  }

  Future addRoute(RouteDTO route) async {
    debugPrint('### ℹ️  ℹ️  ℹ️  add new route to database ..........☘\n');
    assert(route.associationIDs.length > 0);
    assert(route.name != null);
    if (route.color == null) {
      route.color = 'white';
    }
    var result = await DancerAPI.addRoute(
      color: route.color,
      name: route.name,
      associationId: route.associationIDs[0],
    );

    debugPrint(
        ' 📍📍📍📍📍📍 adding route ${route.name} to model and stream sink ...');
    _appModel.routes.add(result);
    _appModelController.sink.add(_appModel);
    return _appModel.routes;
  }

  Future<LandmarkDTO> addLandmark(LandmarkDTO landmark) async {
    debugPrint('### ℹ️  add new landmark to database ..........ℹ️  ℹ️  ℹ️  ');
    LandmarkDTO result;
    try {
      result = await DancerAPI.addLandmark(
          landmarkName: landmark.landmarkName,
          latitude: landmark.latitude,
          longitude: landmark.longitude,
          routeIDs: [],
          routeDetails: []);
      debugPrint(
          '❤️ 🧡 💛  adding landmark to _routeLandmarksController sink ...');
      prettyPrint(result.toJson(),
          '❤️ 🧡 💛 NEW LANDMARK added: ${landmark.landmarkName}');
      routeLandmarks.add(result);
      _routeLandmarksController.sink.add(_routeLandmarks);
    } catch (e) {
      print('🌶 🌶 🌶  $e  🌶 🌶 🌶 ');
      throw e;
    }
    return result;
  }

  Future addCityToLandmark(LandmarkDTO landmark, CityDTO city) async {
    debugPrint(
        '📍 📍 📍  update landmark ${landmark.landmarkName} on Firestore ..........\n');

    _appModel.landmarks.remove(landmark);
    landmark.cities.add(BasicCity(name: city.name, longitude: city.longitude, latitude: city.latitude, provinceName: city.provinceName));
    await DancerAPI.addCityToLandmark(cityId: city.cityID, landmarkId: landmark.landmarkID);
    debugPrint(
        '❤️ 🧡 💛 ${landmark.landmarkName} updated;  🍀 add to model and stream sink ...');
    _appModel.landmarks.add(landmark);
    _appModelController.sink.add(_appModel);
    return landmark;
  }

  Future updateRoute(RouteDTO route) async {
    debugPrint(
        '### 📍 📍 📍  update route:  ${route.name} on Firestore ..........\n');
    _appModel.routes.remove(route);

    route.created = DateTime.now().toUtc().toIso8601String();
    await DancerAPI.updateRoute(
        routeId: route.routeID, name: route.name, color: route.color);
    debugPrint(' 📍 adding route, after update,  to model and stream sink ...');

    _appModel.routes.add(route);
    _appModelController.sink.add(_appModel);
    return null;
  }

  Future<List<CityDTO>> getCities(String countryId) async {
    debugPrint('### ℹ️  getCities: getting cities in Firestore ..........\n');
    var cities = await LocalDB.getCities();
    if (cities == null || cities.isEmpty) {
      cities = await DancerAPI.getCountryCities(countryId);
      if (cities.isNotEmpty) {
        await LocalDB.saveCities(Cities(cities));
      }
    }

    debugPrint(
        ' 📍 adding model with ${cities.length} cities to model and stream sink ...');
    _appModel.cities.clear();
    _appModel.cities.addAll(cities);
    _appModelController.sink.add(_appModel);
    debugPrint('++++ ✅  cities retrieved: ${cities.length}\n');
    return _appModel.cities;
  }

  LocationFinderBloc locationFinderBloc;

  Future<List<LandmarkDTO>> findLandmarksNearRoutePoint(
      RoutePointDTO routePoint) async {
    debugPrint(
        '\n\n♻️♻️♻️♻️♻️♻️♻️♻️ calling  LocationFinderBloc to find nearest landmarks ... result goes to _marksNearPointController.stream ... ♻️♻️');
    assert(routePoint != null);
    if (routePoint == null) {
      _marksNearPointController.sink.add(List());
      prettyPrint(
          routePoint.toJson(), '\n\n💀 💀 💀 BAD ROUTE POINT 💀 💀 💀 ');
      return List();
    }
    List<LandmarkDTO> list = List();
    list = await DancerAPI.findLandmarksByLocation(
      latitude: routePoint.latitude,
      longitude: routePoint.longitude,
      radiusInKM: 0.1,
    );
    _marksNearPointController.sink.add(list);
    return list;
  }

  Future findCitiesByLocation(
      {@required double latitude,
      @required double longitude,
      @required double radiusInKM,
      LocationBlocListener listener,
      CityLocationListener cityListener}) async {
    var list = await DancerAPI.findCitiesByLocation(
      latitude: latitude,
      longitude: longitude,
      radiusInKM: radiusInKM,
    );
    cityListener.onCitiesFound(list);
    return list;
  }

  Future findCitiesNearLandmark(
      {@required LandmarkDTO landmark,
      @required double radiusInKM,
      LocationBlocListener listener,
      CityLocationListener cityListener}) async {
    var list = await DancerAPI.findCitiesByLocation(
      latitude: landmark.latitude,
      longitude: landmark.longitude,
      radiusInKM: radiusInKM,
    );
    cityListener.onCitiesNearLandmark(landmark, list);
  }

  Future findRoutePointsNearLandmark(
      {LandmarkDTO landmark, String routeId, LocationListener listener}) async {
    assert(landmark != null);
    assert(routeId != null);
    assert(listener != null);

    var list = await DancerAPI.findRoutePointsByLocation(
      latitude: landmark.latitude,
      longitude: landmark.longitude,
      radiusInKM: 0.2,
      routeId: routeId,
    );
    listener.onRoutePointsFound(routeId, list);
    debugPrint(
        '\n\n♻️♻️♻️♻️♻️♻️♻️♻️ found nearest routePoints; routeID:  $routeId   🔴 ${list.length} routePoints... ♻️♻️');

    return list;
  }

  Future addRouteToLandmark({RouteDTO route, LandmarkDTO landmark}) async {
    debugPrint(
        'routeBuilderBloc.addRouteToLandmark: adding .... calling DataAPI.addRouteToLandmark');
    var m = await DancerAPI.addRouteToLandmark(routeId: route.routeID, landmarkId: landmark.landmarkID);
    debugPrint(
        'done adding route to landmark ... calling  getRouteLandmarks  ...');
    await getRouteLandmarks(route);
    return m;
  }

  Future<List<LandmarkDTO>> getRouteLandmarks(RouteDTO route) async {
    debugPrint(
        '\n\nrouteBuilderBloc ℹ️ℹ️ℹ️ℹ️ℹ️  getRouteLandmarks: getting route landmarks from Firestore ..........\n');
    var marks = await DancerAPI.getRouteLandmarks(routeId: route.routeID);

    debugPrint(
        'routeBuilderBloc: 📍 adding model with landmarks to model and stream sink ...');
    _routeLandmarks.clear();
    marks.forEach((m) {
      DataAPI.filterRouteInfos(m, route);
    });
    _routeLandmarks.addAll(marks);
    _routeLandmarksController.sink.add(_routeLandmarks);
    debugPrint(
        'routeBuilderBloc; ✅  route landmarks retrieved: ${_routeLandmarks.length}\n');

    return _routeLandmarks;
  }


  Future<List<RoutePointDTO>> getRawRoutePoints({RouteDTO route}) async {
    debugPrint(
        '\n🔵 🔵 🔵 🔵 🔵 ️ getRawRoutePoints: getting RAW route points : 🧩🧩  ${route.name}\n');

    _rawRoutePoints =
        await LocalDBAPI.getRawRoutePoints(routeID: route.routeID);
    if (_rawRoutePoints.isEmpty) {
      RouteDTO mRoute = await DancerAPI.getRoute(routeId: route.routeID);
      _rawRoutePoints = mRoute.rawRoutePoints;
    }
    print(
        '\n🚨 🚨 🚨 🚨  rawRoutePoints found : 🍀️🍀️ ${_rawRoutePoints.length}  🍀️🍀️  for route  ✳️  ${route.routeID} - ${route.name}\n\n');
    _rawRoutePointController.sink.add(_rawRoutePoints);

    return _rawRoutePoints;
  }

  Future<List<RoutePointDTO>> getRoutePoints({RouteDTO route}) async {
    debugPrint('ℹ️  getRoutePoints getting route points ..........');
    var mRoute = await DancerAPI.getRoute(routeId: route.routeID);
    _rawRoutePoints = mRoute.routePoints;
    _routePointController.sink.add(mRoute.routePoints);
    debugPrint(
        'ℹ️  🍎 🍎 🍎 🍎  getRoutePoints found: 🍎 ${_routePoints.length}');
    return _routePoints;
  }

  Future<RouteDTO> getRouteByID(String routeID) async {
    var mRoute = await DancerAPI.getRoute(routeId: routeID);
    return mRoute;
  }

  Future updateRoutePointLandmark(
      {String routeID, RoutePointDTO routePoint, LandmarkDTO landmark}) async {
    assert(routePoint != null);
    assert(landmark != null);
    _routePoints.remove(routePoint);
    routePoint.landmarkID = landmark.landmarkID;
    routePoint.landmarkName = landmark.landmarkName;

    var result = await DancerAPI.updateRoutePoint(routeId: routeID, landmarkId: landmark.landmarkID, created: routePoint.created);
      _routePoints.add(routePoint);
      _routePointController.sink.add(_routePoints);
      //update route point in local db
      await LocalDBAPI.updateRawRoutePoint(point: routePoint);
      debugPrint('\n\n 🍏🍏 Sorted out route point in Local Mongo');
   return result;
  }


  Timer timer;
  int timerDuration = 10;
  int index;

  startRoutePointCollectionTimer(
      {@required RouteDTO route, @required int collectionSeconds}) async {
    print('🌽 🌽 🌽 🌽   startRoutePointCollectionTimer   🌽 🌽 🌽 🌽 🌽 ');
    assert(route != null);
    assert(collectionSeconds != null);
    index = 0;
    _rawRoutePoints.clear();
    _rawRoutePointController.sink.add(_rawRoutePoints);
    _collectRawRoutePoint();
    Timer.periodic(Duration(seconds: collectionSeconds), (mTimer) {
      timer = mTimer;
      debugPrint(
          "🔆 🔆 🔆  timer triggered for  🌺  $collectionSeconds seconds  🌺  get GPS location and save");
      _collectRawRoutePoint();
    });
    debugPrint(
        "\n\n🔆 🔆 🔆  timer set up to start point collection every  🌺  $collectionSeconds seconds  🌺 ");
  }

  double _prevLatitude, _prevLongitude;
  Future _collectRawRoutePoint() async {
    var currentLocation = await LocationUtil.getCurrentLocation();
    var route = await Prefs.getRoute();
    if (route == null) {
      return null;
    }
    if (currentLocation == null) {
      return null;
    }
    debugPrint(
        '🧩 🧩  🧩 🧩  🧩 🧩 _collectRawRoutePoint : add point for 🔆  route:  👌 ${route.name}.............');
    _addRawRoutePoint(
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    );

    return currentLocation;
  }

  _addRawRoutePoint({double latitude, double longitude}) async {
    print(
        '🚺 🚺 🚺   _addRawRoutePoint: processing route point.  ⏰ check previous distance');

    try {
      if (_prevLatitude != null) {
        var ld = LandmarkDistance();
        ld.calculateDistance(
            fromLatitude: _prevLatitude,
            fromLongitude: _prevLongitude,
            toLatitude: latitude,
            toLongitude: longitude);

        print(
            '🥦  🥦  Distance from previous point: ${ld.distanceMetre} : ${DateTime.now().toIso8601String()}');
        if (ld.distanceMetre < 50.0) {
          print(
              ' 🥦  🥦 🥦  🥦 Looks like we are NOT moving. Distance:  🚹 ${ld.distanceMetre} metres:  🍷 🍷 🍷 Ignoring location');
          return;
        } else {
          await _writeRawPoint(latitude: latitude, longitude: longitude);
          _prevLatitude = latitude;
          _prevLongitude = longitude;
        }
      } else {
        await _writeRawPoint(latitude: latitude, longitude: longitude);
        _prevLatitude = latitude;
        _prevLongitude = longitude;
      }
    } catch (e) {
      //todo - error handling here
      print('⚠️ ⚠️ ⚠️  $e');
    }
  }

  Future _writeRawPoint({double latitude, double longitude}) async {
    var route = await Prefs.getRoute();
    debugPrint(
        '🧩 🧩  🧩 🧩  🧩 🧩 _writeRawPoint : add routePoint for 🔆  route:  👌 ${route.name}.............');
    assert(route != null);
    assert(latitude != null);
    assert(longitude != null);

    var point = RoutePointDTO(
      latitude: latitude,
      longitude: longitude,
      created: DateTime.now().toUtc().toIso8601String(),
      index: index,
      routeID: route.routeID,
    );

    index++;
    try {
      await LocalDBAPI.addRoutePoint(route: route, routePoint: point);
      var ref = await fs
          .collection(Constants.ROUTES)
          .document(route.routeID)
          .collection(Constants.RAW_ROUTE_POINTS)
          .add(point.toJson());

      debugPrint(
          '🔴🔴 🔴🔴 🔴🔴  _writeRawPoint collected point written:  🔆 ${ref.path} 🧩🧩  point #$index  🧩🧩');
      _rawRoutePoints.add(point);
      _rawRoutePointController.sink.add(_rawRoutePoints);
    } catch (e) {
      print('👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿');
      print(e);
    }
    return null;
  }

  void cancelTimer() {
    if (timer != null) {
      timer.cancel();
      timer = null;
      debugPrint('\n\n🧩🧩 🧩🧩 🧩🧩 Timer cancelled and 👿👿👿 nulled');
    }
  }

  Future stopRoutePointCollectionTimer() async {
    index = null;
    clearPreviousLocation();
    if (timer == null) {
      print('---------- timer is null. ⚠️  ---- quit.');
    } else {
      print("🚨 🚨 🚨 🚨  cancelling collection timer ⚠️  ⚠️ ");
      timer.cancel();
      timer = null;
    }
    return null;
  }

  @override
  onLandmarksFound(List<LandmarkDTO> landmarks) {
    // TODO: implement onLandmarksFound
    return null;
  }

  @override
  onVehicleLocationsFound(List<VehicleLocation> vehicleLocations) {
    // TODO: implement onVehicleLocationsFound
    return null;
  }

  clearPreviousLocation() async {
    _prevLongitude = null;
    _prevLatitude = null;
  }

  @override
  onRoutePointsFound(
      String routeID, List<RoutePointDTO> list, LandmarkDTO landmark) async {
    debugPrint(
        '\n\n🔆 🔆 🔆 RouteBuilderBloc onRoutePointsFound: $routeID points: ${routePoints.length} ${landmark.landmarkName}  🔆');
    if (list.isNotEmpty) {
      var res = await routeBuilderBloc.updateRoutePointLandmark(
          routeID: routeID, routePoint: list.elementAt(0), landmark: landmark);
      debugPrint('🍎 🍎 🍎 route point has been updated with landmark: $res');
    } else {
      debugPrint('🍎 🍎 🍎 route point NOT FOUND');
    }
  }

  void setIndex(int newIndex) {
    index = newIndex;
  }
}

abstract class LocationListener {
  onRoutePointsFound(String routeID, List<RoutePointDTO> routePoints);
}
