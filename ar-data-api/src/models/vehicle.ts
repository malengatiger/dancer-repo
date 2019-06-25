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
import Photo from "./photo";
import VehicleType from "./vehicle_type";

class Vehicle extends Typegoose {

  @staticMethod
  public static findByOwnerID(
    this: ModelType<Vehicle> & typeof Vehicle,
    ownerID: string,
  ) {
    return this.findOne({ ownerID });
  }
  //
  @prop({ required: true, index: true, trim: true })
  public vehicleReg?: string;
  //
  @prop({ required: true, index: true, trim: true })
  public associationID?: string;
  //
  @prop({ required: true, index: true, trim: true })
  public associationName?: string;
  //
  @prop({ trim: true, index: true })
  public ownerID?: string;
  //
  @prop({ trim: true })
  public ownerName?: string;
  //
  @prop({ required: true})
  public vehicleType?: VehicleType;
  //
  @prop({ default: []})
  public photos?: any[];
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //
  @instanceMethod
  public updateOwner(this: InstanceType<Vehicle>, ownerID: string, ownerName: string) {
    this.ownerID = ownerID;
    this.ownerName = ownerName;
    this.save();
  }

  @instanceMethod
  public addPhoto(this: InstanceType<Vehicle>, url: string) {
    const photo =  {
      created: new Date().toISOString(),
      url,
    };
    this.photos.push(photo);
    this.save();
  }
  @instanceMethod
  public updateType(this: InstanceType<Vehicle>, vehicleType: VehicleType) {
    this.vehicleType = vehicleType;
    this.save();
  }
  @instanceMethod
  public getPhotos(this: InstanceType<Vehicle>) {
    return this.photos;
  }
}

export default Vehicle;
