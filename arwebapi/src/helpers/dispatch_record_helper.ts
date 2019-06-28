import * as Moment from "moment";
import DispatchRecord from "../models/dispatch_record";
export class DispatchRecordHelper {
  public static async onDispatchRecordAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onDispatchRecordAddedEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  DispatchRecord in stream:   🍀 🍎  `,
    );
  }

  public static async addDispatchRecord(request: any): Promise<any> {
    const dispatchRecordModel = new DispatchRecord().getModelForClass(
      DispatchRecord,
    );
    console.log(`....... 😍 😍 😍  about to add DispatchRecord:  👽 👽 👽`);
    console.log(request);
    const dispRecord = new dispatchRecordModel({
      dispatched: request.dispatched,
      landmarkId: request.landmarkId,
      landmarkName: request.landmarkName,
      passengers: request.passengers,
      position: {
        coordinates: [request.longitude, request.latitude],
        type: "Point",
      },
      routeId: request.routeId,
      routeName: request.routeName,
      vehicleId: request.vehicleId,
      vehicleReg: request.vehicleReg,
      dispatchedAt: new Date().toISOString(),
      marshalId: request.marshalId,
      marshalName: request.marshalName,
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
