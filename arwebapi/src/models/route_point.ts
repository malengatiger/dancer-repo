import Position from './position';

class RoutePoint {
  public position: Position;
  public latitude: number;
  public longitude: number;
  public routeId: string;
  public index: number;

  constructor() {
    this.position = new Position();
    this.latitude = 0.0;
    this.longitude = 0.0;
    this.routeId = '';
    this.index = 0;
  }
}

export default RoutePoint;
