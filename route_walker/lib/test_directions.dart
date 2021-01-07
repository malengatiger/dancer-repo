import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/location_bloc.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_map_polyline/google_map_polyline.dart';
import 'package:page_transition/page_transition.dart';
import 'package:route_walker/test_map.dart';

class TestDirections extends StatefulWidget {
  @override
  _TestDirectionsState createState() => _TestDirectionsState();
}

class _TestDirectionsState extends State<TestDirections>
    with SingleTickerProviderStateMixin {
  AnimationController _controller;
  static const CHANNEL = "aftarobot.com/routebuilder";
  MethodChannel channel = MethodChannel(CHANNEL);
  bool isBusy = false;
  String result = '';
  GoogleMapPolyline googleMapPolyLine;

  @override
  void initState() {
    _controller = AnimationController(vsync: this);
    super.initState();
    _getPermission();
  }

  void _getPermission() async {
    await LocationBloc().requestPermission();
    p('$mm Getting location permission : seem to be OK');
  }

  void _callDirections() {}

  List<RoutePoint> rawRoutePoints = [];
  // void _getPolylineString() async {
  //   p('$mm _getPolylineString: 🍎 Starting the talk with Google directions ....');
  //   rawRoutePoints.clear();
  //   setState(() {
  //     isBusy = true;
  //   });
  //
  //   // result = await DancerListAPI.getPolyline(
  //   //     origin: 'Pretoria', destination: 'Johannesburg');
  //   // print(result);
  //   var pos = await LocationBloc().getCurrentPosition();
  //   var sandton = '-26.10499958,28.05249979';
  //   var fourways = '-26.025469,28.00397';
  //   try {
  //     var args = {
  //       'origin': '${pos.latitude},${pos.longitude}',
  //       'destination': fourways
  //     };
  //     final String result = await channel.invokeMethod('getLatLngs', args);
  //     List m = jsonDecode(result);
  //     var index = 0;
  //
  //     m.forEach((pointFromDirections) {
  //       p('🥦🥦 ${pointFromDirections.toString()}');
  //       var routeID = DateTime.now().toIso8601String();
  //       var created = routeID;
  //       try {
  //         var longitude = pointFromDirections['longitude'] as double;
  //         var latitude = pointFromDirections['latitude'] as double;
  //
  //         p('$mm Extracted 🌺 latitude: $latitude  🌺 longitude: $longitude');
  //
  //         if (pointFromDirections['latitude'].toString().contains('0.0')) {
  //           p('👿👿👿👿👿👿 Weird latitude, ignoring ....');
  //         } else {
  //           rawRoutePoints.add(RoutePoint(
  //               routeID: routeID,
  //               position: Position(coordinates: [longitude, latitude]),
  //               latitude: latitude,
  //               longitude: longitude,
  //               created: created,
  //               index: index));
  //
  //           index++;
  //         }
  //       } catch (e) {
  //         p(e);
  //       }
  //     });
  //     rawRoutePoints.forEach((element) {
  //       p('$mm Point  🌺 ${element.position.toJson()} '
  //           '🥦 latitude: ${element.latitude} 🥦 longitude: ${element.longitude}');
  //     });
  //
  //     p('$mm  ✅ ✅ ✅ ✅ Results back from Google ..... ✅ ✅  what now? Senor!'
  //         ' ✅ ✅  what do we do with this shit? ${rawRoutePoints.length} raw routePoints');
  //   } on PlatformException catch (e) {
  //     p('⚠️ ⚠️ ⚠️ ⚠️ ⚠️  TestDir: ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️  ERROR! 👿👿👿👿👿 $e 👿');
  //     p(e);
  //   }
  //   setState(() {
  //     isBusy = false;
  //   });
  // }

  _navigateToMap() {
    mp('$mm :_navigateToMap with ${rawRoutePoints.length} points ....🧩 🧩 🧩 ');
    Navigator.push(
        context,
        PageTransition(
            child: TestMap(
              rawRoutePoints: rawRoutePoints,
            ),
            type: PageTransitionType.scale,
            duration: Duration(milliseconds: 1500),
            alignment: Alignment.topLeft,
            curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    p('$mm ....... widget build ....... ${DateTime.now().toIso8601String()}');
    return SafeArea(
      child: Scaffold(
          appBar: AppBar(
            title: Text(
              'LatLngs Worker',
              style: Styles.whiteTiny,
            ),
            actions: [
              IconButton(icon: Icon(Icons.map), onPressed: _navigateToMap),
              IconButton(icon: Icon(Icons.refresh), onPressed: _navigateToMap)
            ],
            bottom: PreferredSize(
              preferredSize: Size.fromHeight(200),
              child: Column(
                children: [
                  Text(
                    'Boogie like we mean it!',
                    style: Styles.whiteBoldSmall,
                  ),
                  SizedBox(
                    height: 40,
                  ),
                ],
              ),
            ),
          ),
          backgroundColor: Colors.brown[50],
          body: Center(
            child: Container(
                width: 300,
                height: 300,
                child: Card(
                  child: Column(
                    children: [
                      SizedBox(
                        height: 20,
                      ),
                      Text(
                        'Loading Route Points',
                        style: Styles.blackBoldSmall,
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Text(
                        '${rawRoutePoints.length}',
                        style: Styles.pinkBoldLarge,
                      ),
                      SizedBox(
                        height: 60,
                      ),
                      RaisedButton(
                        color: Colors.indigo,
                        elevation: 8,
                        onPressed: _navigateToMap,
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Text(
                            'Get Route Points',
                            style: Styles.whiteSmall,
                          ),
                        ),
                      )
                    ],
                  ),
                )),
          )),
    );
  }

  static const mm = '🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 TestDirections : ';
}
