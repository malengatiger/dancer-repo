import 'dart:async';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/dancer/dancer_list_api.dart';
import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicle_departure.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/geofencing/locator.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

MarshalBloc marshalBloc = MarshalBloc();

class MarshalBloc {
  StreamController<List<CommuterFenceDwellEvent>>
      _commuterDwellEventsController = StreamController.broadcast();
  StreamController<List<CommuterFenceExitEvent>> _commuterExitEventsController =
      StreamController.broadcast();
  StreamController<List<VehicleArrival>> _vehicleArrivalsController =
      StreamController.broadcast();
  StreamController<List<VehicleDeparture>> _vehicleDeparturesController =
      StreamController.broadcast();
  StreamController<List<DispatchRecord>> _dispatchController =
      StreamController.broadcast();
  StreamController<List<ar.Route>> _routesController =
      StreamController.broadcast();
  StreamController<List<CommuterArrivalLandmark>> _commuterArrivalsController =
      StreamController.broadcast();
  StreamController<List<Landmark>> _landmarksController =
      StreamController.broadcast();
  StreamController<List<Vehicle>> _vehiclesController =
      StreamController.broadcast();

  StreamController<String> _errorController = StreamController.broadcast();
  StreamController<bool> _busyController = StreamController.broadcast();

  Stream<bool> get busyStream => _busyController.stream;
  Stream<String> get errorStream => _errorController.stream;
  Stream<List<Vehicle>> get vehicleStream => _vehiclesController.stream;
  Stream<List<Landmark>> get landmarkStream => _landmarksController.stream;
  Stream<List<CommuterArrivalLandmark>> get commuterArrivalsStream =>
      _commuterArrivalsController.stream;
  Stream<List<ar.Route>> get routeStream => _routesController.stream;
  Stream<List<DispatchRecord>> get dispatchStream => _dispatchController.stream;
  Stream<List<VehicleDeparture>> get vehicleDepartureStream =>
      _vehicleDeparturesController.stream;
  Stream<List<VehicleArrival>> get vehicleArrivalStream =>
      _vehicleArrivalsController.stream;
  Stream<List<CommuterFenceDwellEvent>> get commuterDwellStream =>
      _commuterDwellEventsController.stream;
  Stream<List<CommuterFenceExitEvent>> get commuterExitStream =>
      _commuterExitEventsController.stream;

  FirebaseAuth _auth = FirebaseAuth.instance;
  User _user;
  User get user => _user;

  _init() async {
    var fbUser = await _auth.currentUser();
    if (fbUser == null) {
      myDebugPrint(
          '🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  Firebase fbUser is null.  👺  need to 🔑 🔑 🔑');
      return;
    }
    _user = await Prefs.getUser();
    if (_user == null) {
      myDebugPrint(
          '🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  AftaRobot User is null.  👺  need to be created by portal 🔑 🔑 🔑');
      _errorController.sink.add('AftaRobot user not found');
      return;
    }
    myDebugPrint('\n\n Loading data into streams ... may take a while ...');
    await initializeData();
  }

  Future initializeData() async {
    LocalDBAPI.setAppID();
    _user = await Prefs.getUser();
    _busyController.sink.add(true);
    await getAssociationRoutes();
    await getAssociationVehicles();
    await findLandmarksByLocation();
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 DONE Loading data into streams\n\n');
    _busyController.sink.add(false);
  }

  Future<bool> checkUserLoggedIn() async {
    var fbUser = await _auth.currentUser();
    if (fbUser == null) {
      myDebugPrint(
          '🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  Firebase fbUser is null.  👺  need to 🔑 🔑 🔑');
      return false;
    }
    _user = await Prefs.getUser();
    if (_user == null) {
      return false;
    }
    return true;
  }

  Future<List<VehicleArrival>> getVehicleArrivals({String landmarkID}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        throw Exception('landmarkID ot found for query');
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    var mList = await DancerListAPI.getVehicleArrivalsByLandmark(
        landmarkID: markID, minutes: 15);
    myDebugPrint(
        " 🌸  🌸  🌸  ${mList.length} vehicle arrivals found within  🌸 15 minutes");
    _vehicleArrivalsController.sink.add(mList);
    return mList;
  }

  Future<List<CommuterFenceDwellEvent>> getCommuterFenceDwellEvents(
      {String landmarkID}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        throw Exception('landmarkID ot found for query');
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    var mList = await DancerListAPI.getCommuterFenceDwellEvents(
        landmarkID: markID, minutes: 15);
    myDebugPrint(
        " 👽  👽  👽  👽  ${mList.length} getCommuterFenceDwellEvents found within  👽 15 minutes");
    _commuterDwellEventsController.sink.add(mList);
    return mList;
  }

  Future<List<Landmark>> findLandmarksByLocation(
      {bool forceRefresh = false, double radiusInKM}) async {
    myDebugPrint('🌸 🌸 findLandmarksByLocation.....');
    try {
      var loc = await LocationUtil.getCurrentLocation();
      var mList = await LocalDBAPI.findLandmarksByLocation(
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          radiusInKM:
              radiusInKM != null ? radiusInKM : Constants.GEO_QUERY_RADIUS);
      if (mList.isEmpty || forceRefresh) {
        mList = await DancerListAPI.findLandmarksByLocation(
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            radiusInKM: Constants.GEO_QUERY_RADIUS);
        myDebugPrint('🌸 🌸 Cache landmarks in local DB .....');
        await LocalDBAPI.addLandmarks(landmarks: mList);
      }
      myDebugPrint('🌸 🌸  ${mList.length} landmarks found');
      _landmarksController.sink.add(mList);
      return mList;
    } catch (e) {
      print(e);
      _errorController.sink
          .add('findLandmarksByLocation failed: ${e.toString()}');
    }

    return null;
  }

  Future<List<ar.Route>> getAssociationRoutes(
      {bool forceRefresh = false}) async {
    myDebugPrint(
        '🧩 🧩 🧩 getAssociationRoutes....._user.associationID: ${_user.associationID}');
    List<ar.Route> fullRoutes = List();
    try {
      var mList = await LocalDBAPI.getRoutesByAssociation(_user.associationID);
      if (mList.isEmpty || forceRefresh) {
        mList = await DancerListAPI.getRoutesByAssociation(
            associationID: _user.associationID);
        myDebugPrint('🧩 🧩 🧩 Cache routes in local DB .....');

        for (var r in mList) {
          var route = await DancerListAPI.getRouteByID(routeID: r.routeID);
          await LocalDBAPI.addRoute(route: route);
          fullRoutes.add(route);
        }
      }
      myDebugPrint('🧩 🧩 🧩  ${mList.length} routes found');
      _routesController.sink.add(mList);
      return fullRoutes;
    } catch (e) {
      print(e);
      _errorController.sink.add('getAssociationRoutes failed: ${e.toString()}');
    }

    return null;
  }

  Future<List<Vehicle>> getAssociationVehicles(
      {bool forceRefresh = false}) async {
    myDebugPrint(
        '🦠 🦠 🦠 getAssociationVehicles....._user.associationID: ${_user.associationID}');
    try {
      var list = await LocalDBAPI.getVehiclesByAssociation(_user.associationID);
      if (list.isEmpty || forceRefresh) {
        list = await DancerListAPI.getVehiclesByAssociation(
            associationID: _user.associationID);
        myDebugPrint('🦠 🦠 🦠 Cache vehicles in local DB .....');
        await LocalDBAPI.addVehicles(vehicles: list);
      }
      myDebugPrint(
          '🦠 🦠 🦠  ${list.length} vehicles found. put on stream: 🌸 _vehiclesController.sink');
      _vehiclesController.sink.add(list);
      return list;
    } catch (e) {
      print(e);
      _errorController.sink.add(e.toString());
    }

    return null;
  }

  closeStreams() {
    _commuterDwellEventsController.close();
    _commuterExitEventsController.close();
    _vehicleArrivalsController.close();
    _vehicleDeparturesController.close();
    _dispatchController.close();
    _routesController.close();
    _commuterArrivalsController.close();
    _errorController.close();
    _landmarksController.close();
    _vehiclesController.close();
    _busyController.close();
  }

  MarshalBloc() {
    _init();
  }
}
