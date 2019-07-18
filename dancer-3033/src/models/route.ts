import {
  arrayProp,
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  Ref,
  staticMethod,
  Typegoose,
} from "typegoose";
import RoutePoint from './route_point';

class Route extends Typegoose {
  @staticMethod
  public static findByName(
    this: ModelType<Route> & typeof Route,
    name: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route(s) by name:  💦  💦  💦  :: 🥦 " + name,
    );
    return this.findOne({ name });
    // coulf be list, routes can have same or similar names for each association
  }
  //
  @staticMethod
  public static findByAssociationName(
    this: ModelType<Route> & typeof Route,
    associationName: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route by associationName:  💦  💦  💦  :: 🥦 " +
        associationName,
    );
    return this.findOne({ associationName });
  }
  //
  @staticMethod
  public static findByassociationID(
    this: ModelType<Route> & typeof Route,
    associationID: string,
  ) {
    return this.find({ associationIDs: associationID });
  }
  //
  @staticMethod
  public static findByRouteID(
    this: ModelType<Route> & typeof Route,
    routeID: string,
  ) {
    return this.findOne({ routeID });
  } 
  //
  @prop({ required: true, trim: true })
  public name!: string;
  //
  @prop({ required: true, index: true, trim: true })
  public routeID!: string;
  //
  @prop( {default: []})
  public associationDetails?: AssociationDetail[];

  @arrayProp({items: String, default: [] })
  public associationIDs!: string[];
  //
  @prop({ required: true, default: "black" })
  public color!: string;
  //
  @prop({default: [] })
  public rawRoutePoints!: RoutePoint[];
  //
  @prop({ default: [] })
  public routePoints!: RoutePoint[];
  //
  @prop({ default: [] })
  public calculatedDistances!: any[];
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //
  @instanceMethod
  public updateColor(this: InstanceType<Route>, color: string) {
    this.color = color;
    this.save();
  }
 
  //
  @instanceMethod
  public async addAssociation(
    this: InstanceType<Route>,
    associationID: string,
  ) {
    const route: any = await this.getModelForClass(Route).findByassociationID(
      associationID,
    );
    if (!this.associationIDs) {
      this.associationIDs = [];
    }
    let isFound = false;
    if (route) {
      if (route.associationIDs) {
        route.associationIDs.forEach((id: string) => {
          if (id === associationID) {
            isFound = true;
          }
        });
      }
    }
    if (!isFound) {
      this.associationIDs.push(associationID);
      this.save();
    } else {
      throw new Error("Association already in route list");
    }
  }
}

export default Route;
