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
  public static findByAssociationID(
    this: ModelType<Route> & typeof Route,
    associationID: string,
  ) {
    return this.findOne({ associationID });
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
  public name?: string;
  //
  @prop({ required: true, index: true, trim: true })
  public routeID?: string;
  //
  @prop({ required: true, default: [] })
  public associationDetails?: any[];

  @prop({ required: true, default: [] })
  public associationIDs?: string[];
  //
  @prop({ required: true, default: "black" })
  public color?: string;
  //
  @prop({ required: true, default: [] })
  public rawRoutePoints?: any[];
  //
  @prop({ required: true, default: [] })
  public routePoints?: any[];
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
    const route = await this.getModelForClass(Route).findByAssociationID(
      associationID,
    );
    if (!this.associationIDs) {
      this.associationIDs = [];
    }
    let isFound = false;
    route.associationIDs.forEach((id) => {
      if (id === associationID) {
        isFound = true;
      }
    });
    if (!isFound) {
      this.associationIDs.push(associationID);
      this.save();
    } else {
      throw new Error("Association already in route list");
    }
  }
}

export default Route;
