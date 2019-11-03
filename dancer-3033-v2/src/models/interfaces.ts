export class AssociationDetail {
    associationID: String | undefined
    associationName: String | undefined
}
export class Position {
    type: String | undefined
    coordinates: Number[] | undefined
}
export class RouteDetail {
    routeID: String | undefined
    name: String | undefined
}
export class Photo {
    url: String | undefined
    created: String | undefined
    comment: String | undefined
}
export class Video {
    url: String | undefined
    created: String | undefined
    comment: String | undefined
}
export class VehicleLog {
    created: String | undefined
    position: Position | undefined
}
export class Rating {
    public driver: Number | undefined;
    public overall: Number | undefined;
    public rank: Number | undefined;
    public vehicle: Number | undefined;
  
  }

  export class RoutePoint {
  
    public position: Position | undefined;
    public latitude: number | undefined;
    public longitude: number | undefined;
    public index: number | undefined;
    public landmarkID: string | undefined;
    public landmarkName: string | undefined;
    public routePointID: string | undefined;
    public created: string | undefined;
  
  }
  