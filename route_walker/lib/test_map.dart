import 'dart:async';
import 'dart:math';

import 'package:aftarobotlibrary4/data/position.dart';
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/location_bloc.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'package:google_maps_flutter/google_maps_flutter.dart';

class TestMap extends StatefulWidget {
  final List<RoutePoint> rawRoutePoints;

  const TestMap({Key key, this.rawRoutePoints}) : super(key: key);
  @override
  _TestMapState createState() => _TestMapState();
}

class _TestMapState extends State<TestMap> with SingleTickerProviderStateMixin {
  AnimationController _controller;
  var locationBloc = LocationBloc();
  Completer<GoogleMapController> _mapController = Completer();
  GoogleMapController googleMapController;
  Map<MarkerId, Marker> markers = <MarkerId, Marker>{};
  Set<Polyline> polyLines = Set();
  List<RoutePoint> rawRoutePoints = [];
  //-25.7605417 27.8525958
  var _currentCameraPosition = CameraPosition(
    target: LatLng(-25.7605417, 27.8525958),
    zoom: 10,
  );
  geo.Position _currentPosition;
  Random random = Random(DateTime.now().millisecondsSinceEpoch);

  void _buildMarkers() async {
    widget.rawRoutePoints.forEach((rp) {
      doMarker(rp);
    });
    mp('TestMap:  🌺  🌺  🌺  🌺  🌺  :_buildMarkers ${markers.length} markers built ....🧩 🧩 🧩 ');
  }

  void doMarker(RoutePoint rp) {
    final MarkerId markerId = MarkerId('${random.nextInt(9999988)}');
    final Marker marker = Marker(
      markerId: markerId,
      // icon: _carIcon,
      position: LatLng(
        rp.position.coordinates[1],
        rp.position.coordinates[0],
      ),
      infoWindow: InfoWindow(title: 'Shit Here', snippet: 'Some Location Here'),
      onTap: () {
        //_onMarkerTapped(projectPosition);
      },
    );
    markers[markerId] = marker;
  }

  void _getLocation() async {
    mp('TestMap:  🌺  🌺  🌺  🌺  🌺  :_getLocation and set camera position ....🧩 🧩 🧩 ');
    await locationBloc.requestPermission();
    _currentPosition = await locationBloc.getCurrentPosition();
    p('TestMap:  🌺  🌺  🌺  🌺  🌺 CurrentPosition: ${_currentPosition.latitude} ${_currentPosition.longitude}');
    _currentCameraPosition = CameraPosition(
      target: LatLng(_currentPosition.latitude, _currentPosition.longitude),
      zoom: 12,
    );
    doMarker(RoutePoint(
        latitude: _currentPosition.latitude,
        longitude: _currentPosition.longitude,
        position: Position(coordinates: [
          _currentPosition.longitude,
          _currentPosition.latitude
        ])));
    setState(() {});
  }

  void _setRoutePolyLines() async {
    mp('TestMap:  🌺  🌺  🌺  🌺  🌺  :_setRoutePolyLines build polyline from ${widget.rawRoutePoints.length} points ....🧩 🧩 🧩 ');
    polyLines.clear();
    List<LatLng> lats = List();
    widget.rawRoutePoints.forEach((rp) {
      lats.add(LatLng(rp.position.coordinates[1], rp.position.coordinates[0]));
    });
    mp('TestMap:  🌺  🌺  🌺  🌺  🌺  :_setRoutePolyLines  creating polyline with ${lats.length} LatLngs ....🧩 🧩 🧩 ');
    var polyLine = Polyline(
        polylineId: PolylineId('${DateTime.now().millisecondsSinceEpoch}'),
        color: Colors.blue,
        width: 8,
        consumeTapEvents: true,
        onTap: () {
          mp('🥩 🥩 polyline tapped, 🥩 now what??? - ..... show bottom sheet');
        },
        geodesic: true,
        points: lats);

    polyLines.add(polyLine);
    setState(() {});
    mp('TestMap:  🌺  🌺  🌺  🌺  🌺  :_setRoutePolyLines ....polyline should show: ${polyLines.length} polyLine 🧩 🧩 🧩 ');
  }

  @override
  void initState() {
    _controller = AnimationController(vsync: this);
    super.initState();
    p(' 🌍 🌍 🌍 🌍 TestMap: starting with ${widget.rawRoutePoints.length} raw route points ...  🌍 🌍 🌍 🌍 ');
    _getLocation();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    p('TestMap:  🌺  🌺  🌺  🌺  🌺 ............ Widget build ...............');
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: Text('Fucking Test Map!!'),
        ),
        body: Stack(
          children: [
            GoogleMap(
              mapType: MapType.hybrid,
              mapToolbarEnabled: true,
              initialCameraPosition: _currentCameraPosition,
              onMapCreated: _onMapCreated,
              myLocationEnabled: true,
              markers: Set<Marker>.of(markers.values),
              polylines: polyLines,
              buildingsEnabled: true,
            ),
          ],
        ),
      ),
    );
  }

  void _onMapCreated(GoogleMapController controller) {
    mp('TestMap:onMapCreated  🌺  🌺  🌺  🌺  🌺  : set up map controllers and build polyline .🧩 🧩 🧩 ');
    _mapController.complete(controller);
    googleMapController = controller;
    markers.clear();
    // _buildMarkers();
    //_setRoutePolyLines();
    setState(() {});

    mp('TestMap:onMapCreated  🌺  🌺  🌺  🌺  🌺  : map should show polyline....🧩 🧩 🧩 ');
  }
}
