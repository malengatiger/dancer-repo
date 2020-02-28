import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/maps/estimator_bloc.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/marshal_bloc.dart';

class ConfirmLandmark extends StatefulWidget {
  @override
  _ConfirmLandmarkState createState() => _ConfirmLandmarkState();
}

class _ConfirmLandmarkState extends State<ConfirmLandmark>
    implements MarshalBlocListener {
  List<Landmark> _landmarks = List();
  var _key = GlobalKey<ScaffoldState>();
  MarshalBloc marshalBloc;
  @override
  initState() {
    super.initState();
    _subscribeToError();
    _subscribeToBusy();
    _getNearestLandmarks();
    marshalBloc = MarshalBloc(this);
  }

  void _subscribeToBusy() {
    marshalBloc.busyStream.listen((busy) {
      myDebugPrint('💙 💙 💙 Received busy: $busy : will setState');
//      if (!busy) {
//        _key.currentState.removeCurrentSnackBar();
//        Navigator.pop(context, _landmark);
//      }
      if ((mounted)) {
        setState(() {
          isBusy = busy.last;
        });
      }
    });
  }

  void _subscribeToError() {
    marshalBloc.errorStream.listen((err) {
      myDebugPrint('👿  👿  👿  Received error: $err');
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: err.last);
    });
  }

  Future _getNearestLandmarks() async {
    var mList = await marshalBloc.findLandmarksByLocation(radiusInKM: .5);
    if (mList.length > 3) {
      _landmarks = mList.getRange(0, 3).toList();
    } else {
      _landmarks = mList;
    }
    setState(() {});
  }

  void _confirmLandmark(Landmark landmark) {
    assert(landmark != null);
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title:
                  new Text("Confirm Landmark", style: Styles.blackBoldMedium),
              content: Container(
                height: 80.0,
                child: Column(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Text(
                          'Do you confirm that you are working from ${landmark.landmarkName}?'),
                    ),
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
                      _saveLandmark(landmark);
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

  Landmark _landmark;
  void _saveLandmark(Landmark landmark) async {
    assert(landmark != null);
    _landmark = landmark;
    prettyPrint(landmark.toJson(),
        '🧩 🧩 🧩 🧩 🧩 🧩 🧩 🧩 🧩  saving Marshal landmark ...  🔴 calling marshalBloc.refreshMarshalLandmark');
    await marshalBloc.refreshMarshalLandmark(landmark);
    Navigator.pop(context, landmark);
  }

  bool isBusy = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Confirm Work Landmark'),
        bottom: PreferredSize(
            child: Padding(
              padding: const EdgeInsets.all(28.0),
              child: Column(
                children: <Widget>[
                  Text(
                    'Please select the landmark/taxi rank that you will be working from. This feature is only possible when you are within 1 kilometre of the rank',
                    style: Styles.whiteSmall,
                  ),
                  SizedBox(
                    height: 40,
                  ),
                ],
              ),
            ),
            preferredSize: Size.fromHeight(200)),
      ),
      backgroundColor: Colors.brown[100],
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: isBusy
            ? Center(
                child: Container(
                  width: 100,
                  height: 100,
                  child: CircularProgressIndicator(
                    strokeWidth: 32,
                    backgroundColor: Colors.blue,
                  ),
                ),
              )
            : ListView.builder(
                itemCount: _landmarks.length,
                itemBuilder: (context, index) {
                  var landmark = _landmarks.elementAt(index);
                  var bf = StringBuffer();
                  landmark.routeDetails.forEach((d) {
                    bf.write('Route: ${d.name}\n');
                  });
                  return GestureDetector(
                    onTap: () {
                      assert(landmark != null);
                      _confirmLandmark(landmark);
                    },
                    child: Card(
                      elevation: 2,
                      child: ListTile(
                        leading: Icon(
                          Icons.my_location,
                          color: getRandomColor(),
                        ),
                        title: Text(
                          landmark.landmarkName,
                          style: Styles.blackBoldSmall,
                        ),
                        subtitle: Text(bf.toString()),
                      ),
                    ),
                  );
                }),
      ),
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
