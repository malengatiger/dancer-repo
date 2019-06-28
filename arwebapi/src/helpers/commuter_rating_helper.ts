import * as Moment from 'moment';
import CommuterRating from '../models/commuter_rating';
import Rating from '../models/rating';
export class CommuterRatingHelper {

  public static async onCommuterRatingAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterRatingChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterRating in stream:   🍀   🍀  ${
        event.fullDocument.CommuterRatingName
      } 🍎  `,
    );
  }

  public static async addCommuterRating(
    commuterRequestId: string,
    rating: Rating,
    userId: string,

  ): Promise<any> {
    const commuterRatingModel = new CommuterRating().getModelForClass(CommuterRating);
    const mRating = new commuterRatingModel({
      commuterRequestId,
      rating,
      userId,
    });
    const m = await mRating.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRating added  for: 🍎  ${CommuterRating.fromLandmarkName} \n\n`);
    console.log(mRating);
    return m;
  }

  public static async findByUser(user: string): Promise<any> {
    const commuterRatingModel = new CommuterRating().getModelForClass(CommuterRating);
    const list = await commuterRatingModel.findByUser(user);
    return list;
  }

  public static async findAll(minutes: number): Promise<any> {
    const commuterRatingModel = new CommuterRating().getModelForClass(CommuterRating);
    const list = await commuterRatingModel.findAll(minutes);
    return list;
  }

}
