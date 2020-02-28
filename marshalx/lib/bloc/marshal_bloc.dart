import 'dart:async';
import 'dart:io';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/dancer/dancer_data_api.dart';
import 'package:aftarobotlibrary4/dancer/dancer_list_api.dart';
import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/commuterdeparturedto.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicle_departure.dart';
import 'package:aftarobotlibrary4/data/vehicle_location.dart';
import 'package:aftarobotlibrary4/data/vehicle_route_assignment.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/geofencing/geofencer.dart';
import 'package:aftarobotlibrary4/geofencing/locator.dart';
import 'package:aftarobotlibrary4/maps/estimator_bloc.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/settings.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

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

  FirebaseAuth _auth = FirebaseAuth.instance;
  User _user;
  User get user => _user;
  Landmark _landmark;
  Landmark get marshalLandmark => _landmark;
  List<RouteDistanceEstimation> _routeDistanceEstimations = List();
  List<VehicleArrival> _vehicleArrivals = List();
  List<CommuterFenceDwellEvent> _dwellEvents = List();
  List<VehicleDeparture> _vehicleDepartures = List();
  List<CommuterFenceExitEvent> _exitEvents = List();
  List<CommuterArrivalLandmark> _commuterArrivals = List();
  List<Vehicle> _vehicles = List();
  List<CommuterRequest> _commuterRequests = List();
  GeoFencer _geoFencer;

  _init() async {
    findLandmarksByLocation(
        radiusInKM: Constants.settings.vehicleGeoQueryRadius);
    var fbUser = await _auth.currentUser();
    if (fbUser == null) {
      myDebugPrint(
          '🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  Firebase fbUser is null.  👺  need to 🔑 🔑 🔑');
      return;
    }
    await DotEnv().load('.env');
    String status = DotEnv().env['status'];
    var devURL = DotEnv().env['devURL'];
    var prodURL = DotEnv().env['prodURL'];
    myDebugPrint(
        'App status: 🔑 $status devURL: 🔑 $devURL prodURL: 🔑 $prodURL');
    _user = await Prefs.getUser();
    if (_user == null) {
      myDebugPrint(
          '🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  AftaRobot User is null.  👺  need to be created by portal 🔑 🔑 🔑');
      _errors.add('AftaRobot user not found');
      _errorController.sink.add(_errors);
      return;
    }
    _configureFCM();
    _geoFencer = GeoFencer(Constants.USER_MARSHAL, geofencerListener: this);
    _geoFencer.findLandmarksByLocation();
  }

  Future initializeData() async {
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 initializeData: Loading data into streams ....');
    _busies.add(true);
    _busyController.sink.add(_busies);
    LocalDBAPI.setAppID();
    _user = await Prefs.getUser();
    _landmark = await Prefs.getLandmark();

    await getAssociationVehicles(forceRefresh: true);
    await findLandmarksByLocation();
    await getAssociationRoutes(forceRefresh: true);
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 initializeData:  🔴 🔴 DONE Loading data into streams');
    _busies.add(false);
    _busyController.sink.add(_busies);
  }

  Future refreshDashboardData(bool forceRefresh) async {
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 refreshDashboardData: Loading data into streams ...');

    _busies.add(true);
    _busyController.sink.add(_busies);
    _landmark = await Prefs.getLandmark();
    await getAssociationVehicles(forceRefresh: forceRefresh);
    await findLandmarksByLocation(
        radiusInKM: Constants.settings.vehicleGeoQueryRadius);
    await getCommuterRequests();
    await getCommuterFenceDwellEvents();
    await getVehicleArrivals();
    await getAssociationRoutes(forceRefresh: forceRefresh);
    _busies.add(false);
    _busyController.sink.add(_busies);
    myDebugPrint(
        '🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 refreshDashboardData:  🔴 🔴 DONE Loading data into streams');
  }

  Future refreshMarshalLandmark(Landmark landmark) async {
    myDebugPrint(
        '\n💙  💙  💙  💙  💙  💙  💙 refreshMarshalLandmark ..... ${landmark.landmarkName}');
    await Prefs.saveLandmark(landmark);
    refreshDashboardData(false);
    findLandmarksByLocation(radiusInKM: Constants.RADIUS_LANDMARK_SEARCH);
    return null;
  }

  List<VehicleLocation> _vehicleLocations = List();

  Future<List<VehicleLocation>> findVehiclesByLocation(
      {int minutes, double radiusInKM}) async {
    myDebugPrint('💙 💙 💙 💙 💙 💙 💙 findVehiclesByLocation .....');
    _busies.add(true);
    _busyController.sink.add(_busies);
    var loc = await LocationUtil.getCurrentLocation();
    if (loc == null) {
      throw Exception('Location cannot be calculated');
    }

    _vehicleLocations = await DancerListAPI.findVehiclesByLocation(
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        radiusInKM: radiusInKM == null
            ? SettingsModel().vehicleGeoQueryRadius
            : radiusInKM,
        minutes: minutes == null ? 5 : minutes);
    myDebugPrint('💙 💙 💙 💙 💙 💙 💙  findVehiclesByLocation ..... '
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
    myDebugPrint(
        '💙 💙 💙 💙 💙 💙 💙  findVehiclesByLocation ..... found & filtered by association:  '
        '🔴 🔴 ${_vehicleLocations.length} UNIQUE vehicles 🍎 🍎  after filtering');
    _busies.add(false);
    _busyController.sink.add(_busies);
    return _vehicleLocations;
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

  List<VehicleArrival> vehicleArrivals;
  Future<List<VehicleArrival>> getVehicleArrivals(
      {String landmarkID, int minutes = 5}) async {
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
      vehicleArrivals = await DancerListAPI.getVehicleArrivalsByLandmark(
          landmarkID: markID, minutes: minutes);
      myDebugPrint(
          " 🌸  🌸  🌸  ${vehicleArrivals.length} vehicle arrivals found within  🌸 15 minutes");
      _vehicleArrivalsController.sink.add(vehicleArrivals);
    } catch (e) {
      dealWithError(e);
    }
    return vehicleArrivals;
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
    myDebugPrint(
        " 🌸  🌸  🌸  ${vehicleArrival.vehicleReg} removed from arrivals. 🌺 updating stream");
    _vehicleArrivalsController.sink.add(vehicleArrivals);
    _vehicleArrivalDispatchedController.sink.add(vehicleArrival);
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
      myDebugPrint(
          " 🌸  🌸  🌸  ${commuterRequests.length} getCommuterRequests found within  🌸 30 minutes");
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
      myDebugPrint('Call has 🔆 🔆 🔆 timed out 🔆 🔆 🔆');
      _errors.add('Network TimeOut');
      _errorController.sink.add(_errors);
      marshalBlocListener.onError("Network Timeout");
    }
    if (e is SocketException) {
      myDebugPrint(
          'Call has run into  🔴  🔴  🔴 SocketException  🔴  🔴  🔴 ');
      _errors.add('Network SocketException');
      _errorController.sink.add(_errors);
      marshalBlocListener.onError("Network SocketException");
    }
    _errors.add(e == null ? 'Unknown Network Error' : e.message);
    _errorController.sink.add(_errors);
    marshalBlocListener
        .onError(e == null ? 'Unknown Network Error' : e.message);
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
      myDebugPrint(
          " 👽  👽  👽  👽  ${commuterFenceDwellEvents.length} getCommuterFenceDwellEvents found within  👽 15 minutes");
      _commuterDwellEventsController.sink.add(commuterFenceDwellEvents);
    } catch (e) {
      dealWithError(e);
    }
    return commuterFenceDwellEvents;
  }

  List<Landmark> landmarks;
  Future<List<Landmark>> findLandmarksByLocation(
      {bool forceRefresh = false, double radiusInKM}) async {
    myDebugPrint('🌸 🌸 findLandmarksByLocation.....');
    try {
      var loc = await LocationUtil.getCurrentLocation();
      landmarks = await LocalDBAPI.findLandmarksByLocation(
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          radiusInKM:
              radiusInKM != null ? radiusInKM : Constants.GEO_QUERY_RADIUS);
      if (landmarks.isEmpty || forceRefresh) {
        landmarks = await DancerListAPI.findLandmarksByLocation(
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            radiusInKM: SettingsModel().vehicleGeoQueryRadius);
        myDebugPrint('🌸 🌸 Cache landmarks in local DB .....');
        await LocalDBAPI.addLandmarks(landmarks: landmarks);
      }

      myDebugPrint(
          '🌸 🌸  ${landmarks.length} landmarks found, adding to _landmarksController.sink ');
      _landmarksController.sink.add(landmarks);
      for (var landmark in landmarks) {
        _geoFencer.addLandmarkGeoFence(landmark);
      }
      return landmarks;
    } catch (e) {
      print(e);
      _errors.add('findLandmarksByLocation failed: ${e.toString()}');
      _errorController.sink.add(_errors);
      marshalBlocListener.onError('findLandmarksByLocation failed');
    }

    return null;
  }

  Future<List<ar.Route>> getAssociationRoutes(
      {bool forceRefresh = false}) async {
    myDebugPrint(
        '🧩 🧩 🧩 getAssociationRoutes....._user.associationID: ${_user.associationID}');
    try {
      var mList = await LocalDBAPI.getRoutesByAssociation(_user.associationID);
      if (mList.isEmpty || forceRefresh) {
        mList = await DancerListAPI.getRoutesByAssociation(
            associationID: _user.associationID);
        myDebugPrint('🧩 🧩 🧩 Cache routes in local DB .....');
        for (var r in mList) {
          await LocalDBAPI.addRoute(route: r);
        }
      }
      myDebugPrint('🧩 🧩 🧩  ${mList.length} routes found');
      _routesController.sink.add(mList);
      return mList;
    } catch (e) {
      print(e);
      _errors.add('getAssociationRoutes failed: ${e.toString()}');
      _errorController.sink.add(_errors);
      marshalBlocListener
          .onError('getAssociationRoutes failed: ${e.toString()}');
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
    myDebugPrint('🧩 🧩 🧩 getRouteByID.....RouteID: $routeID');
    try {
      var mRoute = await LocalDBAPI.getRoute(routeID: routeID);
      if (mRoute == null) {
        mRoute = await DancerListAPI.getRouteByID(routeID: routeID);
        myDebugPrint('🧩 🧩 🧩 Cache route in local DB .....${mRoute.name}');
        await LocalDBAPI.addRoute(route: mRoute);
      }

      return mRoute;
    } catch (e) {
      print(e);
      _errorController.sink.add(_errors);
      marshalBlocListener.onError('getRouteByID failed: ${e.toString()}');
    }

    return null;
  } //eagleworkshop@gmail.com 01019760657

  List<Vehicle> vehicles;
  Future<List<Vehicle>> getAssociationVehicles(
      {bool forceRefresh = false}) async {
    myDebugPrint(
        '🦠 🦠 🦠 getAssociationVehicles....._user.associationID: ${_user.associationID}');
    try {
      vehicles = await LocalDBAPI.getVehiclesByAssociation(_user.associationID);
      if (vehicles.isEmpty || forceRefresh) {
        vehicles = await DancerListAPI.getVehiclesByAssociation(
            associationID: _user.associationID);
        myDebugPrint('🦠 🦠 🦠 Cache vehicles in local DB .....');
        await LocalDBAPI.addVehicles(vehicles: vehicles);
      }
      myDebugPrint(
          '🦠 🦠 🦠  ${vehicles.length} vehicles found. put on stream: 🌸 _vehiclesController.sink');
      _vehiclesController.sink.add(vehicles);
      return vehicles;
    } catch (e) {
      print(e);
      _errorController.sink.add(_errors);
      marshalBlocListener
          .onError('getAssociationVehicles failed: ${e.toString()}');
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
      myDebugPrint(
          '🍏 Landmark ${landmark.landmarkName} has already subscribed to FCM');
    } else {
      await _subscribe(topics, landmark);
      myDebugPrint('MarshalBloc:: 🧩 Subscribed to ${topics.length} FCM topics'
          ' for landmark: 🍎 ${landmark.landmarkName} 🍎 ');
    }

    myDebugPrint(
        'MarshalBloc:... 💜 💜 Subscribed to FCM ${landmarksSubscribedMap.length} topics for '
        'landmark ✳️ ${_landmark == null ? 'unknown' : _landmark.landmarkName}\n');
  }

  _subscribe(List<String> topics, Landmark landmark) async {
    for (var t in topics) {
      await fcm.subscribeToTopic(t);
      myDebugPrint(
          'MarshalBloc: 💜 💜 Subscribed to FCM topic: 🍎  $t ✳️ at ${landmark.landmarkName}');
    }
    landmarksSubscribedMap[landmark.landmarkID] = landmark;
    return;
  }

  bool _listenerSetupAlready = false;

  Future _configureFCM() async {
    if (_listenerSetupAlready) {
      myDebugPrint('MarshalBloc:FCM already configured, ignoring');
      return null;
    }
    myDebugPrint(
        '✳️ ✳️ ✳️ ✳️ MarshalBloc:_configureFCM: CONFIGURE FCM: ✳️ ✳️ ✳️ ✳️  ${_landmark == null ? '' : _landmark.landmarkName}');
    fcm.configure(
      onMessage: (Map<String, dynamic> message) async {
        String messageType = message['data']['type'];
        myDebugPrint(
            "\n\n️♻️♻️♻️️♻️♻️♻️  ✳️ ✳️ ✳️ ✳️ MarshalBloc:FCM onMessage messageType: 🍎 $messageType arrived 🍎 \n\n");
        switch (messageType) {
          case Constants.VEHICLE_ARRIVALS:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 VEHICLE_ARRIVALS arrived 🍎");
            _processVehicleArrival(message);
            break;
          case Constants.VEHICLE_DEPARTURES:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 VEHICLE_DEPARTURES arrived 🍎");
            _processVehicleDeparture(message);
            break;

          case Constants.COMMUTER_ARRIVALS:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_ARRIVALS arrived 🍎");
            _processCommuterArrivals(message);
            break;
          case Constants.COMMUTER_FENCE_DWELL_EVENTS:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_FENCE_DWELL_EVENTS arrived 🍎");
            _processCommuterFenceDwellEvent(message);
            break;
          case Constants.COMMUTER_FENCE_EXIT_EVENTS:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_FENCE_EXIT_EVENTS arrived 🍎");
            _processCommuterFenceExitEvent(message);
            break;
          case Constants.COMMUTER_REQUESTS:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 💛️💛️💛️💛️💛️ COMMUTER_REQUESTS 💛️  arrived, calling _processCommuterRequests 🍎");
            _processCommuterRequests(message);
            break;
          case Constants.ROUTE_DISTANCE_ESTIMATIONS:
            myDebugPrint(
                "✳️ ✳️ FCM onMessage messageType: 🍎 💛️💛️💛️💛️💛️ ROUTE_DISTANCE_ESTIMATIONS 💛️  arrived, calling _processCommuterRequests 🍎");
            _processRouteDistanceEstimations(message);
            break;
        }
      },
      onLaunch: (Map<String, dynamic> message) async {
        myDebugPrint(
            "️♻️♻️♻️️♻️♻️♻️ onLaunch:  🧩 triggered by FCM message: $message  🧩 ");
      },
      onResume: (Map<String, dynamic> message) async {
        myDebugPrint(
            "️♻️♻️♻️️♻️♻️♻️ App onResume  🧩 triggered by FCM message: $message  🧩 ");
      },
    );
    fcm.requestNotificationPermissions(
        const IosNotificationSettings(sound: true, badge: true, alert: true));
    fcm.onIosSettingsRegistered.listen((IosNotificationSettings settings) {
      myDebugPrint("IosNotificationSettings Settings registered: $settings");
    });
    fcm.getToken().then((String token) {
      assert(token != null);
      myDebugPrint(
          '♻️♻️♻️️♻️♻️️ MarshalBloc:FCM token  ❤️ 🧡 💛️ $token ❤️ 🧡 💛');
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
    if (marshalBlocListener != null) {
      marshalBlocListener
          .onRouteDistanceEstimationsArrived(_routeDistanceEstimations);
    }
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
    myDebugPrint('💜 💜 💜 💜  _processCommuterRequests ... 🥬🥬🥬🥬🥬');
    try {
      var data = CommuterRequest.fromJson(message['data']);
      _commuterRequests.add(data);
      myDebugPrint(
          'MarshalBoc: ❤️ 🧡 💛️ commuter request added to _commuterRequests: ❤️ '
          '${_commuterRequests.length} 💛️ 💛️  ${data.fromLandmarkName} 💛️ 💛️ ');
      _commuterRequestsController.sink.add(_commuterRequests);
    } catch (e) {
      myDebugPrint(
          '😈😈😈😈_processCommuterRequests fell down: ${e.toString()}');
      print(e);
    }
  }

  void _processVehicleArrival(Map<String, dynamic> message) async {
    var data = VehicleArrival.fromJson(message['data']);
    _vehicleArrivals.add(data);
    _vehicleArrivalsController.sink.add(_vehicleArrivals);
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

  MarshalBlocListener marshalBlocListener;
  MarshalBloc(MarshalBlocListener listener) {
    marshalBlocListener = listener;
    _init();
  }

  Future addVehicleRouteAssignment(VehicleRouteAssignment assignment) async {
    await DancerDataAPI.addVehicleRouteAssignment(assignment: assignment);
  }

  @override
  onCommuterArrival(CommuterArrivalLandmark arrival) {
    // TODO: implement onCommuterArrival
    return null;
  }

  @override
  onCommuterDeparture(CommuterDeparture departure) {
    // TODO: implement onCommuterDeparture
    return null;
  }

  @override
  onConnectivityChange(bool connected) {
    // TODO: implement onConnectivityChange
    return null;
  }

  @override
  onDwell(List<Landmark> landmarks) {
    // TODO: implement onDwell
    return null;
  }

  @override
  onDynamicDistanceCalculated(List<RouteDistanceEstimation> estimations) {
    if (marshalBlocListener != null) {
      marshalBlocListener.onRouteDistanceEstimationsArrived(estimations);
    }
  }

  @override
  onHeartbeat(List<Landmark> landmarks) {
    // TODO: implement onHeartbeat
    return null;
  }

  @override
  onInVehicle(Location location) {
    // TODO: implement onInVehicle
    return null;
  }

  @override
  onLandmarksFound(List<Landmark> landmarks) {
    // TODO: implement onLandmarksFound
    return null;
  }

  @override
  onMoving(Location location) {
    // TODO: implement onMoving
    return null;
  }

  @override
  onStandingStill(Location location) {
    // TODO: implement onStandingStill
    return null;
  }

  @override
  onVehicleArrival(VehicleArrival arrival) {
    // TODO: implement onVehicleArrival
    return null;
  }

  @override
  onVehicleDeparture(VehicleDeparture departure) {
    // TODO: implement onVehicleDeparture
    return null;
  }
}

abstract class MarshalBlocListener {
  onRouteDistanceEstimationsArrived(
      List<RouteDistanceEstimation> routeDistanceEstimations);
  onError(String message);
}
