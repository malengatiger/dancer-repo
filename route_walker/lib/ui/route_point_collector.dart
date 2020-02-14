import 'package:aftarobotlibrary4/api/local_db_api.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/data/route_point.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';
import 'package:route_walker/ui/routepoints_manager.dart';

/*
  This widget manages the collection of route points. The route builder may collect these points either on foot or in a car.
  The app automatically drops a point every few seconds depending on the mode.

  After collection is complete, this widget passes the resulting points to the SnapToRoads page for viewing on the map and
  saving to Firestore.

  The points collected will be used to draw polylines for route and other maps.

 */
class RoutePointCollector extends StatefulWidget {
  final ar.Route route;

  RoutePointCollector(this.route);

  @override
  _RoutePointCollectorState createState() => _RoutePointCollectorState();
}

class _RoutePointCollectorState extends State<RoutePointCollector>
    implements SnackBarListener, ModesListener {
  final GlobalKey<ScaffoldState> _key = new GlobalKey<ScaffoldState>();

  List<RoutePoint> _routePointsCollected = List();
  bool isCancelTimer = false;
  ar.Route _route;

  @override
  void initState() {
    super.initState();
    isStopped = true;
    _getRoute();
  }

  String routeID;
  void _getRoute() async {
    _route = widget.route;
    _getCollectionPoints();
  }

  @override
  void dispose() {
    print(
        '### LocationCollector dispose  🔵  🔵  🔵  🔵  🔵  - do nuthin, just checkin!');
    super.dispose();
  }

  void _startCreateRoutePointsPage() {
    print('🌀 ☘️ startCreateRoutePointsPage ... add collected points to route: '
        '${_route.name}  🌀🌀🌀');
    Navigator.push(
      context,
      SlideRightRoute(
        widget: CreateRoutePointsPage(_route),
      ),
    );
  }

  _startTimer() async {
    assert(_route != null);
    try {
      routeBuilderBloc.cancelTimer();
      routeBuilderBloc.startRoutePointCollectionTimer(
          route: _route, collectionSeconds: collectionSeconds);
      _showSnack(
          color: Colors.teal[300], message: 'Location collection started');
      setState(() {
        isStopped = false;
      });
    } catch (e) {
      print(e);
      _showSnack(
        message: e.toString(),
        color: Colors.red[700],
      );
    }
  }

//  _confirmStopType() {
//    _stopTimer();
//    showDialog(
//        context: context,
//        barrierDismissible: false,
//        builder: (_) => new AlertDialog(
//              title: new Text(
//                "Confirm Status",
//                style: TextStyle(
//                    fontWeight: FontWeight.bold,
//                    color: Theme.of(context).primaryColor),
//              ),
//              content: Container(
//                height: 160.0,
//                child: Column(
//                  children: <Widget>[
//                    Padding(
//                      padding: const EdgeInsets.all(8.0),
//                      child: Column(
//                        children: <Widget>[
//                          Text(
//                            'Do you want to complete the route buikding for ${widget.route.name} ?',
//                            style: Styles.blackBoldSmall,
//                          ),
//                          SizedBox(
//                            height: 12,
//                          ),
//                        ],
//                      ),
//                    ),
//                  ],
//                ),
//              ),
//              actions: <Widget>[
//                FlatButton(
//                  child: Text(
//                    'NO',
//                    style: TextStyle(color: Colors.grey),
//                  ),
//                  onPressed: () {
//                    Navigator.pop(context);
//                  },
//                ),
//                Padding(
//                  padding: const EdgeInsets.only(bottom: 20.0),
//                  child: RaisedButton(
//                    onPressed: () {
//                      Navigator.pop(context);
//                      widget.route.rawRoutePoints = _routePointsCollected;
//                      Navigator.push(
//                          context,
//                          SlideRightRoute(
//                              widget: CreateRoutePointsPage(widget.route)));
//                    },
//                    elevation: 4.0,
//                    color: Colors.blue.shade700,
//                    child: Padding(
//                      padding: const EdgeInsets.all(16.0),
//                      child: Text(
//                        'Add Landmark',
//                        style: TextStyle(color: Colors.white),
//                      ),
//                    ),
//                  ),
//                ),
//              ],
//            ));
//  }

  _stopTimer() async {
    _showSnack(
        message:
            'Location collection stopped ${getFormattedDateHourMinuteSecond()}',
        color: Colors.pink[200]);
    await routeBuilderBloc.stopRoutePointCollectionTimer();
    if (_key.currentState != null) {
      _key.currentState.removeCurrentSnackBar();
    }
    setState(() {
      isCancelTimer = false;
    });
    Navigator.pop(context);
  }

  _showSnack({String message, Color color}) {
    AppSnackbar.showSnackbar(
        backgroundColor: Colors.black,
        scaffoldKey: _key,
        textColor: color == null ? Colors.white : color,
        message: message);
  }

  void eraseLocations() async {
//    try {
//      routeBuilderBloc.deleteRoutePoints(routeID: _route.routeID);
//    } catch (e) {
//      print(e);
//      _showSnack(message: e.toString(), color: Colors.red);
//    }
  }

  void _getCollectionPoints() async {
    _routePointsCollected =
        await LocalDBAPI.getRawRoutePoints(routeID: widget.route.routeID);
    assert(widget.route.routeID != null);
    if (_routePointsCollected.isEmpty) {
      myDebugPrint(
          '🔵 🔵 _routePointsCollected.isEmpty ... 🔵 refreshing from remote db');
      _route = await routeBuilderBloc
          .getRouteByIDAndCacheLocally(widget.route.routeID);
      _routePointsCollected = _route.rawRoutePoints;
    }
    setState(() {});
  }

  int collectionSeconds = DRIVING;
  bool isStopped = false;

  @override
  void onActionPressed(int action) {}
  ScrollController scrollController = ScrollController();

  static const int MINIMUM_POINTS = 10;
  List<BottomNavigationBarItem> barItems = List();
  List<BottomNavigationBarItem> _buildNavItems() {
    barItems.clear();
    barItems.add(BottomNavigationBarItem(
      icon: Icon(
        Icons.location_on,
        size: 24,
        color: Colors.black,
      ),
      title: Text(
        'Start',
        style: Styles.blackSmall,
      ),
    ));
    barItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.my_location, size: 24, color: Colors.blue),
      title: Text(
        'Build Route',
        style: Styles.blackSmall,
      ),
    ));

    barItems.add(BottomNavigationBarItem(
      icon: Icon(
        Icons.close,
        size: 24,
        color: Colors.pink,
      ),
      title: Text(
        'Stop',
        style: Styles.blackSmall,
      ),
    ));

    return barItems;
  }

  @override
  Widget build(BuildContext context) {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      scrollController.animateTo(
        scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeOut,
      );
    });
    return StreamBuilder<List<RoutePoint>>(
        stream: routeBuilderBloc.rawRoutePointsStream,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            _routePointsCollected = snapshot.data;
          }
          return WillPopScope(
            onWillPop: () async {
              return false;
            },
            child: Scaffold(
              key: _key,
              appBar: AppBar(
                title: Text('Route Point Collector'),
                leading: Container(),
                backgroundColor: isStopped == false
                    ? Colors.pink[300]
                    : Colors.blueGrey[400],
                bottom: PreferredSize(
                  preferredSize: Size.fromHeight(240),
                  child: Padding(
                    padding: const EdgeInsets.only(left: 16.0, right: 16),
                    child: Column(
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            SizedBox(
                              width: 20,
                            ),
                            Flexible(
                              child: Container(
                                child: Text(
                                  _route == null
                                      ? 'UNAVAILABLE ROUTE'
                                      : _route.name,
                                  style: Styles.whiteMedium,
                                  overflow: TextOverflow.clip,
                                ),
                              ),
                            ),
                            SizedBox(
                              width: 20,
                            ),
                          ],
                        ),
                        SizedBox(
                          height: 8,
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: <Widget>[
                            Hero(
                              child: Modes(
                                listener: this,
                              ),
                              tag: 'modes',
                            ),
                            SizedBox(
                              width: 40,
                            ),
                            Column(
                              children: <Widget>[
                                Text('${_routePointsCollected.length}',
                                    style: Styles.blackBoldReallyLarge),
                                Text(
                                  'Collected',
                                  style: Styles.whiteBoldSmall,
                                )
                              ],
                            ),
                            SizedBox(
                              width: 30,
                            )
                          ],
                        ),
                        SizedBox(
                          height: 12,
                        ),
                        StreamBuilder<String>(
                            stream: routeBuilderBloc.errorStream,
                            builder: (context, snapshot) {
                              var err = '';
                              if (snapshot.hasData) {
                                err = snapshot.data;
                              }
                              return Row(
                                children: <Widget>[
                                  Text(
                                    err,
                                    style: Styles.whiteSmall,
                                  ),
                                ],
                              );
                            }),
                        SizedBox(
                          height: 4,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              body: Stack(
                children: <Widget>[
                  Container(
                    padding: EdgeInsets.all(16.0),
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: _routePointsCollected.length,
                      itemBuilder: (context, index) {
                        var point = _routePointsCollected.elementAt(index);
                        return Card(
                          elevation: 2.0,
                          color: getRandomPastelColor(),
                          child: ListTile(
                            leading: Icon(
                              Icons.location_on,
                              color: getRandomColor(),
                            ),
                            title: Text(
                                '${getFormattedDateShortWithTime(point.created, context)}',
                                style: Styles.blackBoldSmall),
                            subtitle: Text(
                                '${point.latitude} ${point.longitude}  #${index + 1}',
                                style: Styles.greyLabelSmall),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
              backgroundColor: Colors.brown.shade100,
              bottomNavigationBar: BottomNavigationBar(
                items: _buildNavItems(),
                onTap: (index) {
                  _handleNavBar(index);
                },
              ),
            ),
          );
        });
  }

  void _handleNavBar(int index) {
    if (index == 0) {
      _confirmStart();
      return;
    }
    if (_routePointsCollected.length == 0) {
      myDebugPrint('🥏 🥏 🥏 🥏 🥏 🥏 Leaving  on pressing stop');
      Navigator.pop(context);
    } else {
      _handleNavItems(index);
    }
  }

  void _handleNavItems(int index) {
    switch (index) {
      case 1:
        if (_routePointsCollected.length > MINIMUM_POINTS) {
          _onBuildRoute();
        }
        break;
      case 2:
        _stopTimer();
        setState(() {
          isStopped = true;
        });
        break;
      case 0:
        _confirmStart();
        break;
    }
  }

  void _onBuildRoute() async {
    await Prefs.saveRouteID(routeID);
    if (_routePointsCollected.length < 20) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Too few points to build route',
          actionLabel: 'Close',
          listener: this);
      return;
    }
    _stopTimer();
    setState(() {
      isStopped = true;
    });
    await routeBuilderBloc.stopRoutePointCollectionTimer();
    _startCreateRoutePointsPage();
  }

  void _confirmStart() {
    if (_routePointsCollected.isEmpty) {
      _startTimer();
      return;
    }

    showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => new AlertDialog(
              title: new Text(
                "Confirm Action",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor),
              ),
              content: Container(
                height: 120.0,
                child: Column(
                  children: <Widget>[
                    Text(
                      'Please select the appropriate action. You can either continue from where you stopped or start again from the beginning of the route. Route currently has ${_routePointsCollected.length} route points collected?',
                      style: Styles.blackBoldSmall,
                    ),
                  ],
                ),
              ),
              actions: <Widget>[
                IconButton(
                  icon: Icon(Icons.cancel),
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                ),
                FlatButton(
                  child: Text(
                    'CONTINUE',
                    style: TextStyle(color: Colors.blue[600]),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    _startTimer();
                  },
                ),
                FlatButton(
                  onPressed: () {
                    Navigator.pop(context);
                    _startFreshCollection();
                  },
                  child: Text(
                    'FRESH START',
                    style: TextStyle(color: Colors.pink[600]),
                  ),
                ),
              ],
            ));
  }

  void onDone() {
    Navigator.pop(context);
  }

  @override
  onModeSelected(int seconds) {
    print(
        '****** ⌛️ ⌛️ ⌛️ ⌛️ onModeSelected, seconds: 🧩 $seconds  ⌛ - restart timer');
    routeBuilderBloc.cancelTimer();
    setState(() {
      collectionSeconds = seconds;
    });
    _startTimer();
  }

  void _exit() async {
    await routeBuilderBloc.stopRoutePointCollectionTimer();
    Navigator.pop(context);
  }

  void _startFreshCollection() async {
    if (_routePointsCollected.isNotEmpty) {
      AppSnackbar.showSnackbarWithProgressIndicator(
          scaffoldKey: _key,
          message: 'Deleting points ...',
          textColor: Colors.pink,
          backgroundColor: Colors.black);
      //await routeBuilderBloc.deleteRoutePoints(routeID: _route.routeID);
      myDebugPrint('_startFreshCollection: points deleted!');
      if (_key.currentState != null) {
        _key.currentState.removeCurrentSnackBar();
      }
    }
    setState(() {
      _routePointsCollected.clear();
    });
    _startTimer();
  }
}

abstract class ModesListener {
  onModeSelected(int seconds);
}

class Modes extends StatefulWidget {
  final ModesListener listener;

  const Modes({Key key, this.listener}) : super(key: key);
  @override
  _ModesState createState() => _ModesState();
}

class _ModesState extends State<Modes> {
  int _mode = 1;
  void _onWalkingTapped() {
    print('#####  🚺  🚺  🚺 on Walking tapped ######## 60 seconda');
    setState(() {
      _mode = 0;
      widget.listener.onModeSelected(WALKING);
    });
  }

  void _onDrivingTapped() {
    print('%%%%%%% 🚓 🚓 🚓  on Driving tapped - 15 seconds');
    setState(() {
      _mode = 1;
      widget.listener.onModeSelected(DRIVING);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      child: Row(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Container(
              color: _mode == 0 ? Colors.amber.shade100 : Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: GestureDetector(
                  onTap: _onWalkingTapped,
                  child: Column(
                    children: <Widget>[
                      IconButton(
                        onPressed: null,
                        icon: Icon(
                          Icons.directions_walk,
                          color: _mode == 0 ? Colors.black : Colors.grey,
                        ),
                      ),
                      Text(
                        'Walking',
                        style: _mode == 0
                            ? Styles.blackBoldSmall
                            : Styles.greyLabelSmall,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Container(
              color: _mode == 1 ? Colors.amber.shade100 : Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: GestureDetector(
                  onTap: _onDrivingTapped,
                  child: Column(
                    children: <Widget>[
                      IconButton(
                        onPressed: null,
                        icon: Icon(
                          Icons.directions_car,
                          color: _mode == 1 ? Colors.black : Colors.grey,
                        ),
                      ),
                      Text('Driving',
                          style: _mode == 1
                              ? Styles.blackBoldSmall
                              : Styles.greyLabelSmall),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

const WALKING = 15, DRIVING = 10;
