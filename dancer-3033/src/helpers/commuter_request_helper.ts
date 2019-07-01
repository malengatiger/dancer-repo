import * as Moment from 'moment';
import CommuterRequest from "../models/commuter_request";
import Landmark from '../models/landmark';
import Route from '../models/route';
import Vehicle from '../models/vehicle';
import Position from '../models/position';
export class CommuterRequestHelper {

  public static async onCommuterRequestAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterRequestChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterRequest in stream:   🍀 🍎  `,
    );
  }

  public static async addCommuterRequest(
    fromLandmarkId: string,
    routeId: string,
    toLandmarkId: string,
    passengers: number,
    userId: string,
    latitude: number, longitude: number,
  ): Promise<any> {
    const commuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const fromModel = new Landmark().getModelForClass(Landmark);
    const from = await fromModel.findByLandmarkID(fromLandmarkId);

    const toModel = new Landmark().getModelForClass(Landmark);
    const to = await toModel.findByLandmarkID(toLandmarkId);

    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId);

  
    const pos = new Position();
    pos.coordinates = [longitude, latitude];
    if (from && to && route) {
      const commuterRequest = new commuterRequestModel({
        autoDetected: false,
        fromLandmarkId,
        fromLandmarkName: from.landmarkName,
        passengers,
        position: pos,
        routeId,
        routeName: route.name,
        scanned: false,
        stringTime: new Date().toISOString(),
        time: new Date().getTime(),
        toLandmarkId,
        toLandmarkName: to.landmarkName,
        userId,
        
      });
      const m = await commuterRequest.save();
      m.commuterRequestId = m.id;
      await m.save();
      console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRequest added  for: 🍎  ${commuterRequest.fromLandmarkName} \n\n`);
      console.log(commuterRequest);
      return m;
    } else {
      throw new Error('Missing or ivalid input data');
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
