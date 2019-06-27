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

class VehicleType extends Typegoose {
  //

  @staticMethod
  public static getVehicleTypeByID(this: ModelType<VehicleType> & typeof VehicleType, vehicleTypeID: string) {
    console.log("#####  🥦  🥦  🥦 Finding vehicleType by ID:  💦  💦  💦  :: 🥦 " + vehicleTypeID);
    return this.findOne({ vehicleTypeID });
  }

  @prop({ required: true, trim: true })
  public vehicleTypeID?: string;
  //
  @prop({ required: true, trim: true })
  public make?: string;
  //
  @prop({ required: true, trim: true })
  public model?: string;
  //
  @prop({ required: true})
  public capacity?: number;
  //
  @prop({ required: true, trim: true })
  public countryID?: string;
  //
  @prop({ required: true, trim: true })
  public countryName?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;

}

export default VehicleType;
