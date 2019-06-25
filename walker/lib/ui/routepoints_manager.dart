import 'dart:async';

import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/landmarkdto.dart';
import 'package:aftarobotlibrary4/data/routedto.dart';
import 'package:aftarobotlibrary4/data/routepointdto.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/maps/snap_to_roads.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:geoflutterfire/geoflutterfire.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:walker/bloc/route_builder_bloc.dart';
import 'package:walker/ui/cards.dart';
import 'package:walker/ui/landmark_city_page.dart';
import 'package:walker/ui/landmarks.dart';
import 'package:walker/ui/page_route.dart';

class CreateRoutePointsPage extends StatefulWidget {
  @override
  _CreateRoutePointsPageState createState() => _CreateRoutePointsPageState();
}

class _CreateRoutePointsPageState extends State<CreateRoutePointsPage>
    implements SnackBarListener, RouteMapListener {
  final GlobalKey<ScaffoldState> _key = GlobalKey();
  List<RoutePointDTO> _rawRoutePoints = List();
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
    return null;
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

  List<RoutePointDTO> _routePoints = List();
  StreamSubscription<List<RoutePointDTO>> _subscription;
  Future _getRoutePoints() async {
    assert(_route != null);
    _subscription = routeBuilderBloc.routePointsStream.listen((snapshot) {
      _routePoints = snapshot;
      if (_routePoints.isNotEmpty) {
        showButton = false;
      }
      if (mounted) {
        setState(() {});
        _setRoutePolyline();
      }
    });

    _rawRoutePoints = await routeBuilderBloc.getRawRoutePoints(route: _route);
    _routePoints = await routeBuilderBloc.getRoutePoints(route: _route);

    if (_rawRoutePoints.isNotEmpty) {
      showButton = true;
      if (_routePoints.isNotEmpty) {
        showButton = false;
      }
    } else {
      showButton = false;
    }
    debugPrint(
        '\n\n🍏 🍎 🍏 🍎  Raw route points collected:  🧩 ${_rawRoutePoints.length} 🧩  snapped: ${_routePoints.length} 🧩\n\n');
    setState(() {});
//    _printPoints(_rawRoutePoints, false);
    _setRawRouteMarkers();
    return null;
  }

  _printPoints(List<RoutePointDTO> list, bool sortByIndex) {
    var dd = LandmarkDistance();
    if (sortByIndex) {
      list.sort((a, b) => a.index.compareTo(b.index));
    } else {
      list.sort((a, b) => a.created.compareTo(b.created));
    }
    RoutePointDTO prevPoint;
    var tot = 0.0;
    list.forEach((p) {
      if (prevPoint == null) {
        prevPoint = p;
        prevPoint.distance = 0;
      } else {
        dd.calculateDistance(
          fromLatitude: prevPoint.latitude,
          fromLongitude: prevPoint.longitude,
          toLatitude: p.latitude,
          toLongitude: p.longitude,
        );
        p.distance = dd.distanceMetre;
        prevPoint = p;
      }
    });
    debugPrint(
        '\n\n🔵🔵🔵🔵🔵🔵 ROUTE POINTS, sortByIndex: $sortByIndex  🥬 🥬 🥬  ${_route.routeID} 🍎 ${_route.name}');
    list.forEach((p) {
      tot += p.distance;
      debugPrint(
          '🔵 ${p.index} 🧡 ${p.distance} 🧡 ${p.created} 🔆 ${p.latitude} ${p.longitude}');
    });
    debugPrint(
        '\n🔵🔵🔵🔵🔵🔵 ROUTE POINTS, sortByIndex: $sortByIndex  🥬 🥬 🥬  ${_route.routeID} 🍎 ${_route.name} 🍎 🍎 total distance : $tot');
  }

  Set<Marker> _markers = Set();
  void _setRawRouteMarkers() async {
    print(
        '🔵 set markers ... 🔵 ...🔵 ...🔵 ... 🔵 ... points collected: ${_rawRoutePoints.length} 🍀️🍀️🍀️');
    _markers.clear();
    var icon =
        BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
    await _buildMarkerIcon();
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
            markerId: MarkerId(m.created),
            position: LatLng(m.latitude, m.longitude),
            infoWindow: InfoWindow(title: m.created, snippet: m.created)));
      });
      print('🍏 🍎 markers added: ${_markers.length}');
      _mapController.animateCamera(
          CameraUpdate.newLatLngZoom(_markers.elementAt(0).position, 15));
    } catch (e) {
      print(e);
    }
  }

  Set<Polyline> polylines = Set();

  void _setRoutePolyline() async {
    print(
        '\n\n📌 📌 📌 create polyline ... 🔵 ...🔵 ...🔵 ... 🔵 ... points collected: ${_rawRoutePoints.length} 🍀️🍀️🍀️');
    polylines.clear();
    try {
      List<LatLng> polylineLatLngs = List();
      try {
        _routePoints.sort((a, b) => a.index.compareTo(b.index));
        _routePoints.forEach((m) {
          polylineLatLngs.add(LatLng(m.latitude, m.longitude));
        });
      } catch (e) {
        print(
            '👿 👿 👿 👿 👿 👿  Houston, we have a fucking problem! setting up LatLng in list 👿 👿 👿 👿 👿 👿 👿 👿');
      }
      print(
          '📌 📌 📌 create polyline ... 🔵 ...🔵 ...🔵 ... 🔵 ... latLngs to add to polyline:🍀️🍀️ ${polylineLatLngs.length} 🍀️🍀️\n');
      var polyLine = Polyline(
          polylineId: PolylineId('${DateTime.now().toIso8601String()}'),
          color: Colors.white,
          width: 20,
          consumeTapEvents: true,
          onTap: () {
            print('🥩 🥩 polyline tapped, 🥩 now what??? - .....');
          },
          geodesic: true,
          points: polylineLatLngs);

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
  RoutePointDTO _selectedMarker;
  List<DropdownMenuItem<LandmarkDTO>> _items = List();

  _onMarkerTapped(RoutePointDTO marker) {
    print('Marker tapped: route: ${marker.created}');
    _selectedMarker = marker;
    _mapController.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(
        target: LatLng(marker.latitude, marker.longitude), zoom: 16.0)));

    _startLandmarksPage(marker);
  }

  _startLandmarksPage(RoutePointDTO marker) {
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
    return StreamBuilder<List<RoutePointDTO>>(
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
                        if (_rawRoutePoints == null ||
                            _rawRoutePoints.isNotEmpty) {
                          _mapController.animateCamera(
                              CameraUpdate.newLatLngZoom(
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
                    isBusy == false? Container(): Card(
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
      geo: {
        'type': 'Point',
        'coordinates': [pressedLatLng.longitude, pressedLatLng.latitude]
      },
      position: {},
      routeIDs: [_route.routeID],
      routeNames: [
        RouteInfo(
            name: _route.name, routeID: _route.routeID, rankSequenceNumber: 0)
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
    landmark.routeNames.forEach((m) {
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
  onPointInfoWindowTapped(RoutePointDTO point) {
    debugPrint(
        ' 🥬 CreateRoutePointsPage:  🐸 onPointInfoWindowTapped: 🧩🧩 created: ${point.created}  🧡 index: ${point.index}');
    // todo - show NEW landmark editor
  }

  @override
  onPointTapped(RoutePointDTO point) {
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
                StreamBuilder<List<RoutePointDTO>>(
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
    _routePoints = await SnapToRoads.getSnappedPoints(
        route: _route, routePoints: _rawRoutePoints);
    await SnapToRoads.createRoutePoints(
        route: _route, snappedPoints: _routePoints);
    debugPrint(
        '\n\nManager: 🍏 🍎 route points added to database. Done  for ${_route.name}');
    await routeBuilderBloc.getRawRoutePoints(route: _route);
    setState(() {
      isBusy = false;
      showButton = false;
    });
    _setRoutePolyline();
  }
}