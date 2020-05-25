import 'package:aftarobotlibrary4/api/fare_bloc.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/cards.dart';
import 'package:aftarobotlibrary4/maps/estimator_bloc.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/scanner.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';
import 'package:marshalx/ui/confirm_landmark.dart';
import 'package:marshalx/ui/select_dispatch.dart';
import 'package:marshalx/ui/wifi.dart';
import 'package:page_transition/page_transition.dart';

import 'find_vehicles.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard>
    implements ScannerListener, MarshalBlocListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  bool isBusy = false;
  MarshalBloc marshalBloc;
  User user;
  Landmark landmark;
  List<Vehicle> _vehicles = List();
  List<VehicleArrival> vehicleArrivals = List();
  List<CommuterRequest> commuterRequests = List();
  List<CommuterArrivalLandmark> commuterArrivals = List();
  List<CommuterFenceDwellEvent> commuterFenceDwellEvents = List();
  List<Landmark> landmarks = List();

  @override
  void initState() {
    super.initState();
    myDebugPrint('💜 💜 💜 💜  subscribing to streams ...');
    marshalBloc = MarshalBloc(this);
    _subscribeToBusy();
    _subscribeToError();
    _listenToDataStreams();
    _checkUser();
//    _testFareGeneration();
  }

  void _testFareGeneration() async {
    var user = await Prefs.getUser();
    if (user != null) {
      FareBloc.createTestFares(user.associationID, user.associationName);
    }
  }

  void _checkMarshalLandmark() async {}

  void _checkUser() async {
    bool isSignedIn = await marshalBloc.checkUserLoggedIn();
    print(
        '🍎 🍎 🍎 _DashboardState: checkUser: is user signed in? 🔆🔆 isSignedIn: $isSignedIn  🔆🔆');
    if (!isSignedIn) {
      try {
        bool isOK = await Navigator.push(
            context,
            PageTransition(
                type: PageTransitionType.leftToRightWithFade, child: SignIn()));

        if (!isOK) {
          AppSnackbar.showSnackbar(
              scaffoldKey: _key,
              message: 'You have not signed in',
              textColor: Colors.amber,
              backgroundColor: Colors.pink[600]);
          return;
        }
        marshalBloc.refreshDashboardData(forceRefresh: true);
      } catch (e) {
        AppSnackbar.showSnackbar(
            scaffoldKey: _key,
            message: 'Problem signing in',
            textColor: Colors.amber,
            backgroundColor: Colors.pink[600]);
      }
    } else {
      myDebugPrint('💜 💜 💜  calling marshalBloc.refreshDashboardData...');
      await marshalBloc.refreshDashboardData(forceRefresh: false);
    }
    user = await Prefs.getUser();
    myDebugPrint('💜 💜 💜 💜  getting marshals cached Landmark ...');
    landmark = await Prefs.getLandmark();
    if (landmark == null) {
      myDebugPrint('💜 💜 💜 💜  starting marshals Landmark selection ...');
      landmark = await Navigator.push(
          context,
          PageTransition(
              type: PageTransitionType.downToUp, child: ConfirmLandmark()));
      if (landmark != null) {
        debugPrint(
            '💜 💜 💜 💜  marshal landmark is ${landmark.landmarkName} 💜 💜 💜 💜 ');
        setState(() {});
      }
    }
  }

  void _subscribeToBusy() {
    marshalBloc.busyStream.listen((busy) {
      myDebugPrint(
          '💙 💙 💙 _DashboardState: Received busy: $busy : will setState');
      setState(() {
        isBusy = busy.last;
      });
    });
  }

  String _errorMessage;
  bool hasAlreadyShownWifi = false;
  void _subscribeToError() {
    hasAlreadyShownWifi = false;
    marshalBloc.errorStream.listen((message) {
      myDebugPrint(
          '💙 💙 💙 _DashboardState: Received ERROR: 🔴  🔴  🔴 $message : will setState');
      setState(() {
        _errorMessage = message.last;
        isBusy = false;
      });
//      if (hasAlreadyShownWifi) {
//        myDebugPrint(
//            'ignoring this ....................hasAlreadyShownWifi: $hasAlreadyShownWifi');
//      } else {
//        Navigator.push(context, SlideRightRoute(widget: WifiError()));
//        hasAlreadyShownWifi = true;
//      }
    });
  }

  void _listenToDataStreams() {
    myDebugPrint(
        '💜 💜 💜 💜 Dashboard: _listenToDataStreams 💜 💜 💜 💜 _listenToDataStreams 💜 💜 💜 💜');
    marshalBloc.vehicleStream.listen((cars) {
      myDebugPrint(
          '💜 💜 💜 💜 Dashboard: _listenToDataStreams: 👌👌 Received vehicles: 🦠 ${cars.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        _vehicles = cars;
      });
    });
    marshalBloc.landmarkStream.listen((marks) {
      myDebugPrint(
          '💜 💜 💜 💜 Dashboard: _listenToDataStreams: 👌👌 Received landmarks: 🦠 ${marks.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        landmarks = marks;
      });
    });
    try {
      marshalBloc.vehicleArrivalStream.listen((arrivals) {
        myDebugPrint(
            '💜 💜 💜 💜 Dashboard: _listenToDataStreams: 👌👌 Received vehicleArrivals: 🦠 ${arrivals.length} 🦠 💜 💜 💜 💜 ');
        setState(() {
          vehicleArrivals = arrivals;
        });
      });
    } catch (e, s) {
      print(s);
    }
    marshalBloc.commuterDwellStream.listen((dwells) {
      myDebugPrint(
          '💜 💜 💜 💜 Dashboard: _listenToDataStreams: 👌👌 Received commuterDwells: 🦠 ${dwells.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        commuterFenceDwellEvents = dwells;
      });
    });
    marshalBloc.commuterArrivalsStream.listen((marks) {
      myDebugPrint(
          '💜 💜 💜 💜 Dashboard: _listenToDataStreams: 👌👌 Received commuterArrivals: 🦠 ${marks.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        commuterArrivals = marks;
      });
    });
    marshalBloc.commuterRequestStream.listen((requests) {
      myDebugPrint(
          '💜 💜 💜 💜 Dashboard: _listenToDataStreams: 👌👌 Received commuterRequests: 🦠 ${requests.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        commuterRequests = requests;
      });
    });
  }

  void _refresh() async {
    setState(() {
      isBusy = true;
      hasAlreadyShownWifi = false;
    });
    try {
      await marshalBloc.refreshDashboardData(forceRefresh: true);
      setState(() {
        isBusy = false;
      });
    } catch (e) {
      AppSnackbar.showSnackbar(
          scaffoldKey: _key,
          message: 'Problem refreshing data',
          textColor: Colors.amber,
          backgroundColor: Colors.pink[600]);
    }
  }

  void _openConfirmLandmark() async {
    myDebugPrint('Dashboard: 🥬🥬🥬🥬🥬_openConfirmLandmark');
    var result = await Navigator.push(
        context,
        PageTransition(
            type: PageTransitionType.leftToRightWithFade,
            child: ConfirmLandmark()));

    print(result);
    if (result != null && result is Landmark) {
      setState(() {
        landmark = result;
      });
    }
  }

  void _tryAnimation() {
    Navigator.push(
        context,
        SlideRightRoute(
            widget: ARAnimations(
          type: 'ball',
        )));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        elevation: 0,
        actions: <Widget>[
          IconButton(
            icon: Icon(
              Icons.my_location,
              color: Colors.black,
            ),
            onPressed: _openConfirmLandmark,
          ),
          IconButton(
            icon: Icon(
              Icons.refresh,
              color: Colors.black,
            ),
            onPressed: _refresh,
          ),
        ],
        backgroundColor: Colors.brown[50],
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      SizedBox(
                        width: 12,
                      ),
                      Text(
                        landmark == null
                            ? 'Marshal Landmark'
                            : landmark.landmarkName,
                        style: Styles.blackMedium,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      SizedBox(
                        width: 8,
                      ),
                      Container(
                        width: 200,
                        child: RaisedButton(
                            elevation: 8,
                            color: Colors.pink[400],
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Scan Passenger',
                                style: Styles.whiteSmall,
                              ),
                            ),
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  PageTransition(
                                      type: PageTransitionType
                                          .leftToRightWithFade,
                                      child: Scanner(
                                        type: Constants.SCAN_TYPE_REQUEST,
                                        scannerListener: this,
                                      )));
                            }),
                      ),
                      SizedBox(
                        width: 20,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Container(
                        width: 200,
                        child: RaisedButton(
                            elevation: 8,
                            color: Colors.indigo[400],
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Dispatch Taxi',
                                style: Styles.whiteSmall,
                              ),
                            ),
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  PageTransition(
                                      type: PageTransitionType.scale,
                                      child: SelectVehicleForDispatch()));
                            }),
                      ),
                      SizedBox(
                        width: 20,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 8,
                  ),
                  Row(
                    children: [
                      Text(
                        landmark == null
                            ? ''
                            : landmark.routeDetails.isEmpty
                                ? 'No Routes for Landmark'
                                : landmark.routeDetails.length == 1
                                    ? '1 Route from here'
                                    : '${landmark.routeDetails.length} Routes from here',
                        style: Styles.blackSmall,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 8,
                  ),
                ],
              ),
            ),
            preferredSize: Size.fromHeight(200)),
      ),
      backgroundColor: Colors.brown[50],
      bottomNavigationBar: BottomNavigationBar(
        fixedColor: Colors.blue,
        items: [
          BottomNavigationBarItem(
              icon: Icon(
                Icons.map,
                color: Colors.pink,
              ),
              title: Text(
                'RouteMaps',
                style: Styles.blueSmall,
              )),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.departure_board,
                color: Colors.black,
              ),
              title: Text(
                'Find Taxis',
                style: Styles.blackSmall,
              )),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.airport_shuttle,
                color: Colors.green,
              ),
              title: Text(
                'Dispatch',
                style: Styles.blueBoldSmall,
              )),
//          BottomNavigationBarItem(
//              icon: Icon(Icons.scanner), title: Text('Scan')),
        ],
//        backgroundColor: Colors.black,
        onTap: _handleBottomNav,
      ),
      body: isBusy
          ? ARAnimations(
              type: 'loader',
            )
          : Padding(
              padding: const EdgeInsets.all(12),
              child: GridView(
                children: <Widget>[
                  GestureDetector(
                    onTap: () {
                      myDebugPrint('GestureDetector onTap 🌺 🌺 🌺 🌺 🌺 🌺 ');
                      marshalBloc.getVehicleArrivals(
                          landmarkID: landmark.landmarkID, minutes: 10);
                    },
                    child: CounterCard(
                      title: 'Vehicle Arrivals',
                      total: vehicleArrivals.length,
                      titleStyle: Styles.blackSmall,
                      totalStyle: Styles.blackBoldLarge,
//                      cardColor: Colors.pink[400],
                      elevation: 2.0,
                      icon: Icon(
                        Icons.airport_shuttle,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      marshalBloc.getCommuterRequests(
                        landmarkID: landmark.landmarkID,
                      );
                    },
                    child: CounterCard(
                      title: 'Commuter Requests',
                      total: commuterRequests.length,
                      elevation: 4.0,
                      icon: Icon(
                        Icons.alarm,
                        color: Colors.grey[600],
                      ),
                      titleStyle: Styles.blackSmall,
                      totalStyle: Styles.blackBoldLarge,
//                      cardColor: Colors.pink[400],
                    ),
                  ),
                  CounterCard(
                    title: 'Commuter Arrivals',
                    total: commuterArrivals.length,
                    elevation: 2.0,
                    titleStyle: Styles.blackSmall,
                    totalStyle: Styles.blackBoldLarge,
//                    cardColor: Colors.blue[800],
                    icon: Icon(
                      Icons.people,
                      color: Colors.grey[600],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      marshalBloc.getCommuterFenceDwellEvents(
                          landmarkID: landmark.landmarkID);
                    },
                    child: CounterCard(
                      title: 'Casual Commuters',
                      total: commuterFenceDwellEvents.length,
                      titleStyle: Styles.blackSmall,
                      totalStyle: Styles.blackBoldLarge,
//                      cardColor: Colors.blue[800],
                      elevation: 1.0,
                      icon: Icon(
                        Icons.people,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      marshalBloc.getAssociationVehicles(forceRefresh: true);
                    },
                    child: CounterCard(
                      title: 'Total Vehicles',
                      total: _vehicles.length,
                      titleStyle: Styles.greyLabelSmall,
                      totalStyle: Styles.greyLabelLarge,
//                      cardColor: Colors.black,
                      icon: Icon(
                        Icons.airport_shuttle,
                        color: Colors.pink,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      marshalBloc.findLandmarksByLocation(forceRefresh: true);
                    },
                    child: CounterCard(
                      title: 'Landmarks Around',
                      total: landmarks.length,
                      titleStyle: Styles.greyLabelSmall,
                      totalStyle: Styles.greyLabelLarge,
//                      cardColor: Colors.grey[800],
                      icon: Icon(
                        Icons.my_location,
                        color: Colors.lightBlue,
                      ),
                    ),
                  ),
                ],
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2),
              ),
            ),
    );
  }

  void _handleBottomNav(int index) {
    if (marshalBloc.marshalLandmark == null) {
      _openConfirmLandmark();
      return;
    }
    switch (index) {
      case 0:
        _startRouteMap();
        break;
      case 1:
        Navigator.push(
            context,
            PageTransition(
                type: PageTransitionType.scale,
                curve: Curves.easeInOut,
                child: FindVehicles()));
        break;
      case 2:
        Navigator.push(
            context,
            PageTransition(
                type: PageTransitionType.scale,
                curve: Curves.easeInOut,
                child: SelectVehicleForDispatch()));
        break;
    }
  }

  void _startRouteMap() async {
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key, message: 'Loading routes');
    List<ar.Route> routes = List();
    for (var rd in landmark.routeDetails) {
      var mRoute = await marshalBloc.getRouteByID(rd.routeID);
      routes.add(mRoute);
    }
    assert(routes.isNotEmpty);
    _key.currentState.removeCurrentSnackBar();
    Navigator.push(
        context,
        PageTransition(
            type: PageTransitionType.scale,
            curve: Curves.easeInOut,
            duration: Duration(seconds: 1),
            child: RouteMap(
              hideAppBar: false,
              landmarkIconColor: RouteMap.colorRed,
              routes: routes,
            )));
  }

  @override
  onScan(String commuterRequestID) {
    myDebugPrint('Dashboard: 👌👌👌 received onScan: $commuterRequestID');
    if (mounted) {
      AppSnackbar.showSnackbar(
          scaffoldKey: _key, message: '💙 Passenger scanned 👌 OK  💙');
    }
    return null;
  }

  List<RouteDistanceEstimation> _routeDistanceEstimations = List();
  @override
  onRouteDistanceEstimationsArrived(
      List<RouteDistanceEstimation> routeDistanceEstimations) {
    _routeDistanceEstimations = routeDistanceEstimations;
    //todo - filter older estimations ....
    setState(() {});
  }

  @override
  onError(String message) {
    if (mounted) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: message, actionLabel: '');
    }
  }
}
