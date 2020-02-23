import 'dart:async';
import 'dart:convert';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/dancer/dancer_list_api.dart';
import 'package:aftarobotlibrary4/data/commuter_request.dart';
import 'package:aftarobotlibrary4/data/user.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

DriverBloc driverBloc = DriverBloc();

class DriverBloc {
  FirebaseAuth _auth = FirebaseAuth.instance;
  User _user;
  User get user => _user;
  List<CommuterRequest> _commuterRequests = List();
  StreamController<List<CommuterRequest>> _reqController =
      StreamController.broadcast();
  Stream<List<CommuterRequest>> get requestStream => _reqController.stream;

  Future<bool> checkUserLoggedIn() async {
    var fbUser = await _auth.currentUser();
    if (fbUser == null) {
      myDebugPrint(
          '🌴 🌴 🌴 Brand new app - 🐢 🐢 🐢  Firebase fbUser is null.  👺  need to 🔑 🔑 🔑');
      return false;
    }
    _user = await Prefs.getUser();
    if (_user == null) {
      return false;
    }
    return true;
  }

  Future addScannedCommuterRequest(String commuterRequestID) async {
    var request = await DancerListAPI.findCommuterRequestByID(
        commuterRequestID: commuterRequestID);
    if (request != null) {
      await LocalDBAPI.addCommuterRequest(request: request);
      _commuterRequests.add(request);
      _reqController.sink.add(_commuterRequests);
    }
    return;
  }

  Future<List<CommuterRequest>> getMyScannedRequests() async {
    List mList = await LocalDBAPI.getCommuterRequests();
    myDebugPrint('Scanned requests found on local database: ${mList.length}');
    mList.forEach((r) {
      _commuterRequests.add(CommuterRequest.fromJson(json.decode(r)));
    });
    _reqController.sink.add(_commuterRequests);
    return _commuterRequests;
  }

  void close() {
    _reqController.close();
  }
}
