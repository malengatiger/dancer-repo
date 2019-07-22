import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/maps/calculated_distance_page.dart';
import 'package:aftarobotlibrary4/maps/route_distance_calculator.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';

import 'landmark_city_page.dart';
import 'landmark_routes_page.dart';

class LandmarksPage extends StatefulWidget {
  final ar.Route route;
  final RoutePoint routePoint;

  const LandmarksPage({Key key, @required this.route, this.routePoint})
      : super(key: key);
  @override
  LandmarksPageState createState() {
    return new LandmarksPageState();
  }
}

class LandmarksPageState extends State<LandmarksPage>
    implements
        LandmarkCardListener,
        SnackBarListener,
        NearbyLandmarkListener,
        RouteMapListener,
        LandmarkEditorListener, LocationListener {
  final GlobalKey<ScaffoldState> _key = GlobalKey();
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
  @override
  initState() {
    super.initState();
    _buildNavItems();
    _controlPopUp();
  }

  _calculateDistances() async {
    if (widget.route.calculatedDistances.isEmpty) {
      AppSnackbar.showSnackbarWithProgressIndicator(
          scaffoldKey: _key,
          message: 'Calculating Landmark distances',
          textColor: Colors.lightGreen,
          backgroundColor: Colors.black);

      List<CalculatedDistance> list =
          await RouteDistanceCalculator.calculate(
              route: widget.route);
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
    } else
      Navigator.push(context,
          SlideRightRoute(widget: CalculatedDistancePage(widget.route)));
  }

  _controlPopUp() async {
    debugPrint(
        '🔵🔵🔵 _controlPopUp: - getting route landmarks ..... ${widget.route.name}');
    landmarks = await routeBuilderBloc.getRouteLandmarks(widget.route);
    if (widget.routePoint != null) {
      nearestLandmarks =
          await routeBuilderBloc.findLandmarksNearRoutePoint(widget.routePoint);
    }
    if (nearestLandmarks != null && nearestLandmarks.isNotEmpty) {
      if (_isInRouteLandmarks()) {
        hidePopup = true;
      } else {
        hidePopup = false;
      }
    } else {
      hidePopup = false;
    }
    if (widget.route == null) {
      hidePopup = true;
    }
    debugPrint(
        '🔵🔵🔵 🔵🔵🔵 _controlPopUp: ......... Hiding popup? $hidePopup');
    setState(() {});
  }

  List<Landmark> landmarks, landmarksNearRoutePoint = List();

  bool _isInRouteLandmarks() {
    if (nearest != null) {
      landmarks.forEach((m) {
        if (m.landmarkID == nearest.landmarkID) {
          debugPrint(
              '\n🧩🧩🧩  🔴 🔴  LandmarksPage: Nearest landmark already has this route: ️🍀️  ${nearest.landmarkName}. cool!\n');
          return true;
        }
        return false;
      });
    }
    return false;
  }

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
    landmarks.forEach((m) {
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

  List<Landmark> nearestLandmarks = List(), marks = List();
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
    assert(routeBuilderBloc != null);
    routeBuilderBloc.model.routeLandmarks
        .sort((a, b) => a.landmarkName.compareTo(b.landmarkName));
    return StreamBuilder<List<Landmark>>(
      initialData: routeBuilderBloc.routeLandmarks,
      stream: routeBuilderBloc.routeLandmarksStream,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          landmarks = snapshot.data;
          _sortLandmarksByDistance();
        }
        return Scaffold(
          key: _key,
          appBar: AppBar(
            title: Text(
              "Route Landmarks",
              style: Styles.whiteSmall,
            ),
            elevation: 16,
            backgroundColor: Colors.indigo.shade300,
            bottom: PreferredSize(
              preferredSize: Size.fromHeight(140),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    StreamBuilder<List<Landmark>>(
                        stream: routeBuilderBloc.routeLandmarksStream,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            landmarks = snapshot.data;
                          }
                          return Row(
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
                                  RaisedButton(
                                    color: Colors.indigo[700],
                                    elevation: 8,
                                    child: Padding(
                                      padding: const EdgeInsets.all(12.0),
                                      child: Text(
                                        'Connect Route Points',
                                        style: Styles.whiteSmall,
                                      ),
                                    ),
                                    onPressed: _connectRoutePoints,
                                  ),
                                ],
                              ),
                              SizedBox(
                                width: 20,
                              ),
                              Column(
                                children: <Widget>[
                                  Text(
                                    landmarks == null
                                        ? '0'
                                        : '${landmarks.length}',
                                    style: Styles.blackBoldLarge,
                                  ),
                                  SizedBox(
                                    height: 4,
                                  ),
                                  Text(
                                    'Landmarks',
                                    style: Styles.blackBoldSmall,
                                  ),
                                ],
                              )
                            ],
                          );
                        }),
                    SizedBox(
                      height: 8,
                    ),
                    nearest == null
                        ? Container()
                        : GestureDetector(
                            child: Row(
                              children: <Widget>[
                                Text(
                                  'Nearest:',
                                  style: Styles.whiteSmall,
                                ),
                                SizedBox(
                                  width: 8,
                                ),
                                Text(
                                  nearest.landmarkName,
                                  style: Styles.blackBoldMedium,
                                ),
                              ],
                            ),
                            onTap: _addNearestLandmarkToRoute,
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
                  itemCount: marks == null ? 0 : marks.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding:
                          const EdgeInsets.only(left: 12, right: 12.0, top: 4),
                      child: LandmarkCard(
                        landmark: marks.elementAt(index),
                        route: widget.route,
                        listener: this,
                      ),
                    );
                  }),
              hidePopup == false
                  ? Positioned(
                      left: 10,
                      top: 10,
                      child: StreamBuilder<List<Landmark>>(
                          initialData: landmarksNearRoutePoint,
                          stream: routeBuilderBloc.landmarksNearPointStream,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              landmarksNearRoutePoint = snapshot.data;
                              print(
                                  '🍎 🍎 🍎 LandmarksPage: StreamBuilder landmarksNearPointStream gave landmarks near point:  🧩  ${landmarksNearRoutePoint.length}, call _buildLandmarkChooser ...');
                              if (landmarksNearRoutePoint.isEmpty) {
                                if (_isInRouteLandmarks()) {
                                  return Container();
                                } else {
                                  if (widget.routePoint != null) {
                                    return LandmarkEditor(
                                      route: widget.route,
                                      routePoint: widget.routePoint,
                                      listener: this,
                                    );
                                  } else {
                                    return Container();
                                  }
                                }
                              }
                              nearest = landmarksNearRoutePoint.elementAt(0);
                              if (_isInRouteLandmarks()) {
                                return Container();
                              }
                              return _buildLandmarkChooser();
                            }
                            return Container();
                          }),
                    )
                  : Container(),
            ],
          ),
        );
      },
    );
  }

  void _sortLandmarksByDistance() {
    marks = List<Landmark>();
    if (widget.route.calculatedDistances.isEmpty) {
      marks = landmarks;
      return;
    }
    widget.route.calculatedDistances.forEach((dist) {
      var m = Landmark(
        landmarkName: dist.fromLandmark,
        landmarkID: dist.fromLandmarkID,
      );
      landmarks.forEach((mx) {
        if (m.landmarkID == mx.landmarkID) {
          m.routeIDs = mx.routeIDs;
          m.routeDetails = mx.routeDetails;
          m.cities = mx.cities;
          m.latitude = mx.latitude;
          m.longitude = mx.longitude;
        }
      });
      marks.add(m);
    });

    var mz = Landmark(
      landmarkName: widget.route.calculatedDistances.last.toLandmark,
      landmarkID: widget.route.calculatedDistances.last.fromLandmarkID,
    );
    landmarks.forEach((m) {
      if (m.landmarkID == widget.route.calculatedDistances.last.toLandmarkID) {
        mz.routeIDs = m.routeIDs;
        mz.routeDetails = m.routeDetails;
        mz.cities = m.cities;
        mz.latitude = m.latitude;
        mz.longitude = m.longitude;
      }
    });
    marks.add(mz);
  }

  bool hidePopup = false;
  Landmark nearest;

  Widget _buildLandmarkChooser() {
    if (_isBackFromEditor) {
      _isBackFromEditor = false;
      return Container();
    }
    return Card(
      elevation: 16.0,
      color: Colors.purple.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            Row(
              children: <Widget>[
                Text(
                  nearest != null
                      ? '${nearest.landmarkName}'
                      : 'No Landmark Nearby',
                  style: Styles.blackBoldSmall,
                ),
              ],
            ),
            SizedBox(
              height: 20,
            ),
            Container(
              width: 300,
              child: Text(
                  'You can assign this route point to an existing landmark (${nearest.landmarkName}).'
                  '\n\nThe Bree Rank example apllies here. The landmark can contain multiple routes as a single entity'),
            ),
            SizedBox(
              height: 20,
            ),
            Row(
              children: <Widget>[
                RaisedButton(
                  color: Colors.pink.shade700,
                  elevation: 8,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'Set Route Point',
                      style: Styles.whiteSmall,
                    ),
                  ),
                  onPressed: _addRouteToLandmark,
                ),
                SizedBox(
                  width: 20,
                ),
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () {
                    setState(() {
                      hidePopup = true;
                    });
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  _addRouteToLandmark() async {
    assert(nearest != null);
    debugPrint(
        '\n\nLandmarksPage: 🍏🍏 _addRouteToLandmark: ... about to add ${widget.route.name} '
        'to  🔴 ${nearest.landmarkName} by calling routeBuilderBloc.addRouteToLandmark\n');

    try {
      await routeBuilderBloc.addRouteToLandmark(
          route: widget.route, landmark: nearest);
//      await routeBuilderBloc.updateRoutePointLandmark(
//          routeID: widget.route.routeID,
//          landmark: nearest,
//          routePoint: widget.routePoint);
      nearest = null;
      setState(() {
        hidePopup = true;
      });
    } catch (e) {
      Navigator.pop(context);
//      AppSnackbar.showErrorSnackbar(
//          scaffoldKey: _key,
//          message: "Unable to add route to landmark, may exist already",
//          actionLabel: 'Cancel',
//          listener: this);
    }
  }


  @override
  onLandmarkNameTapped(Landmark landmark) {
    _startLandmarkCity(landmark);
  }

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
    return null;
  }

  @override
  onNearbyLandmarkTapped(Landmark landmark) {
    debugPrint('${landmark.landmarkName} received from tap');
    return null;
  }

  void _addNearestLandmarkToRoute() async {
    debugPrint('🔵🔵🔵 _addNearestlandmarkToRoute ................');
    if (nearest == null) {
      print('Nearest is null ... 😡😡😡 what the fuck?');
      return;
    }
    prettyPrint(nearest.toJson(), '🔵🔵🔵 Nearest Landmark');
//    try {
//      var res = await routeBuilderBloc.addRouteToLandmark(
//          route: widget.route, landmark: nearest);
//      await routeBuilderBloc.updateRoutePointLandmark(
//          routePoint: widget.routePoint,
//          landmark: nearest,
//          routeID: widget.route.routeID);
//      debugPrint(
//          'LandmarksPage: 🧩🧩🧩 Route ${widget.route
//              .name} added to landmark: ${nearest.landmarkName}');
//      debugPrint('Result 🔵🔵🔵 : $res');
//    } catch (e) {
//      AppSnackbar.showErrorSnackbar(
//          scaffoldKey: _key,
//          message: e.message,
//          actionLabel: 'Err',
//          listener: this);
//    }
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
      hidePopup = true;
    });
  }


  void _connectRoutePoints() async {
    debugPrint(
        '\n\n🔵🔵🔵 _connectRoutePoints ....... this may take a while ....');
    //get every route point a position
    assert(widget.route != null);
    assert(widget.route.routePoints.isNotEmpty);
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Connecting route points ...',
        textColor: Colors.white,
        backgroundColor: Colors.black);
    try {
      List<RoutePoint> landmarkPoints = List();
      for (var mark in landmarks) {
        RoutePoint point = await routeBuilderBloc.findRoutePointNearestLandmark(
          route: widget.route,
            landmark: mark);
          landmarkPoints.add(point);
          widget.route.routePoints.forEach((p) {
            if (point.latitude == p.latitude && point.longitude == p.latitude) {
              p.landmarkID = mark.landmarkID;
              p.landmarkName = mark.landmarkName;
            }
          });


      }
      var cnt = 0;
      widget.route.routePoints.forEach((p) {
        if (p.landmarkID != null) {
          cnt++;
          prettyPrint(p.toJson(), '🔴🔴🔴🔴 #$cnt -  💛 Route point that is a LANDMARK  💛');
        }
      });
      await routeBuilderBloc.updateRoutePoints(routeID: widget.route.routeID, points: landmarkPoints);
      await RouteDistanceCalculator.calculate(route: widget.route);
      if (_key.currentState != null) _key.currentState.removeCurrentSnackBar();
    } catch (e) {
      print(e);
    }
  }


  @override
  onLandmarkInfoWindowTapped(Landmark landmark) {
    if (landmark.routeDetails.isNotEmpty && landmark.routeIDs.isNotEmpty) {
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
          landmark: landmark, radiusInKM: 3.0);
      print(res);
    }
  }

  @override
  onCitiesFound(List<CityDTO> cities) {
    debugPrint(
        '🔵🔵🔵 LandmarksPage: ️♻️♻️♻️♻ onCitiesFound: ${cities.length}. ️♻️♻️♻️♻');
    return null;
  }

//  @override
//  onCitiesNearLandmark(Landmark landmark, List<CityDTO> cities) async {
//    debugPrint(
//        '\n\n🔵🔵🔵 LandmarksPage: ️♻️♻️♻️ onCitiesFound: 🍎 ${cities.length} 🍎  near ${landmark.landmarkName}. ️♻️♻️♻️');
//    Map<String, CityDTO> map = Map();
//    landmark.cities.forEach((bc) {
//      map['${bc.cityID}'] = City.fromJson(bc.toJson());
//    });
//    cities.forEach((c) {
//      map['${c.cityID}'] = c;
//    });
//
//    landmark.cities.clear();
//    map.forEach((k, c) {
//      landmark.cities.add(BasicCity(
//        cityID: c.cityID,
//        name: c.name,
//        provinceName: c.provinceName,
//      ));
//    });
//    await routeBuilderBloc.addCityToLandmark(landmark, null);
//    debugPrint(
//        '\n\n❤️ 🧡 💛  LandmarksPage: ️♻️♻️♻️ landmark updated: ${landmark.landmarkName} and has  💛 ${landmark.cities.length} cities️ 💛 \n\n');
//    if (_key.currentState != null) {
//      _key.currentState.removeCurrentSnackBar();
//    }
//    setState(() {});
//  }

  @override
  void onRoutePointsFound(String routeID, List<RoutePoint> routePoints) {
    debugPrint('♻️♻️♻️♻️♻️♻️ onRoutePointsFound $routeID -  💛 points ${routePoints.length}');
    //todo - this route point must be updated to contain landmark data
  }

  @override
  onCitiesNearLandmark(landmark, List<CityDTO> cities) {
    // TODO: implement onCitiesNearLandmark
    return null;
  }
}

class LandmarkEditor extends StatefulWidget {
  final RoutePoint routePoint;
  final ar.Route route;
  final LandmarkEditorListener listener;
  LandmarkEditor(
      {@required this.routePoint,
      @required this.route,
      @required this.listener});

  @override
  _LandmarkEditorState createState() => _LandmarkEditorState();
}

class _LandmarkEditorState extends State<LandmarkEditor> {
  String landmarkName;
  int sequence;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 400,
      height: 300,
      child: Card(
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
      ),
    );
  }

  void _onNameChanged(String value) {
    print(value);
    landmarkName = value;
  }

  void _onSeqChanged(String value) {
    print(value);
    sequence = int.parse(value);
  }

  void _addNewLandmark() async {
    if (landmarkName.isEmpty) {
      widget.listener.onError('Please enter landmark name');
      return;
    }
    if (sequence == null) {
      sequence = 0;
    }
    var landmark = Landmark(
      landmarkName: landmarkName,
      latitude: widget.routePoint.latitude,
      longitude: widget.routePoint.longitude,
    );
    landmark.routeIDs = List();
    landmark.routeDetails = List();
    landmark.routeIDs.add(widget.route.routeID);
    landmark.routeDetails.add(RouteInfo(
        name: widget.route.name,
        routeID: widget.route.routeID));
    var m = await routeBuilderBloc.addLandmark(landmark);
    debugPrint(
        '\n️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️  New landmark added: ️🍀️️🍀️️🍀️ $landmarkName');
    widget.listener.onSuccess(m);
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
      @required this.listener});

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
                          landmark.routeIDs == null
                              ? '0'
                              : '${landmark.routeIDs.length}',
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
