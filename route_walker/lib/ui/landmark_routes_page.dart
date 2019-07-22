import 'package:aftarobotlibrary4/data/landmark.dart';
import 'package:aftarobotlibrary4/maps/route_map.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/util/slide_right.dart';
import 'package:flutter/material.dart';
import 'package:route_walker/bloc/route_builder_bloc.dart';

class LandmarkRoutesPage extends StatelessWidget {
  final LandmarkDTO landmark;

  LandmarkRoutesPage(this.landmark);

  @override
  Widget build(BuildContext context) {
    landmark.routeDetails.sort((a,b) => a.name.compareTo(b.name));
    return Scaffold(
      appBar: AppBar(
        title: Text('Landmark Routes'),
        elevation: 16,
        backgroundColor: Colors.indigo[300],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(140),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Text(landmark.landmarkName, style: Styles.whiteBoldSmall,),
                    SizedBox(width: 20,),
                    Column(
                      children: <Widget>[
                        Text('${landmark.routeIDs.length}', style: Styles.blackBoldLarge,),
                        SizedBox(height: 4,),
                        Text('Routes'),
                      ],
                    ),
                    SizedBox(width: 12,)
                  ],
                ),
                SizedBox(height: 24,),
                Text('These routes are accessible from this landmark', style: Styles.whiteSmall,),
                SizedBox(height: 12,)
              ],
            ),
          ),
        ),
      ),
      backgroundColor: Colors.brown[50],
      body: ListView.builder(
          itemCount: landmark.routeDetails.length,
          itemBuilder: (context, index) {

            return Padding(
              padding: const EdgeInsets.only(left:12.0, right: 12, top: 4, bottom: 0),
              child: GestureDetector(
                onTap: () async {
                  var route = await routeBuilderBloc.getRouteByID(landmark.routeDetails.elementAt(index).routeID);
                  Navigator.push(context, SlideRightRoute(widget: RouteMap(
                    routes: [route],
                    hideAppBar: false,
                    landmarkIconColor: RouteMap.colorRed,
                  )));
                },
                child: Card(
                  elevation: 4,
//                  color: getRandomPastelColor(),
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: Column(
                      children: <Widget>[
                        ListTile(
                          leading: Icon(Icons.ac_unit, color: getRandomPastelColor(),),
                          title: Text('${landmark.routeDetails.elementAt(index).name}', style: TextStyle(fontSize: 16),),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
      }),
    );
  }
}
