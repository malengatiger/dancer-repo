import * as Moment from "moment";
import {
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  staticMethod,
  Typegoose,
} from "typegoose";
import Position from './position';

class VehicleArrival extends Typegoose {
  //
  @staticMethod
  public static findByLandmarkId(
    this: ModelType<VehicleArrival> & typeof VehicleArrival,
    landmarkId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      landmarkId,
      dateArrived: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findByRouteId(
    this: ModelType<VehicleArrival> & typeof VehicleArrival,
    routeId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    return this.find({
      routeId,
      dateArrived: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findByVehicleId(
    this: ModelType<VehicleArrival> & typeof VehicleArrival,
    vehicleId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    return this.find({
      vehicleId,
      dateArrived: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  //
  @staticMethod
  public static findAllByVehicleId(
    this: ModelType<VehicleArrival> & typeof VehicleArrival,
    vehicleId: string,
  ) {
    return this.find({
      vehicleId,
    });
  }
  //
  @staticMethod
  public static async findAll(
    this: ModelType<VehicleArrival> & typeof VehicleArrival,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    console.log(
      `💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`,
    );
    const list = await this.find({
      dispatchedAt: { $gt: cutOffDate.toISOString() },
    });
    console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
    return list;
  }

  @prop({ required: true, default: false })
  public dispatched!: boolean;
  //
  @prop({ required: true, trim: true })
  public landmarkId!: string;
  //
  @prop({ required: true, trim: true })
  public landmarkName!: string;

  @prop({ required: true })
  public position!: Position;
  //
  @prop({ required: true, trim: true })
  public vehicleReg!: string;
  //
  @prop({ required: true, trim: true })
  public make!: string;
  //
  @prop({ required: true })
  public capacity!: number;
  //
  @prop({ required: true, trim: true })
  public modelType!: string;
  //
  @prop({ trim: true })
  public vehicleArrivalId!: string;
  //
  @prop({ required: true, trim: true })
  public vehicleId!: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public dateArrived!: string;
  //
  @instanceMethod
  public async setVehicleArrivalId(this: InstanceType<VehicleArrival>) {
    this.vehicleArrivalId = this.id;
    await this.save();
    console.log("vehicleArrival vehicleArrivalId set to _id");
  }
}

export default VehicleArrival;
