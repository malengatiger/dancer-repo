import 'dart:async';
import 'dart:io';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/dancer/dancer_data_api.dart';
import 'package:aftarobotlibrary4/dancer/dancer_list_api.dart';
import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/user.dart' as af;
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicle_departure.dart';
import 'package:aftarobotlibrary4/data/vehicle_location.dart';
import 'package:aftarobotlibrary4/data/vehicle_route_assignment.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/distance.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/geofencer.dart';
import 'package:aftarobotlibrary4/util/settings.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:geolocator/geolocator.dart';

final MarshalBloc marshalBloc = MarshalBloc(null);

class MarshalBloc implements GeofencerListener {
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
  StreamController<List<CommuterRequest>> _commuterRequestsController =
      StreamController.broadcast();
  StreamController<List<Landmark>> _landmarksController =
      StreamController.broadcast();
  StreamController<List<Vehicle>> _vehiclesController =
      StreamController.broadcast();
  StreamController<VehicleArrival> _vehicleArrivalDispatchedController =
      StreamController.broadcast();
  StreamController<List<RouteDistanceEstimation>>
      _routeDistanceEstimationController = StreamController.broadcast();

  List<String> _errors = List();
  List<bool> _busies = List();
  StreamController<List<String>> _errorController =
      StreamController.broadcast();
  StreamController<List<bool>> _busyController = StreamController.broadcast();
  StreamController<List<VehicleLocation>> _vehicleLocationController =
      StreamController.broadcast();
  Stream<List<CommuterRequest>> get commuterRequestStream =>
      _commuterRequestsController.stream;
  Stream<List<bool>> get busyStream => _busyController.stream;
  Stream<List<String>> get errorStream => _errorController.stream;
  Stream<List<Vehicle>> get vehicleStream => _vehiclesController.stream;
  Stream<List<VehicleLocation>> get vehicleLocationStream =>
      _vehicleLocationController.stream;
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
  Stream<VehicleArrival> get vehicleArrivalDispatchedStream =>
      _vehicleArrivalDispatchedController.stream;

  FirebaseAuth _auth;
  af.User _user;
  af.User get user => _user;
  Landmark _landmark;
  Landmark get marshalLandmark => _landmark;
  List<RouteDistanceEstimation> _routeDistanceEstimations = List();
  List<VehicleArrival> _vehicleArrivals = List();
  List<CommuterFenceDwellEvent> _dwellEvents = List();
  List<VehicleDeparture> _vehicleDepartures = List();
  List<CommuterFenceExitEvent> _exitEvents = List();
  List<CommuterArrivalLandmark> _commuterArrivals = List();
  List<Vehicle> _vehicles = List();
  List<Vehicle> get vehicles => _vehicles;
  List<CommuterRequest> _commuterRequests = List();
  List<DispatchRecord> _dispatchRecords = List();
  GeoFencer _geoFencer;

  _init() async {
    debugPrint(
        '🌸 🌸 🌸 🌸 ... MarshalBloc initializing and faking cities search .... 🌸 🌸 🌸 🌸 ...');
    Position position =
        await getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
    p(" 🍎 🍎 Finding cities within location ..............");
    var cities = await DancerListAPI.findCitiesByLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        radiusInKM: 2);
    p("🔵 🔵 🔵 🔵 🔵 🔵 🔵 ....................... : Cities found: ${cities.length} ");
    findLandmarksByLocation(
        radiusInKM: Constants.RADIUS_LANDMARK_SEARCH, forceRefresh: true);
    if (_auth == null) {
      await initializeFirebase();
      _auth = FirebaseAuth.instance;
    }
    var fbUser = _auth.currentUser;
    if (fbUser == null) {
      mp('🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  Firebase fbUser is null.  👺  need to 🔑 🔑 🔑');
      return;
    }
    await DotEnv().load('.env');
    String status = DotEnv().env['status'];
    var devURL = DotEnv().env['devURL'];
    var prodURL = DotEnv().env['prodURL'];
    mp('🌸 🌸 🌸 🌸 ... MarshalBloc initializing: App status: 🔑 $status devURL: 🔑 $devURL prodURL: 🔑 $prodURL');
    _geoFencer =
        GeoFencer(userType: Constants.USER_MARSHAL, geofencerListener: this);
    _user = await Prefs.getUser();
    if (_user == null) {
      mp('🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  AftaRobot User is null.  👺  need to be created by portal 🔑 🔑 🔑');
      _errors.add('AftaRobot user not found');
      _errorController.sink.add(_errors);
      return;
    } else {
      mp('🌸 🌸 🌸 🌸 ... MarshalBloc initializing: getAssociationVehicles forceRefresh: true');
      _vehicles = await getAssociationVehicles(forceRefresh: false);
      _vehiclesController.sink.add(_vehicles);
    }
    _configureFCM();

    // _geoFencer.findLandmarksByLocation();
  }

  Future refreshDashboardData({bool forceRefresh}) async {
    mp('\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 refreshDashboardData: Loading data into streams ...');

    _busies.add(true);
    _busyController.sink.add(_busies);

    _landmark = await Prefs.getLandmark();
    _vehicles = await getAssociationVehicles(forceRefresh: forceRefresh);

    await findLandmarksByLocation(radiusInKM: Constants.RADIUS_LANDMARK_SEARCH);
    await getCommuterRequests();
    await getCommuterFenceDwellEvents();
    await getVehicleArrivals();
    await getAssociationRoutes(forceRefresh: forceRefresh);
    _busies.add(false);
    _busyController.sink.add(_busies);
    mp('🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 refreshDashboardData:  🔴 🔴 DONE Loading data into streams');
  }

  Future refreshMarshalLandmark(Landmark landmark) async {
    mp('\n💙  💙  💙  💙  💙  💙  💙 refreshMarshalLandmark ..... ${landmark.landmarkName}');
    await Prefs.saveLandmark(landmark);
    refreshDashboardData(forceRefresh: true);
    return null;
  }

  List<VehicleLocation> _vehicleLocations = List();

  Future<List<VehicleLocation>> findVehiclesByLocation(
      {int minutes, double radiusInKM}) async {
    mp('💙 💙 💙 💙 💙 💙 💙 findVehiclesByLocation .....');
    _busies.add(true);
    _busyController.sink.add(_busies);
    Position position =
        await getCurrentPosition(desiredAccuracy: LocationAccuracy.high);

    _vehicleLocations = await DancerListAPI.findVehiclesByLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        radiusInKM: radiusInKM == null
            ? SettingsModel().vehicleGeoQueryRadius
            : radiusInKM,
        minutes: minutes == null ? 5 : minutes);
    mp('💙 💙 💙 💙 💙 💙 💙  findVehiclesByLocation ..... '
        'found  🔴 🔴 ${_vehicleLocations.length} vehicles 🧡 before filtering by association');

    //remove duplicate vehicles
    prettyPrint(_user.toJson(),
        '🌿 🌿 🌿 🌿 USER object 🌿 🌿 🌿 🌿  check association');
    _vehicleLocations.sort((a, b) => a.created.compareTo(b.created));
    Map<String, VehicleLocation> map = Map();
    _vehicleLocations.forEach((v) {
      if (v.associationID == _user.associationID) {
        map[v.vehicleID] = v;
      }
    });
    _vehicleLocations = map.values.toList();
    _vehicleLocationController.sink.add(_vehicleLocations);
    mp('💙 💙 💙 💙 💙 💙 💙  findVehiclesByLocation ..... found & filtered by association:  '
        '🔴 🔴 ${_vehicleLocations.length} UNIQUE vehicles 🍎 🍎  after filtering');
    _busies.add(false);
    _busyController.sink.add(_busies);
    return _vehicleLocations;
  }

  Future<bool> checkUserLoggedIn() async {
    await initializeFirebase();
    _auth = FirebaseAuth.instance;
    var fbUser = _auth.currentUser;
    if (fbUser == null) {
      mp('🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  Firebase fbUser is null.  👺  need to 🔑 🔑 🔑');
      return false;
    }
    _user = await Prefs.getUser();
    if (_user == null) {
      return false;
    }
    return true;
  }

  Future addDispatchRecord(DispatchRecord dispatchRecord) async {
    var result =
        await DancerDataAPI.addDispatchRecord(dispatchRecord: dispatchRecord);
    p('........... Backend has added dispatch record OK ...');
    _dispatchRecords.add(result);
    p('There are ${_dispatchRecords.length} dispatch records in list, about to save last dispatch ...');
    await Prefs.saveLastDispatch(result);
    await LocalDBAPI.addDispatchRecord(record: result);
    p('Put list of records in stream ...');
    _dispatchController.sink.add(_dispatchRecords);
    return result;
  }

  List<VehicleArrival> vehicleArrivals = [];
  Future<List<VehicleArrival>> getVehicleArrivals(
      {String landmarkID, int minutes = 10}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        return List();
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    try {
      var temp = await DancerListAPI.getVehicleArrivalsByLandmark(
          landmarkID: markID, minutes: minutes);
      mp("🌸 🌸 🌸  ${temp.length} vehicle arrivals found within  🌸 $minutes minutes; filtering by dispatched flag ... ");
      vehicleArrivals.clear();
      temp.forEach((element) {
        if (element.dispatched == null || element.dispatched == false) {
          vehicleArrivals.add(element);
        }
      });

      mp("🌸 🌸 🌸  ${vehicleArrivals.length} vehicle arrivals filtered   🌸🌸🌸");
      return vehicleArrivals;
    } catch (e) {
      dealWithError(e);
    }
    return _vehicleArrivals;
  }

  removeVehicleArrival(VehicleArrival vehicleArrival) {
    List<VehicleArrival> temp = List();
    if (vehicleArrivals == null || vehicleArrivals.isEmpty) {
      return;
    }
    vehicleArrivals.forEach((m) {
      if (m.vehicleID != vehicleArrival.vehicleID) {
        temp.add(m);
      }
    });
    vehicleArrivals = temp;
    mp(" 🌸  🌸  🌸  ${vehicleArrival.vehicleReg} removed from arrivals. 🌺 updating stream");
    _removeVehiclesDispatchedWithinLastHour();
  }

  List<CommuterRequest> commuterRequests;
  Future<List<CommuterRequest>> getCommuterRequests({String landmarkID}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        return List();
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    _busies.add(true);
    _busyController.sink.add(_busies);
    try {
      commuterRequests = await DancerListAPI.getCommuterRequests(
          landmarkID: markID, minutes: 30);
      mp(" 🌸  🌸  🌸  ${commuterRequests.length} getCommuterRequests found within  🌸 30 minutes");
      _commuterRequestsController.sink.add(commuterRequests);
      _busies.add(false);
      _busyController.sink.add(_busies);
    } catch (e) {
      dealWithError(e);
    }
    return commuterRequests;
  }

  void dealWithError(e) {
    if (e is TimeoutException) {
      mp('Call has 🔆 🔆 🔆 timed out 🔆 🔆 🔆');
      _errors.add('Network TimeOut');
      _errorController.sink.add(_errors);
//      marshalBlocListener.onError("Network Timeout");
    }
    if (e is SocketException) {
      mp('Call has run into  🔴  🔴  🔴 SocketException  🔴  🔴  🔴 ');
      _errors.add('Network SocketException');
      _errorController.sink.add(_errors);
//      marshalBlocListener.onError("Network SocketException");
    }
    _errors.add(e == null ? 'Unknown Network Error' : e.message);
    _errorController.sink.add(_errors);
//    marshalBlocListener
//        .onError(e == null ? 'Unknown Network Error' : e.message);
    print(e);
  }

  List<CommuterFenceDwellEvent> commuterFenceDwellEvents;
  Future<List<CommuterFenceDwellEvent>> getCommuterFenceDwellEvents(
      {String landmarkID}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        return List();
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    try {
      commuterFenceDwellEvents =
          await DancerListAPI.getCommuterFenceDwellEvents(
              landmarkID: markID, minutes: 30);
      mp(" 👽  👽  👽  👽  ${commuterFenceDwellEvents.length} getCommuterFenceDwellEvents found within  👽 15 minutes");
      _commuterDwellEventsController.sink.add(commuterFenceDwellEvents);
    } catch (e) {
      dealWithError(e);
    }
    return commuterFenceDwellEvents;
  }

  List<Landmark> landmarks;
  // ignore: missing_return
  Future<List<Landmark>> findLandmarksByLocation(
      {bool forceRefresh = false, double radiusInKM}) async {
    mp('🌸 🌸 MarshalBloc:................ findLandmarksByLocation.....');
    try {
      Position position =
          await getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
      landmarks = await LocalDBAPI.findLandmarksByLocation(
          latitude: position.latitude,
          longitude: position.longitude,
          radiusInKM:
              radiusInKM != null ? radiusInKM : Constants.GEO_QUERY_RADIUS);
      if (landmarks.isEmpty || forceRefresh) {
        landmarks = await DancerListAPI.findLandmarksByLocation(
            latitude: position.latitude,
            longitude: position.longitude,
            radiusInKM: SettingsModel().vehicleGeoQueryRadius);
        mp('🌸 🌸 Cache landmarks in local DB .....');
        await LocalDBAPI.addLandmarks(landmarks: landmarks);
      }

      mp('🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸'
          '  ${landmarks.length} landmarks found, adding to _landmarksController.sink ');
      _landmarksController.sink.add(landmarks);
      if (_geoFencer == null) {
        _geoFencer = GeoFencer(
            userType: Constants.USER_MARSHAL, geofencerListener: this);
      }
      for (var landmark in landmarks) {
        _geoFencer.addLandmarkGeoFence(landmark: landmark);
      }
      mp('🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 MarshalBloc: returning ${landmarks.length} landmarks ...');
      return landmarks;
    } catch (e) {
      print(e);
      _errors.add('findLandmarksByLocation failed: ${e.toString()}');
      _errorController.sink.add(_errors);
      //marshalBlocListener.onError('findLandmarksByLocation failed');
    }
  }

  Future<List<ar.Route>> getAssociationRoutes(
      {bool forceRefresh = false}) async {
    mp('🧩 🧩 🧩 getAssociationRoutes....._user.associationID: ${_user.associationID}');
    try {
      var mList = await LocalDBAPI.getRoutesByAssociation(_user.associationID);
      if (mList.isEmpty || forceRefresh) {
        mList = await DancerListAPI.getRoutesByAssociation(
            associationID: _user.associationID);
        mp('🧩 🧩 🧩 Cache routes in local DB .....');
        for (var r in mList) {
          await LocalDBAPI.addRoute(route: r);
        }
      }
      mp('🧩 🧩 🧩  ${mList.length} routes found');
      _routesController.sink.add(mList);
      return mList;
    } catch (e) {
      print(e);
      _errors.add('getAssociationRoutes failed: ${e.toString()}');
      _errorController.sink.add(_errors);
//      marshalBlocListener
//          .onError('getAssociationRoutes failed: ${e.toString()}');
    }

    return null;
  }

  Future updateCommuterRequestScanned(String commuterRequestID) async {
    final request = await DancerDataAPI.updateCommuterRequestScanned(
        commuterRequestID: commuterRequestID);

    print(
        '💙💙💙💙 updateCommuterRequestScanned: 🧩 🧩 🧩 updateCommuterRequestScanned added for 🔴 ${commuterRequestID} 🔴 🔴 ');
//    return null;
    return request;
  }

  Future<ar.Route> getRouteByID(String routeID) async {
    mp('🧩 🧩 🧩 getRouteByID.....RouteID: $routeID');
    try {
      var mRoute = await LocalDBAPI.getRoute(routeID: routeID);
      if (mRoute == null) {
        mRoute = await DancerListAPI.getRouteByID(routeID: routeID);
        mp('🧩 🧩 🧩 Cache route in local DB .....${mRoute.name}');
        await LocalDBAPI.addRoute(route: mRoute);
      }

      return mRoute;
    } catch (e) {
      print(e);
      _errorController.sink.add(_errors);
//      marshalBlocListener.onError('getRouteByID failed: ${e.toString()}');
    }

    return null;
  } //eagleworkshop@gmail.com 01019760657

  Future<List<Vehicle>> getAssociationVehicles(
      {bool forceRefresh = false}) async {
    mp('🦠 🦠 🦠 MarshalBloc: getAssociationVehicles ..... 🦠 🦠 🦠 forceRefresh: 🔵 🔵 🔵 $forceRefresh');
    if (_user == null) {
      _user = await Prefs.getUser();
    }
    if (user == null) {
      throw Exception('User not cached');
    }
    try {
      if (forceRefresh == true) {
        _vehicles = await DancerListAPI.getVehiclesByAssociation(
            associationID: _user.associationID);
        mp('🦠 🦠 🦠 MarshalBloc: Cache vehicles in local DB .....');
        await LocalDBAPI.addVehicles(vehicles: vehicles);
      } else {
        _vehicles = await LocalDBAPI.getAllVehicles();
        if ((vehicles.isEmpty)) {
          _vehicles = await DancerListAPI.getVehiclesByAssociation(
              associationID: _user.associationID);
        }
      }
      _vehicles.forEach((v) {
        if (v.assignments == null) {
          v.assignments = List();
        }
      });
      mp('🦠 🦠 🦠 🦠 🦠 🦠  ${_vehicles.length} ASSOCIATION vehicles found. put on stream: 🌸 _vehiclesController.sink 🦠🦠🦠');
      _vehiclesController.sink.add(_vehicles);
      return vehicles;
    } catch (e) {
      print(e);
      _errorController.sink.add(_errors);
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
    _commuterRequestsController.close();
    _vehicleArrivalDispatchedController.close();
    _vehicleLocationController.close();
    _routeDistanceEstimationController.close();
  }

  final FirebaseMessaging fcm = FirebaseMessaging();
  final Map<String, Landmark> landmarksSubscribedMap = Map();

  void _subscribeToArrivalsFCM(Landmark landmark) async {
    List<String> topics = List();
    topics
        .add('${Constants.COMMUTER_ARRIVAL_LANDMARKS}_${landmark.landmarkID}');
    topics.add('${Constants.VEHICLE_ARRIVALS}_${landmark.landmarkID}');
    topics
        .add('${Constants.ROUTE_DISTANCE_ESTIMATIONS}_${landmark.landmarkID}');
    topics
        .add('${Constants.COMMUTER_FENCE_DWELL_EVENTS}_${landmark.landmarkID}');
    topics
        .add('${Constants.COMMUTER_FENCE_EXIT_EVENTS}_${landmark.landmarkID}');
    topics.add('${Constants.COMMUTER_REQUESTS}_${landmark.landmarkID}');

    if (landmarksSubscribedMap.containsKey(landmark.landmarkID)) {
      mp('🍏 Landmark ${landmark.landmarkName} has already subscribed to FCM');
    } else {
      await _subscribe(topics, landmark);
      mp('MarshalBloc:: 🧩 Subscribed to ${topics.length} FCM topics'
          ' for landmark: 🍎 ${landmark.landmarkName} 🍎 ');
    }

    mp('MarshalBloc:... 💜 💜 Subscribed to FCM ${landmarksSubscribedMap.length} topics for '
        'landmark ✳️ ${_landmark == null ? 'unknown' : _landmark.landmarkName}\n');
  }

  _subscribe(List<String> topics, Landmark landmark) async {
    for (var t in topics) {
      await fcm.subscribeToTopic(t);
      mp('MarshalBloc: 💜 💜 Subscribed to FCM topic: 🍎  $t ✳️ at ${landmark.landmarkName}');
    }
    landmarksSubscribedMap[landmark.landmarkID] = landmark;
    return;
  }

  bool _listenerSetupAlready = false;

  Future _configureFCM() async {
    if (_listenerSetupAlready) {
      mp('MarshalBloc:FCM already configured, ignoring');
      return null;
    }
    mp('✳️ ✳️ ✳️ ✳️ MarshalBloc:_configureFCM: CONFIGURE FCM: ✳️ ✳️ ✳️ ✳️  ${_landmark == null ? '' : _landmark.landmarkName}');
    fcm.configure(
      onMessage: (Map<String, dynamic> message) async {
        String messageType = message['data']['type'];
        mp("\n\n️♻️♻️♻️️♻️♻️♻️  ✳️ ✳️ ✳️ ✳️ MarshalBloc:FCM onMessage messageType: 🍎 $messageType arrived 🍎 \n\n");
        switch (messageType) {
          case Constants.VEHICLE_ARRIVALS:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 VEHICLE_ARRIVALS arrived 🍎");
            _processVehicleArrival(message);
            break;
          case Constants.VEHICLE_DEPARTURES:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 VEHICLE_DEPARTURES arrived 🍎");
            _processVehicleDeparture(message);
            break;

          case Constants.COMMUTER_ARRIVALS:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_ARRIVALS arrived 🍎");
            _processCommuterArrivals(message);
            break;
          case Constants.COMMUTER_FENCE_DWELL_EVENTS:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_FENCE_DWELL_EVENTS arrived 🍎");
            _processCommuterFenceDwellEvent(message);
            break;
          case Constants.COMMUTER_FENCE_EXIT_EVENTS:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_FENCE_EXIT_EVENTS arrived 🍎");
            _processCommuterFenceExitEvent(message);
            break;
          case Constants.COMMUTER_REQUESTS:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 💛️💛️💛️💛️💛️ COMMUTER_REQUESTS 💛️  arrived, calling _processCommuterRequests 🍎");
            _processCommuterRequests(message);
            break;
          case Constants.ROUTE_DISTANCE_ESTIMATIONS:
            mp("✳️ ✳️ FCM onMessage messageType: 🍎 💛️💛️💛️💛️💛️ ROUTE_DISTANCE_ESTIMATIONS 💛️  arrived, calling _processCommuterRequests 🍎");
            _processRouteDistanceEstimations(message);
            break;
        }
      },
      onLaunch: (Map<String, dynamic> message) async {
        mp("️♻️♻️♻️️♻️♻️♻️ onLaunch:  🧩 triggered by FCM message: $message  🧩 ");
      },
      onResume: (Map<String, dynamic> message) async {
        mp("️♻️♻️♻️️♻️♻️♻️ App onResume  🧩 triggered by FCM message: $message  🧩 ");
      },
    );
    fcm.requestNotificationPermissions(
        const IosNotificationSettings(sound: true, badge: true, alert: true));
    fcm.onIosSettingsRegistered.listen((IosNotificationSettings settings) {
      mp("IosNotificationSettings Settings registered: $settings");
    });
    fcm.getToken().then((String token) {
      assert(token != null);
      mp('♻️♻️♻️️♻️♻️️ MarshalBloc:FCM token  ❤️ 🧡 💛️ $token ❤️ 🧡 💛');
    });
    _listenerSetupAlready = true;
    var mark = await Prefs.getLandmark();
    if (mark != null) {
      _subscribeToArrivalsFCM(mark);
    }
    return null;
  }

  void _processRouteDistanceEstimations(Map<String, dynamic> message) {
    var data = RouteDistanceEstimation.fromJson(message['data']);
    _routeDistanceEstimations.add(data);
    _routeDistanceEstimationController.sink.add(_routeDistanceEstimations);
//    if (marshalBlocListener != null) {
//      marshalBlocListener
//          .onRouteDistanceEstimationsArrived(_routeDistanceEstimations);
//    }
  }

  void _processCommuterFenceExitEvent(Map<String, dynamic> message) {
    var data = CommuterFenceExitEvent.fromJson(message['data']);
    _exitEvents.add(data);
    _commuterExitEventsController.sink.add(_exitEvents);
  }

  void _processCommuterFenceDwellEvent(Map<String, dynamic> message) {
    var data = CommuterFenceDwellEvent.fromJson(message['data']);
    _dwellEvents.add(data);
    _commuterDwellEventsController.sink.add(_dwellEvents);
  }

  void _processCommuterRequests(Map<String, dynamic> message) {
    mp('💜 💜 💜 💜  _processCommuterRequests ... 🥬🥬🥬🥬🥬');
    try {
      var data = CommuterRequest.fromJson(message['data']);
      _commuterRequests.add(data);
      mp('MarshalBoc: ❤️ 🧡 💛️ commuter request added to _commuterRequests: ❤️ '
          '${_commuterRequests.length} 💛️ 💛️  ${data.fromLandmarkName} 💛️ 💛️ ');
      _commuterRequestsController.sink.add(_commuterRequests);
    } catch (e) {
      mp('😈😈😈😈_processCommuterRequests fell down: ${e.toString()}');
      print(e);
    }
  }

  void _processVehicleArrival(Map<String, dynamic> message) async {
    var data = VehicleArrival.fromJson(message['data']);
    _vehicleArrivals.add(data);
    p('🅿️  🅿️ 🅿️  🅿️ MarshalBloc: Adding vehicle arrival from fcm message: stream has ${_vehicleArrivals.length}');
    _removeVehiclesDispatchedWithinLastHour();
  }

  Future<int> getMinutesForQuery() async {
    await DotEnv().load('.env');
    var min = DotEnv().env['minutesForQuery'];
    if (min == null) {
      min = '5';
    }
    int minutes = int.parse(min);
    return minutes;
  }

  Future _removeVehiclesDispatchedWithinLastHour() async {
    mp('MarshalBloc: _removeVehiclesDispatchedWithinLastHour: getDispatchRecordsFromLastHour .... 🧩 🧩 🧩 🧩 🧩 ... ');
    List<DispatchRecord> mList =
        await LocalDBAPI.getDispatchRecordsFromLastHour();
    mp('MarshalBloc: _removeVehiclesDispatchedWithinLastHour .... 🧩 🧩 🧩 🧩 🧩 processed: ${mList.length}');
    Map<String, VehicleArrival> tempVehicles = Map();
    _vehicleArrivals.forEach((arr) {
      var isFound = false;
      mList.forEach((dispatchRecord) {
        if (dispatchRecord.vehicleReg == arr.vehicleReg) {
          isFound = true;
        }
      });

      if (!isFound) {
        tempVehicles['${arr.vehicleID}'] = arr;
      }
    });
    mp(' 🅿️ 🅿️ 🅿️ 🅿️ vehicles NOT dispatched within the last hour: ${tempVehicles.length}. 🍎 🍎 THIS SHOULD BE THE LIST ????');

    _vehicleArrivals.clear();
    _vehicleArrivals = tempVehicles.values.toList();
    mp(' 🅿️ 🅿️ 🅿️ 🅿️ vehicles NOT dispatched within the last hour: ${_vehicleArrivals.length}. 🍎 🍎 THIS IS THE LIST going to the stream');
    _vehicleArrivalsController.sink.add(_vehicleArrivals);
    return _vehicleArrivals;
  }

  void _processVehicleDeparture(Map<String, dynamic> message) async {
    var data = VehicleDeparture.fromJson(message['data']);
    _vehicleDepartures.add(data);
    _vehicleDeparturesController.sink.add(_vehicleDepartures);
  }

  void _processCommuterArrivals(Map<String, dynamic> message) async {
    var data = CommuterArrivalLandmark.fromJson(message['data']);
    _commuterArrivals.add(data);
    _commuterArrivalsController.sink.add(_commuterArrivals);
  }

  final Map<String, Landmark> landmarksSubscribed = Map();
  static const MAX_NUMBER_GEOFENCES = 30;

//  MarshalBlocListener marshalBlocListener;
  MarshalBloc(MarshalBlocListener listener) {
    //marshalBlocListener = listener;
    _init();
  }

  Future addVehicleRouteAssignment(VehicleRouteAssignment assignment) async {
    await DancerDataAPI.addVehicleRouteAssignment(assignment: assignment);
  }

  @override
  onError(String message) {
    // TODO: implement onError
    throw UnimplementedError();
  }

  @override
  onLandmarkDwell(Landmark landmark) {
    // TODO: implement onLandmarkDwell
    throw UnimplementedError();
  }

  @override
  onHeartbeat(Location location) {
    // TODO: implement onHeartbeat
    throw UnimplementedError();
  }
}

abstract class MarshalBlocListener {
  onRouteDistanceEstimationsArrived(
      List<RouteDistanceEstimation> routeDistanceEstimations);
  onError(String message);
}
