import 'package:aftarobotlibrary4/data/vehicle_location.dart';
import 'package:aftarobotlibrary4/maps/distance.dart';
import 'package:aftarobotlibrary4/maps/vehicle_map.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalz/bloc/marshal_bloc.dart';

class FindVehicles extends StatefulWidget {
  @override
  _FindVehiclesState createState() => _FindVehiclesState();
}

class _FindVehiclesState extends State<FindVehicles>
    implements MarshalBlocListener {
  List<VehicleLocation> _vehicleLocations = List();
  var _key = GlobalKey<ScaffoldState>();
  bool isBusy = false;
  MarshalBloc marshalBloc;
  @override
  void initState() {
    super.initState();
    marshalBloc = MarshalBloc(this);
    _subscribeToBusy();
    _subscribeToError();
    _subscribeToLocationStream();
    _findVehicles();
  }

  void _subscribeToBusy() {
    marshalBloc.busyStream.listen((busy) {
      mp('💙 💙 💙 Received busy: $busy : will setState');
//      if (!busy) {
//        _key.currentState.removeCurrentSnackBar();
//      }
      setState(() {
        isBusy = busy.last;
      });
    });
  }

  void _subscribeToError() {
    marshalBloc.errorStream.listen((err) {
      mp('👿  👿  👿  Received error: $err');
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: err.last);
    });
  }

  void _subscribeToLocationStream() {
    marshalBloc.vehicleLocationStream.listen((vehicleLocations) {
      mp('🏀  🏀  🏀  _subscribeToLocationStream: 🧩 Received ${vehicleLocations.length} vehicleLocations: ');
      setState(() {
        _vehicleLocations = vehicleLocations;
      });
    });
  }

  _findVehicles() async {
    try {
      _vehicleLocations = await marshalBloc.findVehiclesByLocation();
      setState(() {});
    } catch (e) {
      print(e);
      setState(() {
        isBusy = false;
      });
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Failed to find taxis', actionLabel: '');
    }
  }

  _startVehicleMap(VehicleLocation vehicleLocation) {
    mp('🍏 🍏 🍏 🍏 🍏 🍏 Start map for single vehicle :  🔴 🔴 ${vehicleLocation.vehicleReg}');
    prettyPrint(vehicleLocation.toJson(),
        '🍏 🍏 🍏 🍏 🍏 🍏 VEHICLE to send to VehicleMap');
    List<VehicleLocation> locs = List();
    locs.add(vehicleLocation);
    Navigator.push(context, SlideRightRoute(widget: VehicleMap(locs)));
  }

  _startVehiclesMap() {
    mp('🍏 🍏 🍏 🍏 🍏 🍏 Start map for all vehicles found :  🔴 🔴 ${_vehicleLocations.length}');
    if (_vehicleLocations.isEmpty) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'No taxis available for map');
      return;
    }
    Navigator.push(
        context, SlideRightRoute(widget: VehicleMap(_vehicleLocations)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Find Taxis'),
        backgroundColor: Colors.indigo[400],
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.map),
            onPressed: _startVehiclesMap,
          ),
          IconButton(
            icon: Icon(Icons.search),
            onPressed: _findVehicles,
          )
        ],
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: <Widget>[
                  Text(
                    'Find taxis around this location. The app will find taxis that are within a ${Constants.GEO_QUERY_RADIUS} km radius',
                    style: Styles.whiteSmall,
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text(
                        'Taxis Found:',
                        style: Styles.greyLabelSmall,
                      ),
                      SizedBox(
                        width: 12,
                      ),
                      Text(
                        '${_vehicleLocations.length}',
                        style: Styles.whiteBoldMedium,
                      ),
                    ],
                  ),
                ],
              ),
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
                  backgroundColor: Colors.indigo,
                ),
              ),
            )
          : StreamBuilder<List<VehicleLocation>>(
              stream: marshalBloc.vehicleLocationStream,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  mp('🔱 🔱 🔱 🔱 StreamBuilder: Vehicle locations received:  🌀 ${snapshot.data.length}');
                  _vehicleLocations = snapshot.data;
                }
                return _vehicleLocations.isEmpty
                    ? Center(
                        child: Text(
                          'No Taxis Found',
                          style: Styles.blackBoldMedium,
                        ),
                      )
                    : ListView.builder(
                        itemCount: _vehicleLocations.length,
                        itemBuilder: (context, index) {
                          var vehicleLoc = _vehicleLocations.elementAt(index);
                          return _vehicleLocations.isEmpty
                              ? Center(
                                  child: Text(
                                    'No Tazis Found',
                                    style: Styles.blackBoldMedium,
                                  ),
                                )
                              : GestureDetector(
                                  onTap: () {
                                    _startVehicleMap(vehicleLoc);
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.only(
                                        left: 12, right: 12, top: 8),
                                    child: Card(
                                      elevation: 2,
                                      child: Column(
                                        children: <Widget>[
                                          Row(
                                            children: <Widget>[
                                              SizedBox(
                                                width: 12,
                                              ),
                                              Icon(Icons.local_taxi),
                                              SizedBox(
                                                width: 12,
                                              ),
                                              Column(
                                                children: <Widget>[
                                                  SizedBox(
                                                    height: 12,
                                                  ),
                                                  Text(
                                                    vehicleLoc.vehicleReg,
                                                    style:
                                                        Styles.blackBoldMedium,
                                                  ),
                                                  SizedBox(
                                                    height: 12,
                                                  ),
                                                  Text(
                                                    '${vehicleLoc.vehicleType.make} ${vehicleLoc.vehicleType.model}',
                                                    style: Styles.blueBoldSmall,
                                                  ),
                                                  SizedBox(
                                                    height: 12,
                                                  ),
                                                  Text(
                                                      getFormattedDateShortWithTime(
                                                          vehicleLoc.created,
                                                          context)),
                                                  SizedBox(
                                                    height: 12,
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                        });
              }),
    );
  }

  @override
  onError(String message) {
    if (mounted) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: message, actionLabel: '');
    }
  }

  @override
  onRouteDistanceEstimationsArrived(
      List<RouteDistanceEstimation> routeDistanceEstimations) {
    // TODO: implement onRouteDistanceEstimationsArrived
    return null;
  }
}
