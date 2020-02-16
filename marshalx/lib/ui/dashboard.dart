import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/cards.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
import 'package:aftarobotlibrary4/util/busy.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';
import 'package:marshalx/ui/confirm_landmark.dart';
import 'package:marshalx/ui/scanner.dart';
import 'package:marshalx/ui/select_dispatch.dart';

import 'find_vehicles.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  bool isBusy = false;
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
    _subscribeToBusy();
    _subscribeToError();
    _listenToDataStreams();
    _checkUser();
  }

  void _checkUser() async {
    bool isSignedIn = await marshalBloc.checkUserLoggedIn();
    print(
        '🍎 🍎 🍎 _DashboardState: checkUser: is user signed in? 🔆🔆 isSignedIn: $isSignedIn  🔆🔆');
    if (!isSignedIn) {
      try {
        bool isOK = await Navigator.push(context,
            MaterialPageRoute(builder: (BuildContext context) {
          return SignIn();
        }));
        if (!isOK) {
          AppSnackbar.showSnackbar(
              scaffoldKey: _key,
              message: 'You have not signed in',
              textColor: Colors.amber,
              backgroundColor: Colors.pink[600]);
          return;
        }
        marshalBloc.initializeData();
      } catch (e) {
        AppSnackbar.showSnackbar(
            scaffoldKey: _key,
            message: 'Problem signing in',
            textColor: Colors.amber,
            backgroundColor: Colors.pink[600]);
      }
    } else {
      myDebugPrint('💜 💜 💜 💜 calling marshalBloc.refreshDashboardData...');
      await marshalBloc.refreshDashboardData(false);
    }

    user = marshalBloc.user;
    myDebugPrint('💜 💜 💜 💜  my Landmark ...');
    landmark = marshalBloc.marshalLandmark;
  }

  void _subscribeToBusy() {
    marshalBloc.busyStream.listen((busy) {
      myDebugPrint(
          '💙 💙 💙 _DashboardState: Received busy: $busy : will setState');
      setState(() {
        isBusy = busy;
      });
    });
  }

  void _subscribeToError() {
    marshalBloc.errorStream.listen((err) {
      myDebugPrint('👿  👿  👿  _DashboardStateReceived error: $err');
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: err);
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
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key, message: 'Refreshing data');

    await marshalBloc.refreshDashboardData(true);
    _key.currentState.removeCurrentSnackBar();
  }

  void _openConfirmLandmark() async {
    myDebugPrint('Dashboard: 🥬🥬🥬🥬🥬_openConfirmLandmark');
    var result = await Navigator.push(
        context,
        SlideRightRoute(
          widget: ConfirmLandmark(),
        ));
    print(result);
    setState(() {
      landmark = marshalBloc.marshalLandmark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Marshal Dashboard'),
        elevation: 16,
        backgroundColor: Colors.pink[300],
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.my_location),
            onPressed: _openConfirmLandmark,
          ),
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _refresh,
          ),
        ],
        bottom: PreferredSize(
            child: Column(
              children: <Widget>[
                Text(
                  landmark == null ? '' : landmark.landmarkName,
                  style: Styles.whiteBoldMedium,
                ),
                SizedBox(
                  height: 12,
                ),
                Text(
                  user == null ? '' : '${user.firstName} ${user.lastName}',
                  style: Styles.blackBoldSmall,
                ),
                SizedBox(
                  height: 8,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Text(
                      landmark == null
                          ? ''
                          : '${landmark.routeDetails.length} Routes from here',
                      style: Styles.whiteSmall,
                    ),
                    SizedBox(
                      width: 24,
                    ),
                    RaisedButton(
                        elevation: 8,
                        color: Colors.indigo[700],
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            'Scan',
                            style: Styles.whiteSmall,
                          ),
                        ),
                        onPressed: () {
                          Navigator.push(
                              context,
                              SlideRightRoute(
                                widget: Scanner(),
                              ));
                        }),
                    SizedBox(
                      width: 20,
                    ),
                  ],
                ),
                SizedBox(
                  height: 20,
                ),
              ],
            ),
            preferredSize: Size.fromHeight(120)),
      ),
      backgroundColor: Colors.brown[100],
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(
              icon: Icon(Icons.map), title: Text('Route Maps')),
          BottomNavigationBarItem(
              icon: Icon(Icons.search), title: Text('Find')),
          BottomNavigationBarItem(
              icon: Icon(Icons.airport_shuttle), title: Text('Dispatch')),
//          BottomNavigationBarItem(
//              icon: Icon(Icons.scanner), title: Text('Scan')),
        ],
        backgroundColor: Colors.brown[50],
        onTap: _handleBottomNav,
      ),
      body: isBusy
          ? Busy()
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
                      icon: Icon(
                        Icons.apps,
                        color: Colors.teal[700],
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
                      icon: Icon(Icons.people),
                    ),
                  ),
                  CounterCard(
                    title: 'Commuter Arrivals',
                    total: commuterArrivals.length,
                    icon: Icon(
                      Icons.people,
                      color: Colors.pink,
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
                      icon: Icon(
                        Icons.people,
                        color: Colors.blue,
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
                      icon: Icon(Icons.airport_shuttle),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      marshalBloc.findLandmarksByLocation(forceRefresh: true);
                    },
                    child: CounterCard(
                      title: 'Landmarks Around',
                      total: landmarks.length,
                      icon: Icon(Icons.my_location),
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
        Navigator.push(context, SlideRightRoute(widget: FindVehicles()));
        break;
      case 2:
        Navigator.push(
            context, SlideRightRoute(widget: SelectVehicleForDispatch()));
        break;
      case 3:
        Navigator.push(context, SlideRightRoute(widget: Scanner()));
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
        SlideRightRoute(
            widget: RouteMap(
          hideAppBar: false,
          landmarkIconColor: RouteMap.colorAzure,
          routes: routes,
        )));
  }
}
