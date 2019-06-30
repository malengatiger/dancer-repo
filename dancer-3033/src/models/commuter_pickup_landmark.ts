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

class CommuterPickupLandmark extends Typegoose {
  //
  @staticMethod
  public static findByUser(
    this: ModelType<CommuterPickupLandmark> & typeof CommuterPickupLandmark,
    userId: string,
  ) {
    return this.find({
      userId,
    });
  }
  //
  @staticMethod
  public static findByFromLandmarkId(
    this: ModelType<CommuterPickupLandmark> & typeof CommuterPickupLandmark,
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
    this: ModelType<CommuterPickupLandmark> & typeof CommuterPickupLandmark,
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
    this: ModelType<CommuterPickupLandmark> & typeof CommuterPickupLandmark,
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
    this: ModelType<CommuterPickupLandmark> & typeof CommuterPickupLandmark,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");
    console.log(
      `💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`,
    );
    const list = await this.find({
      createdAt: { $gt: cutOffDate.toISOString() },
    });
    console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
    return list;
  }
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
  @prop({ required: true, trim: true })
  public routeId?: string;
  //
  @prop({ required: true, trim: true })
  public vehicleId?: string;
  //
  @prop({ required: true, trim: true })
  public vehicleReg?: string;
  //
  @prop({ required: true })
  public position?: Position;
  //
  @prop({ required: true, trim: true })
  public commuterRequestId?: string;
  //
  @prop({ required: true, trim: true })
  public routeName?: string;
  //
  @prop({ required: true, trim: true })
  public departureId?: string;
  //
  @prop({ required: true, trim: true })
  public userId?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public createdAt?: string;
  //
  @prop({ trim: true })
  public commuterPickupLandmarkId?: string;
  //
  @instanceMethod
  public async setCommuterPickupLandmarkId(
    this: InstanceType<CommuterPickupLandmark>,
  ) {
    this.commuterPickupLandmarkId = this.id;
    await this.save();
    console.log(
      "setCommuterPickupLandmarkId: commuterPickupLandmarkId set to _Id",
    );
  }
  // //
  // @instanceMethod
  // public async updateScanned(this: InstanceType<CommuterArrivalLandmark>) {
  //   this.scanned = true;
  //   await this.save();
  //   console.log("commuterRequest scanned set to true");
  // }
  // //
  // @instanceMethod
  // public async updateAutoDetected(this: InstanceType<CommuterArrivalLandmark>) {
  //   this.autoDetected = true;
  //   await this.save();
  //   console.log("commuterRequest autoDetected set to true");
  // }
}

export default CommuterPickupLandmark;
