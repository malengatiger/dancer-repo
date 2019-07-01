import * as Moment from 'moment';
import CommuterStartingLandmark from '../models/commuter_starting_landmark';
import Position from '../models/position';
import Landmark from '../models/landmark';
import Route from '../models/route';
import Vehicle from '../models/vehicle';
export class CommuterStartingLandmarkHelper {

  public static async onCommuterStartingLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterStartingLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterStartingLandmark in stream:   🍀  🍎  `,
    );
  }

  public static async addCommuterStartingLandmark(
    landmarkId: string,
    latitude: number,
    longitude: number,
    userId: string,

  ): Promise<any> {
    const CommuterStartingLandmarkModel = new CommuterStartingLandmark().getModelForClass(CommuterStartingLandmark);
    const fromModel = new Landmark().getModelForClass(Landmark);
    const from = await fromModel.findByLandmarkID(landmarkId);

    
    if (from) {

      const position = new Position();
      position.coordinates = [longitude, latitude]
      const commuterStartingLandmark = new CommuterStartingLandmarkModel({
        landmarkId,
        position,
        userId,
        landmarkName: from.landmarkName,

      });
      const m = await commuterStartingLandmark.save();
    
      console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterStartingLandmark added  for: 🍎  ${commuterStartingLandmark.userId} \n\n`);
      console.log(m);
      return m;
    } else {
      throw new Error('Missing input data');
    }
  }

   public static async findByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
    minutes: number,
  ) {
    const time = Moment.utc().subtract(minutes, "minutes");
    const RADIUS = radiusInKM * 1000;
    const CommuterStartingLandmarkModel = new CommuterStartingLandmark().getModelForClass(CommuterStartingLandmark);
    console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
    const coords: number[] = [latitude, longitude];
  
    const mm = await CommuterStartingLandmarkModel.find({
      createdAt: { $gt: time.toISOString() },
     }).where('position')
      .near({
        center: {
          type: 'Point',
          coordinates: coords,
          spherical: true,
          maxDistance: RADIUS,
        },
        
      }).exec().catch((reason) => {
        console.log(`ppfffffffft! fucked!`)
        console.error(reason);
        throw reason;
      });
    
    console.log(`☘️ ☘️ ☘️ Commuter Request search found  🍎  ${mm.length}  🍎 `);
    return mm;
  }
  public static async findByLandmark(landmarkID: string, minutes: number): Promise<any> {
    const CommuterStartingLandmarkModel = new CommuterStartingLandmark().getModelForClass(CommuterStartingLandmark);
    const list = await CommuterStartingLandmarkModel.findByLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByUser(userId: string): Promise<any> {
    const CommuterStartingLandmarkModel = new CommuterStartingLandmark().getModelForClass(CommuterStartingLandmark);
    const list = await CommuterStartingLandmarkModel.findByUserId(userId);
    return list;
  }

  public static async findAll(minutes: number): Promise<any> {
    const CommuterStartingLandmarkModel = new CommuterStartingLandmark().getModelForClass(CommuterStartingLandmark);
    const list = await CommuterStartingLandmarkModel.findAll(minutes);
    return list;
  }

}
