import * as Moment from "moment";
import DispatchRecord from "../models/dispatch_record";
import Landmark from "../models/landmark";
import Route from "../models/route";
import Vehicle from "../models/vehicle";
export class DispatchRecordHelper {
  public static async onDispatchRecordAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onDispatchRecordAddedEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  DispatchRecord in stream:   🍀 🍎  `,
    );
  }

  public static async addDispatchRecord(
    landmarkId: string,
    vehicleId: string,
    routeId: string,
    marshalId: string,
    passengers: number,
  ): Promise<any> {
    const dispatchRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const landmark = await landmarkModel.findByLandmarkID(landmarkId);
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId);
    const vehicleModel = new Vehicle().getModelForClass(Vehicle);
    const vehicle = await vehicleModel.findByVehicleID(vehicleId);
    if (landmark && route && vehicle) {
      const dispRecord = new dispatchRecordModel({
        dispatched: true,
        landmarkId,
        landmarkName: landmark.landmarkName,
        passengers,
        position: {
          coordinates: [landmark.longitude, landmark.latitude],
          type: "Point",
          createdAt: new Date().toISOString(),
        },
        routeId,
        routeName: route.name,
        vehicleId,
        vehicleReg: vehicle.vehicleReg,
        vehicleType: vehicle.vehicleType,
        dispatchedAt: new Date().toISOString(),
        marshalId,
        marshalName: "tbd",
      });
      const m = await dispRecord.save();
      m.setDispatchRecordId = m.id;
      await m.save();
      console.log(
        `\n👽 👽 👽  DispatchRecord added  for: 🍎  ${
          dispRecord.landmarkName
        } \n\n`,
      );
      console.log(dispRecord);
      return m;
    } else {
      throw new Error('Input data incomplete');
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
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    console.log(
      `about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`,
    );
    const coords: number[] = [latitude, longitude];

    const mm = await DispRecordModel.find({
      dispatchedAt: { $gt: time.toISOString() },
    })
      .where("position")
      .near({
        center: {
          type: "Point",
          coordinates: coords,
          spherical: true,
          maxDistance: RADIUS,
        },
      })
      .exec()
      .catch((reason) => {
        console.log(`ppfffffffft! fucked!`);
        console.error(reason);
        throw reason;
      });

    console.log(`☘️ ☘️ ☘️ DispatchRecord search found  🍎  ${mm.length}  🍎 `);
    return mm;
  }

  public static async findByLandmark(
    landmarkID: string,
    minutes: number,
  ): Promise<any> {
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const list = await DispRecordModel.findByLandmarkId(landmarkID, minutes);
    return list;
  }

  public static async findByRoute(
    routeID: string,
    minutes: number,
  ): Promise<any> {
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const list = await DispRecordModel.findByRouteId(routeID, minutes);
    return list;
  }

  public static async findByMarshal(marshalId: string): Promise<any> {
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const list = await DispRecordModel.findByMarshal(marshalId);
    return list;
  }

  public static async findByVehicleId(
    vehicleId: string,
    minutes: number,
  ): Promise<any> {
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const list = await DispRecordModel.findByVehicleId(vehicleId, minutes);
    return list;
  }

  public static async findAllByVehicleId(vehicleId: string): Promise<any> {
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const list = await DispRecordModel.findAllByVehicleId(vehicleId);
    return list;
  }

  public static async findAll(minutes: number): Promise<any> {
    const DispRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    const list = await DispRecordModel.findAll(minutes);
    return list;
  }
}
