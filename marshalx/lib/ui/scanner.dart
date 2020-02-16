import 'dart:convert';

import 'package:aftarobotlibrary4/dancer/dancer_data_api.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qrscan/qrscan.dart' as scanner;

class Scanner extends StatefulWidget {
  @override
  _ScannerState createState() => _ScannerState();
}

class _ScannerState extends State<Scanner> {
  var barcode = "";
  var newNumber;

  @override
  initState() {
    super.initState();
    scan();
  }

  var _key = GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Trip Scan'),
//        backgroundColor: Colors.indigo,
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            _buildImage(),
            FloatingActionButton.extended(
              icon: Icon(Icons.camera),
              label: Text("Scan"),
              onPressed: scan,
              backgroundColor: Colors.blue,
            ),
          ],
        ),
      ),
    );
  }

  Future scan() async {
    try {
      var barcode = await scanner.scan();
      myDebugPrint('👌👌👌 barcode: $barcode 👌👌👌');
      setState(() => this.barcode = barcode);

      var decoded = base64.decode(barcode);
      String stringTitle = utf8.decode(decoded);
      myDebugPrint(
          '👌👌👌 stringTitle: $stringTitle 👌👌👌 will print decoded object');
      var parts = stringTitle.split('@');
      print(parts);

      try {
        DancerDataAPI.updateCommuterRequestScanned(commuterRequestID: parts[0]);
        Navigator.pop(context);
        Navigator.push(
            context,
            SlideRightRoute(
              widget: Scanner(),
            ));
      } catch (e) {
        AppSnackbar.showSnackbar(scaffoldKey: _key, message: 'Unable to scan');
      }
    } on PlatformException catch (e) {
      if (e.code == scanner.CameraAccessDenied) {
        setState(() {
          this.barcode =
              '✨✨✨ The user did not grant the camera permission! ✨✨✨';
        });
      } else {
        setState(() => this.barcode = 'Unknown error: $e');
      }
    } on FormatException {
      setState(() => this.barcode =
          'null (User returned using the "back"-button before scanning anything. Result)');
    } catch (e) {
      setState(() => this.barcode = 'Unknown error: $e');
    }
  }

  Widget _buildImage() {
    return SizedBox(
      height: 500.0,
      child: Center(
          child: barcode == null || barcode == ""
              ? Padding(
                  padding: EdgeInsets.only(top: 150),
                  child: Container(
                      child: Column(children: <Widget>[
                    Text(
                      "Start the scan again!",
                      style: new TextStyle(
                          fontFamily: GoogleFonts.lato().toString(),
                          fontSize: 30.0,
                          fontWeight: FontWeight.w900),
                    ),
                    Container(
                        child: Icon(Icons.keyboard_arrow_down,
                            size: 100, color: Colors.black))
                  ])))
              : Padding(
                  padding: EdgeInsets.only(top: 150),
                  child: Container(
                      child: Column(children: <Widget>[
                    Text(
                      "Scanned!",
                      style: new TextStyle(
                          fontSize: 45.0, fontWeight: FontWeight.bold),
                    ),
                    Container(
                        child: Icon(Icons.beenhere,
                            size: 200, color: Colors.green))
                  ])))),
    );
  }
}
