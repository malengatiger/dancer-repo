import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/associationdto.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/data/route.dart' as aftarobot;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/data/user.dart' as ar;
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/signin/sign_in.dart';
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

import 'flag_routepoint_landmarks.dart';
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
    _checkUser();
  }

  void _checkUser() async {
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
      debugPrint('asssociations from local cache: ${asses.length}');
    }
    _buildDropDownItems();
    LocalDBAPI.setAppID();
    _getAssociation();
  }

  void _getAssociation() async {
    association = await Prefs.getAssociation();
    if (association != null) {
      mTitle = association.associationName;
      _getRoutesByAssoc();
    }
    setState(() {});
  }

  List<aftarobot.Route> routes = List();

  void _refresh() async {
    print(
        '🧩🧩 RouteViewerPage refresh routes and landmarks .................');
    if (association == null) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key, message: 'Please select association');
      return;
    }

    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Loading fresh data',
        textColor: Colors.yellow,
        backgroundColor: Colors.black);

    try {
      routes = await routeBuilderBloc
          .getRoutesByAssociation(association.associationID);
      _key.currentState.removeCurrentSnackBar();

      setState(() {});
      await routeBuilderBloc.cacheRoutes(routes: routes);
      _key.currentState.removeCurrentSnackBar();
    } catch (e) {
      print(e);
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Some shit happened, Boss!',
          actionLabel: 'Err',
          listener: this);
    }
  }

  Future<List<aftarobot.Route>> _getRoutesByAssoc() async {
    routes = await LocalDBAPI.getRoutesByAssociation(association.associationID);
    if (routes.isNotEmpty) {
      debugPrint('🌿 🌿 🌿 🌿  routes from local db: 🌿  ${routes.length}');
      routes.forEach(((r) {
        debugPrint('🌿 🌿 🌿 🌿  route from local db: 🌿  ${r.name}');
      }));
      routeBuilderBloc.updateRoutesInStream(routes);
    } else {
      AppSnackbar.showSnackbarWithProgressIndicator(
          scaffoldKey: _key,
          message: 'Loading fresh data',
          textColor: Colors.yellow,
          backgroundColor: Colors.black);
      routes = await routeBuilderBloc
          .getRoutesByAssociation(association.associationID);
      _key.currentState.removeCurrentSnackBar();
    }
    setState(() {});
    return routes;
  }

  Future<List<aftarobot.Route>> _getRoutesByAssocFromRemote() async {
    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: 'Loading fresh data',
        textColor: Colors.yellow,
        backgroundColor: Colors.black);
    routes = await routeBuilderBloc
        .getRoutesByAssociation(association.associationID);
    _key.currentState.removeCurrentSnackBar();
    if (routes.isNotEmpty) {
      debugPrint('🔆 🔆 🔆 🔆 routes from remote db: 🌿  ${routes.length}');
      routes.forEach(((r) {
        debugPrint('🔆 🔆 🔆 🔆  route from remote db: 🌿  ${r.name}');
      }));
    }
    setState(() {});
    return routes;
  }

  DateTime start, end;
  Widget _getListView() {
    return ListView.builder(
        itemCount: routes.length,
        controller: scrollController,
        itemBuilder: (BuildContext context, int index) {
//          - app;
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
  bool switchStatus = false;
  RouteBuilderModel appModel;
  void _sortRoutes() {
    //appModel.routes.sort((a, b) => a.name.compareTo(b.name));
  }

  void writeRoutesToMongo() async {
    await routeBuilderBloc.addRoutesToMongo(appModel.routes);
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
            actions: <Widget>[
              association == null
                  ? Container()
                  : Padding(
                      padding: const EdgeInsets.only(right: 8.0, top: 4.0),
                      child: IconButton(
                        onPressed: _addNewRoute,
                        iconSize: 24,
                        icon: Icon(Icons.library_add),
                      ),
                    ),
              Padding(
                padding: const EdgeInsets.only(right: 8.0, top: 4.0),
                child: IconButton(
                  onPressed: writeRoutesToMongo,
                  iconSize: 24,
                  icon: Icon(Icons.room),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(right: 8.0, top: 4.0),
                child: IconButton(
                  onPressed: _getRoutesByAssocFromRemote,
                  iconSize: 24,
                  icon: Icon(Icons.refresh),
                ),
              ),
            ],
            bottom: _getTotalsView(),
          ),
          body: _getListView(),
          backgroundColor: Colors.brown.shade100,
        );
      },
    );
  }

  void _addNewRoute() {
    if (association == null) {
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
    _refresh();
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
                    style: Styles.whiteMedium,
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
//                  RaisedButton(
//                    color: Colors.indigo[600],
//                    elevation: 16,
//                    child: Padding(
//                      padding: const EdgeInsets.all(16.0),
//                      child: Text(
//                        'Test Dynamic Distance',
//                        style: Styles.whiteSmall,
//                      ),
//                    ),
//                    onPressed: () {
//                      Navigator.push(
//                          context,
//                          SlideRightRoute(
//                            widget: EstimatorTester(),
//                          ));
//                    },
//                  ),
                  SizedBox(
                    width: 0,
                  ),
                  GestureDetector(
                    onTap: () {
                      _refresh();
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

  void _addNewRoute() async {
    print('🌀 🌀 🌀 🌀 add new route .... 🔴 start NewRoutePage');
    Navigator.pop(context);

    var association = await Prefs.getAssociation();
    if (association != null) {
      Navigator.push(
          context, SlideRightRoute(widget: NewRoutePage(association)));
    } else {
      widget.routeCardListener.onMessage(
          null, 'Please select Association', Colors.white, Colors.pink, true);
    }
  }

  List<PopupMenuItem<String>> menuItems = List();
  _buildMenuItems() {
    menuItems.clear();
    menuItems.add(PopupMenuItem<String>(
      value: 'Collect Route Points',
      child: GestureDetector(
        onTap: _startRoutePointCollector,
        child: ListTile(
          leading: Icon(
            Icons.location_on,
            color: getRandomColor(),
          ),
          title: Text('Collect Route Points', style: Styles.blackSmall),
        ),
      ),
    ));
    menuItems.add(PopupMenuItem<String>(
      value: 'Manage Route Points',
      child: GestureDetector(
        onTap: _startCreateRoutePointsPage,
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
    menuItems.add(PopupMenuItem<String>(
      value: 'Route Landmarks',
      child: GestureDetector(
        onTap: () async {
          Navigator.pop(context);
          await Prefs.saveRouteID(widget.route.routeID);
          Navigator.push(
            context,
            SlideRightRoute(
              widget: FlagRoutePointLandmarks(
                route: widget.route,
              ),
            ),
          );
        },
        child: ListTile(
          leading: Icon(
            Icons.airport_shuttle,
            color: Colors.pink,
          ),
          title: Text('Route Landmarks', style: Styles.blackSmall),
        ),
      ),
    ));
//    menuItems.add(PopupMenuItem<String>(
//      value: 'Route Estimation',
//      child: GestureDetector(
//        onTap: () async {
//          Navigator.pop(context);
//          await Prefs.saveRouteID(widget.route.routeID);
//          Navigator.push(
//            context,
//            SlideRightRoute(
//              widget: EstimationPage(
//                route: widget.route,
//              ),
//            ),
//          );
//        },
//        child: ListTile(
//          leading: Icon(
//            Icons.airport_shuttle,
//            color: Colors.pink,
//          ),
//          title: Text('Route Estimation', style: Styles.blackSmall),
//        ),
//      ),
//    ));
  }

  _startRoutePointCollector() async {
    print('_startRoutePointCollector');
    await Prefs.saveRouteID(widget.route.routeID);
    Navigator.pop(context);

    Navigator.push(context, SlideRightRoute(widget: RoutePointCollector()));
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

  _testLibraryMap() async {
    List<aftarobot.Route> list = List();
    list.add(widget.route);

    var card = Card(
      color: Colors.pink.shade50,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Text('Testing Map Positioned Widget'),
      ),
    );
    var card2 = Card(
      color: Colors.blue.shade50,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Text('Top Left'),
      ),
    );
    var container = Container(
      height: 100,
      width: double.infinity,
      color: Colors.teal,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Text('🍏 🍎 I am a Container, height 🍎  100',
            style: Styles.whiteSmall),
      ),
    );

    var btn = RaisedButton(
      elevation: 16,
      color: Colors.red,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Text(
          'Show Places',
          style: Styles.whiteSmall,
        ),
      ),
      onPressed: () {
        print('🥬 🥬 🥬  Top Left Button inside RouteMap pressed  🥬 🥬 🥬');
      },
    );

    var fab = FloatingActionButton(
      child: Icon(Icons.airport_shuttle),
      backgroundColor: Colors.red.shade800,
      elevation: 16,
      onPressed: () {
        print(
            '🍑 🍑 🍑  FloatingActionButton inside RouteMap pressed  🍑 🍑 🍑');
      },
    );

    Navigator.push(
        context,
        SlideRightRoute(
            widget: RouteMap(
          routes: list,
          hideAppBar: false,
          landmarkIconColor: RouteMap.colorAzure,
          title: widget.route.name,
          listener: this,
          bottomRightWidget: btn,
          topLeftWidget: fab,
//          bottomRightWidget: card,
//          topLeftWidget: card2,
          container: container,
          containerHeight: 100,
        )));
  }

  aftarobot.Route route;
  _startCreateRoutePointsPage() async {
    debugPrint('_startCreateRoutePointsPage........... : 🍎 🍎 🍎');
    await Prefs.saveRouteID(widget.route.routeID);
    Navigator.pop(context);
    if (widget.route.routePoints.isEmpty) {
      var points =
          await LocalDBAPI.getRoutePoints(routeID: widget.route.routeID);
      debugPrint('........... Route points from LOCAL DB: ${points.length}');
      if (points.isEmpty) {
        widget.routeCardListener.onMessage(
            widget.route,
            'Loading route points from REMOTE',
            Colors.white,
            Colors.indigo,
            false);
        widget.routeCardListener.onMessage(
            widget.route, 'Loading', Colors.yellowAccent, Colors.black, false);
        route = await routeBuilderBloc.getRouteByID(widget.route.routeID);
        await LocalDBAPI.addRoute(route: route);
      } else {
        debugPrint('Route points from LOCAL DB');
        widget.routeCardListener.onMessage(
            widget.route,
            'Loading route points from LOCAL',
            Colors.white,
            Colors.indigo,
            false);
        route.routePoints = points;
      }
    }

    if (route.routePoints.isNotEmpty) {
      Navigator.push(context, SlideRightRoute(widget: LandmarksManagerPage()));
    } else {
      Navigator.push(
          context, SlideRightRoute(widget: CreateRoutePointsPage(route)));
    }
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
//
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
      await routeBuilderBloc.updateRoute(widget.route);

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
