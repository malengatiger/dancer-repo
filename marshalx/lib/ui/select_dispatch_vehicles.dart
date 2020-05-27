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
import 'package:marshalx/ui/dispatch.dart';
import 'package:marshalx/ui/wifi.dart';
import 'package:page_transition/page_transition.dart';

class SelectTaxiFromVehicles extends StatefulWidget {
  @override
  _SelectTaxiFromVehiclesState createState() => _SelectTaxiFromVehiclesState();
}

class _SelectTaxiFromVehiclesState extends State<SelectTaxiFromVehicles>
    implements MarshalBlocListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  ScrollController scrollController = ScrollController();
  Landmark landmark;
  bool isBusy = false;
  var _vehicles = List<Vehicle>();
  List<DispatchRecord> _records = [];
  Vehicle selectedVehicle;

  @override
  void initState() {
    super.initState();
    _getCachedDispatches();
    isBusy = true;
    _getVehicles(false);
  }

  void _getCachedDispatches() async {
    _records = await LocalDBAPI.getDispatchRecordsFromLast24Hours();
    landmark = await Prefs.getLandmark();
    setState(() {});
  }

  Future<void> _getVehicles(bool refresh) async {
    try {
      _vehicles =
          await marshalBloc.getAssociationVehicles(forceRefresh: refresh);
      if (_vehicles.isEmpty) {
        _vehicles =
            await marshalBloc.getAssociationVehicles(forceRefresh: true);
      }
      _vehicles.sort((a, b) => a.vehicleReg.compareTo(b.vehicleReg));
      setState(() {
        isBusy = false;
      });
      p('--------------------------------> Vehicles loaded : ${_vehicles.length}');
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

  TextEditingController _controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        elevation: 0,
        actions: <Widget>[
          IconButton(
            icon: Icon(
              Icons.refresh,
              color: Colors.black,
            ),
            onPressed: () {
              setState(() {
                isBusy = true;
              });
              _getVehicles(true);
            },
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
                      Container(
                        height: 64,
                        width: 64,
                        decoration: BoxDecoration(
                            boxShadow: customShadow,
                            color: Colors.pink[400],
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
                          Text(
                            '${_records.length}',
                            style: Styles.pinkBoldLarge,
                          ),
                          GestureDetector(
                            onTap: _getCachedDispatches,
                            child: Text(
                              'Dispatched Today',
                              style: Styles.blackSmall,
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                  SizedBox(
                    height: 40,
                  ),
                  GestureDetector(
                    onTap: _getCachedDispatches,
                    child: Text(
                      landmark == null ? '' : '${landmark.landmarkName}',
                      style: Styles.blackBoldMedium,
                    ),
                  ),
                  SizedBox(
                    height: 40,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text(
                        'Find taxi',
                        style: Styles.blackBoldSmall,
                      ),
                      SizedBox(
                        width: 20,
                      ),
                      Container(
                        width: 200,
                        child: TextField(
                          onChanged: _filterVehicles,
                          keyboardType: TextInputType.text,
                          controller: _controller,
                          decoration: InputDecoration(
                            icon: Icon(Icons.search),
                            labelText: 'Registration',
                            hintText: 'Enter Registration',
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 20,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 40,
                  ),
                ],
              ),
            ),
            preferredSize: Size.fromHeight(320)),
      ),
      backgroundColor: Colors.brown[50],
      body: isBusy
          ? ARAnimations(
              type: 'loader',
            )
          : ListView.builder(
              itemCount: _filtered.length,
              itemBuilder: (context, index) {
                var vehicle = _filtered.elementAt(index);
                selectedVehicle = vehicle;
                return GestureDetector(
                  onTap: () {
                    var vehicleArrival = VehicleArrival(
                      associationID: vehicle.associationID,
                      associationName: vehicle.associationName,
                      landmarkID: landmark.landmarkID,
                      landmarkName: landmark.landmarkName,
                      vehicleID: vehicle.vehicleID,
                      vehicleReg: vehicle.vehicleReg,
                      vehicleType: vehicle.vehicleType,
                      position: landmark.position,
                    );
                    _startDispatch(vehicleArrival, index);
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(top: 8, left: 12, right: 12),
                    child: Card(
                      elevation: 2,
                      child: ListTile(
                        leading: Icon(Icons.local_taxi),
                        title: Text(
                          vehicle.vehicleReg,
                          style: Styles.blackBoldMedium,
                        ),
                        subtitle: Text(
                            'Arrived: ${getFormattedDateHourMinSec(DateTime.now().toIso8601String())}'),
                      ),
                    ),
                  ),
                );
              }),
    );
  }

  void _startDispatch(VehicleArrival vehicleArrival, int index) async {
    mp('SelectTaxiFromVehicles: _startDispatch ...  💀  💀  💀  💀  vehicleArrival::: ');
    print(vehicleArrival.toJson());

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
          '_vehicles: ${_vehicles.length} remove record at index: $index');
      AppSnackbar.showSnackbar(
          scaffoldKey: _key,
          message: '${selectedVehicle.vehicleReg} '
              'has been dispatched  🌺 ');
      selectedVehicle = null;
      _controller.text = '';
      _getCachedDispatches();
      setState(() {
        _filtered.clear();
      });
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

  var _filtered = List<Vehicle>();
  void _filterVehicles(String value) {
    p(value);
    _filtered.clear();
    if (value == null || value.isEmpty) {
      _vehicles.forEach((element) {
        _filtered.add(element);
      });
    } else {
      _vehicles.forEach((element) {
        if (element.vehicleReg.toLowerCase().contains(value.toLowerCase())) {
          _filtered.add(element);
        }
      });
    }
    FocusScope.of(context).requestFocus(new FocusNode());
    p('🔵 🔵 🔵 Filtered taxis: ${_filtered.length}');
    setState(() {});
  }
}
