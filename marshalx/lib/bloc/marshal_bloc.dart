import 'dart:async';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/dancer/dancer_list_api.dart';
import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicle_departure.dart';
import 'package:aftarobotlibrary4/data/vehicle_location.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/geofencing/locator.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

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
  StreamController<List<CommuterRequest>> _commuterRequestsController =
      StreamController.broadcast();
  StreamController<List<CommuterFenceDwellEvent>> _dwellController =
      StreamController.broadcast();
  StreamController<List<CommuterFenceExitEvent>> _exitController =
      StreamController.broadcast();
  StreamController<List<Landmark>> _landmarksController =
      StreamController.broadcast();
  StreamController<List<Vehicle>> _vehiclesController =
      StreamController.broadcast();

  StreamController<String> _errorController = StreamController.broadcast();
  StreamController<bool> _busyController = StreamController.broadcast();
  StreamController<List<VehicleLocation>> _vehicleLocationController =
      StreamController.broadcast();
  Stream<List<CommuterRequest>> get commuterRequestStream =>
      _commuterRequestsController.stream;
  Stream<bool> get busyStream => _busyController.stream;
  Stream<String> get errorStream => _errorController.stream;
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

  FirebaseAuth _auth = FirebaseAuth.instance;
  User _user;
  User get user => _user;
  Landmark _landmark;
  Landmark get marshalLandmark => _landmark;
  List<VehicleArrival> _vehicleArrivals = List();
  List<CommuterFenceDwellEvent> _dwellEvents = List();
  List<VehicleDeparture> _vehicleDepartures = List();
  List<CommuterFenceExitEvent> _exitEvents = List();
  List<CommuterArrivalLandmark> _commuterArrivals = List();
  List<Vehicle> _vehicles = List();
  List<CommuterRequest> _commuterRequests = List();

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
    _landmark = await Prefs.getLandmark();
    if (_landmark != null) {
      prettyPrint(
          _landmark.toJson(), '🧩 🧩 🧩 CURRENT MARSHAL LANDMARK 🧩 🧩 🧩 ');
      subscribeToArrivalsFCM(_landmark);
    }
  }

  Future initializeData() async {
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 initializeData: Loading data into streams ....');
    _busyController.sink.add(true);
    LocalDBAPI.setAppID();
    _user = await Prefs.getUser();
    _landmark = await Prefs.getLandmark();

    await getAssociationRoutes();
    await getAssociationVehicles();
    await findLandmarksByLocation();
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 initializeData:  🔴 🔴 DONE Loading data into streams');
    _busyController.sink.add(false);
  }

  Future refreshDashboardData() async {
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 refreshDashboardData: Loading data into streams ...');
    _busyController.sink.add(true);
    _landmark = await Prefs.getLandmark();
    await getAssociationVehicles();
    await findLandmarksByLocation(radiusInKM: Constants.GEO_QUERY_RADIUS);
    await getCommuterRequests();
    await getCommuterFenceDwellEvents();
    await getVehicleArrivals();
    _busyController.sink.add(false);
    myDebugPrint(
        '\n\n 🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬  🥬 refreshDashboardData:  🔴 🔴 DONE Loading data into streams');
  }

  Future refreshMarshalLandmark(Landmark landmark) async {
    myDebugPrint(
        '\n\n💙  💙  💙  💙  💙  💙  💙 refreshMarshalLandmark ..... ${landmark.landmarkName}');
    await Prefs.saveLandmark(landmark);
    refreshDashboardData();
    return null;
  }

  List<VehicleLocation> _vehicleLocations = List();

  Future<List<VehicleLocation>> findVehiclesByLocation() async {
    myDebugPrint('\n\n💙  💙  💙  💙  💙  💙  💙 findVehiclesByLocation .....');
    _busyController.sink.add(true);
    var loc = await LocationUtil.getCurrentLocation();
    _vehicleLocations = await DancerListAPI.findVehiclesByLocation(
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        radiusInKM: Constants.GEO_QUERY_RADIUS,
        minutes: 5);
    //remove duplicate vehicles
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
        '💙  💙  💙  💙  💙  💙  💙 findVehiclesByLocation ..... found  🔴 🔴 ${_vehicleLocations.length} vehicles');
    _busyController.sink.add(false);
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
  Future<List<VehicleArrival>> getVehicleArrivals({String landmarkID}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        throw Exception('landmarkID not found for query');
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    vehicleArrivals = await DancerListAPI.getVehicleArrivalsByLandmark(
        landmarkID: markID, minutes: 15);
    myDebugPrint(
        " 🌸  🌸  🌸  ${vehicleArrivals.length} vehicle arrivals found within  🌸 15 minutes");
    _vehicleArrivalsController.sink.add(vehicleArrivals);
    return vehicleArrivals;
  }

  List<CommuterRequest> commuterRequests;
  Future<List<CommuterRequest>> getCommuterRequests({String landmarkID}) async {
    var markID;
    if (landmarkID == null) {
      var mark = await Prefs.getLandmark();
      if (mark == null) {
        throw Exception('landmarkID not found for query');
      }
      markID = mark.landmarkID;
    } else {
      markID = landmarkID;
    }
    commuterRequests = await DancerListAPI.getCommuterRequests(
        landmarkID: markID, minutes: 15);
    myDebugPrint(
        " 🌸  🌸  🌸  ${commuterRequests.length} getCommuterRequests found within  🌸 15 minutes");
    _commuterRequestsController.sink.add(commuterRequests);
    return commuterRequests;
  }

  List<CommuterFenceDwellEvent> commuterFenceDwellEvents;
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
    commuterFenceDwellEvents = await DancerListAPI.getCommuterFenceDwellEvents(
        landmarkID: markID, minutes: 15);
    myDebugPrint(
        " 👽  👽  👽  👽  ${commuterFenceDwellEvents.length} getCommuterFenceDwellEvents found within  👽 15 minutes");
    _commuterDwellEventsController.sink.add(commuterFenceDwellEvents);
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
            radiusInKM: Constants.GEO_QUERY_RADIUS);
        myDebugPrint('🌸 🌸 Cache landmarks in local DB .....');
        await LocalDBAPI.addLandmarks(landmarks: landmarks);
      }
      myDebugPrint(
          '🌸 🌸  ${landmarks.length} landmarks found, adding to _landmarksController.sink ');
      _landmarksController.sink.add(landmarks);
      return landmarks;
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
      _errorController.sink.add('getRouteByID failed: ${e.toString()}');
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

  final FirebaseMessaging fcm = FirebaseMessaging();
  final Map<String, Landmark> landmarksSubscribedMap = Map();

  void subscribeToArrivalsFCM(Landmark landmark) async {
    await _configureFCM();
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
      myDebugPrint(
          'MarshalBloc:: 🧩 🧩 🧩 ... Subscribed to ${topics.length} FCM topics'
          ' for landmark: 🍎 ${landmark.landmarkName} 🍎 ');
    }

    myDebugPrint('MarshalBloc:... 💜 💜 Subscribed to FCM topics for '
        '${landmarksSubscribedMap.length} landmark ✳️ ${_landmark == null ? '' : _landmark.landmarkName}\n');
  }

  _subscribe(List<String> topics, Landmark landmark) async {
    for (var t in topics) {
      await fcm.subscribeToTopic(t);
      myDebugPrint('MarshalBloc:... 💜 💜 Subscribed to FCM topic:🍎  $t ✳️ ');
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
        '✳️ ✳️ ✳️ ✳️ MarshalBloc:listenForArrivals: CONFIGURE FCM: ✳️ ✳️ ✳️ ✳️  ${_landmark == null ? '' : _landmark.landmarkName}');
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
                "✳️ ✳️ FCM onMessage messageType: 🍎 COMMUTER_REQUESTS arrived 🍎");
            _processCommuterRequests(message);
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
          '♻️♻️♻️️♻️♻️♻️ MarshalBloc:FCM token  ❤️ 🧡 💛️ $token ❤️ 🧡 💛');
    });
    _listenerSetupAlready = true;
    return null;
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
    var data = CommuterRequest.fromJson(message['data']);
    _commuterRequests.add(data);
    _commuterRequestsController.sink.add(_commuterRequests);
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

  MarshalBloc() {
    _init();
  }
}
