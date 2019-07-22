import 'package:aftarobotlibrary4/api/list_api.dart';
import 'package:aftarobotlibrary4/api/location_bloc.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart';
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:aftarobotlibrary4/maps//estimation_page.dart';
import 'package:aftarobotlibrary4/maps/estimation.dart';
import 'package:aftarobotlibrary4/maps/estimator_bloc.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class EstimatorTester extends StatefulWidget {
  @override
  _EstimatorTesterState createState() => _EstimatorTesterState();
}

class _EstimatorTesterState extends State<EstimatorTester>
    implements EstimatorBlocListener, RouteMapListener {
  GlobalKey<ScaffoldState> _key = GlobalKey();
  var vehicle;

  List<VehicleDTO> _vehicles = List();
  List<RouteDTO> _routes = List();
  EstimatorBloc _bloc = EstimatorBloc();
  @override
  initState() {
    super.initState();
    _getData();
  }
//
//  _fix() async {
//    var qs = await fs.collection(Constants.LANDMARKS).getDocuments();
//    var finder = LocationFinderBloc(null);
//    for (var doc in qs.documents) {
//      var mark = LandmarkDTO.fromJson(doc.data);
//      var position = await finder.getPosition(
//          latitude: mark.latitude, longitude: mark.longitude);
//      mark.position = position;
//      await doc.reference.setData(mark.toJson());
//      debugPrint('🤞🤞 Landmark updated:  🍎 ${mark.landmarkName}  🍎 ');
////      if (mark.cities.isNotEmpty) {
////        debugPrint('🤞🤞 We have cities here! 🍎  ${mark.cities.length}  🍎 at ${mark.landmarkName}');
////      }
//      //prettyPrint(mark.toJson(), 'checking  data accuracy');
//    }
//  }

  _getData() async {
    _vehicles = await ListAPI.getVehicles();
    _routes = await ListAPI.getRoutesByAssociation('-KTzcm79kpPSSJlNQuFQ');
    assert(_routes != null);
    assert(_vehicles != null);
    List<RouteDTO> mRoutes = List();
    _routes.forEach((r) {
      if (r.calculatedDistances.isNotEmpty) {
        mRoutes.add(r);
      }
    });
    _routes = mRoutes;
    setState(() {});
  }

  double latitude, longitude;
  _startEstimationTest() async {
    debugPrint(
        'EstimatorTester: 🔵 🔵 _startEstimationTest: 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 ');

    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Calculating Estimates ... 🔵 🔵',
        textColor: Colors.yellow,
        backgroundColor: Colors.black);

    _bloc.startEstimationTest(
        vehicle: _vehicles.elementAt(46),
        route: route,
        secondsBetweenEstimations: 15,
        listener: this,
        radiusInKM: 30,);

    if (_key.currentState != null) {
      _key.currentState.removeCurrentSnackBar();
    }
  }

  _startEstimation(RouteDTO route) async {
    await _bloc.startEstimation(
        vehicle: _vehicles.elementAt(0),
        route: route,
        secondsBetweenEstimations: 600,
        listener: this);
  }

  RouteDTO route;

  _callMap() {
    Navigator.push(
        context,
        SlideRightRoute(
            widget: RouteMap(
          hideAppBar: false,
          title: 'Dynamic Distance Tester',
          routes: [route],
          showTypeToggle: false,
          listener: this,
          popOnLongPress: true,
          landmarkIconColor: RouteMap.colorRed,
        )));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Estimation Algorithm  🍎 Tester', style: Styles.whiteSmall,),
        elevation: 16,
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.map),
            onPressed: _callMap,
          ),
        ],
        backgroundColor: Colors.brown[300],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(160),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: <Widget>[
                Text('This temporary feature helps to test the new dynamic distance algorithm. It uses routes rhat have been prepped first.',
                style: Styles.whiteSmall,),
                Row(
                  children: <Widget>[
                    Text(
                      'Qualified Routes',
                      style: Styles.blackBoldMedium,
                    ),
                    SizedBox(
                      width: 12,
                    ),
                    Text(
                      '${_routes.length}',
                      style: Styles.yellowBoldReallyLarge,
                    )
                  ],
                ),
                SizedBox(
                  height: 8,
                )
              ],
            ),
          ),
        ),
      ),
      backgroundColor: Colors.brown[100],
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: ListView.builder(
          itemCount: _routes.length,
          itemBuilder: (BuildContext context, int index) {
            return GestureDetector(
              onTap: () {
                route = _routes.elementAt(index);
                _startEstimationTest();
              },
              child: Card(
                elevation: 2,
                child: Column(
                  children: <Widget>[
                    ListTile(
                      leading: Icon(Icons.airline_seat_flat_angled),
                      title: Text(
                        '${_routes.elementAt(index).name}',
                        style: Styles.blackBoldSmall,
                      ),
                      subtitle: Row(
                        children: <Widget>[
                          Text(
                            '${_routes.elementAt(index).calculatedDistances.length}',
                            style: Styles.pinkBoldMedium,
                          ),
                          SizedBox(
                            width: 8,
                          ),
                          Text('Calculated Route Stages'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  onError(String message) {
    // TODO: implement onError
    return null;
  }

  @override
  onEstimations(List<Estimation> estimations) {
    if (estimations == null) {
      debugPrint(' 👿 👿 👿 👿 👿 👿 Estimations are NULL. WTF?  👿 👿 👿 👿 👿 👿');
      return;
    }
    debugPrint(
        '\n\n🔴 🔴 🔴 🔴 🔴 🔴 🔴 We have Estimations! Yay! all 🔴 ${estimations.length} of them  🔴');
    int cnt = 0;
    estimations.forEach((e) {
      cnt++;
      debugPrint(
          '✳️ ESTIMATION  🔴  #$cnt  🔴 distance from vehicle: 🔵  ${e.distanceInKM} 🔵  km to 🔴 ${e.landmarkName} 🔴 🔴 ');
    });
    Navigator.push(context, SlideRightRoute(
      widget: EstimationPage(route: route,),
    ));
  }

  @override
  onLandmarkInfoWindowTapped(LandmarkDTO landmark) {
    // TODO: implement onLandmarkInfoWindowTapped
    return null;
  }

  @override
  onLandmarkTapped(LandmarkDTO landmark) {
    // TODO: implement onLandmarkTapped
    return null;
  }

  @override
  onLongPress(LatLng latLng) {
    debugPrint(
        '\n\n❄️❄️❄️ Map long pressed, 🔵 🔵 use latLng $latLng to drive calc 🔵 🔵 \n\n');
    latitude = latLng.latitude;
    longitude = latLng.longitude;
    _startEstimationTest();
    return null;
  }

  @override
  onPointInfoWindowTapped(RoutePoint point) {
    // TODO: implement onPointInfoWindowTapped
    return null;
  }

  @override
  onPointTapped(RoutePoint point) {
    // TODO: implement onPointTapped
    return null;
  }

  @override
  onTimerCancelled() {
    // TODO: implement onTimerCancelled
    return null;
  }
}
