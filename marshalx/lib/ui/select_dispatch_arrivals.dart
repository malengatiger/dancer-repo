import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps/estimator_bloc.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';
import 'package:marshalx/ui/confirm_landmark.dart';
import 'package:marshalx/ui/dispatch.dart';
import 'package:marshalx/ui/select_dispatch_vehicles.dart';
import 'package:marshalx/ui/wifi.dart';
import 'package:page_transition/page_transition.dart';

class SelectTaxiFromArrivals extends StatefulWidget {
  @override
  _SelectTaxiFromArrivalsState createState() => _SelectTaxiFromArrivalsState();
}

class _SelectTaxiFromArrivalsState extends State<SelectTaxiFromArrivals>
    implements MarshalBlocListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  List<VehicleArrival> vehicleArrivals = List();
  List<VehicleArrival> vehicleArrivalsToProcess = List();
  List<VehicleArrival> vehicleArrivalsNew = List();
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
          PageTransition(
              type: PageTransitionType.scale,
              curve: Curves.easeInOut,
              duration: Duration(milliseconds: 1000),
              alignment: Alignment.topLeft,
              child: ConfirmLandmark()));
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
      mp('SelectTaxiFromArrivals: 🥬🥬🥬🥬🥬 Dispatched message from 🌺 ${arrival.vehicleReg} 🌺 ');
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
      if (landmark == null) landmark = await Prefs.getLandmark();
      if (landmark == null) {
        AppSnackbar.showErrorSnackbar(
            scaffoldKey: _key,
            message: 'Marshal Landmark is missing',
            actionLabel: '');
        return;
      }
      prettyPrint(landmark.toJson(), '🦠🦠🦠🦠🦠 ... LANDMARK for dispatching');
      var minutes = await marshalBloc.getMinutesForQuery();
      vehicleArrivals = await marshalBloc.getVehicleArrivals(
          landmarkID: landmark.landmarkID, minutes: minutes);
      _removeDuplicates();
      vehicleArrivals.forEach((element) {
        vehicleArrivalsToProcess.add(element);
      });
      setState(() {
        isBusy = false;
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
    p('... _removeDuplicates .... vehicleArrivals: ${vehicleArrivals.length}');
    Map<String, VehicleArrival> vMap = Map();
    vehicleArrivals.sort((a, b) => a.created.compareTo(b.created));
    vehicleArrivals.forEach((v) {
      vMap[v.vehicleID] = v;
    });
    vehicleArrivals.clear();
    vehicleArrivals = vMap.values.toList();
    vehicleArrivals.sort((a, b) => a.created.compareTo(b.created));
    p('... _removeDuplicates .... vehicleArrivals: ${vehicleArrivals.length}');
  }

  List<DispatchRecord> _records = [];
  void _getCachedDispatches() async {
    _records = await LocalDBAPI.getDispatchRecordsFromLast24Hours();
    setState(() {});
  }

  Future<void> _startSelectTaxiFromVehicles() async {
    var result = await Navigator.push(
        context,
        PageTransition(
            type: PageTransitionType.scale,
            curve: Curves.easeInOut,
            duration: Duration(milliseconds: 1000),
            alignment: Alignment.topLeft,
            child: SelectTaxiFromVehicles()));

    if (result != null && result == true) {
      Navigator.pop(context);
    }
  }

  Vehicle selectedVehicle;
  @override
  Widget build(BuildContext context) {
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
        ],
        backgroundColor: Colors.brown[100],
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Container(
                        height: 64,
                        width: 64,
                        decoration: BoxDecoration(
                            boxShadow: customShadow,
                            color: Colors.blue[400],
                            shape: BoxShape.circle),
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Image(
                            image: AssetImage('assets/ty1.png'),
                            height: 52,
                            width: 52,
                          ),
                        ),
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
                              'Dispatches Today',
                              style: Styles.blackSmall,
                            ),
                          ),
                          Text(
                            '${_records.length}',
                            style: Styles.pinkBoldLarge,
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
                        'Number of Taxis Arrived',
                        style: Styles.blackSmall,
                      ),
                      SizedBox(
                        width: 20,
                      ),
                      Text(
                        '${vehicleArrivalsToProcess.length}',
                        style: Styles.blueBoldMedium,
                      ),
                      SizedBox(
                        width: 20,
                      ),
                    ],
                  )
                ],
              ),
            ),
            preferredSize: Size.fromHeight(180)),
      ),
      backgroundColor: Colors.brown[100],
      body: StreamBuilder<List<VehicleArrival>>(
          stream: marshalBloc.vehicleArrivalStream,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              mp(' 🅿️  🅿️  🅿️  🅿️  🅿️  🅿️ StreamBuilder receiving '
                  '${snapshot.data.length} arrivals');
              vehicleArrivals = snapshot.data;
              _removeDuplicates();
            }
            return isBusy
                ? ARAnimations(
                    type: 'loader',
                  )
                : vehicleArrivalsToProcess.isEmpty
                    ? Center(
                        child: Container(
                          height: 200,
                          width: 300,
                          child: Card(
                            elevation: 1,
                            color: Colors.brown[80],
                            child: Padding(
                              padding: const EdgeInsets.all(20.0),
                              child: Column(
                                children: [
                                  SizedBox(
                                    height: 20,
                                  ),
                                  Text(
                                    'No taxis arrived yet',
                                    style: Styles.blueBoldSmall,
                                  ),
                                  SizedBox(
                                    height: 40,
                                  ),
                                  RaisedButton(
                                      onPressed: _startSelectTaxiFromVehicles,
                                      elevation: 8,
                                      color: Colors.indigo[300],
                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Text(
                                          'Use Static List',
                                          style: Styles.whiteSmall,
                                        ),
                                      ))
                                ],
                              ),
                            ),
                          ),
                        ),
                      )
                    : ListView.builder(
                        itemCount: vehicleArrivalsToProcess.length,
                        itemBuilder: (context, index) {
                          var vehicleArrival =
                              vehicleArrivalsToProcess.elementAt(index);
                          return GestureDetector(
                            onTap: () {
                              selectedVehicle = null;
                              _startDispatch(vehicleArrival, index);
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

  void _startDispatch(VehicleArrival vehicleArrival, int index) async {
    mp('SelectTaxi: _startDispatch ...  💀  💀  💀  💀  vehicleArrival::: ');
    print(vehicleArrival.toJson());
    if (selectedVehicle == null) {
      selectedVehicle =
          await LocalDBAPI.getVehicleByID(vehicleArrival.vehicleID);
      if (selectedVehicle == null) {
        AppSnackbar.showErrorSnackbar(
            scaffoldKey: _key, message: 'Unable to find vehicle data');
        return;
      }
    }

    var res = await Navigator.push(
        context,
        PageTransition(
            type: PageTransitionType.scale,
            curve: Curves.easeInOut,
            duration: Duration(milliseconds: 2000),
            alignment: Alignment.topLeft,
            child: Dispatch(vehicleArrival, selectedVehicle)));

    if (res != null && res == true) {
      mp('🥬🥬🥬 .......... Back in _startDispatch ... 🥬🥬🥬 cool! 🥬🥬🥬  '
          'vehicleArrivals: ${vehicleArrivalsToProcess.length} remove record at index: $index');
      vehicleArrival.dispatched = true;
      _getCachedDispatches();
      AppSnackbar.showSnackbar(
          scaffoldKey: _key,
          message: '${selectedVehicle.vehicleReg} '
              'has been dispatched  🌺 ');
      selectedVehicle = null;
      setState(() {
        vehicleArrivalsToProcess.removeAt(index);
      });
      mp('🥬🥬🥬 Back in _startDispatch: remove dispatched vehicle ??? vehicleArrivals: ${vehicleArrivalsToProcess.length}');
    } else {
      mp('🥬🥬🥬  🍎 🍎 Back in _startDispatch: DISPATCH cancelled 🍎 ');
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
