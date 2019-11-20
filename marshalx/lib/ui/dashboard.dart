import 'package:aftarobotlibrary4/data/commuter_fence_event.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/cards.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/MarshalBloc.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  bool isBusy = false;
  List<Vehicle> _vehicles = List();
  @override
  void initState() {
    super.initState();
    _checkUser();
  }

  void _checkUser() async {
    bool isSignedIn = await marshalBloc.checkUserLoggedIn();
    print(
        '🍎 🍎 🍎 _RouteViewerPageState: checkUser: ...................... 🔆🔆 isSignedIn: $isSignedIn  🔆🔆');
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
      _subscribeToTotalVehicle();
    }
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

  void _subscribeToTotalVehicle() {
    marshalBloc.vehicleStream.listen((cars) {
      myDebugPrint(
          '💜 💜 💜 💜   Received vehicles: 🦠 ${cars.length} 🦠 💜 💜 💜 💜 ');
      setState(() {
        _vehicles = cars;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        key: _key,
        appBar: AppBar(
          title: Text('Marshal Dashboard'),
          bottom: PreferredSize(
              child: Column(), preferredSize: Size.fromHeight(120)),
        ),
        backgroundColor: Colors.brown[100],
        body: Padding(
          padding: const EdgeInsets.only(left: 12, right: 12, top: 12),
          child: isBusy
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
              : GridView(
                  children: <Widget>[
                    StreamBuilder<List<VehicleArrival>>(
                        stream: marshalBloc.vehicleArrivalStream,
                        builder: (context, snapshot) {
                          var cnt = 0;
                          if (snapshot.hasData) {
                            cnt = snapshot.data.length;
                          }
                          return CounterCard(
                            title: 'Vehicle Arrivals',
                            total: cnt,
                            icon: Icon(Icons.apps),
                          );
                        }),
                    StreamBuilder<List<CommuterFenceDwellEvent>>(
                        stream: marshalBloc.commuterDwellStream,
                        builder: (context, snapshot) {
                          var cnt = 0;
                          if (snapshot.hasData) {
                            cnt = snapshot.data.length;
                          }
                          return CounterCard(
                            title: 'Commuter Arrivals',
                            total: cnt,
                            icon: Icon(Icons.people),
                          );
                        }),
                    StreamBuilder<List<Vehicle>>(
                        stream: marshalBloc.vehicleStream,
                        builder: (context, snapshot) {
                          var cnt = 0;
                          if (snapshot.hasData) {
                            cnt = snapshot.data.length;
                            myDebugPrint(
                                'StreamBuilder:............... Received vehicles 💜 💜 💜 💜 $cnt');
                          }
                          return CounterCard(
                            title: 'Total Vehicles',
                            total: _vehicles.length,
                            icon: Icon(Icons.airport_shuttle),
                          );
                        }),
                  ],
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2),
                ),
        ));
  }
}
