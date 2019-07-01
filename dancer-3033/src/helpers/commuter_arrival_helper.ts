import * as Moment from 'moment';
import CommuterArrivalLandmark from '../models/commuter_arrival_landmark';
import Position from '../models/position';
import Landmark from '../models/landmark';
import Route from '../models/route';
import Vehicle from '../models/vehicle';
export class CommuterArrivalLandmarkHelper {

  public static async onCommuterArrivalLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterArrivalLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterArrivalLandmark in stream:   🍀  🍎  `,
    );
  }

  public static async addCommuterArrivalLandmark(
    commuterRequestId: string,
    fromLandmarkId: string,
    routeId: string,
    toLandmarkId: string,
    vehicleId: string,
    departureId: string,
    userId: string,

  ): Promise<any> {
    const CommuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    const fromModel = new Landmark().getModelForClass(Landmark);
    const from = await fromModel.findByLandmarkID(fromLandmarkId);

    const toModel = new Landmark().getModelForClass(Landmark);
    const to = await toModel.findByLandmarkID(toLandmarkId);

    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId);

    const vehModel = new Vehicle().getModelForClass(Vehicle);
    const veh = await vehModel.findByVehicleID(vehicleId);
    if (from && to && route && veh) {

      const position = new Position();
      position.coordinates = [from.longitude, from.latitude]
      const commuterArrivalLandmark = new CommuterArrivalLandmarkModel({
        commuterRequestId,
        fromLandmarkId,
        fromLandmarkName: from.landmarkName,
        position,
        routeId,
        routeName: route.name,
        createdAt: new Date().toISOString(),
        toLandmarkId,
        toLandmarkName: to.landmarkName,
        userId,
        vehicleId,
        vehicleReg: veh.vehicleReg,
        departureId,
      });
      const m = await commuterArrivalLandmark.save();
      m.commuterArrivalLandmarkId = m.id;
      await m.save();
      console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterArrivalLandmark added  for: 🍎  ${commuterArrivalLandmark.fromLandmarkName} \n\n`);
      console.log(CommuterArrivalLandmark);
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
