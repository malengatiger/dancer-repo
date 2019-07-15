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

class CommuterRequest extends Typegoose {
  //
  @staticMethod
  public static findByUser(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    user: string,
  ) {
    return this.find({
      user,
    });
  }
  //
  @staticMethod
  public static findByFromLandmarkId(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    landmarkId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      fromLandmarkId: landmarkId,
      createdAt: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findByToLandmarkId(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    landmarkId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      toLandmarkId: landmarkId,
      createdAt: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findByRouteId(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    routeId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    return this.find({
      routeId,
      createdAt: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static async findAll(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    console.log(`💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`)
    const list = await this.find({
      stringTime: { $gt: cutOffDate.toISOString() },
    });
    console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
    return list;
  }
 
  @prop({ required: true, default: false })
  public autoDetected?: boolean;
  //
  @prop({ required: true, default: false })
  public scanned?: boolean;
  //
  @prop({ required: true, trim: true })
  public fromLandmarkId?: string;
  //
  @prop({ required: true, trim: true })
  public fromLandmarkName?: string;
//
  @prop({ required: true, trim: true })
  public toLandmarkId?: string;
  //
  @prop({ required: true, trim: true })
  public toLandmarkName?: string;
  //
  @prop({ required: true, default: 1 })
  public passengers?: number;
  //
  @prop({ required: true, trim: true })
  public routeId?: string;
  //
  @prop({ required: true})
  public position?: Position;
  //
  @prop({ trim: true })
  public vehicleId?: string;
  //
  @prop({ trim: true })
  public vehicleReg?: string;
  //
  @prop({ trim: true })
  public commuterRequestId?: string;
  //
  @prop({ required: true, trim: true })
  public routeName?: string;
  //
  @prop({ required: true, trim: true })
  public userId?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public stringTime?: string;
  //
  @prop({ required: true, default: new Date().getTime() })
  public time?: number;
  @prop({ required: true, default: new Date().toISOString() })
  public createdAt?: string;
  //
  @instanceMethod
  public async setCommuterRequestId(this: InstanceType<CommuterRequest>) {
    this.commuterRequestId = this.id;
    await this.save();
    console.log("commuterRequest commuterRequestId set to _Id");
  }
  //
  @instanceMethod
  public async updateScanned(this: InstanceType<CommuterRequest>) {
    this.scanned = true;
    await this.save();
    console.log("commuterRequest scanned set to true");
  }
  //
  @instanceMethod
  public async updateAutoDetected(this: InstanceType<CommuterRequest>) {
    this.autoDetected = true;
    await this.save();
    console.log("commuterRequest autoDetected set to true");
  }
}

export default CommuterRequest;
