import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/position.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/util/busy.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';
import 'package:marshalx/ui/dispatch.dart';
import 'package:marshalx/ui/wifi.dart';

class SelectVehicleForDispatch extends StatefulWidget {
  @override
  _SelectVehicleForDispatchState createState() =>
      _SelectVehicleForDispatchState();
}

class _SelectVehicleForDispatchState extends State<SelectVehicleForDispatch> {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  List<VehicleArrival> vehicleArrivals = List();
  Landmark landmark;
  bool isBusy = false;

  @override
  void initState() {
    super.initState();
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
    landmark = marshalBloc.marshalLandmark;
    prettyPrint(landmark.toJson(), 'LANDMARK for dispatching');
    vehicleArrivals = await marshalBloc.getVehicleArrivals(
        landmarkID: landmark.landmarkID, minutes: 5);
    _removeDuplicates();
    setState(() {
      isBusy = false;
      showAllAssocVehicles = false;
    });
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

  Future<void> _getVehicles() async {
    setState(() {
      isBusy = true;
    });
    landmark = marshalBloc.marshalLandmark;
    prettyPrint(landmark.toJson(), 'LANDMARK for dispatching');
    _vehicles = await marshalBloc.getAssociationVehicles();
    setState(() {
      isBusy = false;
      showAllAssocVehicles = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Taxi Select'),
        elevation: 0,
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            onPressed: _getVehicleArrivals,
          ),
          IconButton(
            icon: Icon(Icons.list),
            onPressed: _getVehicles,
          )
        ],
        backgroundColor: Colors.black,
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
                        width: 12,
                      ),
                      Wrap(
                        alignment: WrapAlignment.center,
                        children: <Widget>[
                          Text(
                            'Tap the taxi you want to dispatch',
                            style: Styles.whiteSmall,
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Text(
                    '${landmark.landmarkName}',
                    style: Styles.whiteBoldMedium,
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text(
                        'Number of Taxis found',
                        style: Styles.whiteSmall,
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
      backgroundColor: Colors.black,
      body: showAllAssocVehicles
          ? StreamBuilder<List<Vehicle>>(
              stream: marshalBloc.vehicleStream,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  myDebugPrint(
                      ' 🅿️  🅿️  🅿️  🅿️  🅿️  🅿️ StreamBuilder receiving ${snapshot.data.length} arrivals');
                  _vehicles = snapshot.data;
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
                                  var vehArrival = VehicleArrival(
                                      vehicleID: myVehicle.vehicleID,
                                      vehicleReg: myVehicle.vehicleReg,
                                      associationID: myVehicle.associationID,
                                      associationName:
                                          myVehicle.associationName,
                                      landmarkID: landmark.landmarkID,
                                      landmarkName: landmark.landmarkName,
                                      vehicleType: myVehicle.vehicleType,
                                      position: Position(
                                          type: 'Point',
                                          coordinates: [
                                            landmark.longitude,
                                            landmark.latitude
                                          ]),
                                      created: DateTime.now()
                                          .toUtc()
                                          .toIso8601String());
                                  _startDispatch(vehArrival);
                                },
                                child: Padding(
                                  padding: const EdgeInsets.only(
                                      top: 2, left: 12, right: 12),
                                  child: Card(
                                    color: Colors.black,
                                    elevation: 2,
                                    child: ListTile(
                                      leading: Icon(
                                        Icons.local_taxi,
                                        color: getRandomColor(),
                                      ),
                                      title: Text(
                                        myVehicle.vehicleReg,
                                        style: Styles.blueBoldMedium,
                                      ),
                                      subtitle: Text(
                                        'Arrived: ${getFormattedDateHourMinSec(myVehicle.created)}',
                                        style: Styles.whiteSmall,
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

  var _vehicles = List<Vehicle>();

  bool showAllAssocVehicles = false;

  void _startDispatch(VehicleArrival vehicleArrival) async {
    myDebugPrint('Back in _startDispatch ...  💀  💀  💀  💀  receiving ???!');
    print(vehicleArrival);
    var res = await Navigator.push(
        context, SlideRightRoute(widget: Dispatch(vehicleArrival)));
    if (res != null) {
      DispatchRecord mm = res as DispatchRecord;
      myDebugPrint(
          '🥬🥬🥬 Back in _startDispatch ... 🥬🥬🥬 cool 🥬🥬🥬 ! : ${mm.toJson()}');
      AppSnackbar.showSnackbar(
          scaffoldKey: _key,
          message: '${mm.vehicleReg} '
              'has been dispached with  🌺 ${mm.passengers} passengers');
    }
  }
}
