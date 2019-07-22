import 'package:aftarobotlibrary4/data/associationdto.dart';
import 'package:aftarobotlibrary4/data/route.dart' as ar;
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';

class NewRoutePage extends StatefulWidget {
  final Association association;
  NewRoutePage(this.association);

  @override
  _NewRoutePageState createState() => _NewRoutePageState();
}

class _NewRoutePageState extends State<NewRoutePage>
    implements SnackBarListener {
  GlobalKey<ScaffoldState> _key = GlobalKey();
  RouteBuilderBloc _bloc = routeBuilderBloc;
  String name, color = RouteMap.colorWhite;
  bool isBusy = false;

  List<String> colors = List();
  @override
  void initState() {
    super.initState();
    _getRoutes();
  }

  List<ar.Route> assocRoutes = List();
  void _getRoutes() async {
    assocRoutes = await routeBuilderBloc.getRoutesByAssociation(widget.association.associationID);
    debugPrint('🧩🧩🧩🧩 ${widget.association.associationName} 🍏 🍎 Association routes: 🧩🧩 ${assocRoutes.length} 🧩🧩');
  }
  void _writeRoute() async {
    if (isBusy) {
      return;
    }
    if (name.isEmpty) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Enter route name',
          listener: this,
          actionLabel: 'Close');
    }
    bool isFound = false;
    assocRoutes.forEach((r) {
      if (r.name == name) {
        isFound = true;
      }
    });
    if (isFound) {
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: 'Duplicate route name',
          listener: this,
          actionLabel: 'close');
      return;
    }

    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: '🍏 🍎  Adding new route ...',
        textColor: Colors.yellow,
        backgroundColor: Colors.black);

    prettyPrint(widget.association.toJson(), ' 🔴  🔴 ASSOCIATION   🔴  🔴');
    var route = ar.Route(
      routeNumber: 'TBD',
      name: name,
      activationDate: DateTime.now().toUtc().toIso8601String(),
      associationID: widget.association.associationID,
      associationName: widget.association.associationName,
      countryID: widget.association.countryID,
      countryName: widget.association.countryName,
      color:  color,
      created: DateTime.now().toUtc().toIso8601String(),
      isActive: true,
    );

    try {
      await _bloc.addRoute(route);
      await _bloc.getRoutesByAssociation(widget.association.associationID);
      _key.currentState.removeCurrentSnackBar();
    } catch (e) {
      isBusy = false;
      print(e);
    }

    AppSnackbar.showSnackbarWithAction(
        scaffoldKey: _key,
        message: 'Route added',
        textColor: Colors.white,
        backgroundColor: Colors.black,
        actionLabel: 'Done',
        listener: this,
        icon: Icons.done,
        action: 1);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('New Route'),
        backgroundColor: Colors.indigo.shade300,
        bottom: PreferredSize(
            child: Column(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(left:8.0, right: 20, bottom: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text(
                        widget.association.associationName,
                        style: Styles.whiteMedium,
                      ),
                      SizedBox(width: 12,),
                      Column(
                        children: <Widget>[
                          Text('${assocRoutes.length}', style: Styles.blackBoldLarge,),
                          SizedBox(height: 4,),
                          Text('Routes')
                        ],
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  height: 4,
                )
              ],
            ),
            preferredSize: Size.fromHeight(80)),
      ),
      backgroundColor: Colors.brown.shade100,
      body: ListView(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Card(
              elevation: 4,
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  children: <Widget>[
                    SizedBox(
                      height: 30,
                    ),
                    Text(
                      'Route Details',
                      style: Styles.blackBoldLarge,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(right: 28.0),
                      child: TextField(
                        onChanged: _onTextChanged,
                        style: Styles.blackMedium,
                        decoration: InputDecoration(
                          icon: Icon(Icons.edit),
                          hintText: 'Enter Name',
                          labelText: 'Route Name',
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 8,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left:28.0, bottom: 4.0),
                      child: Row(
                        children: <Widget>[
                          Text('Color:', style: Styles.greyLabelSmall,),
                          SizedBox(width: 8,),
                          Text(color == null? 'None': color, style: Styles.blackBoldMedium,),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 20,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left:28.0, bottom: 4.0),
                      child: Row(
                        children: <Widget>[
                          RaisedButton(
                            color: Colors.black,
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Black', style: Styles.whiteSmall,),
                            ),
                            onPressed: () {
                              color = RouteMap.colorBlack;
                              setState(() {});
                            },
                          ),
                          SizedBox(width: 20,),
                          RaisedButton(
                            color: Colors.yellow,
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Yellow', style: Styles.blackSmall,),
                            ),
                            onPressed: () {
                              color = RouteMap.colorYellow;
                              setState(() {});
                            },
                          ),
                          SizedBox(width: 20,),
                          RaisedButton(
                            color: Colors.red,
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Red', style: Styles.whiteSmall,),
                            ),
                            onPressed: () {
                              color = RouteMap.colorRed;
                              setState(() {});
                            },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 4,),
                    Padding(
                      padding: const EdgeInsets.only(left:28.0, bottom: 4.0),
                      child: Row(
                        children: <Widget>[
                          RaisedButton(
                            color: Colors.blue[600],
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Azure', style: Styles.whiteSmall,),
                            ),
                            onPressed: () {
                              color = RouteMap.colorAzure;
                              setState(() {});
                            },
                          ),
                          SizedBox(width: 20,),
                          RaisedButton(
                            color: Colors.green[700],
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Green', style: Styles.whiteSmall,),
                            ),
                            onPressed: () {
                              color = RouteMap.colorGreen;
                              setState(() {});
                            },
                          ),
                          SizedBox(width: 20,),
                          RaisedButton(
                            color: Colors.cyan,
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Cyan', style: Styles.whiteSmall,),
                            ),
                            onPressed: () {
                              color = RouteMap.colorCyan;
                              setState(() {});
                            },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 24,),
                    RaisedButton(
                      onPressed: _writeRoute,
                      elevation: 8,
                      color: Colors.pink,
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Text(
                          'Add New Route',
                          style: Styles.whiteSmall,
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 60,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  onActionPressed(int action) {
    Navigator.pop(context);
  }

  void _onTextChanged(String value) {
    print(value);
    setState(() {
      name = value;
    });
  }
}
