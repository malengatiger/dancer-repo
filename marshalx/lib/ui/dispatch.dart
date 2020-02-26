import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/dancer/dancer_data_api.dart';
import 'package:aftarobotlibrary4/data/dispatch_record.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/position.dart';
import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/util/busy.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';

class Dispatch extends StatefulWidget {
  final VehicleArrival vehicleArrival;

  Dispatch(this.vehicleArrival);

  @override
  _DispatchState createState() => _DispatchState();
}

class _DispatchState extends State<Dispatch> implements NumberDropDownListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  Landmark landmark;
  MarshalBloc marshalBloc;
  int number = 0;

  @override
  void initState() {
    super.initState();
    marshalBloc = MarshalBloc(null);
    _getRoutes();
  }

  _getRoutes() async {
    landmark = marshalBloc.marshalLandmark;
    if (landmark == null) {
      throw Exception('No marshal landmark found');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Taxi Dispatch'),
        backgroundColor: Colors.teal[300],
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: <Widget>[
                  Text(
                    widget.vehicleArrival.vehicleReg,
                    style: Styles.blackBoldLarge,
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Card(
                    child: Row(
                      children: <Widget>[
                        SizedBox(
                          width: 8,
                        ),
                        Text('Enter Number of Passengers'),
                        SizedBox(
                          width: 20,
                        ),
                        MyNumberDropDown(
                          this,
                          startNumber: 0,
                          endNumber: 31,
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 8,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text('Number Selected'),
                      SizedBox(
                        width: 12,
                      ),
                      Text(
                        '$number',
                        style: Styles.whiteBoldMedium,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 8,
                  )
                ],
              ),
            ),
            preferredSize: Size.fromHeight(180)),
      ),
      backgroundColor: Colors.brown[100],
      body: ListView.builder(
          itemCount: landmark.routeDetails.length,
          itemBuilder: (context, index) {
            RouteInfo detail = landmark.routeDetails.elementAt(index);
            return Padding(
              padding: const EdgeInsets.only(top: 8.0, left: 12, right: 12),
              child: GestureDetector(
                onTap: () {
                  _confirmDispatchCar(detail);
                },
                child: Card(
                  elevation: 2,
                  child: ListTile(
                    leading: Icon(
                      Icons.my_location,
                      color: getRandomColor(),
                    ),
                    title: Text(
                      detail.name,
                      style: Styles.blackBoldSmall,
                    ),
                  ),
                ),
              ),
            );
          }),
    );
  }

  @override
  onNumberSelected(int num) {
    myDebugPrint('🍏 🍏 🍏 🍏 🍏 🍏 OnNumberChanged: $num');
    setState(() {
      number = num;
    });
  }

  _confirmDispatchCar(RouteInfo detail) {
    myDebugPrint(
        ' 🐳  🐳  🐳  🐳  🐳 Ready to CONFIRM : dispatch car to  💀 ${detail.name}  💀 ');
    assert(landmark != null);
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title:
                  new Text("Confirm Dispatch", style: Styles.blackBoldMedium),
              content: Container(
                height: 100.0,
                child: Column(
                  children: <Widget>[
                    Text(
                        'Do you confirm that you are dispatching ${widget.vehicleArrival.vehicleReg} from ${landmark.landmarkName} with $number passengers?'),
                  ],
                ),
              ),
              actions: <Widget>[
                FlatButton(
                  child: Text(
                    'NO',
                    style: TextStyle(color: Colors.grey),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0),
                  child: RaisedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _dispatchVehicle(detail);
                    },
                    elevation: 4.0,
                    color: Colors.pink.shade700,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Confirm',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ],
            ));
  }

  bool isBusy = false;
  _dispatchVehicle(RouteInfo detail) async {
    myDebugPrint(
        '🌺 🌺 🌺 🌺 🌺 Ready to dispatch car to  💀 ${detail.name}  💀 ');
    setState(() {
      isBusy = true;
    });
    try {
      var user = marshalBloc.user;
      var veh =
          await LocalDBAPI.getVehicleByID(widget.vehicleArrival.vehicleID);
      var dr = DispatchRecord(
          landmarkID: landmark.landmarkID,
          landmarkName: landmark.landmarkName,
          associationD: user.associationID,
          associationName: user.associationName,
          vehicleID: widget.vehicleArrival.vehicleID,
          vehicleReg: widget.vehicleArrival.vehicleReg,
          vehicleType: veh.vehicleType,
          dispatched: true,
          marshalID: user.userID,
          marshalName: '${user.firstName} ${user.lastName}',
          routeID: detail.routeID,
          routeName: detail.name,
          passengers: number,
          ownerID: veh.ownerID,
          position:
              Position(coordinates: [landmark.longitude, landmark.latitude]));
      try {
        AppSnackbar.showSnackbarWithProgressIndicator(
            scaffoldKey: _key, message: ' 🌺  🌺  Dispatching taxi ..');
      } catch (e, s) {
        print(s);
      }
      var dispatchRecord =
          await DancerDataAPI.addDispatchRecord(dispatchRecord: dr);
      marshalBloc.removeVehicleArrival(widget.vehicleArrival);
      prettyPrint(dispatchRecord.toJson(),
          '🎁 🎁 🎁 🎁 DISPATCH RECORD returned, about to pop!');
      _key.currentState.removeCurrentSnackBar();
      Navigator.pop(context, dispatchRecord);
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: e.toString());
    }

    setState(() {
      isBusy = false;
    });
  }
}
