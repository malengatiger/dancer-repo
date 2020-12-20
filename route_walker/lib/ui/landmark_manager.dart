import 'dart:async';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as aftarobot;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import 'cards.dart';
import 'flag_routepoint_landmarks.dart';
import 'landmark_city_page.dart';

/// This widget displays all the route points and allows you to tap one of the routePoint markers to create a LANDMARK.
/// This is the only way a landmark can be created.
class LandmarksManagerPage extends StatefulWidget {
  final aftarobot.Route route;

  LandmarksManagerPage(this.route);

  @override
  _LandmarksManagerPageState createState() => _LandmarksManagerPageState();
}

class _LandmarksManagerPageState extends State<LandmarksManagerPage>
    implements SnackBarListener, RouteMapListener, LandmarkEditorListener {
  final GlobalKey<ScaffoldState> _key = GlobalKey();

  List<Landmark> _landmarks = List();
  List<RoutePoint> _routePoints = List();
  Completer<GoogleMapController> _completer = Completer();
  GoogleMapController _mapController;
  CameraPosition _cameraPosition = CameraPosition(
    target: LatLng(0.0, 0.0),
    zoom: 14.0,
  );
  BitmapDescriptor _markerIcon;
  aftarobot.Route _route;
  int landmarksOnRoute = 0;

  @override
  void initState() {
    super.initState();
    print('🔆 🔆 🔆  ManageLandmarkPage: initState');
    _getRoute();
  }

  void _getRoute() async {
    _route = widget.route;
    await _getRoutePoints();
    setState(() {});
  }

  Future _getRoutePoints() async {
    _routePoints = _route.routePoints;
    landmarksOnRoute = 0;
    _routePoints.forEach((m) {
      if (m.landmarkID != null) {
        landmarksOnRoute++;
      }
    });
    mp('🔆🔆🔆 🔆🔆🔆 🔆🔆🔆 Landmarks on the route: $landmarksOnRoute');
    _buildItems();
    if (_mapController != null) {
      _setRouteMarkers();
    }

    setState(() {});
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

  Future _setRoutePoints() async {
    if (_route.routePoints.isNotEmpty) {
      showButton = false;
    }
    mp('\n\n🍏 🍎 🍏 🍎  Route points:  🧩  snapped: ${_routePoints.length} 🧩\n\n');
    _setRouteMarkers();
    setState(() {});
  }

  Set<Marker> _markers = Set();

  void _setRouteMarkers() async {
    print(
        '🔵 set markers ... 🔵 ...🔵 ...🔵 ... 🔵 ... points: ${_route.routePoints.length} 🍀️🍀️🍀️');
    var index = 0;
    _route.routePoints.forEach((p) {
      p.index = index;
      index++;
    });
    //_checkPoints();
    _markers.clear();
    var icon =
        BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
    // await _buildMarkerIcon();
    try {
      _route.routePoints.forEach((m) {
        if (m.landmarkID != null) {
          icon =
              BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure);
          putMarkerOnMap(m, icon);
        }
      });
      print('🍏 🍎 markers added: ${_markers.length}');
      //
      if (_route.routePoints.isNotEmpty) {
        _setRoutePolyline();
      }
      _mapController.animateCamera(
          CameraUpdate.newLatLngZoom(_markers.elementAt(0).position, 15));
    } catch (e) {
      print(e);
    }
  }

  void putMarkerOnMap(RoutePoint m, BitmapDescriptor icon) {
    _markers.add(Marker(
        onTap: () {
          mp('LandmarkManager: 🔴 marker tapped!! ❤️ 🧡 💛   ${m.created}');
          _onMarkerTapped(m);
        },
        icon: icon,
        markerId: MarkerId(DateTime.now().toIso8601String()),
        position: LatLng(m.latitude, m.longitude),
        infoWindow: InfoWindow(
            title: m.landmarkID == null ? m.created : m.landmarkName,
            snippet: m.landmarkID == null ? m.created : 'LANDMARK')));
  }

  Set<Polyline> polyLines = Set();

  void _setRoutePolyline() async {
    polyLines.clear();
    try {
      List<LatLng> latLngs = List();
      try {
        _routePoints.forEach((m) {
          latLngs.add(LatLng(m.latitude, m.longitude));
        });
      } catch (e) {
        mp('👿 👿 👿 👿 👿 👿  Houston, we have a fucking problem! setting up LatLng in list 👿 👿 👿 👿 👿 👿 👿 👿');
      }
      mp('📌 📌 📌 LandmarksManagerPage: create polyline 🔵 🔵 🔵 🔵 latLngs:🍀️🍀️ ${latLngs.length} 🍀️🍀️\n');
      var polyLine = Polyline(
          polylineId: PolylineId('${DateTime.now().toIso8601String()}'),
          color: Colors.white,
          width: 12,
          consumeTapEvents: true,
          onTap: () {
            print(
                '🥩 🥩 LandmarksManagerPage: polyline tapped, 🥩 now what??? - .....');
          },
          geodesic: true,
          points: latLngs);

      polyLines.add(polyLine);
      _mapController.animateCamera(CameraUpdate.newLatLngZoom(
          LatLng(_routePoints.elementAt(0).latitude,
              _routePoints.elementAt(0).longitude),
          14));
    } catch (e) {
      print(e);
    }
  }

  bool showLandmarkEditor = false, showButton = false;
  List<DropdownMenuItem<Landmark>> _items = List();

  ///Start the Landmark editor on marker tap
  _onMarkerTapped(RoutePoint routePoint) async {
    mp('LandmarksManagerPage: 📌 📌 📌 📌 📌 📌 Marker tapped: routePOINT: ${routePoint.toJson()}');
    if ((routePoint.landmarkID != null)) {
      mp('Marker tapped: route point is already a landmark');
      return;
    }
    await _mapController.animateCamera(CameraUpdate.newCameraPosition(
        CameraPosition(
            target: LatLng(routePoint.latitude, routePoint.longitude),
            zoom: 16.0)));
    var landmark = await Navigator.push(
        context,
        SlideRightRoute(
            widget: LandmarkEditor(
                routePoint: routePoint,
                route: _route,
                withScaffold: true,
                listener: this)));
    if (landmark != null) {
      if (landmark is Landmark) {
        mp('🐥 🐥 🐥  LandmarksManagerPage: landmark from editor ... need map to reflect new landmark ....');
        _route = await LocalDBAPI.getRoute(routeID: _route.routeID);
        Navigator.pop(context);
        Navigator.push(
            context, SlideRightRoute(widget: LandmarksManagerPage(_route)));
      }
    }
  }

  bool showLandmarks = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text(
          'Landmark Manager',
          style: Styles.blackBoldSmall,
        ),
        backgroundColor: Colors.teal.shade400,
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
            polylines: polyLines,
            myLocationEnabled: true,
            compassEnabled: true,
            zoomGesturesEnabled: true,
            rotateGesturesEnabled: true,
            scrollGesturesEnabled: true,
            tiltGesturesEnabled: true,
//            onLongPress: _onLongPress,
            onMapCreated: (mapController) {
              if (!_completer.isCompleted) {
                _completer.complete(mapController);
                _mapController = mapController;
                print(
                    ' ❤️ 🧡 💛  onMapCreated!! ❤️ 🧡 💛   ${_mapController.toString()}');
              }
              _setRouteMarkers();

              if (_routePoints != null && _routePoints.isNotEmpty) {
                _mapController.animateCamera(CameraUpdate.newLatLngZoom(
                    LatLng(_routePoints.elementAt(0).latitude,
                        _routePoints.elementAt(0).longitude),
                    16.0));
              }
            },
          ),
          // Positioned(
          //   top: 12,
          //   left: 12,
          //   child: FloatingActionButton(
          //     backgroundColor: Colors.pink.shade900,
          //     elevation: 16,
          //     child: Icon(Icons.airport_shuttle),
          //     onPressed: _startFlagLandmarks,
          //   ),
          // ),
          showLandmarks
              ? Positioned(
                  top: 20,
                  left: 80,
                  child: Card(
                    elevation: 16,
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Text(
                        getNames(),
                        style: Styles.pinkBoldSmall,
                      ),
                    ),
                  ))
              : Container(),
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
        ],
      ),
    );
  }

  int sequenceNumber;
  Landmark landmark;
  String landmarkName;

  String getNames() {
    var dd = StringBuffer();
    dd.write('Landmarks\n\n');
    mList.forEach((m) {
      dd.write(m.landmarkName);
      dd.write('\n');
    });
    return dd.toString();
  }

  @override
  onActionPressed(int action) {
    List<aftarobot.Route> list = List();
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
    List<aftarobot.Route> list = List();
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
                          mp('🧩 🧩 🧩 🧩 Confirm Route button pressed  🧩 🧩 🧩 🧩 ');
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

  String name;

  void _onNameChanged(String value) async {
    print(value);
    name = value;
  }

  @override
  onLandmarkInfoWindowTapped(Landmark landmark) {
    mp(' 🥬 CreateRoutePointsPage:  🐸 onLandmarkInfoWindowTapped: 🧩🧩 ${landmark.landmarkName}  🍎 ');
    landmark.routeDetails.forEach((m) {
      mp(' 🐸 🐸 🐸  You can get on route :  🍎 ${m.name} from 🧩🧩 ${landmark.landmarkName}');
    });
  }

  @override
  onLandmarkTapped(Landmark landmark) {
    mp(' 🥬 CreateRoutePointsPage:  🐸 onLandmarkTapped: 🧩🧩 ${landmark.landmarkName}  🥬 ');
    // todo - show UPDATE landmark editor
  }

  @override
  onLongPress(LatLng latLng) {
    mp(' 🥬 CreateRoutePointsPage:  🐸 onLongPress: map pressed on latLng: 🧩🧩 $latLng  💛 ');
    // todo - show NEW landmark editor
  }

  @override
  onPointInfoWindowTapped(RoutePoint point) {
    mp(' 🥬 CreateRoutePointsPage:  🐸 onPointInfoWindowTapped: 🧩🧩 created: ${point.created}  🧡 index: ${point.index}');
    // todo - show NEW landmark editor
  }

  @override
  onPointTapped(RoutePoint point) {
    mp(' 🥬 CreateRoutePointsPage:  🐸 onPointTapped: 🧩🧩  created: ${point.created}  ❤️ index: ${point.index}');
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
                SizedBox(
                  width: 8,
                ),
                GestureDetector(
                  onTap: _displayLandmarks,
                  child: Counter(
                    label: 'Landmarks',
                    total: landmarksOnRoute,
                    totalStyle: Styles.blackBoldMedium,
                    labelStyle: Styles.whiteSmall,
                  ),
                ),
                SizedBox(
                  width: 48,
                ),
                Counter(
                  label: 'Collected',
                  total: _routePoints.length,
                  totalStyle: Styles.blackBoldMedium,
                  labelStyle: Styles.whiteSmall,
                ),
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

  List<RoutePoint> mList = List();
  _displayLandmarks() {
    mp('_displayLandmarks: 🔆 🔆 🔆 🔆  showLandmarks: $showLandmarks');
    mList.clear();
    var mx = Map<String, RoutePoint>();
    _routePoints.forEach((b) {
      if (b.landmarkID != null) {
        mx[b.landmarkID] = b;
      }
    });
    mx.forEach((key, value) {
      mList.add(value);
    });
    showLandmarks = !showLandmarks;
    mp('_displayLadmarks  ❤️ 🧡 💛  mList: ${mList.length}: showLandmarks state: 🧡  $showLandmarks');
    setState(() {});
  }

  bool isBusy = false;

  @override
  onCancel() {
    print('onCancel: 🔴  🔴 ');
    return null;
  }

  @override
  onError(String message) {
    print('onError: 🔴  $message 🔴 ');
    return null;
  }

  @override
  onSuccess(Landmark landmark) {
    print('LandmarkManager: onSuccess: 👌 👌 👌 👌 👌 👌 👌 👌 }');
    prettyPrint(
        landmark.toJson(), ' 🧩 🧩 🧩 Landmark returned to LandmarkManager');
    setState(() {});
    return null;
  }

  // void _startFlagLandmarks() async {
  //   var update = await Navigator.push(
  //     context,
  //     SlideRightRoute(
  //       widget: FlagRoutePointLandmarks(
  //         route: _route,
  //       ),
  //     ),
  //   );
  //   if (update != null) {
  //     if ((update is aftarobot.Route)) {
  //       mp('🐥 🐥 🐥 🐥 🐥 🐥 🐥 🐥 🐥 🐥 Route state refresh required: points: ${update.routePoints.length}');
  //       setState(() {
  //         _route = update;
  //         _routePoints = _route.routePoints;
  //       });
  //     }
  //   } else {
  //     mp('🔆 🔆 🔆 🔆  Route update NOT required');
  //   }
  // }
}
