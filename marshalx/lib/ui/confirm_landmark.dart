import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:marshalx/bloc/MarshalBloc.dart';

class ConfirmLandmark extends StatefulWidget {
  @override
  _ConfirmLandmarkState createState() => _ConfirmLandmarkState();
}

class _ConfirmLandmarkState extends State<ConfirmLandmark> {
  List<Landmark> _landmarks = List();
  var _key = GlobalKey<ScaffoldState>();
  @override
  initState() {
    super.initState();
    _getNearestLandmarks();
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
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title:
                  new Text("Confirm Landmark", style: Styles.blackBoldMedium),
              content: Container(
                height: 160.0,
                child: Column(
                  children: <Widget>[
                    Text(
                      landmark.landmarkName,
                      style: Styles.blackBoldSmall,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20.0),
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

  void _saveLandmark(Landmark landmark) async {
    await Prefs.saveLandmark(landmark);
    Navigator.pop(context);
  }

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
        child: ListView.builder(
            itemCount: _landmarks.length,
            itemBuilder: (context, index) {
              var landmark = _landmarks.elementAt(index);
              var bf = StringBuffer();
              landmark.routeDetails.forEach((d) {
                bf.write('Route: ${d.name}\n');
              });
              return GestureDetector(
                onTap: () {
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
}
