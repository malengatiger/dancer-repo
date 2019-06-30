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

class CommuterArrivalLandmark extends Typegoose {
  //
  @staticMethod
  public static findByUser(
    this: ModelType<CommuterArrivalLandmark> & typeof CommuterArrivalLandmark,
    user: string,
  ) {
    return this.find({
      user,
    });
  }
  //
  @staticMethod
  public static findByFromLandmarkId(
    this: ModelType<CommuterArrivalLandmark> & typeof CommuterArrivalLandmark,
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
    this: ModelType<CommuterArrivalLandmark> & typeof CommuterArrivalLandmark,
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
    this: ModelType<CommuterArrivalLandmark> & typeof CommuterArrivalLandmark,
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
    this: ModelType<CommuterArrivalLandmark> & typeof CommuterArrivalLandmark,
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
  public commuterArrivalLandmarkId?: string;
  //
  @instanceMethod
  public async setCommuterArrivalLandmarkId(
    this: InstanceType<CommuterArrivalLandmark>,
  ) {
    this.commuterArrivalLandmarkId = this.id;
    await this.save();
    console.log(
      "setCommuterArrivalLandmark: setCommuterArrivalLandmarkId set to _Id",
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

export default CommuterArrivalLandmark;
