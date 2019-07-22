import 'dart:async';

import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/dancer/dancer_data_api.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart';
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/maps/route_distance_calculator.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/maps/snap_to_roads.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:geoflutterfire/geoflutterfire.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';

import 'cards.dart';
import 'landmark_city_page.dart';
import 'landmarks.dart';

class CreateRoutePointsPage extends StatefulWidget {
  @override
  _CreateRoutePointsPageState createState() => _CreateRoutePointsPageState();
}

class _CreateRoutePointsPageState extends State<CreateRoutePointsPage>
    implements SnackBarListener, RouteMapListener {
  final GlobalKey<ScaffoldState> _key = GlobalKey();
  List<RoutePoint> _rawRoutePoints = List();
  List<LandmarkDTO> _landmarks = List();
  Completer<GoogleMapController> _completer = Completer();
  GoogleMapController _mapController;
  CameraPosition _cameraPosition = CameraPosition(
    target: LatLng(0.0, 0.0),
    zoom: 14.0,
  );
  BitmapDescriptor _markerIcon;
  RouteDTO _route;

  @override
  void initState() {
    super.initState();
    print('🔆 🔆 🔆  ManageLandmarkPage: initState');
    _getRoute();
  }

  void _getRoute() async {
    _route = await Prefs.getRoute();
    assert(_route != null);
    await _getRoutePoints();
    await _getLandmarks();
    setState(() {});
  }

  Future _getLandmarks() async {
    _landmarks = await routeBuilderBloc.getRouteLandmarks(_route);
    _buildItems();
    setState(() {});
    ;
  }

  Future _buildMarkerIcon() async {
    if (_markerIcon != null) return;
    final ImageConfiguration imageConfiguration =
        createLocalImageConfiguration(context, size: Size.square(600.0));
    await BitmapDescriptor.fromAssetImage(imageConfiguration, 'assets/pin.png')
        .then((img) {
      _markerIcon = img;
      print('_buildLandmarkIcon Ⓜ️ Ⓜ️ Ⓜ️ has been created');
    }).catchError((err) {
      print(err);
    });
  }

  void _buildItems() {
    for (var m in _landmarks) {
      var item = DropdownMenuItem<LandmarkDTO>(
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
  StreamSubscription<List<RoutePoint>> _subscription;
  Future _getRoutePoints() async {
    assert(_route != null);

    _rawRoutePoints = _route.rawRoutePoints;
    _routePoints = _route.routePoints;

    if (_rawRoutePoints.isNotEmpty) {
      showButton = true;
    } else {
      showButton = false;
    }
    debugPrint(
        '\n\n🍏 🍎 🍏 🍎  Raw route points collected:  🧩 ${_rawRoutePoints.length} 🧩  snapped: ${_routePoints.length} 🧩\n\n');
    _setRawRouteMarkers();
    setState(() {});
  }


  Set<Marker> _markers = Set();
  void _setRawRouteMarkers() async {
    print(
        '🔵 set markers ... 🔵 ...🔵 ...🔵 ... 🔵 ... points collected: ${_rawRoutePoints.length} 🍀️🍀️🍀️');
    _markers.clear();
    var icon =
        BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
    // await _buildMarkerIcon();
    try {
      _rawRoutePoints.forEach((m) {
        if (m.landmarkID != null) {
          icon = BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed);
        } else {
          icon =
              BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueYellow);
        }
        _markers.add(Marker(
            onTap: () {
              print('marker tapped!! ❤️ 🧡 💛   ${m.created}');
              _onMarkerTapped(m);
            },
            icon: icon,
            markerId: MarkerId(DateTime.now().toIso8601String()),
            position: LatLng(m.latitude, m.longitude),
            infoWindow: InfoWindow(title: m.created, snippet: m.created)));
      });
      print('🍏 🍎 markers added: ${_markers.length}');
      if (_route.routePoints.isNotEmpty) {
        _setRoutePolyline();
      }
      _mapController.animateCamera(
          CameraUpdate.newLatLngZoom(_markers.elementAt(0).position, 15));
    } catch (e) {
      print(e);
    }
  }

  Set<Polyline> polylines = Set();

  void _setRoutePolyline() async {
    polylines.clear();
    try {
      List<LatLng> latLngs = List();
      try {
        _routePoints.forEach((m) {
          latLngs.add(LatLng(m.latitude, m.longitude));
        });
      } catch (e) {
        print(
            '👿 👿 👿 👿 👿 👿  Houston, we have a fucking problem! setting up LatLng in list 👿 👿 👿 👿 👿 👿 👿 👿');
      }
      print(
          '📌 📌 📌 create polyline 🔵 🔵 🔵 🔵 latLngs:🍀️🍀️ ${latLngs.length} 🍀️🍀️\n');
      var polyLine = Polyline(
          polylineId: PolylineId('${DateTime.now().toIso8601String()}'),
          color: Colors.white,
          width: 12,
          consumeTapEvents: true,
          onTap: () {
            print('🥩 🥩 polyline tapped, 🥩 now what??? - .....');
          },
          geodesic: true,
          points: latLngs);

      polylines.add(polyLine);
      _mapController.animateCamera(CameraUpdate.newLatLngZoom(
          LatLng(_routePoints.elementAt(0).latitude,
              _routePoints.elementAt(0).longitude),
          14));
    } catch (e) {
      print(e);
    }
  }

  bool showLandmarkEditor = false, showButton = false;
  List<DropdownMenuItem<LandmarkDTO>> _items = List();

  _onMarkerTapped(RoutePoint marker) {
    print('Marker tapped: route: ${marker.created}');
    _mapController.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(
        target: LatLng(marker.latitude, marker.longitude), zoom: 16.0)));

    _startLandmarksPage(marker);
  }

  _startLandmarksPage(RoutePoint marker) {
    Navigator.push(
      context,
      SlideRightRoute(
        widget: LandmarksPage(
          route: _route,
          routePoint: marker,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<RoutePoint>>(
      initialData: routeBuilderBloc.rawRoutePoints,
      stream: routeBuilderBloc.rawRoutePointsStream,
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        if (snapshot.hasData) {
          _setRawRouteMarkers();
        }
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
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: IconButton(
                  icon: Icon(Icons.refresh),
                  onPressed: _getRoutePoints,
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
                polylines: polylines,
                myLocationEnabled: true,
                compassEnabled: true,
                zoomGesturesEnabled: true,
                rotateGesturesEnabled: true,
                scrollGesturesEnabled: true,
                tiltGesturesEnabled: true,
                onLongPress: _onLongPress,
                onMapCreated: (mapController) {
                  if (!_completer.isCompleted) {
                    _completer.complete(mapController);
                    _mapController = mapController;
                  }
                  _setRawRouteMarkers();
                  if (_rawRoutePoints == null || _rawRoutePoints.isNotEmpty) {
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
                    Navigator.push(
                      context,
                      SlideRightRoute(
                        widget: LandmarksPage(
                          route: _route,
                        ),
                      ),
                    );
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
      },
    );
  }

  int sequenceNumber;
  LandmarkDTO landmark;
  String landmarkName;

  @override
  onActionPressed(int action) {
    List<RouteDTO> list = List();
    list.add(_route);
    Navigator.pop(context);
    switch (action) {
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
    List<RouteDTO> list = List();
    list.add(_route);
    Navigator.push(
        context,
        SlideRightRoute(
          widget: RouteMap(
            routes: list,
            hideAppBar: false,
            listener: this,
            title: _route.name,
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
                          debugPrint(
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
    debugPrint('🧩🧩🧩  map has been long pressed, 🧩 $latLng');
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
    var m = LandmarkDTO(
      landmarkName: name,
      latitude: pressedLatLng.latitude,
      longitude: pressedLatLng.longitude,
      position: {
        'type': 'Point',
        'coordinates': [pressedLatLng.longitude, pressedLatLng.latitude]
      },
      routeIDs: [_route.routeID],
      routeDetails: [
        RouteInfo(
          name: _route.name,
          routeID: _route.routeID,
        )
      ],
    );
    await routeBuilderBloc.addLandmark(m);
    debugPrint(
        '️♻️ ♻️♻️ ♻️   🐸 New landmark added : 🍎 ${m.landmarkName} 🍎 ');
  }

  @override
  onLandmarkInfoWindowTapped(LandmarkDTO landmark) {
    debugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onLandmarkInfoWindowTapped: 🧩🧩 ${landmark.landmarkName}  🍎 ');
    landmark.routeDetails.forEach((m) {
      debugPrint(
          ' 🐸 🐸 🐸  You can get on route :  🍎 ${m.name} from 🧩🧩 ${landmark.landmarkName}');
    });
  }

  @override
  onLandmarkTapped(LandmarkDTO landmark) {
    debugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onLandmarkTapped: 🧩🧩 ${landmark.landmarkName}  🥬 ');
    // todo - show UPDATE landmark editor
  }

  @override
  onLongPress(LatLng latLng) {
    debugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onLongPress: map pressed on latLng: 🧩🧩 $latLng  💛 ');
    // todo - show NEW landmark editor
  }

  @override
  onPointInfoWindowTapped(RoutePoint point) {
    debugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onPointInfoWindowTapped: 🧩🧩 created: ${point.created}  🧡 index: ${point.index}');
    // todo - show NEW landmark editor
  }

  @override
  onPointTapped(RoutePoint point) {
    debugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onPointTapped: 🧩🧩  created: ${point.created}  ❤️ index: ${point.index}');
    // todo - show NEW landmark editor
  }

  Widget _getBottom() {
    return PreferredSize(
      preferredSize: Size.fromHeight(100),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: <Widget>[
            Text(
              _route == null ? 'No Route?' : _route.name,
              style: Styles.whiteBoldSmall,
            ),
            SizedBox(
              height: 8,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
//                showButton == false
//                    ? Container()
//                    : RaisedButton(
//                        color: Colors.pink,
//                        elevation: 16,
//                        child: Padding(
//                          padding: const EdgeInsets.all(12.0),
//                          child: Text(
//                            'Confirm Route Points',
//                            style: Styles.whiteSmall,
//                          ),
//                        ),
//                        onPressed: _confirmSave),

                SizedBox(
                  width: 8,
                ),
                StreamBuilder<List<RoutePoint>>(
                    stream: routeBuilderBloc.rawRoutePointsStream,
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        _rawRoutePoints = snapshot.data;
                      }
                      return Counter(
                        label: 'Collected',
                        total: _rawRoutePoints.length,
                        totalStyle: Styles.blackBoldMedium,
                        labelStyle: Styles.blackSmall,
                      );
                    }),
                SizedBox(
                  width: 40,
                ),
              ],
            ),
            SizedBox(
              height: 8,
            ),
          ],
        ),
      ),
    );
  }

  bool isBusy = false;
  void _snapPoints() async {
    setState(() {
      isBusy = true;
    });
    debugPrint(
        '\n\n🔵 🔵 🔵 🔵 🔵 Getting snapped points from raw: ${_rawRoutePoints.length}....');
    assert(_rawRoutePoints.isNotEmpty);
    _routePoints = await SnapToRoads.getSnappedPoints(
        route: _route, routePoints: _rawRoutePoints);
    _route.routePoints = _routePoints;
    try {
      if (_routePoints.length < 301) {
        print(
            '🍎🍎🍎🍎 adding ${_routePoints.length} route points to 🍎 ${_route.name} ...');
        await DancerDataAPI.addRoutePoints(
            routeId: _route.routeID, routePoints: _routePoints, clear: true);
        await _connectPointsAndCalculateDistances();
      } else {
        //batches of 30
        var rem = _routePoints.length % 300;
        var pages = _routePoints.length ~/ 300;

        var map = Map<int, List<RoutePoint>>();
        if (rem > 0) {
          pages++;
        }
        int startIndex = 0;

        for (var i = 0; i < pages; i++) {
          map[i] = List<RoutePoint>();
          for (var j = startIndex; j < (startIndex + 300); j++) {
            try {
              map[i].add(_routePoints.elementAt(j));

            } catch (e) {}
          }
          print(
              '🍎🍎🍎🍎 adding ${map[i].length} route points to 🍎 ${_route.name} ...');
          _route.routePoints = map[i];
          bool clear;
          if (i == 0) {
            clear = true;
          } else {
            clear = false;
          }
          await DancerDataAPI.addRoutePoints(
              routeId: _route.routeID, routePoints: map[i], clear: clear);
          print(
              '🧩🧩🧩🧩🧩 calculating distances for route  🍎 ${_route.name} ...');
          _connectPointsAndCalculateDistances();
          setState(() {

          });
        }
      }
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: "Berlin Wall fell down. ${e.message}",
          actionLabel: "Err",
          listener: this);
    }

    debugPrint(
        '\n\nManager: 🍏 🍎 route points added to database. Done  for ${_route.name}');
    //await routeBuilderBloc.getRawRoutePoints(route: _route);
    setState(() {
      isBusy = false;
      showButton = false;
    });
    _setRoutePolyline();
  }
  _connectPointsAndCalculateDistances() async {
    debugPrint('🔆🔆🔆🔆🔆🔆🔆🔆🔆🔆 _connectPoints ... calculate distances 🔆🔆');
    try {
      List<RoutePoint> landmarkPoints = List();
      var landmarks = await routeBuilderBloc.getRouteLandmarks(_route);
      if (landmarks.isEmpty) {
        print('💜💜💜 no landmarks in this route yet, so no calculations');
        return;
      }
      debugPrint('🍀️🍀️🍀️ Connect 🔴 ${landmarks.length} landmarks to route points');
      for (var mark in landmarks) {
        RoutePoint point = await routeBuilderBloc.findRoutePointNearestLandmark(
            route: _route,
            landmark: mark);
        landmarkPoints.add(point);
        _route.routePoints.forEach((p) {
          if (point.latitude == p.latitude && point.longitude == p.latitude) {
            p.landmarkID = mark.landmarkID;
            p.landmarkName = mark.landmarkName;
          }
        });


      }
      var cnt = 0;
      _route.routePoints.forEach((p) {
        if (p.landmarkID != null) {
          cnt++;
          prettyPrint(p.toJson(), '🔴 🔴 🔴 🔴 #$cnt -  💛 Route point that is a LANDMARK: ${p.landmarkName} 💛');
        }
      });
      debugPrint('🍀️🍀️🍀️ sending ${landmarkPoints.length} landmarked points ... calculate distances between landmarks');
      await routeBuilderBloc.updateRoutePoints(routeID: _route.routeID, points: landmarkPoints);
      await RouteDistanceCalculator.calculate(route: _route);
      if (_key.currentState != null) _key.currentState.removeCurrentSnackBar();
    } catch (e) {
      print(e);
    }
  }
}
