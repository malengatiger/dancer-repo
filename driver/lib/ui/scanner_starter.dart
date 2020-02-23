import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
import 'package:aftarobotlibrary4/util/constants.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/scanner.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:driver/bloc/driver_bloc.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';
import 'package:google_fonts/google_fonts.dart';

class ScannerStarter extends StatefulWidget {
  @override
  _ScannerStarterState createState() => _ScannerStarterState();
}

class _ScannerStarterState extends State<ScannerStarter>
    implements ScannerListener {
  List<CommuterRequest> _requests = List();
  @override
  void initState() {
    super.initState();
    _checkUser();
  }

  void _checkUser() async {
    bool isSignedIn = await driverBloc.checkUserLoggedIn();
    print(
        '🍎 🍎 🍎 _DashboardState: checkUser: is user signed in? 🔆🔆 isSignedIn: $isSignedIn  🔆🔆');
    if (!isSignedIn) {
      try {
        bool isOK = await Navigator.push(context,
            MaterialPageRoute(builder: (BuildContext context) {
          return SignIn();
        }));
        if (!isOK) {
          AppSnackbar.showSnackbar(
              scaffoldKey: _key,
              message: 'You have not signed in',
              textColor: Colors.amber,
              backgroundColor: Colors.pink[600]);
          return;
        }
      } catch (e) {
        AppSnackbar.showSnackbar(
            scaffoldKey: _key,
            message: 'Problem signing in',
            textColor: Colors.amber,
            backgroundColor: Colors.pink[600]);
      }
    } else {
      myDebugPrint('💜 💜 calling getMyScannedRequests: ..');
      driverBloc.getMyScannedRequests();
    }
  }

  void _startScan() {
    Navigator.push(
        context,
        SlideRightRoute(
          widget: Scanner(
            type: Constants.SCAN_TYPE_REQUEST,
            scannerListener: this,
          ),
        ));
  }

  var _key = GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _startScan,
        icon: Icon(Icons.language),
        label: Text("Scan Passenger Phone"),
        foregroundColor: Colors.white,
        backgroundColor: Colors.pink,
        elevation: 16,
        heroTag: 'myFB',
        splashColor: Colors.yellow,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
      ),
      backgroundColor: Colors.brown[100],
      body: Stack(
        children: <Widget>[
          Padding(
            padding: EdgeInsets.only(left: 20, right: 20, top: 120),
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage("assets/ty1.png"),
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          Positioned(
            left: 40,
            top: 40,
            child: StreamBuilder<List<CommuterRequest>>(
                stream: driverBloc.requestStream,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    _requests = snapshot.data;
                  }
                  return Card(
                    elevation: 16,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: <Widget>[
                          Row(
                            children: <Widget>[
                              Text(
                                'Daily Pickings',
                                style: TextStyle(
                                    fontFamily:
                                        GoogleFonts.raleway().toString(),
                                    fontWeight: FontWeight.w900,
                                    color: Colors.grey[500],
                                    fontSize: 24),
                              ),
                              SizedBox(
                                width: 12,
                              ),
                              Text(getFormattedDateShortest(
                                  DateTime.now().toIso8601String(), context)),
                            ],
                          ),
                          SizedBox(
                            height: 24,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: <Widget>[
                              Text('Total Takings:'),
                              SizedBox(
                                width: 20,
                              ),
                              Text(
                                'R${getTotalTakings()}',
                                style: Styles.blackBoldLarge,
                              ),
                            ],
                          ),
                          SizedBox(
                            height: 12,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              Text(
                                'Total Passengers:',
                                style: Styles.greyLabelSmall,
                              ),
                              SizedBox(
                                width: 20,
                              ),
                              Text(
                                '${getTotalPassengers()}',
                                style: Styles.tealBoldLarge,
                              ),
                            ],
                          ),
                          SizedBox(
                            height: 12,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              Text(
                                ' Number of Scans:',
                                style: Styles.greyLabelSmall,
                              ),
                              SizedBox(
                                width: 20,
                              ),
                              Text(
                                '${_requests.length}',
                                style: Styles.blueBoldLarge,
                              ),
                            ],
                          ),
                          SizedBox(
                            height: 20,
                          ),
                        ],
                      ),
                    ),
                  );
                }),
          ),
        ],
      ),
    );
  }

  int getTotalPassengers() {
    var tot = 0;
    _requests.forEach((m) {
      tot += m.passengers;
    });
    return tot;
  }

  String getTotalTakings() {
    var tot = 0.00;
    _requests.forEach((m) {
      if (m.isWallet) {
        tot += Constants.DUMMY_FARE * .9 * m.passengers;
      } else {
        tot += Constants.DUMMY_FARE * m.passengers;
      }
    });
    return getFormattedAmount(tot.toString(), context);
  }

  @override
  onScan(String commuterRequestID) {
    driverBloc.addScannedCommuterRequest(commuterRequestID);
    myDebugPrint('👌 👌 👌 ScannerStarter: onScan: 👌 $commuterRequestID');
    return null;
  }
}
