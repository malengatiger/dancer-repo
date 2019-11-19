import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/dancer/dancer_data_api.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/maps/route_distance_calculator.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/maps/snap_to_roads.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:latlong/latlong.dart' as mlb;
import 'package:route_walker/bloc/route_builder_bloc.dart';

import 'landmark_city_page.dart';
import 'landmark_routes_page.dart';

/*
This class looks for possible landmarks along a set of route points
 */

class FlagRoutePointLandmarks extends StatefulWidget {
  final ar.Route route;
  final RoutePoint routePoint;

  const FlagRoutePointLandmarks(
      {Key key, @required this.route, this.routePoint})
      : super(key: key);

  @override
  FlagRoutePointLandmarksState createState() {
    return new FlagRoutePointLandmarksState();
  }
}

class FlagRoutePointLandmarksState extends State<FlagRoutePointLandmarks>
    implements
        LandmarkCardListener,
        SnackBarListener,
        NearbyLandmarkListener,
        RouteMapListener,
        LandmarkEditorListener,
        LocationListener {
  final GlobalKey<ScaffoldState> _key = GlobalKey();
  bool showConnectButton = true;
  List<BottomNavigationBarItem> _navItems = [
    BottomNavigationBarItem(
        icon: Icon(
          Icons.cancel,
          color: Colors.pink,
        ),
        title: Text('Delete Route')),
    BottomNavigationBarItem(
        icon: Icon(Icons.location_on), title: Text('Geo Locations')),
    BottomNavigationBarItem(icon: Icon(Icons.map), title: Text('Route Map')),
  ];

  ar.Route _route;

  @override
  initState() {
    super.initState();
    _buildNavItems();
  }

  _calculateDistances() async {
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Calculating Landmark distances',
        textColor: Colors.lightGreen,
        backgroundColor: Colors.black);

    List<CalculatedDistance> list =
        await RouteDistanceCalculator.calculate(route: widget.route);
    if (_key.currentState != null) {
      _key.currentState.removeCurrentSnackBar();
    }
    debugPrint(
        '\n\n💛 💛 💛 💛 💛 LandmarksPage: returned ${list.length} calculated distances');
    var tot = 0.0;
    list.forEach((d) {
      tot += d.distanceInMetres;
    });
    debugPrint(
        '💛 💛 💛 💛 💛 LandmarksPage: total distance  🍎  $tot metres  🍎   \n\n');
//    } else
//      Navigator.push(context,
//          SlideRightRoute(widget: CalculatedDistancePage(widget.route)));
  }

  List<LandmarkAndRoutePoint> landmarkPoints = List();

  List<Landmark> routeLandmarks, landmarksNearRoutePoint = List();

  _startRouteMap() {
    List<ar.Route> list = List();
    list.add(widget.route);
    Navigator.push(
      context,
      SlideRightRoute(
        widget: RouteMap(
          hideAppBar: false,
          title: widget.route.name,
          routes: list,
          listener: this,
          landmarkIconColor: RouteMap.colorAzure,
          polylineColor: RouteMap.colorWhite,
        ),
      ),
    );
  }

  _startLandmarkCity(Landmark landmark) {
    Landmark mark;
    routeLandmarks.forEach((m) {
      if (landmark.landmarkID == m.landmarkID) {
        mark = m;
      }
    });
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => LandmarkCityPage(
                  landmark: mark,
                )));
  }

  List<LandmarkAndRoutePoint> possibleLandmarks = List(), marks = List();
  List<BottomNavigationBarItem> barItems = List();

  _buildNavItems() {
    barItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.map),
      title: Text('Route Map'),
    ));
    barItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.my_location),
      title: Text('Distances'),
    ));
    barItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.location_on),
      title: Text('Link Places'),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text(
          "Flag Landmark Route Points",
          style: Styles.whiteSmall,
        ),
        elevation: 16,
        backgroundColor: Colors.indigo.shade400,
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(240),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Column(
                      children: <Widget>[
                        Text(
                          widget.route.name,
                          style: Styles.whiteBoldSmall,
                        ),
                        SizedBox(
                          height: 28,
                        ),
                        showConnectButton == false
                            ? Container()
                            : RaisedButton(
                                color: Colors.pink[700],
                                elevation: 8,
                                child: Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Text(
                                    'Find Landmarks',
                                    style: Styles.whiteSmall,
                                  ),
                                ),
                                onPressed: _findPossibleLandmarksAlongRoute,
                              ),
                      ],
                    ),
                    SizedBox(
                      width: 20,
                    ),
                    GestureDetector(
                      onTap: () {
                        _findPossibleLandmarksAlongRoute();
                      },
                      child: Column(
                        children: <Widget>[
                          Text(
                            landmarkPoints == null
                                ? '0'
                                : '${landmarkPoints.length}',
                            style: Styles.whiteBoldLarge,
                          ),
                          SizedBox(
                            height: 4,
                          ),
                          Text(
                            'Landmarks',
                            style: Styles.blackBoldSmall,
                          ),
                        ],
                      ),
                    )
                  ],
                ),
                SizedBox(
                  height: 28,
                ),
                Text(
                  'This will flag route points that are situated at an existing landmark. RoutePoint will carry that landmark data',
                  style: Styles.whiteSmall,
                ),
                SizedBox(
                  height: 28,
                ),
              ],
            ),
          ),
        ),
      ),
      backgroundColor: Colors.brown.shade100,
      bottomNavigationBar: BottomNavigationBar(
        items: barItems,
        backgroundColor: Colors.brown[100],
        elevation: 8,
        onTap: _onNavItemTapped,
      ),
      body: Stack(
        children: <Widget>[
          ListView.builder(
              itemCount: landmarkPoints == null ? 0 : landmarkPoints.length,
              itemBuilder: (context, index) {
                return LandmarkCard(
                  landmark: landmarkPoints.elementAt(index).landmark,
                  route: widget.route,
                  listener: this,
                );
              }),
        ],
      ),
    );
  }

  @override
  onLandmarkNameTapped(Landmark landmark) {}

  @override
  onSequenceNumberTapped(Landmark landmark) {
    print('change sequence number here ....');
  }

  String landmarkName = '';

  void _onNameChanged(String value) {
    landmarkName = value;
  }

  @override
  onActionPressed(int action) {
    Navigator.pop(context, true);
  }

  @override
  onNearbyLandmarkTapped(Landmark landmark) {
    debugPrint('${landmark.landmarkName} received from tap');
    return null;
  }

  @override
  onCancel() {
    Navigator.pop(context);
  }

  @override
  onError(String message) {
    AppSnackbar.showErrorSnackbar(
        scaffoldKey: _key,
        message: message,
        actionLabel: 'Cancel',
        listener: this);
  }

  bool _isBackFromEditor = false;

  @override
  onSuccess(Landmark landmark) {
    debugPrint(
        '\n\nLandmarksPage: ️🍀️ landmark addition successful. ❤️ 🧡 💛 Did the magic happen? ${landmark.landmarkName}');
    setState(() {
      _isBackFromEditor = true;
    });
  }

  var existing = Map<String, LandmarkAndRoutePoint>();
  var newLandmarks = Map<String, LandmarkAndRoutePoint>();
  _findPossibleLandmarksAlongRoute() async {
    if (_key == null) {
      throw Exception('_key is NULL');
    }
    landmarkPoints.clear();
    setState(() {});
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key, message: 'Finding possible landmarks');

    List<RoutePoint> mList =
        widget.route.routePoints.take(1).toList(growable: true);
    debugPrint(
        '🔵 🔵 🔵 Traversing 🧡 ${widget.route.routePoints.length} points looking for landmarks');
    _preparePoints(mList);
    debugPrint(
        '🔴 🔴  using ${mList.length} points to search for landmarks ...');
    Map<String, LandmarkAndRoutePoint> hashMap = Map();
    await _getNearestLandmarkPoints(mList, hashMap);
    debugPrint(
        '🔴 🔴   ${landmarkPoints.length} landmark points found ... 🔴 🔴 ');
//    _splitExistingLandmarkPoints();
    _key.currentState.removeCurrentSnackBar();

    debugPrint(
        '🔴 🔴 🔴 Landmarks possibly on route: 🧡 ${landmarkPoints.length} 🧡 \n\n');
    landmarkPoints.forEach((p) {
      debugPrint(
          '🔴  routePointIndex : ${p.routePoint.index}  🧩 🧩 Landmark 🧩 ${p.distance} metres 🧩 from routePoint is possibly on route: 🧡 ${p.landmark.landmarkName} ');
    });
    debugPrint(
        '\n🧡 🧡 🧡 🧡 landmarks found on route: ${landmarkPoints.length}');
    setState(() {
      showConnectButton = true;
    });
    if (landmarkPoints.isNotEmpty) {
      _addRouteToLandmarks();
    }
  }

  void _preparePoints(List<RoutePoint> mList) {
    var index = 0;
    widget.route.routePoints.forEach((p) {
      p.index = index;
      p.landmarkName = null;
      p.landmarkID = null;
      index++;
    });

    widget.route.routePoints.forEach((p) {
      var m = p.index % 50;
      if (m == 0) {
        mList.add(p);
      }
    });
    mList.add(widget.route.routePoints.last);
  }

  void _splitExistingLandmarkPoints() {
    existing = Map<String, LandmarkAndRoutePoint>();
    newLandmarks = Map<String, LandmarkAndRoutePoint>();

    landmarkPoints.forEach((mark) {
      bool found = false;
      widget.route.routePoints.forEach((rp) {
        if (mark.landmark.landmarkID == rp.landmarkID) {
          found = true;
          existing[mark.landmark.landmarkID] = mark;
        }
      });
      if (!found) {
        newLandmarks[mark.landmark.landmarkID] = mark;
      }
    });
  }

  Future _getNearestLandmarkPoints(List<RoutePoint> mList,
      Map<String, LandmarkAndRoutePoint> hashMap) async {
    for (var point in mList) {
      List<Landmark> landmarksNearRoute =
          await routeBuilderBloc.findLandmarksNearRoutePoint(point, 5.0);
      for (var mark in landmarksNearRoute) {
        //this is a landmark on the route - add it
        var nearestPoint = await routeBuilderBloc.findRoutePointNearestLandmark(
            route: widget.route, landmark: mark);

        if (nearestPoint != null) {
          double distance = _distanceUtil.distance(
              mlb.LatLng(mark.latitude, mark.longitude),
              mlb.LatLng(nearestPoint.latitude, nearestPoint.longitude));
          if (distance < 50) {
            //get real index from widget route
            widget.route.routePoints.forEach((p) {
              if (p.latitude == nearestPoint.latitude &&
                  p.longitude == nearestPoint.longitude) {
                nearestPoint.index = p.index;
              }
            });
            nearestPoint.landmarkID = mark.landmarkID;
            nearestPoint.landmarkName = mark.landmarkName;
            hashMap[mark.landmarkID] =
                LandmarkAndRoutePoint(mark, nearestPoint, distance);
            //remove landmarks already in route points  ;
            setState(() {
              landmarkPoints = hashMap.values.toList();
            });
          }
        }
      }
    }
  }

  mlb.Distance _distanceUtil = mlb.Distance();
  @override
  onLandmarkInfoWindowTapped(Landmark landmark) {
    if (landmark.routeDetails.isNotEmpty) {
      Navigator.push(
          context, SlideRightRoute(widget: LandmarkRoutesPage(landmark)));
    }
    debugPrint(
        'onLandmarkInfoWindowTapped: 🍀️🍀️ ${landmark.landmarkName} 🍀️');
  }

  @override
  onLandmarkTapped(Landmark landmark) {
    debugPrint('onLandmarkTapped: 🍀️🍀️🍀️  ${landmark.landmarkName} ');
  }

  @override
  onLongPress(LatLng latLng) {
    debugPrint('onLongPress $latLng: 🍀️🍀️  $latLng  🍀️');
  }

  @override
  onPointInfoWindowTapped(RoutePoint point) {
    debugPrint('onPointInfoWindowTapped: 🍀️🍀️🍀️ $point');
  }

  @override
  onPointTapped(RoutePoint point) {
    debugPrint('onPointTapped: 🍀️🍀️🍀️ $point');
  }

  void _onNavItemTapped(int value) {
    switch (value) {
      case 0:
        _startRouteMap();
        break;
      case 2:
        _linkPlacesForAllLandmarks();
        break;
      case 1:
        _calculateDistances();
        break;
    }
  }

  void _linkPlacesForAllLandmarks() async {
    debugPrint('🔵🔵🔵 _linkPlacesForAllLandmarks. ');
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Linking places',
        textColor: Colors.lightGreen,
        backgroundColor: Colors.black);

    for (var landmark in marks) {
      var res = await routeBuilderBloc.findCitiesNearLandmark(
          landmark: landmark.landmark, radiusInKM: 3.0);
      print(res);
    }
  }

  @override
  void onRoutePointsFound(String routeID, List<RoutePoint> routePoints) {
    debugPrint(
        '♻️♻️♻️♻️♻️♻️ onRoutePointsFound $routeID -  💛 points ${routePoints.length}');
    //todo - this route point must be updated to contain landmark data
  }

  void _addRouteToLandmarks() async {
    debugPrint(
        '\n\n_addRouteToLandmarks  🧩 🧩 🧩 ... ${landmarkPoints.length}');
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Adding route to ${landmarkPoints.length} landmarks');
    try {
      var routePointsForLandmarks = List<RoutePoint>();
      landmarkPoints.forEach((lp) {
        lp.routePoint.landmarkName = lp.landmark.landmarkName;
        lp.routePoint.landmarkID = lp.landmark.landmarkID;
        routePointsForLandmarks.add(lp.routePoint);
        print(
            '♻️♻️♻️ Landmark point to be added/updated: ${lp.landmark.landmarkName}');
      });

      debugPrint(
          ' 🧩 🧩 🧩 ${routePointsForLandmarks.length} landmark points to be updated ...');
      await _updatePoints(routePointsForLandmarks);
      _route = await routeBuilderBloc
          .getRouteByIDAndCacheLocally(widget.route.routeID);
      //todo - calculate distances
      await RouteDistanceCalculator.calculate(route: _route);
      _route = await routeBuilderBloc
          .getRouteByIDAndCacheLocally(widget.route.routeID);
      Navigator.pop(context, _route);
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Add Route to Landmarks Failed:\n ${e.message}');
    }
  }

  Future _updatePoints(List<RoutePoint> routePoints) async {
    print(
        '🍎🍎🍎🍎 _updatePoints: adding ${routePoints.length} route points to 🍎 ${widget.route.name} ...');

    if (routePoints.length < 300) {
      await DancerDataAPI.updateLandmarkRoutePoints(
          routeId: widget.route.routeID, routePoints: routePoints);
    } else {
      var batches = BatchUtil.makeBatches(routePoints, 300);
      batches.forEach((mKey, mValue) async {
        await DancerDataAPI.updateLandmarkRoutePoints(
          routeId: _route.routeID,
          routePoints: mValue,
        );
      });
    }
  }
}

class LandmarkEditor extends StatefulWidget {
  final RoutePoint routePoint;
  final ar.Route route;
  final LandmarkEditorListener listener;
  final bool withScaffold;

  LandmarkEditor(
      {@required this.routePoint,
      @required this.route,
      @required this.withScaffold,
      @required this.listener});

  @override
  _LandmarkEditorState createState() => _LandmarkEditorState();
}

class _LandmarkEditorState extends State<LandmarkEditor>
    implements SnackBarListener {
  String landmarkName;
  int sequence;
  List<Landmark> landmarks;
  ar.Route _route;
  String routeID;

  @override
  void initState() {
    super.initState();
    _search();
  }

  void _search() async {
    routeID = widget.route.routeID;
    _route = await LocalDBAPI.getRoute(routeID, widget.route.name);
    if (_route == null) {
      _route = await routeBuilderBloc.getRouteByIDAndCacheLocally(routeID);
    }
    landmarks = await routeBuilderBloc.findLandmarksNearRoutePoint(
        widget.routePoint, 0.1);
    landmarks.forEach((m) {
      prettyPrint(m.toJson(), 'LANDMARK NEAREST 🔆 🔆 🔆 🔆 ');
    });
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return widget.withScaffold
        ? Scaffold(
            key: _key,
            appBar: AppBar(
              title: Text('Landmark Editor'),
              bottom: PreferredSize(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: <Widget>[
                        _getCard(),
                        SizedBox(
                          height: 40,
                        ),
                      ],
                    ),
                  ),
                  preferredSize: Size.fromHeight(360)),
            ),
            backgroundColor: Colors.brown[100],
            body: Padding(
              padding: const EdgeInsets.only(top: 48.0, left: 12, right: 12),
              child: ListView.builder(
                  itemCount: landmarks == null ? 0 : landmarks.length,
                  itemBuilder: (BuildContext context, index) {
                    var mark = landmarks.elementAt(index);
                    return GestureDetector(
                      onTap: () {
                        _setAsLandmark(mark);
                      },
                      child: Card(
                        elevation: 2,
                        child: Column(
                          children: <Widget>[
                            ListTile(
                              leading: Icon(Icons.apps),
                              title: Text(
                                mark.landmarkName,
                                style: Styles.blackBoldMedium,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
            ),
          )
        : Container(
            width: 400,
            height: 300,
            child: _getCard(),
          );
  }

  Widget _getCard() {
    return Card(
      elevation: 8,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: <Widget>[
            Text(
              'New Landmark',
              style: Styles.blackBoldLarge,
            ),
            SizedBox(
              height: 8,
            ),
            Text(
              _route == null ? '' : _route.name,
              style: Styles.greyLabelSmall,
            ),
            SizedBox(
              height: 24,
            ),
            TextField(
              keyboardType: TextInputType.text,
              decoration: InputDecoration(
                hintText: 'Enter Landmark Name',
              ),
              onChanged: _onNameChanged,
            ),
            SizedBox(
              height: 24,
            ),
            Row(
              children: <Widget>[
                FlatButton(
                  child: Text('Cancel'),
                  onPressed: () {
                    debugPrint('Cancel new landmark creation');
                    widget.listener.onCancel();
                  },
                ),
                SizedBox(
                  width: 40,
                ),
                RaisedButton(
                  elevation: 8,
                  color: Colors.blue[700],
                  child: Text(
                    'Save Landmark',
                    style: Styles.whiteSmall,
                  ),
                  onPressed: _addNewLandmark,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _onNameChanged(String value) {
    print(value);
    landmarkName = value;
  }

  void _addNewLandmark() async {
    if (landmarkName == null || landmarkName.isEmpty) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Please enter landmark name');
      return;
    }

    var landmark = Landmark(
      landmarkName: landmarkName,
      latitude: widget.routePoint.latitude,
      longitude: widget.routePoint.longitude,
    );
    landmark.routeDetails = List();
    landmark.routeDetails
        .add(RouteInfo(name: widget.route.name, routeID: widget.route.routeID));

    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key, message: 'Adding new landmark ');
    try {
      var m = await routeBuilderBloc.addLandmark(landmark);
      debugPrint(
          '\n️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️  New landmark added: ️🍀️️🍀️️🍀️ $landmarkName');

      widget.listener.onSuccess(m);
      AppSnackbar.showSnackbarWithAction(
          scaffoldKey: _key,
          message: 'Route Added to Landmark ',
          action: 1,
          listener: this,
          backgroundColor: Colors.teal[800],
          actionLabel: 'Done');
    } catch (e) {
      widget.listener.onError('Failed');
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Add Landmark Failed');
    }
  }

  var _key = GlobalKey<ScaffoldState>();
  void _setAsLandmark(Landmark mark) async {
    print(
        ' 🧩 🧩 🧩 this route should be added to Landmark: ${mark.landmarkName}');
    prettyPrint(widget.routePoint.toJson(),
        "Landmark Route Point 🔴 TODO 🔴  - has to be updated on MongoDB");

    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key, message: 'Setting landmark route');
    try {
      await routeBuilderBloc.addRouteToLandmark(
          route: widget.route, landmark: mark, routePoint: widget.routePoint);
      AppSnackbar.showSnackbarWithAction(
          scaffoldKey: _key,
          message: 'Route added to Landmark',
          action: 1,
          listener: this,
          actionLabel: 'Done');
    } catch (e) {
      print(e);
      widget.listener.onError('Failed');
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Route linking failed');
    }
  }

  @override
  onActionPressed(int action) {
    Navigator.pop(context);
  }
}

abstract class LandmarkEditorListener {
  onCancel();

  onSuccess(Landmark landmark);

  onError(String message);
}

abstract class LandmarkCardListener {
  onLandmarkNameTapped(Landmark landmark);

  onSequenceNumberTapped(Landmark landmark);
}

class LandmarkCard extends StatelessWidget {
  final Landmark landmark;
  final ar.Route route;
  final Color cardColor;
  final TextStyle titleStyle, captionStyle;
  final double elevation;
  final LandmarkCardListener listener;

  LandmarkCard(
      {@required this.landmark,
      this.cardColor,
      this.titleStyle,
      this.captionStyle,
      this.elevation,
      @required this.route,
      this.listener});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: cardColor == null ? Colors.white : cardColor,
      elevation: elevation == null ? 2 : elevation,
      child: Padding(
        padding: const EdgeInsets.only(left: 8.0),
        child: Column(
          children: <Widget>[
            GestureDetector(
              onTap: () {
                if (listener != null) {
                  listener.onLandmarkNameTapped(landmark);
                }
              },
              child: ListTile(
                leading: Icon(
                  Icons.my_location,
                  color: getRandomColor(),
                ),
                title: Text(
                  landmark.landmarkName,
                  style: Styles.blackBoldSmall,
                ),
                subtitle: Column(
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        Text(
                          'Routes',
                          style: Styles.greyLabelSmall,
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Text(
                          landmark.routeDetails == null
                              ? '0'
                              : '${landmark.routeDetails.length}',
                          style: Styles.pinkBoldMedium,
                        ),
                        SizedBox(
                          width: 20,
                        ),
                        Text(
                          'Places Linked:',
                          style: Styles.greyLabelSmall,
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Text(
                          landmark.cities == null
                              ? '0'
                              : '${landmark.cities.length}',
                          style: Styles.tealBoldMedium,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

abstract class NearbyLandmarkListener {
  onNearbyLandmarkTapped(Landmark landmark);
}

class NearbyLandmark extends StatelessWidget {
  final NearbyLandmarkListener listener;
  final Landmark landmark;

  NearbyLandmark({@required this.listener, @required this.landmark});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: FlatButton(
        child: Text(
          landmark.landmarkName,
          style: Styles.blackMedium,
        ),
        onPressed: () {
          print('landmark tapped: ${landmark.landmarkName}');
          listener.onNearbyLandmarkTapped(landmark);
        },
      ),
    );
  }
}

class LandmarkAndRoutePoint {
  Landmark landmark;
  RoutePoint routePoint;
  double distance;

  LandmarkAndRoutePoint(this.landmark, this.routePoint, this.distance);
}
