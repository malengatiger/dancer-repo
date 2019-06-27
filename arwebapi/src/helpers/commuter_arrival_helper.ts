import * as Moment from 'moment';
import CommuterArrivalLandmark from '../models/commuter_arrival_landmark';
export class CommuterArrivalLandmarkHelper {

  public static async onCommuterArrivalLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterArrivalLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterArrivalLandmark in stream:   🍀   🍀  ${
        event.fullDocument.CommuterArrivalLandmarkName
      } 🍎  `,
    );
  }

  public static async addCommuterArrivalLandmark(
    request: any,
  ): Promise<any> {
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    console.log(`....... 😍 😍 😍  about to add CommuterArrivalLandmark:  👽 👽 👽`);
    console.log(request);
    const commuterArrivalLandmark = new CommuterArrivalLandmarkModel({
      commuterRequestId: request.commuterRequestId,
      fromLandmarkId: request.fromLandmarkId,
      fromLandmarkName: request.fromLandmarkName,
      position: request.position,
      routeId: request.routeId,
      routeName: request.routeName,
      createdAt: new Date().toISOString(),
      toLandmarkId: request.toLandmarkId,
      toLandmarkName: request.toLandmarkName,
      userId: request.userId,
      vehicleId: request.vehicleId,
      vehicleReg: request.vehicleReg,
      departureId: request.departureId,
    });
    const m = await commuterArrivalLandmark.save();
    m.commuterArrivalLandmarkId = m.id;
    await m.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterArrivalLandmark added  for: 🍎  ${commuterArrivalLandmark.fromLandmarkName} \n\n`);
    console.log(CommuterArrivalLandmark);
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
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
    const coords: number[] = [latitude, longitude];
  
    const mm = await CommuterArrivalLandmarkModel.find({
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
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    const list = await CommuterArrivalLandmarkModel.findByFromLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByToLandmark(landmarkID: string, minutes: number): Promise<any> {
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    const list = await CommuterArrivalLandmarkModel.findByToLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByRoute(routeID: string, minutes: number): Promise<any> {
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    const list = await CommuterArrivalLandmarkModel.findByRouteId(routeID, minutes);
    return list;
  }

  public static async findByUser(user: string): Promise<any> {
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    const list = await CommuterArrivalLandmarkModel.findByUser(user);
    return list;
  }

  public static async findAll(minutes: number): Promise<any> {
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    const list = await CommuterArrivalLandmarkModel.findAll(minutes);
    return list;
  }

}
