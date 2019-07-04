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
import VehicleType from "./vehicle_type";

class DispatchRecord extends Typegoose {
  //
  @staticMethod
  public static findByMarshal(
    this: ModelType<DispatchRecord> & typeof DispatchRecord,
    marshalId: string,
  ) {
    return this.find({
      marshalId,
    });
  }
  //
  
  @staticMethod
  public static findByLandmarkId(
    this: ModelType<DispatchRecord> & typeof DispatchRecord,
    landmarkId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      landmarkId,
      dispatchedAt: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findByRouteId(
    this: ModelType<DispatchRecord> & typeof DispatchRecord,
    routeId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    return this.find({
      routeId,
      dispatchedAt: { $gt: cutOffDate.toISOString() },
    });
  }
    //
    @staticMethod
    public static findByVehicleId(
      this: ModelType<DispatchRecord> & typeof DispatchRecord,
      vehicleId: string,
      minutes: number,
    ) {
      const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
      return this.find({
        vehicleId,
        dispatchedAt: { $gt: cutOffDate.toISOString() },
      });
    }
  //
    //
    @staticMethod
    public static findAllByVehicleId(
      this: ModelType<DispatchRecord> & typeof DispatchRecord,
      vehicleId: string,
    ) {
      return this.find({
        vehicleId,
      });
    }
  //
  @staticMethod
  public static async findAll(
    this: ModelType<DispatchRecord> & typeof DispatchRecord,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    console.log(`💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`)
    const list = await this.find({
      dispatchedAt: { $gt: cutOffDate.toISOString() },
    });
    console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
    return list;
  }
 
  @prop({ required: true, default: false })
  public dispatched?: boolean;
 //
  @prop({ required: true, trim: true })
  public landmarkId?: string;
  //
  @prop({ required: true, trim: true })
  public landmarkName?: string;

  @prop({ required: true, trim: true })
  public routeId!: string;
  //
  @prop({ required: true})
  public position?: Position;
  //
  @prop({ required: true, trim: true })
  public routeName!: string;
  //
  @prop({ required: true, trim: true })
  public vehicleReg!: string;
  //
  @prop({ required: true, trim: true })
  public vehicleId!: string;
  //
  @prop({ required: true })
  public vehicleType?: VehicleType;
  //
  @prop({ trim: true })
  public dispatchRecordId?: string;
  //
  @prop({ required: true, trim: true })
  public userId?: string;
  //
  @prop({ required: true })
  public passengers?: number;

  @prop({ required: true, default: new Date().toISOString() })
  public dispatchedAt?: string;
  //
  @instanceMethod
  public async setDispatchRecordId(this: InstanceType<DispatchRecord>) {
    this.dispatchRecordId = this.id;
    await this.save();
    console.log("DispatchRecord dispatchRecordId set to _id");
  }

}

export default DispatchRecord;
