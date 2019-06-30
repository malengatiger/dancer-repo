import * as Moment from 'moment';
import CommuterRequest from "../models/commuter_request";
export class CommuterRequestHelper {

  public static async onCommuterRequestAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterRequestChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterRequest in stream:   🍀  🍎  `,
    );
  }

  public static async addCommuterRequest(
    request: any,
  ): Promise<any> {
    const commuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    console.log(`....... 😍 😍 😍  about to add CommuterRequest:  👽 👽 👽`);
    console.log(request);
    const commuterRequest = new commuterRequestModel({
      autoDetected: request.autoDetected,
      commuterLocation: request.commuterLocation,
      fromLandmarkId: request.fromLandmarkId,
      fromLandmarkName: request.fromLandmarkName,
      passengers: request.passengers,
      position: {
        coordinates: [request.commuterLocation.lng, request.commuterLocation.lat],
        type: "Point",
      },
      routeId: request.routeId,
      routeName: request.routeName,
      scanned: request.scanned,
      stringTime: new Date().toISOString(),
      time: new Date().getTime(),
      toLandmarkId: request.toLandmarkId,
      toLandmarkName: request.toLandmarkName,
      user: request.user,
      vehicleId: request.vehicleId,
      vehicleReg: request.vehicleReg,
    });
    const m = await commuterRequest.save();
    m.commuterRequestId = m.id;
    await m.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRequest added  for: 🍎  ${commuterRequest.fromLandmarkName} \n\n`);
    console.log(commuterRequest);
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
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
    const coords: number[] = [latitude, longitude];
  
    const mm = await CommuterRequestModel.find({
      stringTime: { $gt: time.toISOString() },
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
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const list = await CommuterRequestModel.findByFromLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByToLandmark(landmarkID: string, minutes: number): Promise<any> {
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const list = await CommuterRequestModel.findByToLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByRoute(routeID: string, minutes: number): Promise<any> {
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const list = await CommuterRequestModel.findByRouteId(routeID, minutes);
    return list;
  }

  public static async findByUser(user: string): Promise<any> {
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const list = await CommuterRequestModel.findByUser(user);
    return list;
  }

  public static async findAll(minutes: number): Promise<any> {
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const list = await CommuterRequestModel.findAll(minutes);
    return list;
  }

}
