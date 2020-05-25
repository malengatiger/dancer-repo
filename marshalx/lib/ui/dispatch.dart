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

import 'confirm_landmark.dart';

class Dispatch extends StatefulWidget {
  final VehicleArrival vehicleArrival;
  final Vehicle vehicle;

  Dispatch(this.vehicleArrival, this.vehicle);

  @override
  _DispatchState createState() => _DispatchState();
}

class _DispatchState extends State<Dispatch>
    implements NumberDropDownListener, MarshalBlocListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  Landmark landmark;
  int number = 0;

  @override
  void initState() {
    super.initState();
    _checkLandmark();
  }

  _checkLandmark() async {
    if (landmark == null) {
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
      } else {
        prettyPrint(landmark.toJson(),
            'Marshal Landmark from cache,  🌸  🌸  🌸 routeDetails: ${landmark.routeDetails.length}');
      }
      if (landmark == null) {
        AppSnackbar.showErrorSnackbar(
            scaffoldKey: _key,
            message: 'Please select Landmark',
            actionLabel: '');
        return;
      }
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
                      Text('Passengers to be Dispatched'),
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
                    height: 20,
                  )
                ],
              ),
            ),
            preferredSize: Size.fromHeight(200)),
      ),
      backgroundColor: Colors.brown[100],
      body: isBusy
          ? Center(
              child: Container(
                width: 60,
                height: 60,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                ),
              ),
            )
          : ListView.builder(
              itemCount: landmark == null ? 0 : landmark.routeDetails.length,
              itemBuilder: (context, index) {
                RouteInfo detail = landmark.routeDetails.elementAt(index);
                return Padding(
                  padding: const EdgeInsets.only(top: 8.0, left: 12, right: 12),
                  child: GestureDetector(
                    onTap: () {
                      debugPrint(
                          '............... About to dispatch, routeInfo is: ${detail.toJson()} - check routeId and name ....');
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
        ' 🐳  🐳  🐳  🐳  🐳 Ready to CONFIRM : dispatch car to  routeID: 💀 ${detail.routeID} name: ${detail.name}  💀 ');
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
  void _dispatchVehicle(RouteInfo routeInfo) async {
    var rec = await Prefs.getDispatchRecord();
    if (rec != null) {
      var id = widget.vehicle.vehicleID == null
          ? widget.vehicleArrival.vehicleID
          : widget.vehicle.vehicleID;
      if (rec.vehicleID == id) {
        var then = DateTime.parse(rec.created);
        if (DateTime.now().millisecondsSinceEpoch -
                then.millisecondsSinceEpoch <
            (1000 * 60 * 5)) {
          AppSnackbar.showErrorSnackbar(
              scaffoldKey: _key,
              message: '${rec.vehicleReg} : taxi has already been dispatched');
          return;
        }
      }
    }
    myDebugPrint(
        '🌺 🌺 🌺 🌺 🌺 Ready to dispatch car to  💀 ${routeInfo.name}  💀 ');
    prettyPrint(widget.vehicleArrival.toJson(),
        '🐳  🐳 widget.vehicleArrival  🐳 check vehicleID');
    setState(() {
      isBusy = true;
    });
    try {
      var user = await Prefs.getUser();
      if (user == null) {
        AppSnackbar.showErrorSnackbar(
            scaffoldKey: _key, message: "User cache problem found");
        return;
      }

      var dispatchRecord = DispatchRecord(
          landmarkID: landmark.landmarkID,
          landmarkName: landmark.landmarkName,
          associationD: user.associationID,
          associationName: user.associationName,
          vehicleID: widget.vehicleArrival.vehicleID,
          vehicleReg: widget.vehicleArrival.vehicleReg,
          vehicleType: widget.vehicle.vehicleType,
          dispatched: true,
          marshalID: user.userID,
          marshalName: '${user.firstName} ${user.lastName}',
          routeID: routeInfo.routeID,
          routeName: routeInfo.name,
          passengers: number,
          ownerID: widget.vehicle.ownerID,
          dispatchRecordID: DateTime.now().toIso8601String(),
          created: DateTime.now().toIso8601String(),
          position:
              Position(coordinates: [landmark.longitude, landmark.latitude]));

      prettyPrint(dispatchRecord.toJson(),
          '🎁 🎁 🎁 🎁 DISPATCH RECORD about to be sent, 👽  👽  👽 check associationID and created ... from user record');
      var result = await marshalBloc.addDispatchRecord(dispatchRecord);
      //marshalBloc.removeVehicleArrival(widget.vehicleArrival);
      prettyPrint(result.toJson(),
          '🎁 🎁 🎁 🎁 DISPATCH RECORD returned, about to pop! WTF?? routeId and routeName missing ??????  🍎  🍎  🍎  🍎 ');
      Navigator.pop(context, result);
    } catch (e) {
      debugPrint(' 🍎  🍎  🍎  🍎  🍎  🍎  We done fucked up, Boss!');
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Dispatch failed');
      setState(() {
        isBusy = false;
      });
    }
  }

  @override
  onRouteDistanceEstimationsArrived(
      List<RouteDistanceEstimation> routeDistanceEstimations) {
    return null;
  }

  @override
  onError(String message) {
    if (mounted) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: message, actionLabel: '');
    }
  }
}
