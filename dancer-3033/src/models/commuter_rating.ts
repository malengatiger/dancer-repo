import * as Moment from "moment";
import {
  ModelType,
  prop,
  staticMethod,
  Typegoose,
} from "typegoose";
import Rating from './rating';

class CommuterRating extends Typegoose {
  //
  @staticMethod
  public static findByUser(
    this: ModelType<CommuterRating> & typeof CommuterRating,
    userId: string,
  ) {
    return this.find({
      userId,
    });
  }
  //
  @staticMethod
  public static async findAll(
    this: ModelType<CommuterRating> & typeof CommuterRating,
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
  
  @prop({ required: true, trim: true })
  public commuterRequestId!: string;
  //
  @prop({ required: true })
  public rating!: Rating;
  //
  @prop({ required: true, trim: true })
  public userId!: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public createdAt!: string;
  //

}

export default CommuterRating;
