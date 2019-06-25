import Moment from "moment";
import {
  arrayProp,
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  Ref,
// tslint:disable-next-line: ordered-imports
  staticMethod,
  Typegoose,
} from "typegoose";
class CommuterRequest extends Typegoose {

  @staticMethod
  public static findByLandmarkId(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    landmarkId: string,
    withinMinutes: number,
  ) {
    // todo - implement
    const m = Moment().subtract(withinMinutes, "minutes");
    return null;
  }
  //
  @staticMethod
  public static findByRouteID(
    this: ModelType<CommuterRequest> & typeof CommuterRequest,
    routeID: string,
    withinMinutes: number,
  ) {
     // todo - implement
     const m = Moment().subtract(withinMinutes, "minutes");
     return null;
  }
  //
  //
  @prop({ required: true, trim: true })
  public fromLandmarkId?: string;
  @prop({ required: true, trim: true })
  public toLandmarkId?: string;
  @prop({ required: true, trim: true })
  public fromLandmarkName?: string;
  @prop({ required: true, trim: true })
  public toLandmarkName?: string;

  @prop({ required: true })
  public position?: any;

  @prop({ required: true })
  public passengers?: number;

  @prop({ required: true, trim: true })
  public routeId?: string;

  @prop({ required: true, default: true })
  public scanned?: boolean;
  //
  @prop({ required: true, trim: true })
  public stringTime?: string;
  //
  @prop({ required: true })
  public time?: number;
  //
  @prop({ required: true })
  public commuterLocation?: any;
  //
  @prop({ required: true, default: false })
  public autoDetected?: boolean;
  //
  @prop({ required: false })
  public vehicleId?: string;
  //
  @prop({ required: true, trim: true })
  public user?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public createdAt?: string;
  //
  @instanceMethod
  public cancelRequest(this: InstanceType<CommuterRequest>, commuterRequestId: string) {
    // todo - implement
  }

}

export default CommuterRequest;
