import 'dart:async';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/position.dart';
import 'package:aftarobotlibrary4/data/route.dart' as aftarobot;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/maps/route_distance_calculator.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/maps/snap_to_roads.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';
import 'package:route_walker/ui/landmark_manager.dart';

import 'cards.dart';
import 'flag_routepoint_landmarks.dart';
import 'landmark_city_page.dart';

class CreateRoutePointsPage extends StatefulWidget {
  final aftarobot.Route route;

  CreateRoutePointsPage(this.route);

  @override
  _CreateRoutePointsPageState createState() => _CreateRoutePointsPageState();
}

class _CreateRoutePointsPageState extends State<CreateRoutePointsPage>
    implements SnackBarListener, RouteMapListener {
  final GlobalKey<ScaffoldState> _key = GlobalKey();
  List<RoutePoint> _rawRoutePoints = List();
  List<Landmark> _landmarks = List();
  Completer<GoogleMapController> _completer = Completer();
  GoogleMapController _mapController;
  CameraPosition _cameraPosition = CameraPosition(
    target: LatLng(0.0, 0.0),
    zoom: 14.0,
  );
  BitmapDescriptor _markerIcon;
//  aftarobot.Route _route;

  @override
  void initState() {
    super.initState();
    print('🔆 🔆 🔆  ManageLandmarkPage: initState');
    _getRoute();
  }

  String routeID;
  void _getRoute() async {
    _rawRoutePoints =
        await LocalDBAPI.getRawRoutePoints(routeID: widget.route.routeID);
    assert(_rawRoutePoints.isNotEmpty);
    myDebugPrint(
        '\n\n🍏 🍎  Raw route points collected:  🧩 ${_rawRoutePoints.length} 🧩 '
        ' snapped: ${_routePoints.length} 🧩\n\n');
    _rawRoutePoints.forEach((p) {
      print(p.toJson());
    });
    setState(() {});
    await _getLandmarks();
  }

  Future _getLandmarks() async {
    try {
      _landmarks = await routeBuilderBloc.getRouteLandmarks(widget.route);
      _buildItems();
      setState(() {});
    } catch (e) {
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: e.toString());
    }
  }

  void _buildItems() {
    for (var m in _landmarks) {
      var item = DropdownMenuItem<Landmark>(
        value: m,
        child: ListTile(
          leading: Icon(
            Icons.my_location,
            color: getRandomColor(),
          ),
          title: Text(m.landmarkName),
        ),
      );
      _items.add(item);
    }
  }

  List<RoutePoint> _routePoints = List();

  Set<Marker> _markers = Set();
  void _setRouteMarkers() async {
    print(
        '🔵 set markers ... 🔵 ...🔵 ...🔵 ... 🔵 ... points: ${_rawRoutePoints.length} 🍀️🍀️🍀️');
    if (_rawRoutePoints.isEmpty) {
      print('🔵 set markers ... 🔵 ...🔵 ...🔵 ... 🔵 . QUIT! No points');
      return;
    }

    _markers.clear();
    var icon =
        BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
    // await _buildMarkerIcon();
    try {
      _rawRoutePoints.forEach((m) {
        icon =
            BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueYellow);

        _markers.add(Marker(
            onTap: () {
              print(
                  'RoutePointManager:  🧩 🧩 🧩marker tapped!! ❤️ 🧡 💛   ${m.created}');
              _onMarkerTapped(m);
            },
            icon: icon,
            markerId: MarkerId(DateTime.now().toIso8601String()),
            position: LatLng(m.latitude, m.longitude),
            infoWindow: InfoWindow(title: m.created, snippet: m.created)));
      });
      print('🍏 🍎 markers added: ${_markers.length}');
      if (_mapController == null) {
        print(
            '🔵 set markers ... 🔵 ...🔵 ...🔵 ... 🔵 . QUIT! MapController is null');
        return;
      }
      _mapController.animateCamera(
          CameraUpdate.newLatLngZoom(_markers.elementAt(0).position, 15));
    } catch (e) {
      print(e);
    }
  }

  bool showLandmarkEditor = false, showButton = false;
  List<DropdownMenuItem<Landmark>> _items = List();

  _onMarkerTapped(RoutePoint point) {
    print('Marker tapped: route: ${point.created}');
    _mapController.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(
        target: LatLng(point.latitude, point.longitude), zoom: 16.0)));
    if (widget.route.routePoints.isNotEmpty) {
      _startLandmarksPage(point);
    }
  }

  _startLandmarksPage(RoutePoint marker) {
    Navigator.push(
      context,
      SlideRightRoute(
        widget: FlagRoutePointLandmarks(
          route: widget.route,
          routePoint: marker,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text(
          'Points Manager',
          style: Styles.blackBoldSmall,
        ),
        backgroundColor: Colors.pink.shade300,
        bottom: _getBottom(),
        actions: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              icon: Icon(Icons.map),
              onPressed: () {
                _startRouteMap(false);
              },
            ),
          ),
        ],
      ),
      body: Stack(
        children: <Widget>[
          GoogleMap(
            initialCameraPosition: _cameraPosition,
            mapType: MapType.hybrid,
            markers: _markers,
            myLocationEnabled: true,
            compassEnabled: true,
            zoomGesturesEnabled: true,
            rotateGesturesEnabled: true,
            scrollGesturesEnabled: true,
            tiltGesturesEnabled: true,
            onMapCreated: (mapController) {
              if (!_completer.isCompleted) {
                myDebugPrint(
                    ' 🍏 🍎  🍏 🍎  🍏 🍎  🍏 🍎  🍏 🍎  🍏 🍎  🍏 🍎  onMapCreated: !_completer.isCompleted');
                _completer.complete(mapController);
                _mapController = mapController;
              }
              _setRouteMarkers();

              if (_rawRoutePoints != null && _rawRoutePoints.isNotEmpty) {
                _mapController.animateCamera(CameraUpdate.newLatLngZoom(
                    LatLng(_rawRoutePoints.elementAt(0).latitude,
                        _rawRoutePoints.elementAt(0).longitude),
                    16.0));
              }
            },
          ),
          Positioned(
            top: 12,
            left: 12,
            child: FloatingActionButton(
              backgroundColor: Colors.pink.shade900,
              elevation: 16,
              child: Icon(Icons.airport_shuttle),
              onPressed: () {
                if (widget.route != null &&
                    widget.route.routePoints.isNotEmpty) {
                  Navigator.push(
                    context,
                    SlideRightRoute(
                      widget: FlagRoutePointLandmarks(
                        route: widget.route,
                      ),
                    ),
                  );
                }
//                  _setRoutePolyline();
              },
            ),
          ),
          isBusy == false
              ? Container()
              : Card(
                  child: Center(
                    child: Column(
                      children: <Widget>[
                        SizedBox(
                          height: 60,
                        ),
                        Container(
                          width: 60,
                          height: 60,
                          child: CircularProgressIndicator(
                            backgroundColor: Colors.teal,
                            strokeWidth: 24,
                          ),
                        ),
                        SizedBox(
                          height: 40,
                        ),
                        Text(
                          'Snapping ... Please Wait',
                          style: Styles.blackMedium,
                        ),
                      ],
                    ),
                  ),
                ),
          showButton == false
              ? Container()
              : Positioned(
                  bottom: 12,
                  right: 12,
                  child: RaisedButton(
                    color: Colors.indigo.shade900,
                    elevation: 16,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Confirm Points',
                        style: Styles.whiteSmall,
                      ),
                    ),
                    onPressed: () {
                      _snapPoints();
                    },
                  ),
                ),
        ],
      ),
    );
  }

  int sequenceNumber;
  Landmark landmark;
  String landmarkName;

  @override
  onActionPressed(int action) {
    List<aftarobot.Route> list = List();
    list.add(widget.route);
    Navigator.pop(context);
    switch (action) {
      case 1:
        Navigator.push(context,
            SlideRightRoute(widget: LandmarksManagerPage(widget.route)));
        break;
      case 2:
        _startRouteMap(true);
        break;
      case 3:
        assert(landmark != null);
        Navigator.push(
          context,
          SlideRightRoute(
              widget: LandmarkCityPage(
            landmark: landmark,
          )),
        );

        break;
    }
  }

  void _startRouteMap(bool showConfirm) {
    List<aftarobot.Route> list = List();
    list.add(widget.route);
    Navigator.push(
        context,
        SlideRightRoute(
          widget: RouteMap(
            routes: list,
            hideAppBar: false,
            listener: this,
            title: widget.route.name,
            landmarkIconColor: RouteMap.colorRed,
            containerHeight: showConfirm == false ? 0 : 60,
            container: showConfirm == false
                ? Container()
                : Container(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: RaisedButton(
                        color: Colors.blue.shade800,
                        elevation: 16,
                        onPressed: () {
                          myDebugPrint(
                              '🧩 🧩 🧩 🧩 Confirm Route button pressed  🧩 🧩 🧩 🧩 ');
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            '🧩 🧩 Confirm Route?',
                            style: Styles.whiteSmall,
                          ),
                        ),
                      ),
                    ),
                  ),
          ),
        ));
  }

  TextEditingController controller = TextEditingController();
  LatLng pressedLatLng;
  void _onLongPress(LatLng latLng) {
    myDebugPrint('🧩🧩🧩  map has been long pressed, 🧩 $latLng');
    pressedLatLng = latLng;
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title: new Text(
                "New Landmark",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor),
              ),
              content: Container(
                height: 160.0,
                child: Column(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        children: <Widget>[
                          Text(
                            'New Landmark',
                            style: Styles.blackBoldSmall,
                          ),
                          SizedBox(
                            height: 12,
                          ),
                          TextField(
                            controller: controller,
                            onChanged: _onNameChanged,
                            keyboardType: TextInputType.text,
                            decoration: InputDecoration(hintText: 'Enter Name'),
                          ),
                        ],
                      ),
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
                      _saveLandmark();
                    },
                    elevation: 4.0,
                    color: Colors.blue.shade700,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Update Landmark',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ],
            ));
  }

  String name;
  void _onNameChanged(String value) async {
    print(value);
    name = value;
  }

  _saveLandmark() async {
    if (name.isEmpty) {
      return;
    }
    var m = Landmark(
      landmarkName: name,
      latitude: pressedLatLng.latitude,
      longitude: pressedLatLng.longitude,
      position: Position(
          type: 'Point',
          coordinates: [pressedLatLng.longitude, pressedLatLng.latitude]),
      routeDetails: [
        RouteInfo(
          name: widget.route.name,
          routeID: widget.route.routeID,
        )
      ],
    );
    await routeBuilderBloc.addLandmark(m);
    myDebugPrint(
        '️♻️ ♻️♻️ ♻️   🐸 New landmark added : 🍎 ${m.landmarkName} 🍎 ');
    List<CalculatedDistance> list =
        await RouteDistanceCalculator.calculate(route: widget.route);
    list.forEach((cd) {
      print('Calculated Distance: 🍎 🍎 ${cd.toJson()}');
    });
  }

  @override
  onLandmarkInfoWindowTapped(Landmark landmark) {
    myDebugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onLandmarkInfoWindowTapped: 🧩🧩 ${landmark.landmarkName}  🍎 ');
    landmark.routeDetails.forEach((m) {
      myDebugPrint(
          ' 🐸 🐸 🐸  You can get on route :  🍎 ${m.name} from 🧩🧩 ${landmark.landmarkName}');
    });
  }

  @override
  onLandmarkTapped(Landmark landmark) {
    myDebugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onLandmarkTapped: 🧩🧩 ${landmark.landmarkName}  🥬 ');
    // todo - show UPDATE landmark editor
  }

  @override
  onLongPress(LatLng latLng) {
    myDebugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onLongPress: map pressed on latLng: 🧩🧩 $latLng  💛 ');
    // todo - show NEW landmark editor
  }

  @override
  onPointInfoWindowTapped(RoutePoint point) {
    myDebugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onPointInfoWindowTapped: 🧩🧩 created: ${point.created}  🧡 index: ${point.index}');
    // todo - show NEW landmark editor
  }

  @override
  onPointTapped(RoutePoint point) {
    myDebugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onPointTapped: 🧩🧩  created: ${point.created}  ❤️ index: ${point.index}');
    // todo - show NEW landmark editor
  }

  Widget _getBottom() {
    return PreferredSize(
      preferredSize: Size.fromHeight(120),
      child: Padding(
        padding: const EdgeInsets.only(left: 8.0),
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(left: 16.0),
              child: Row(
                children: <Widget>[
                  Text(
                    'Route',
                    style: Styles.greyLabelSmall,
                  ),
                  SizedBox(
                    width: 12,
                  ),
                  Text(
                    widget.route == null ? 'No Route?' : widget.route.name,
                    style: Styles.whiteBoldSmall,
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
                _rawRoutePoints.isEmpty
                    ? Container()
                    : RaisedButton(
                        color: Colors.indigo,
                        elevation: 16,
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Text(
                            'Confirm Route Points',
                            style: Styles.whiteSmall,
                          ),
                        ),
                        onPressed: _confirmSave),
                SizedBox(
                  width: 24,
                ),
                Counter(
                  label: 'Collected',
                  total: _rawRoutePoints.length,
                  totalStyle: Styles.blackBoldMedium,
                  labelStyle: Styles.blackSmall,
                ),
                SizedBox(
                  width: 8,
                ),
              ],
            ),
            SizedBox(
              height: 28,
            ),
          ],
        ),
      ),
    );
  }

  bool isBusy = false;
  static const batchSize = 300;
  void _snapPoints() async {
    setState(() {
      isBusy = true;
    });
    assert(_rawRoutePoints.isNotEmpty);

    try {
      myDebugPrint(
          '\n\n🔵 🔵 🔵 🔵 🔵 Getting snapped points from raw route points: ${_rawRoutePoints.length}....');
      _routePoints = await SnapToRoads.getSnappedPoints(
          route: widget.route, routePoints: _rawRoutePoints);
      widget.route.routePoints = _routePoints;
      var index = 0;
      _routePoints.forEach((p) {
        p.index = index;
        p.position =
            Position(type: 'Point', coordinates: [p.longitude, p.latitude]);
        index++;
      });
      myDebugPrint(
          '🍎🍎🍎🍎 adding ${_routePoints.length} route points to 🍎 ${widget.route.name} ...');
      await routeBuilderBloc.addRoutePointsToMongoDB(
          widget.route, _routePoints);
      myDebugPrint(
          '\n\n🔵 🔵 🔵 🔵 🔵 Saving raw points: ${_rawRoutePoints.length} to REMOTE db....');
      await routeBuilderBloc.addRawRoutePointsToMongoDB(
          widget.route, _rawRoutePoints);

      setState(() {});
      AppSnackbar.showSnackbarWithAction(
          scaffoldKey: _key,
          message: 'Route Points added',
          action: 1,
          actionLabel: 'DONE',
          listener: this,
          backgroundColor: Colors.teal[800]);
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: "Berlin Wall fell down. ${e.message}",
          actionLabel: "Err",
          listener: this);
    }

    myDebugPrint(
        '\n\nManager: 🍏 🍎 route points added to database. Done  for ${widget.route.name}');
    setState(() {
      isBusy = false;
      showButton = false;
    });
  }

  void _confirmSave() async {
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title: new Text(
                "Confirm Route Points",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor),
              ),
              content: Container(
                height: 160.0,
                child: Column(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        children: <Widget>[
                          Text(
                            'Do you want to confirm RoutePoints for ${widget.route.name} ?? This will save these route points in the database for use in maps.',
                            style: Styles.blackBoldSmall,
                          ),
                          SizedBox(
                            height: 12,
                          ),
                        ],
                      ),
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
                      _snapPoints();
                    },
                    elevation: 4.0,
                    color: Colors.blue.shade700,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Save Route Points',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ],
            ));
  }
}
