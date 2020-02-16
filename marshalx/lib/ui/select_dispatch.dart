import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/util/busy.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';
import 'package:marshalx/ui/dispatch.dart';

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Select Taxi for Dispatch'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            onPressed: _getVehicleArrivals,
          )
        ],
        backgroundColor: Colors.teal[400],
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: <Widget>[
                  Text(
                    'Tap the vehicle you want to dispatch. The vehicle(s) shown here have recorded themselves at the rank',
                    style: Styles.whiteSmall,
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Text(
                    '${landmark.landmarkName}',
                    style: Styles.blackBoldMedium,
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text('Number of Taxis found'),
                      SizedBox(
                        width: 20,
                      ),
                      Text(
                        '${vehicleArrivals.length}',
                        style: Styles.whiteBoldMedium,
                      )
                    ],
                  )
                ],
              ),
            ),
            preferredSize: Size.fromHeight(160)),
      ),
      backgroundColor: Colors.brown[100],
      body: StreamBuilder<List<VehicleArrival>>(
          stream: marshalBloc.vehicleArrivalStream,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              myDebugPrint(
                  ' 🅿️  🅿️  🅿️  🅿️  🅿️  🅿️ StreamBuilder receiving ${snapshot.data.length} arrivals');
              vehicleArrivals = snapshot.data;
              _removeDuplicates();
            }
            return isBusy
                ? Busy()
                : vehicleArrivals.isEmpty
                    ? NothingFound(
                        message: 'No taxis arrived',
                      )
                    : ListView.builder(
                        itemCount: vehicleArrivals.length,
                        itemBuilder: (context, index) {
                          var vehicleArrival = vehicleArrivals.elementAt(index);
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
