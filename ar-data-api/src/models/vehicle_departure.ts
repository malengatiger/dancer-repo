import * as Moment from "moment";
import {
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  staticMethod,
  Typegoose,
} from "typegoose";

class VehicleDeparture extends Typegoose {
  
  //
  @staticMethod
  public static findByLandmarkId(
    this: ModelType<VehicleDeparture> & typeof VehicleDeparture,
    landmarkId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      landmarkId,
      dateDeparted: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findByRouteId(
    this: ModelType<VehicleDeparture> & typeof VehicleDeparture,
    routeId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    return this.find({
      routeId,
      dateDeparted: { $gt: cutOffDate.toISOString() },
    });
  }
    //
    @staticMethod
    public static findByVehicleId(
      this: ModelType<VehicleDeparture> & typeof VehicleDeparture,
      vehicleId: string,
      minutes: number,
    ) {
      const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
      return this.find({
        vehicleId,
        dateDeparted: { $gt: cutOffDate.toISOString() },
      });
    }
  //
    //
    @staticMethod
    public static findAllByVehicleId(
      this: ModelType<VehicleDeparture> & typeof VehicleDeparture,
      vehicleId: string,
    ) {
      return this.find({
        vehicleId,
      });
    }
  //
  @staticMethod
  public static async findAll(
    this: ModelType<VehicleDeparture> & typeof VehicleDeparture,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    console.log(`💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`)
    const list = await this.find({
        dateDeparted: { $gt: cutOffDate.toISOString() },
    });
    console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
    return list;
  }
 
  @prop({ required: true, trim: true })
  public landmarkId?: string;
  //
  @prop({ required: true, trim: true })
  public landmarkName?: string;

  @prop({ required: true})
  public position?: Position;
  //
  @prop({ trim: true })
  public vehicleReg?: string;
  //
  @prop({ trim: true })
  public vehicleDepartureId?: string;
  //
  @prop({ required: true, trim: true })
  public vehicleId?: string;
//
  @prop({ required: true, default: new Date().toISOString() })
  public dateDeparted?: string;
  //
  @instanceMethod
  public async setVehicleArrivalId(this: InstanceType<VehicleDeparture>) {
    this.vehicleDepartureId = this.id;
    await this.save();
    console.log("vehicleDeparture: vehicleDepartureId set to _id");
  }

}

export default VehicleDeparture;
