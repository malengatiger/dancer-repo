import * as Moment from 'moment';
import CommuterPickupLandmark from '../models/commuter_pickup_landmark';
export class CommuterPickupLandmarkHelper {

  public static async onCommuterPickupLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterPickupLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterPickupLandmark in stream:   🍀  🍎  `,
    );
  }

  public static async addCommuterPickupLandmark(
    commuterRequestId: string,
    fromLandmarkId: string,
    toLandmarkId: string,
    fromLandmarkName: string,
    toLandmarkName: string,
    latitude: number, longitude: number,
    vehicleId: string,
    vehicleReg: string,
    userId: string,
    routeId: string,
    routeName: string,

  ): Promise<any> {
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);

    const position = {
      type: 'Point',
      coordinates: [longitude, latitude],
      createdAt: new Date().toISOString()
    }
    const cplModel = new commuterPickupLandmarkModel({
      commuterRequestId,
      fromLandmarkId,
      fromLandmarkName,
      position,
      routeId,
      routeName,
      createdAt: new Date().toISOString(),
      toLandmarkId,
      toLandmarkName,
      userId,
      vehicleId,
      vehicleReg,
    });
    const m = await cplModel.save();
    m.commuterPickupLandmarkId = m.id;
    await m.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPickupLandmark added  for: 🍎  ${cplModel.fromLandmarkName} \n\n`);
    console.log(m);
    return m;
  }

   public static async findByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
    minutes: number,
  ) {
    const time = Moment.utc().subtract(minutes, "minutes");
    const RADIUS = radiusInKM * 1000;
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);
    console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
    const coords: number[] = [latitude, longitude];
  
    const mm = await commuterPickupLandmarkModel.find({
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
  public static async findByFromLandmark(landmarkID: string, minutes: number): Promise<any> {
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);
    const list = await commuterPickupLandmarkModel.findByFromLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByToLandmark(landmarkID: string, minutes: number): Promise<any> {
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);
    const list = await commuterPickupLandmarkModel.findByToLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByRoute(routeID: string, minutes: number): Promise<any> {
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);
    const list = await commuterPickupLandmarkModel.findByRouteId(routeID, minutes);
    return list;
  }

  public static async findByUser(userId: string): Promise<any> {
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);
    const list = await commuterPickupLandmarkModel.findByUser(userId);
    return list;
  }

  public static async findAll(minutes: number): Promise<any> {
    const commuterPickupLandmarkModel = new CommuterPickupLandmark().getModelForClass(CommuterPickupLandmark);
    const list = await commuterPickupLandmarkModel.findAll(minutes);
    return list;
  }

}
