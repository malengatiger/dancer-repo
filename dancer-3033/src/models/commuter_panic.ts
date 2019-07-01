import * as Moment from "moment";
import {
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  staticMethod,
  Typegoose,
} from "typegoose";
import Position from "./position";

enum PanicType {
  Accident = "Accident",
  FollowMe = "FollowMe",
  Robbery = "Robbery",
  Traffic = "Traffic",
  Rape = "Rape",
  Breakdown = "Breakdown",
  Unrest = "Unrest",
}
class CommuterPanic extends Typegoose {
  //
  @staticMethod
  public static findByUserId(
    this: ModelType<CommuterPanic> & typeof CommuterPanic,
    userId: string,
  ) {
    return this.find({
      userId,
    });
  }
   //
   @staticMethod
   public static findByPanicId(
     this: ModelType<CommuterPanic> & typeof CommuterPanic,
     commuterPanicId: string,
   ) {
     return this.findOne({
      commuterPanicId,
     });
   }
  //
  @staticMethod
  public static findAllPanicsWithinMinutes(
    this: ModelType<CommuterPanic> & typeof CommuterPanic,
    minutes: number,
  ) {
    const cutOffDate: Moment.Moment = Moment.utc().subtract(minutes, "minutes");

    return this.find({
      createdAt: { $gt: cutOffDate.toISOString() },
    });
  }
  //
  @staticMethod
  public static findAllPanics(
    this: ModelType<CommuterPanic> & typeof CommuterPanic,
  ) {
    return this.find();
  }

  @prop({ required: true, default: false })
  public active!: boolean;
  //
  @prop({ required: true, default: false })
  public type!: PanicType;
  //
  @prop({ required: true })
  public userId!: string;

  @prop({ required: true, default: [] })
  public locations!: Position[];
  //
  @prop({ trim: true })
  public vehicleId?: string;
  //
  @prop({ trim: true })
  public vehicleReg?: string;
  //
  @prop({ trim: true })
  public commuterPanicId?: string;

  @prop({ required: true, default: new Date().toISOString() })
  public createdAt?: string;
  //
  @instanceMethod
  public async setCommuterPanicId(this: InstanceType<CommuterPanic>) {
    this.commuterPanicId = this.id;
    await this.save();
    console.log("CommuterPanic CommuterPanicId set to _Id");
  }
}

export default CommuterPanic;
