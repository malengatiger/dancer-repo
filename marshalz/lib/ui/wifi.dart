import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flare_flutter/flare_actor.dart';
import 'package:flutter/material.dart';

class ARAnimations extends StatefulWidget {
  final String type;

  const ARAnimations({Key key, this.type}) : super(key: key);
  @override
  _ARAnimationsState createState() => new _ARAnimationsState();
}

class _ARAnimationsState extends State<ARAnimations> {
  @override
  Widget build(BuildContext context) {
    FlareActor flare;
    switch (widget.type) {
      case 'ball':
        flare = FlareActor("assets/ball.flr",
            alignment: Alignment.center,
            fit: BoxFit.contain,
            animation: "Aura2");
        break;
      case 'wifi':
        flare = FlareActor("assets/wifi.flr",
            alignment: Alignment.center,
            fit: BoxFit.contain,
            animation: "nonetwork");
        break;
      case 'loader':
        flare = FlareActor("assets/loader.flr",
            alignment: Alignment.center,
            fit: BoxFit.contain,
            animation: "load");
        break;
      case 'wallet':
        flare = FlareActor("assets/wallet.flr",
            alignment: Alignment.center,
            fit: BoxFit.contain,
            animation: "billetera cargada");
        break;
      case 'ok':
        flare = FlareActor("assets/ok.flr",
            alignment: Alignment.center,
            fit: BoxFit.contain,
            animation: "verified");
        break;
      default:
        flare = FlareActor("assets/ball.flr",
            alignment: Alignment.center,
            fit: BoxFit.contain,
            animation: "Aura2");
        break;
    }

    return flare;
  }
}

class WifiError extends StatefulWidget {
  @override
  _WifiErrorState createState() => _WifiErrorState();
}

class _WifiErrorState extends State<WifiError> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: ListView(
        children: <Widget>[
          SizedBox(
            height: 20,
          ),
          SizedBox(
            height: 400,
            child: ARAnimations(
              type: 'wifi',
            ),
          ),
          SizedBox(
            height: 8,
          ),
          Text(
            'A network related error has occured. Either the network is down or the server is not available',
            style: Styles.whiteSmall,
          ),
          SizedBox(
            height: 8,
          ),
          FlatButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text(
              'Close',
              style: Styles.blueSmall,
            ),
          )
        ],
      ),
    );
  }
}
