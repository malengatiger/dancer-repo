import 'package:aftarobotlibrary4/data/vehicle_arrival.dart';
import 'package:aftarobotlibrary4/data/vehicledto.dart';
import 'package:flutter/material.dart';

class Dispatch extends StatefulWidget {
  @override
  _DispatchState createState() => _DispatchState();
}

class _DispatchState extends State<Dispatch> {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();
  List<Vehicle> _vehicles = List();
  List<VehicleArrival> vehicleArrivals = List();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Taxi Dispatch'),
      ),
    );
  }
}
