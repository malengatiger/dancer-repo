import * as Moment from "moment";
import {
  ModelType,
  prop,
  staticMethod,
  Typegoose,
} from "typegoose";
import Position from './position';

class CommuterStartingLandmark extends Typegoose {
  //
  @staticMethod
  public static findByUserId(
    this: ModelType<CommuterStartingLandmark> & typeof CommuterStartingLandmark,
    userId: string,
  ) {
    return this.find({
      userId,
    });
  }
  //
  @staticMethod
  public static findByLandmarkId(
    this: ModelType<CommuterStartingLandmark> & typeof CommuterStartingLandmark,
    landmarkId: string,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      landmarkId,
      createdAt: { $gt: cutOffDate.toISOString() },
    });
  }
  //

  @staticMethod
  public static async findAll(
    this: ModelType<CommuterStartingLandmark> & typeof CommuterStartingLandmark,
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
  public landmarkId!: string;
  //
  @prop({ required: true, trim: true })
  public landmarkName!: string;
  //
  @prop({ required: true })
  public position!: Position;
  //
  @prop({ required: true, trim: true })
  public userId!: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public createdAt!: string;
  //
  
}

export default CommuterStartingLandmark;
