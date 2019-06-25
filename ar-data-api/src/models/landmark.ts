import {
  arrayProp,
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  Ref,
// tslint:disable-next-line: ordered-imports
  staticMethod,
  Typegoose,
} from "typegoose";

class Landmark extends Typegoose {
  @staticMethod
  public static findByName(
    this: ModelType<Landmark> & typeof Landmark,
    name: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by name:  💦  💦  💦  :: 🥦 " + name,
    );
    return this.findOne({ name });
    // could be list, routes can have same or similar names for each association
  }
  //
  @staticMethod
  public static findByRouteName(
    this: ModelType<Landmark> & typeof Landmark,
    routeName: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by routeName:  💦  💦  💦  :: 🥦 " +
        routeName,
    );
    return this.findOne({ routeName });
  }
  
  //
  @staticMethod
  public static findByRouteID(
    this: ModelType<Landmark> & typeof Landmark,
    routeID: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by routeID:  💦  💦  💦  :: 🥦 " +
        routeID,
    );
    return this.find({ routes: [routeID] });
  }
  //
  @staticMethod
  public static findByLandmarkID(
    this: ModelType<Landmark> & typeof Landmark,
    landmarkID: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by landmarkID:  💦  💦  💦  : 🥦 " +
        landmarkID,
    );
    return this.find({ landmarkID });
  }
  //

  @prop({ required: true, trim: true })
  public landmarkName?: string;
  @prop({ required: true, index: true, trim: true })
  public landmarkID?: string;

  @prop({ required: true })
  public latitude?: number;
  @prop({ required: true })
  public longitude?: number;

  @prop({ required: true })
  public position?: any;
  //
  @prop({ required: true, default: 0 })
  public rankSequenceNumber?: number;
  //
  @prop({ required: true, default: [] })
  public routeIDs?: string[];
  //
  @prop({ required: true, default: [] })
  public routeDetails?: any[];
  //
  @prop({ trim: true })
  public distance?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //

  @instanceMethod
  public updateLocation(this: InstanceType<Landmark>, id: string, latitude: number, longitude: number) {
    this.position = {
      coordinates: [longitude, latitude],
      type: "Point",
    };
    this.save();
  }

}

export default Landmark;
