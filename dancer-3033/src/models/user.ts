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

enum UserType {
  Administrator = "Administrator",
  Driver = "Driver",
  Marshal = "Marshal",
  Owner = "Owner",
  Patroller = "Patroller",
  Commuter = "Commuter",
}
class User extends Typegoose {
  //
  @staticMethod
  public static findByAssociationID(
    this: ModelType<User> & typeof User,
    associationID: string,
  ) {
    return this.find({ associationID });
  }
  //
  @staticMethod
  public static findByUserID(
    this: ModelType<User> & typeof User,
    userID: string,
  ) {
    return this.findOne({ userID });
  }
  //
  @prop({ required: true, trim: true })
  public firstName!: string;
  //
  @prop({ required: true, trim: true })
  public email!: string;
  //
  @prop({ trim: true })
  public cellphone!: string;
  //
  @prop({ required: true, trim: true })
  public lastName!: string;
  //
  @prop({ index: true, trim: true })
  public userID!: string;
  //
  @prop({ trim: true })
  public associationId?: string;
  //
  @prop({ trim: true })
  public associationName?: string;
  //
  @prop({ required: true })
  public userType!: UserType;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created!: string;
}

export default User;
