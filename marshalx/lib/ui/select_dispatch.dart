import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/position.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/estimator_bloc.dart';
import 'package:aftarobotlibrary4/util/busy.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';
import 'package:marshalx/ui/confirm_landmark.dart';
import 'package:marshalx/ui/dispatch.dart';
import 'package:marshalx/ui/wifi.dart';
import 'package:page_transition/page_transition.dart';

class SelectVehicleForDispatch extends StatefulWidget {
  @override
  _SelectVehicleForDispatchState createState() =>
      _SelectVehicleForDispatchState();
}

class _SelectVehicleForDispatchState extends State<SelectVehicleForDispatch>
    implements MarshalBlocListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  List<VehicleArrival> vehicleArrivals = List();
  Landmark landmark;
  bool isBusy = false;

  @override
  void initState() {
    super.initState();
    _checkMarshalLandmark();
    _getCachedDispatches();
  }

  test() async {}
  _checkMarshalLandmark() async {
    landmark = await Prefs.getLandmark();
    if (landmark == null) {
      var result = await Navigator.push(
          context,
          SlideRightRoute(
            widget: ConfirmLandmark(),
          ));
      if (result != null && result is Landmark) {
        setState(() {
          landmark = result;
        });
      }
    }
    if (landmark == null) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Please select Landmark',
          actionLabel: '');
      return;
    }
    _subscribeToDispatchedStream();
    _getVehicleArrivals();
  }

  _subscribeToDispatchedStream() {
    marshalBloc.vehicleArrivalDispatchedStream.listen((arrival) {
      myDebugPrint(
          'SelectVehicleForDispatch: 🥬🥬🥬🥬🥬 Dispatched message from 🌺 ${arrival.vehicleReg} 🌺 ');
      List<VehicleArrival> temp = List();
      vehicleArrivals.forEach((m) {
        if (m.vehicleID != arrival.vehicleID) {
          temp.add(m);
        }
      });
      setState(() {
        vehicleArrivals = temp;
      });
      AppSnackbar.showSnackbar(
          scaffoldKey: _key, message: "Taxi Dispatched ${arrival.vehicleReg}");
    });
  }

  _getVehicleArrivals() async {
    setState(() {
      isBusy = true;
    });
    try {
      landmark = await Prefs.getLandmark();
      if (landmark == null) {
        return;
      }
      prettyPrint(landmark.toJson(), 'LANDMARK for dispatching');
      vehicleArrivals = await marshalBloc.getVehicleArrivals(
          landmarkID: landmark.landmarkID, minutes: 5);
      _removeDuplicates();
      setState(() {
        isBusy = false;
        showAllAssocVehicles = false;
      });
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Failed to get other vehicle arrivals',
          actionLabel: '');
    }
  }

  void _removeDuplicates() {
    //deduplicate
    Map<String, VehicleArrival> vMap = Map();
    vehicleArrivals.sort((a, b) => a.created.compareTo(b.created));
    vehicleArrivals.forEach((v) {
      vMap[v.vehicleID] = v;
    });
    vehicleArrivals = vMap.values.toList();
    vehicleArrivals.sort((a, b) => a.created.compareTo(b.created));
  }

  List<DispatchRecord> _records = [];
  void _getCachedDispatches() async {
    _records = await LocalDBAPI.getDispatchRecordsFromLast24Hours();
    setState(() {});

    marshalBloc.dispatchStream.listen((List<DispatchRecord> list) {
      p('🧩🧩🧩🧩🧩 Stream returned records 🧩 ${list.length}');
      setState(() {
        _records = list;
      });
    });
  }

  Future<void> _getVehicles() async {
    setState(() {
      isBusy = true;
    });
    try {
      _vehicles = await marshalBloc.getAssociationVehicles(forceRefresh: false);
      if (_vehicles.isEmpty) {
        _vehicles =
            await marshalBloc.getAssociationVehicles(forceRefresh: true);
      }
      _vehicles.sort((a, b) => a.vehicleReg.compareTo(b.vehicleReg));
      setState(() {
        isBusy = false;
        showAllAssocVehicles = true;
      });
    } catch (e) {
      print(e);
      if (mounted) {
        AppSnackbar.showErrorSnackbar(
            scaffoldKey: _key,
            message: 'Vehicle loading failed',
            actionLabel: '');
      }
    }
  }

  _startLandmarkConfirm() async {
    var result = await Navigator.push(
        context, SlideRightRoute(widget: ConfirmLandmark()));
    if (result != null && result is Landmark) {
      setState(() {
        landmark = result;
      });
    }
  }

  Vehicle selectedVehicle;
  @override
  Widget build(BuildContext context) {
    myDebugPrint('SelectTaxi: ....... build .......');
    return Scaffold(
      key: _key,
      appBar: AppBar(
        elevation: 0,
        actions: <Widget>[
          IconButton(
            icon: Icon(
              Icons.search,
              color: Colors.black,
            ),
            onPressed: _getVehicleArrivals,
          ),
          IconButton(
            icon: Icon(
              Icons.list,
              color: Colors.black,
            ),
            onPressed: _getVehicles,
          )
        ],
        backgroundColor: Colors.brown[50],
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Image(
                        image: AssetImage('assets/ty1.png'),
                        height: 60,
                        width: 60,
                      ),
                      SizedBox(
                        width: 60,
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          GestureDetector(
                            onTap: _getCachedDispatches,
                            child: Text(
                              'Dispatched Today',
                              style: Styles.blackSmall,
                            ),
                          ),
                          Text(
                            '${_records.length}',
                            style: Styles.tealBoldLarge,
                          ),
                        ],
                      )
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Text(
                    landmark == null ? '' : '${landmark.landmarkName}',
                    style: Styles.blackBoldMedium,
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text(
                        'Number of Association Taxis',
                        style: Styles.blackSmall,
                      ),
                      SizedBox(
                        width: 20,
                      ),
                      Text(
                        showAllAssocVehicles
                            ? '${_vehicles.length}'
                            : '${vehicleArrivals.length}',
                        style: Styles.blueBoldMedium,
                      )
                    ],
                  )
                ],
              ),
            ),
            preferredSize: Size.fromHeight(180)),
      ),
      backgroundColor: Colors.brown[50],
      body: showAllAssocVehicles
          ? StreamBuilder<List<Vehicle>>(
              stream: marshalBloc.vehicleStream,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  myDebugPrint(
                      ' 🅿️  🅿️  🅿️  🅿️  🅿️  🅿️ StreamBuilder receiving ${snapshot.data.length} arrivals');
                  _vehicles = snapshot.data;
                  _vehicles
                      .sort((a, b) => a.vehicleReg.compareTo(b.vehicleReg));
                }
                return isBusy
                    ? ARAnimations(
                        type: 'loader',
                      )
                    : _vehicles.isEmpty
                        ? NothingFound(
                            message: 'No association taxis found',
                          )
                        : ListView.builder(
                            itemCount: _vehicles.length,
                            itemBuilder: (context, index) {
                              var myVehicle = _vehicles.elementAt(index);
                              return GestureDetector(
                                onTap: () {
                                  if (landmark == null) {
                                    _startLandmarkConfirm();
                                    return;
                                  }
                                  _createVehicleArrival(myVehicle);
                                },
                                child: Padding(
                                  padding: const EdgeInsets.only(
                                      top: 2, left: 12, right: 12),
                                  child: Card(
                                    color: Colors.grey[300],
                                    elevation: 2,
                                    child: ListTile(
                                      leading: Icon(
                                        Icons.local_taxi,
                                        color: Colors.grey[400],
                                      ),
                                      title: Text(
                                        myVehicle == null
                                            ? 'No Vehicle'
                                            : myVehicle.vehicleReg == null
                                                ? 'VehicleReg is NULL'
                                                : myVehicle.vehicleReg,
                                        style: Styles.blackBoldMedium,
                                      ),
                                      subtitle: Text(
                                        myVehicle == null
                                            ? ''
                                            : 'Arrived: ${getFormattedDateHourMinSec(DateTime.now().toLocal().toIso8601String())}',
                                        style: Styles.greyLabelSmall,
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            });
              })
          : StreamBuilder<List<VehicleArrival>>(
              stream: marshalBloc.vehicleArrivalStream,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  myDebugPrint(
                      ' 🅿️  🅿️  🅿️  🅿️  🅿️  🅿️ StreamBuilder receiving ${snapshot.data.length} arrivals');
                  vehicleArrivals = snapshot.data;
                  _removeDuplicates();
                }
                return isBusy
                    ? ARAnimations(
                        type: 'loader',
                      )
                    : vehicleArrivals.isEmpty
                        ? NothingFound(
                            message: 'No taxis arrived yet',
                          )
                        : ListView.builder(
                            itemCount: vehicleArrivals.length,
                            itemBuilder: (context, index) {
                              var vehicleArrival =
                                  vehicleArrivals.elementAt(index);
                              return GestureDetector(
                                onTap: () {
                                  selectedVehicle = null;
                                  _startDispatch(vehicleArrival);
                                },
                                child: Padding(
                                  padding: const EdgeInsets.only(
                                      top: 8, left: 12, right: 12),
                                  child: Card(
                                    elevation: 2,
                                    child: ListTile(
                                      leading: Icon(Icons.local_taxi),
                                      title: Text(
                                        vehicleArrival.vehicleReg,
                                        style: Styles.blackBoldMedium,
                                      ),
                                      subtitle: Text(
                                          'Arrived: ${getFormattedDateHourMinSec(vehicleArrival.created)}'),
                                    ),
                                  ),
                                ),
                              );
                            });
              }),
    );
  }

  void _createVehicleArrival(Vehicle myVehicle) {
    prettyPrint(myVehicle.toJson(), 'myVehicle, check registration .....');
    selectedVehicle = myVehicle;
    var vehArrival = VehicleArrival(
        vehicleID: myVehicle.vehicleID,
        vehicleReg: myVehicle.vehicleReg,
        associationID: myVehicle.associationID,
        associationName: myVehicle.associationName,
        landmarkID: landmark.landmarkID,
        landmarkName: landmark.landmarkName,
        vehicleType: myVehicle.vehicleType,
        position: Position(
            type: 'Point',
            coordinates: [landmark.longitude, landmark.latitude]),
        created: DateTime.now().toUtc().toIso8601String());
    _startDispatch(vehArrival);
  }

  var _vehicles = List<Vehicle>();

  bool showAllAssocVehicles = false;

  void _startDispatch(VehicleArrival vehicleArrival) async {
    myDebugPrint('Back in _startDispatch ...  💀  💀  💀  💀  receiving ???!');
    print(vehicleArrival);
    if (selectedVehicle == null) {
      selectedVehicle =
          await LocalDBAPI.getVehicleByID(vehicleArrival.vehicleID);
    }
    if (selectedVehicle == null) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Unable to find vehicle data');
      return;
    }
//    var res = await Navigator.push(
//        context,
//        PageTransition(
//            type: PageTransitionType.leftToRightWithFade,
//            child: Dispatch(vehicleArrival, selectedVehicle)));

    var res = await Navigator.push(
        context,
        PageTransition(
            type: PageTransitionType.scale,
            alignment: Alignment.bottomCenter,
            child: Dispatch(vehicleArrival, selectedVehicle)));

    if (res != null && res is DispatchRecord) {
      DispatchRecord mm = res;
      myDebugPrint(
          '🥬🥬🥬 Back in _startDispatch ... 🥬🥬🥬 cool 🥬🥬🥬 ! : ${mm.toJson()}');
      AppSnackbar.showSnackbar(
          scaffoldKey: _key,
          message: '${mm.vehicleReg} '
              'has been dispached with  🌺 ${mm.passengers} passengers');
      try {
        _vehicles.remove(selectedVehicle);
      } catch (e) {
        print(e);
        AppSnackbar.showErrorSnackbar(
            scaffoldKey: _key, message: 'Unable to remove vehicle from list');
        return;
      }
      setState(() {
        selectedVehicle = null;
      });
    }
  }

  @override
  onError(String message) {
    if (mounted) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: message, actionLabel: '');
    }
    return null;
  }

  @override
  onRouteDistanceEstimationsArrived(
      List<RouteDistanceEstimation> routeDistanceEstimations) {
    // TODO: implement onRouteDistanceEstimationsArrived
    return null;
  }
}
