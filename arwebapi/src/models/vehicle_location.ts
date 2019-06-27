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
import Position from "./position";
import Vehicle from "./vehicle";

class VehicleLocation extends Typegoose {
  //
  @prop({ required: true, index: true, trim: true })
  public date?: string;
  @prop({ required: true })
  public timestamp?: number;
  //
  @prop({ required: true })
  public latitude?: number;
  //
  @prop({ required: true })
  public longitude?: number;
  //
  @prop({ required: true })
  public position?: Position;
  //
  @prop({ required: true })
  public vehicle?: Vehicle;
  //
  @prop({ trim: true })
  public distance?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //
}

export default VehicleLocation;
