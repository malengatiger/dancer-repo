import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/maps/cards.dart';

import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/snack.dart';
import 'package:flutter/material.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';


class LandmarkCityPage extends StatefulWidget {
  final Landmark landmark;

  LandmarkCityPage({this.landmark});

  @override
  _LandmarkCityPageState createState() => _LandmarkCityPageState();
}

class _LandmarkCityPageState extends State<LandmarkCityPage>
    implements SnackBarListener {
  List<CityDTO>  _filteredCities = List();
  GlobalKey<ScaffoldState> _key = GlobalKey();
  String name;
  CityDTO city;

  @override
  void initState() {
    super.initState();

    if (widget.landmark.cities.isEmpty) {
      _getCities();
    } else {
      _loadCities();
    }
  }

  void _loadCities() {
    widget.landmark.cities.forEach((c) {
      _filteredCities.add(CityDTO.fromJson(c.toJson()));
    });
    setState(() {

    });
  }
  void _getCities() async {
    prettyPrint(widget.landmark.toJson(), 'LANDMARK to link cities: 🍏 🍏 🍏 ');
    debugPrint('🧩🧩🧩 Finding cities within 5 km of 🍏 ${widget.landmark.landmarkName} 🍏 ');
    AppSnackbar.showSnackbarWithProgressIndicator(scaffoldKey: _key, message: 'Finding nearby  places ...', textColor: Colors.white, backgroundColor: Colors.black);
    await routeBuilderBloc.findCitiesByLocation(
      latitude: widget.landmark.latitude,
      longitude: widget.landmark.longitude,
      radiusInKM: 3.0,
    );
    if (_key.currentState != null) {
      _key.currentState.removeCurrentSnackBar();
    }

  }

  void _showConfirmDialog() {
    if (_filteredCities.isEmpty) {
      _getCities();
      return;
    }
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
              title: new Text(
                "Confirm Landmark Links",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor),
              ),
              content: Container(
                height: 160.0,
                child: Column(
                  children: <Widget>[
                    Text(
                      widget.landmark == null
                          ? ''
                          : widget.landmark.landmarkName,
                      style: Styles.blackBoldSmall,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Text(
                          'Do you want to link these ${_filteredCities.length} places to ${widget.landmark.landmarkName}?'),
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
                      _writeLandmarkCities();
                    },
                    elevation: 4.0,
                    color: Colors.pink.shade700,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Link Places to Landmark',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ],
            ));
  }

  void _writeLandmarkCities() async {

    AppSnackbar.showSnackbarWithProgressIndicator(
        scaffoldKey: _key,
        message: "Linking places to Landmark ...",
        textColor: Colors.white,
        backgroundColor: Colors.black);

    _filteredCities.forEach((city) {
      var basicCity = BasicCity(
        cityID: city.cityID,
        name: city.name,
        provinceName: city.provinceName,
        latitude: city.latitude,
        longitude: city.longitude,
      );
      widget.landmark.cities.add(basicCity);
    });

    try {
      await routeBuilderBloc.addCityToLandmark(widget.landmark, city);
      setState(() {});
      AppSnackbar.showSnackbarWithAction(
          scaffoldKey: _key,
          icon: Icons.done,
          action: 3,
          actionLabel: 'Done',
          message: 'Places linked to landmark',
          listener: this,
          textColor: Colors.lightGreenAccent,
          backgroundColor: Colors.black);
    } catch (e) {
      print(e.toString());
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: '${e.toString()}',
          listener: this,
          actionLabel: 'close');
    }
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Places for Landmark'),
        elevation: 16,
        backgroundColor: Colors.indigo.shade400,
        actions: <Widget>[
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: IconButton(
              icon: Icon(Icons.my_location),
              onPressed: _getCities,
            ),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(160),
          child: Padding(
            padding: const EdgeInsets.only(left: 8.0, right: 20, top: 12),
            child: Column(
              children: <Widget>[
                Text(
                  widget.landmark.landmarkName,
                  style: Styles.whiteBoldMedium,
                ),
                SizedBox(
                  height: 24,
                ),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    RaisedButton(
                        color: Colors.pink[600],
                        elevation: 16,
                        onPressed: _showConfirmDialog,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text('Link Places', style: Styles.whiteSmall,),
                        )),
                    SizedBox(
                      width: 40,
                    ),
                    Counter(
                      total: _filteredCities.length,
                      label: 'Places Found',
                      totalStyle: Styles.blackBoldLarge,
                    ),
                  ],
                ),
                SizedBox(
                  height: 28,
                ),
              ],
            ),
          ),
        ),
      ),
      backgroundColor: Colors.brown.shade50,
      body: ListView.builder(
          itemCount: _filteredCities.length,
          itemBuilder: (context, index) {
            return GestureDetector(
              onTap: () {
                _showConfirmDialog();
              },
              child: Padding(
                padding: const EdgeInsets.only(left: 12, right: 12, top: 4),
                child: Card(
//                  color: getRandomPastelColor(),
                  elevation: 2,
                  child: ListTile(
                    leading: Icon(
                      Icons.location_on,
                      color: Colors.grey[300],
                    ),
                    title: Text(
                      _filteredCities.elementAt(index).name,
                      style: Styles.blackBoldSmall,
                    ),
                    subtitle: Text(
                        '${_filteredCities.elementAt(index).provinceName}'),
                  ),
                ),
              ),
            );
          }),
    );
  }

  @override
  onActionPressed(int action) {
    Navigator.pop(context);
    switch (action) {
      case 3:
        Navigator.pop(context);
        break;
    }
  }

  @override
  onCitiesFound(List<CityDTO> cities) {
    debugPrint(' 🍎 🍎 🍎 onCitiesFound: ${cities.length}   🍎 🍎 🍎');
    Map<String, CityDTO> map = Map();
    _filteredCities.forEach((c) {
      map[c.name] = c;
    });
    cities.forEach((c) {
      map[c.name] = c;
    });

    setState(() {
      _filteredCities.clear();
    });
    map.forEach((k,v) {
      _filteredCities.add(v);
    });
    setState(() {
      _filteredCities = cities;
    });
  }

  @override
  onCitiesNearLandmark(landmark, List<CityDTO> cities) {
    // TODO: implement onCitiesNearLandmark
    return null;
  }


}
