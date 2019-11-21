import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/commuter_arrival_landmark.dart';
import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/cards.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/MarshalBloc.dart';
import 'package:marshalx/ui/confirm_landmark.dart';

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
        await marshalBloc.initializeData();
      } catch (e) {
        AppSnackbar.showSnackbar(
            scaffoldKey: _key,
            message: 'Problem signing in',
            textColor: Colors.amber,
            backgroundColor: Colors.pink[600]);
      }
    } else {
      myDebugPrint('💜 💜 💜 💜  subscribing to streams ...');
      _subscribeToBusy();
      _subscribeToError();
      _subscribeToDataStreams();
      myDebugPrint('💜 💜 💜 💜  finding nearby landmarks...');
      setState(() {
        isBusy = true;
      });
      await marshalBloc.findLandmarksByLocation(radiusInKM: 25);
      setState(() {
        isBusy = false;
      });
    }
    user = await Prefs.getUser();
    landmark = await Prefs.getLandmark();
    setState(() {});
    _refresh();
  }

  void _subscribeToBusy() {
    marshalBloc.busyStream.listen((busy) {
      myDebugPrint('💙 💙 💙 Received busy: $busy : will setState');
      if (!busy) {
        _key.currentState.removeCurrentSnackBar();
      }
      setState(() {
        isBusy = busy;
      });
    });
  }

  void _subscribeToError() {
    marshalBloc.errorStream.listen((err) {
      myDebugPrint('👿  👿  👿  Received error: $err');
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: err);
    });
  }

  void _subscribeToDataStreams() {
    myDebugPrint(
        '💜 💜 💜 💜 _subscribeToDataStreams 💜 💜 💜 💜 _subscribeToDataStreams 💜 💜 💜 💜');
    marshalBloc.vehicleStream.listen((cars) {
      myDebugPrint(
          '💜 💜 💜 💜 _subscribeToDataStreams:  Received vehicles: 🦠 ${cars.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        _vehicles = cars;
      });
    });
    marshalBloc.landmarkStream.listen((marks) {
      myDebugPrint(
          '💜 💜 💜 💜 _subscribeToDataStreams:  Received landmarks: 🦠 ${marks.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        landmarks = marks;
      });
    });
    marshalBloc.vehicleArrivalStream.listen((arrivals) {
      myDebugPrint(
          '💜 💜 💜 💜 _subscribeToDataStreams:  Received vehicleArrivals: 🦠 ${arrivals.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        vehicleArrivals = arrivals;
      });
    });
    marshalBloc.commuterDwellStream.listen((dwells) {
      myDebugPrint(
          '💜 💜 💜 💜 _subscribeToDataStreams:  Received commuterDwells: 🦠 ${dwells.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        commuterFenceDwellEvents = dwells;
      });
    });
    marshalBloc.commuterArrivalsStream.listen((marks) {
      myDebugPrint(
          '💜 💜 💜 💜 _subscribeToDataStreams:  Received commuterArrivals: 🦠 ${marks.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        commuterArrivals = marks;
      });
    });
  }

  void _refresh() async {
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key, message: 'Refreshing data');

    await marshalBloc.refreshDashboardData();
    _key.currentState.removeCurrentSnackBar();
  }

  void _openConfirmLandmark() async {
    var result = await Navigator.push(
        context,
        SlideRightRoute(
          widget: ConfirmLandmark(),
        ));
    if (result is Landmark) {
      setState(() {
        landmark = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Marshal Dashboard'),
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
                  height: 40,
                ),
              ],
            ),
            preferredSize: Size.fromHeight(120)),
      ),
      backgroundColor: Colors.brown[100],
      body: isBusy
          ? Center(
              child: Container(
                width: 100,
                height: 100,
                child: CircularProgressIndicator(
                  strokeWidth: 32,
                  backgroundColor: Colors.teal,
                ),
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(12),
              child: GridView(
                children: <Widget>[
                  CounterCard(
                    title: 'Vehicle Arrivals',
                    total: vehicleArrivals.length,
                    icon: Icon(Icons.apps),
                  ),
                  CounterCard(
                    title: 'Commuter Requests',
                    total: commuterRequests.length,
                    icon: Icon(Icons.people),
                  ),
                  CounterCard(
                    title: 'Commuter Arrivals',
                    total: commuterArrivals.length,
                    icon: Icon(Icons.people),
                  ),
                  CounterCard(
                    title: 'Total Vehicles',
                    total: _vehicles.length,
                    icon: Icon(Icons.airport_shuttle),
                  ),
                  CounterCard(
                    title: 'Landmarks Around',
                    total: landmarks.length,
                    icon: Icon(Icons.my_location),
                  ),
                ],
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2),
              ),
            ),
    );
  }
}
