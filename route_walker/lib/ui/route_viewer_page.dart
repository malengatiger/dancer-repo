import 'dart:async';

import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/associationdto.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as aftarobot;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/data/user.dart' as ar;
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
import 'package:aftarobotlibrary4/util/busy.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';
import 'package:route_walker/ui/route_editor.dart';
import 'package:route_walker/ui/route_point_collector.dart';
import 'package:route_walker/ui/routepoints_manager.dart';

import 'landmark_manager.dart';
import 'landmark_routes_page.dart';

/*
  This widget manages a list of routes. A route builder selects a route and starts the LocationCollector
  for collection of raw route points.
*/

class RouteViewerPage extends StatefulWidget {
  @override
  _RouteViewerPageState createState() => _RouteViewerPageState();
}

class _RouteViewerPageState extends State<RouteViewerPage>
    implements SnackBarListener, RouteCardListener {
  ScrollController scrollController = ScrollController();
  String status = 'AftaRobot Routes';
  int routeCount = 0, landmarkCount = 0;
  List<Association> asses = List();
  Association association;
  ar.User user;
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _subscribe();
    _checkUser();
  }

  void _checkUser() async {
    setState(() {
      isBusy = true;
    });
    bool isSignedIn = await isUserSignedIn();
    print(
        '🍎 🍎 🍎 _RouteViewerPageState: checkUser: ...................... 🔆🔆 isSignedIn: $isSignedIn  🔆🔆');
    if (!isSignedIn) {
      try {
        var user = await Navigator.push(context,
            MaterialPageRoute(builder: (BuildContext context) {
          return SignIn();
        }));
        if (user == null) {
          AppSnackbar.showSnackbar(
              scaffoldKey: _key,
              message: 'You have not signed in',
              textColor: Colors.amber,
              backgroundColor: Colors.pink[600]);
          return;
        }
        setState(() {});
      } catch (e) {
        AppSnackbar.showSnackbar(
            scaffoldKey: _key,
            message: 'Problem signing in',
            textColor: Colors.amber,
            backgroundColor: Colors.pink[600]);
      }
    }
    print(
        '🍎 🍎 🍎 _RouteViewerPageState: checkUser: set local MongoDB appID and get saved association');
    user = await Prefs.getUser();
    asses = await LocalDBAPI.getAssociations();
    if (asses.isEmpty) {
      asses = await routeBuilderBloc.getAssociations();
    } else {
      myDebugPrint('asssociations from local cache: ${asses.length}');
    }
    _buildDropDownItems();
    LocalDBAPI.setAppID();
    await _getAssociation();
    setState(() {
      isBusy = false;
    });
  }

  Future _getAssociation() async {
    association = await Prefs.getAssociation();
    if (association != null) {
      mTitle = association.associationName;
      await _refresh(false);
    }
    setState(() {});
  }

  List<aftarobot.Route> routes = List();
  StreamSubscription<bool> subscription;
  _subscribe() {
    var m = " 🍏 🍎 StreamSubscription: subscribe to 🍏 🍎 busyStream";
    print("$m:  start busyStream subscription: ");
    subscription = routeBuilderBloc.busyStream.listen((busy) {
      print(
          "\n\n\n$m: ..............subscription DataReceived:  busy: 🍎 $busy\n\n");
      setState(() {
        isBusy = busy;
      });
    }, onDone: () {
      print("$m: Task Done");
    }, onError: (error) {
      print("$m: Some Error: ${error.toString()}");
    });
    routeBuilderBloc.errorStream.listen((msg) {
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: msg);
    });
  }

  void _cancelSub() {
    subscription.cancel();
  }

  Future _refresh(bool forceRefresh) async {
    print(
        '🧩🧩 RouteViewerPage refresh routes and landmarks .................');
    if (association == null) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Please select association');
      return;
    }
    try {
      routes = await routeBuilderBloc.getRoutesByAssociation(
          association.associationID, forceRefresh);
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Some shit happened, Boss!',
          actionLabel: 'Err',
          listener: this);
    }
  }

  DateTime start, end;
  Widget _getListView() {
    return ListView.builder(
        itemCount: routes.length,
        controller: scrollController,
        itemBuilder: (BuildContext context, int index) {
          return Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16, top: 4.0),
            child: StreamBuilder<List<aftarobot.Route>>(
                stream: routeBuilderBloc.routeStream,
                builder: (context, snapshot) {
                  if ((snapshot.hasData)) {
                    routes = snapshot.data;
                  }
                  return RouteCard(
                    route: routes.elementAt(index),
                    number: index + 1,
                    hideLandmarks: switchStatus,
                    routeCardListener: this,
                  );
                }),
          );
        });
  }

  String switchLabel = 'Hide';
  bool switchStatus = false, isBusy = false;
  RouteBuilderModel appModel;
  void _sortRoutes() {
    //appModel.routes.sort((a, b) => a.name.compareTo(b.name));
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Association>>(
      stream: routeBuilderBloc.associationStream,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          asses = snapshot.data;
          print(
              '🔵 RouteViewerPage 🧩🧩🧩 ConnectionState.active  🔴 set appModel from stream: associations ${asses.length}');
          _buildDropDownItems();
        }

        return Scaffold(
          key: _key,
          appBar: AppBar(
            title: mTitle == null
                ? Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      'AftaRobot Routes',
                      style: Styles.blackBoldMedium,
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      mTitle,
                      style: Styles.blackBoldMedium,
                    ),
                  ),
            elevation: 16,
            backgroundColor: Colors.pink[300],
            bottom: _getTotalsView(),
          ),
          bottomNavigationBar: _getBottomNav(),
          body: Stack(
            children: <Widget>[
              isBusy ? Busy() : _getListView(),
            ],
          ),
          backgroundColor: Colors.brown.shade100,
        );
      },
    );
  }

  void _addNewRoute() {
    if (association == null) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Please select Association');
      return;
    }
    print(
        '🌀 🌀 🌀 🌀 add new route .... 🔴 start NewRoutePage for ${association.toJson()}');
    Navigator.push(context, SlideRightRoute(widget: NewRoutePage(association)));
  }

  void _onAssociationTapped(Association ass) async {
    print(
        '⚜️⚜️⚜️ onAssociationTapped ⚜️ ${ass.associationID} ⚜ ${ass.associationName} ... ♻️♻️♻️ set Association and refresh');
    association = ass;
    await Prefs.saveAssociation(association);
    _refresh(true);
  }

  String mTitle;
  List<DropdownMenuItem<Association>> _dropdownMenuItems = List();
  void _buildDropDownItems() {
    print('_buildDropDownItems ...... ♻️♻️ : ${asses.length} associations');
    _dropdownMenuItems.clear();
    asses.forEach((ass) {
      _dropdownMenuItems.add(DropdownMenuItem(
        value: ass,
        child: Container(
          width: 300,
          child: Text(
            '🍎 ${ass.associationName}',
            overflow: TextOverflow.ellipsis,
            style: Styles.blackBoldSmall,
          ),
        ),
      ));
    });
  }

  Widget _getBottomNav() {
    List<BottomNavigationBarItem> items = List();
    items.add(BottomNavigationBarItem(
        title: Text('Create New Route'),
        icon: Icon(
          Icons.add_circle_outline,
          color: Colors.pink,
        )));
    items.add(BottomNavigationBarItem(
        title: Text('Refresh Data'), icon: Icon(Icons.refresh)));
    return BottomNavigationBar(
      items: items,
      onTap: _bottomNavTapped,
      backgroundColor: Colors.amber[100],
    );
  }

  Widget _getTotalsView() {
    return PreferredSize(
      preferredSize: Size.fromHeight(132),
      child: Padding(
        padding: const EdgeInsets.all(4.0),
        child: Center(
          child: Column(
            children: <Widget>[
              DropdownButton<Association>(
                items: _dropdownMenuItems,
                hint: Padding(
                  padding: const EdgeInsets.only(left: 4.0),
                  child: Text(
                    'Tap to Select Association',
                    style: Styles.whiteSmall,
                  ),
                ),
                onChanged: (Association ass) {
                  print(
                      '☘️ ☘️ ☘️ _onDropDownChanged ⚜️ ${ass.associationName} ... ♻️♻️♻️ set Association and refresh');
                  mTitle = ass.associationName;
                  _onAssociationTapped(ass);
                },
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: <Widget>[
                  SizedBox(
                    width: 0,
                  ),
                  GestureDetector(
                    onTap: () {
                      _refresh(true);
                    },
                    child: Row(
                      children: <Widget>[
                        user == null
                            ? Container()
                            : Column(
                                children: <Widget>[
                                  Text(
                                    '${user.firstName} ${user.lastName}',
                                    style: Styles.whiteBoldMedium,
                                  ),
                                  SizedBox(
                                    height: 4,
                                  ),
                                  Text(
                                    '${user.userType}',
                                    style: Styles.blackSmall,
                                  ),
                                ],
                              ),
                        SizedBox(
                          width: 28,
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: <Widget>[
                            Text(
                              '${routes.length}',
                              style: Styles.blackBoldLarge,
                            ),
                            Text(
                              'Routes',
                              style: Styles.whiteSmall,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 20,
                  ),
                ],
              ),
              SizedBox(
                height: 16,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  onActionPressed(int action) {
    return null;
  }

  @override
  onMessage(aftarobot.Route route, String message, Color textColor,
      Color backColor, bool isError) {
    myDebugPrint(
        'onMessage: 🍏 🍏 🍏 🍏 ${route.rawRoutePoints.length} 🍎 in route ${route.name}');
    myDebugPrint(
        'onMessage: 🍏 🍏 🍏 🍏 ${route.routePoints.length} 🍎 in route ${route.name}');
    if (isError) {
      AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: message);
    } else {
      AppSnackbar.showSnackbar(
          scaffoldKey: _key,
          message: message,
          backgroundColor: backColor,
          textColor: textColor);
    }
  }

  void _bottomNavTapped(int index) {
    switch (index) {
      case 0:
        _addNewRoute();
        break;
      case 1:
        _refresh(true);
        break;
      default:
    }
  }
}

class RouteCard extends StatefulWidget {
  final aftarobot.Route route;
  final Color color;
  final int number;
  final bool hideLandmarks;
  final RouteCardListener routeCardListener;

  RouteCard(
      {@required this.route,
      this.color,
      this.number,
      this.hideLandmarks,
      this.routeCardListener});

  @override
  _RouteCardState createState() => _RouteCardState();
}

abstract class RouteCardListener {
  onMessage(aftarobot.Route route, String message, Color textColor,
      Color backColor, bool isError);
}

class _RouteCardState extends State<RouteCard>
    implements SnackBarListener, RouteMapListener {
  int index = 0;
  bool isExpanded = false;
  @override
  void initState() {
    super.initState();
    if (widget.route == null) {
      throw Exception('🍎 🍎 🍎 Route in RouteCard is NULL 🍎');
    } else {
      route = widget.route;
      myDebugPrint(
          '\n\n🌿 🌿 🌿 🌿  _RouteCardState: ❤️ 🧡 CHECKING ROUTE points :: 🧩🧩🧩 rawRoutePoints: ${route.rawRoutePoints.length}  '
          '🧩🧩🧩  routePoints: ${route.routePoints.length} at 🍎 ${route.name} 🌿 🌿 🌿 🌿 ');
    }
    _buildMenuItems();
  }

  void _showUpdateRouteDialog() async {
    print('*************** update route: ');
    await Prefs.saveRouteID(widget.route.routeID);
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title: new Text(
                "Update Route Name",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor),
              ),
              content: Container(
                height: 160.0,
                child: Column(
                  children: <Widget>[
                    Text(
                      widget.route == null ? '' : widget.route.name,
                      style: Styles.blackBoldSmall,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: TextField(
                        onChanged: _onRouteNameChanged,
                        decoration: InputDecoration(
                          hintText: 'Enter Route Name',
                        ),
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
                      _executeUpdate();
                    },
                    elevation: 4.0,
                    color: Colors.pink.shade700,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Update Route Name',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ],
            ));
  }

  List<PopupMenuItem<String>> menuItems = List();
  _buildMenuItems() {
    menuItems.clear();
//    menuItems.add(PopupMenuItem<String>(
//      value: 'Collect Route Points',
//      child: GestureDetector(
//        onTap: _startRoutePointCollector,
//        child: ListTile(
//          leading: Icon(
//            Icons.location_on,
//            color: getRandomColor(),
//          ),
//          title: Text('Collect Route Points', style: Styles.blackSmall),
//        ),
//      ),
//    ));
    menuItems.add(PopupMenuItem<String>(
      value: 'Manage Route Points',
      child: GestureDetector(
        onTap: _startNavigation,
        child: ListTile(
          leading: Icon(
            Icons.settings,
            color: getRandomColor(),
          ),
          title: Text(
            'Manage Route Points',
            style: Styles.blackSmall,
          ),
        ),
      ),
    ));
    if (widget.route.routePoints.isNotEmpty) {
      menuItems.add(PopupMenuItem<String>(
        child: GestureDetector(
          onTap: _startRouteMapPage,
          child: ListTile(
            leading: Icon(
              Icons.map,
              color: getRandomColor(),
            ),
            title: Text('Route Map', style: Styles.blackSmall),
          ),
        ),
      ));
    }
    menuItems.add(PopupMenuItem<String>(
      child: GestureDetector(
        onTap: _showUpdateRouteDialog,
        child: ListTile(
          leading: Icon(
            Icons.edit,
            color: getRandomColor(),
          ),
          title: Text('Update Route', style: Styles.blackSmall),
        ),
      ),
    ));
  }

  _startRouteMapPage() async {
    print('_startRouteLandmarks ........ route: ${widget.route.name}');
    Navigator.pop(context);
    await Prefs.saveRouteID(widget.route.routeID);
    List<aftarobot.Route> list = List();
    list.add(widget.route);

    Navigator.push(
        context,
        SlideRightRoute(
            widget: RouteMap(
          routes: list,
          title: widget.route.name,
          hideAppBar: false,
          landmarkIconColor: RouteMap.colorOrange,
//          title: widget.route.name,
          listener: this,
//              bottomRightWidget: btn,
//              topLeftWidget: fab,
//          bottomRightWidget: card,
//          topLeftWidget: card2,
////          container: container,
//          containerHeight: 100,
        )));
  }

  aftarobot.Route route;
  _startNavigation() async {
    myDebugPrint('_startNavigation........... : 🍎 🍎 🍎');
    await Prefs.saveRouteID(widget.route.routeID);
    Navigator.pop(context);

    if (widget.route.rawRoutePoints.isEmpty &&
        widget.route.routePoints.isEmpty) {
      Navigator.push(
          context, SlideRightRoute(widget: RoutePointCollector(route)));
      return;
    }
    if (widget.route.rawRoutePoints.isNotEmpty &&
        widget.route.routePoints.isEmpty) {
      Navigator.push(
          context, SlideRightRoute(widget: CreateRoutePointsPage(route)));
      return;
    }
    if (widget.route.rawRoutePoints.isNotEmpty &&
        widget.route.routePoints.isNotEmpty) {
      Navigator.push(
          context, SlideRightRoute(widget: LandmarksManagerPage(route)));
      return;
    }
    if (widget.route.routePoints.isEmpty &&
        widget.route.rawRoutePoints.isNotEmpty) {
      Navigator.push(
          context, SlideRightRoute(widget: CreateRoutePointsPage(route)));
    } else {
      Navigator.push(
          context, SlideRightRoute(widget: LandmarksManagerPage(route)));
    }
  }

  Widget _getLandmarks() {
    var cnt = 0;
    widget.route.routePoints.forEach((point) {
      if (point.landmarkID != null) {
        cnt++;
      }
    });
    return Text(
      '$cnt',
      style: Styles.tealBoldSmall,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4.0,
//      color: getRandomPastelColor(),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: <Widget>[
            RouteName(
              name: route == null ? 'Route is NULL! 🍎' : route.name,
              number: widget.number,
            ),
            Padding(
              padding: const EdgeInsets.only(left: 40.0),
              child: Row(
                children: <Widget>[
                  Text(
                    'Landmarks',
                    style: Styles.greyLabelSmall,
                  ),
                  SizedBox(
                    width: 8,
                  ),
                  _getLandmarks(),
                  SizedBox(
                    width: 24,
                  ),
                  Text(
                    'Route Points',
                    style: Styles.greyLabelSmall,
                  ),
                  SizedBox(
                    width: 8,
                  ),
                  Text(
                    '${route.routePoints.length}',
                    style: Styles.tealBoldSmall,
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 20,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                Text(
                  'Route Actions',
                  style: Styles.greyLabelSmall,
                ),
                SizedBox(
                  width: 0,
                ),
                PopupMenuButton<String>(
                  itemBuilder: (context) {
                    return menuItems;
                  },
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
  }

  String routeName = '';
  void _onRouteNameChanged(String value) {
    routeName = value;
  }

  void _executeUpdate() async {
    if (routeName.isEmpty) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: widget.key,
          message: 'Enter route name',
          listener: this,
          actionLabel: 'close');
      return;
    }
    Navigator.pop(context);

    widget.routeCardListener.onMessage(widget.route, 'Updating route name',
        Colors.yellowAccent, Colors.black, false);

    widget.route.name = routeName;
    try {
      await routeBuilderBloc.updateLocalRoute(widget.route);

      widget.routeCardListener.onMessage(widget.route, 'Route name updated',
          Colors.white, Colors.teal[800], false);
    } catch (e) {
      print(e);
      widget.routeCardListener.onMessage(
          widget.route, e.message, Colors.white, Colors.pink[800], false);
      return;
    }
  }

  @override
  onActionPressed(int action) {
    return null;
  }

  @override
  onLandmarkTapped(Landmark landmark) {
    print(
        '️🔴  RouteViewerPage: Caller has received onLandmarkTapped ️🔴 ️🔴  ️🔴  ${landmark.landmarkName}');
    return null;
  }

  @override
  onLandmarkInfoWindowTapped(Landmark landmark) {
    print(
        '️🔴  RouteViewerPage: Caller has received onLandmarkInfoWindowTapped ☘ ☘ ☘ ☘  ${landmark.landmarkName}');
    Navigator.push(
        context, SlideRightRoute(widget: LandmarkRoutesPage(landmark)));
  }

  @override
  onPointInfoWindowTapped(RoutePoint point) {
    print(
        '️🔴  RouteViewerPage: Caller has received onPointInfoWindowTapped ️🌼 🌼 🌼 🌼  ${point.created}');
  }

  @override
  onPointTapped(RoutePoint point) {
    print(
        '️🔴  RouteViewerPage: Caller has received onPointTapped ️🔴 ️🔴  ️🔴  ${point.created} ');
  }

  @override
  onLongPress(LatLng latLng) {
    print(
        '️🔴  RouteViewerPage: 🌼  Caller has received onLongPress ️💎  💎  💎   $latLng  💎 ');
    ;
  }
}

class RouteName extends StatelessWidget {
  final String name;
  final int number;

  const RouteName({Key key, this.name, this.number}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        SizedBox(
          width: 40,
          child: Text(
            number == null ? '' : '$number',
            style: Styles.pinkBoldMedium,
          ),
        ),
        Flexible(
          child: Container(
            child: Text(
              name,
              style: Styles.blackBoldSmall,
              overflow: TextOverflow.clip,
            ),
          ),
        ),
      ],
    );
  }
}

class SearchRoutes extends StatefulWidget {
  @override
  _SearchRoutesState createState() => _SearchRoutesState();
}

class _SearchRoutesState extends State<SearchRoutes> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
