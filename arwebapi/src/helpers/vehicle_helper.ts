import moment from "moment";
import v1 from "uuid/v1";
import Photo from "../models/photo";
import Position from "../models/position";
import Vehicle from "../models/vehicle";
import VehicleArrival from "../models/vehicle_arrival";
import VehicleDeparture from "../models/vehicle_departure";
import VehicleLocation from "../models/vehicle_location";
import VehicleType from "../models/vehicle_type";

export class VehicleHelper {
  public static async onVehicleAdded(event: any) {
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  vehicle in stream:   🍀  🍎 `,
    );
  }
  public static async addVehicle(
    vehicleReg: string,
    associationID: string,
    associationName: string,
    ownerID: string,
    ownerName: string,
    vehicleTypeID: string,
    photos: string[],
  ): Promise<any> {
    console.log(
      `\n\n🌀🌀🌀  VehicleHelper: addVehicle  🍀  ${vehicleReg}  🍀   ${associationID}  🍀   ${associationName}\n`,
    );

    const vehicleTypeModel = new VehicleType().getModelForClass(VehicleType);
    const type: any = await vehicleTypeModel.getVehicleTypeByID(vehicleTypeID);
    if (!type) {
      const msg = "Vehicle Type not found";
      console.log(`👿👿👿👿 ${msg} 👿👿👿👿`);
      throw new Error(msg);
    }
    console.log(
      `\n🥦🥦🥦  VehicleType from Mongo ...  🍊  ${type.make} ${type.model}`,
    );
    const vehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = [];
    if (photos) {
      for (const url of photos) {
        const photo = new Photo();
        photo.url = url;
        list.push(photo);
      }
    }
    const vehicleID = v1();
    const vehicle = new vehicleModel({
      associationID,
      associationName,
      ownerID,
      ownerName,
      photos: list,
      vehicleID,
      vehicleReg,
      vehicleType: type,
    });
    const m = await vehicle.save();
    m.vehicleId = m.id;
    await m.save();
    if (m && m.vehicleType) {
      console.log(
        `🍊 🍊  vehicle added:  🍊 ${m.vehicleReg} ${m.vehicleType.make} ${
        m.vehicleType.model
        }  🚗 🚗 `,
      );
    }
    return m;
  }
  public static async addVehicleArrival(
    vehicleReg: string,
    vehicleId: string,
    landmarkName: string,
    landmarkId: string,
    latitude: number,
    longitude: number,
    make: string, model: string, capacity: number,
  ): Promise<any> {
    console.log(
      `\n\n🌀🌀🌀  VehicleHelper: addVehicleArrival  🍀  ${vehicleReg}  🍀   ${landmarkName}  🍀 \n`,
    );

    const vehicleArrivalModel = new VehicleArrival().getModelForClass(
      VehicleArrival,
    );

    const position = new Position();
    position.type = "Point";
    position.coordinates = [longitude, latitude];

    const vehicleArrival = new vehicleArrivalModel({
      vehicleId,
      landmarkName,
      landmarkId,
      position,
      vehicleReg,
      dateArrived: new Date().toISOString(),
      make, model, capacity,
    });
    const m = await vehicleArrival.save();
    m.vehicleArrivalId = m.id;
    await m.save();
    console.log(
      `🍊 🍊  vehicleArrival added:  🍊 ${m.vehicleReg} ${
        m.landmarkName
      }  🚗 🚗 `,
    );
    return m;
  }
  public static async addVehicleDeparture(
    vehicleReg: string,
    vehicleId: string,
    landmarkName: string,
    landmarkId: string,
    latitude: number,
    longitude: number,
    make: string, model: string, capacity: number,
  ): Promise<any> {
    console.log(
      `\n\n🌀🌀🌀  VehicleHelper: addVehicleDeparture  🍀  ${vehicleReg}  🍀   ${landmarkName}  🍀  \n`,
    );

    const vehicleDepModel = new VehicleDeparture().getModelForClass(
      VehicleDeparture,
    );

    const position = new Position();
    position.type = "Point";
    position.coordinates = [longitude, latitude];

    const vehicleDeparture = new vehicleDepModel({
      vehicleId,
      landmarkName,
      landmarkId,
      position,
      vehicleReg,
      dateDeparted: new Date().toISOString(),
      make, model, capacity,
    });
    const m = await vehicleDeparture.save();
    m.vehicleDepartureId = m.id;
    await m.save();
    console.log(
      `🍊 🍊  vehicleDeparture added:  🍊 ${m.vehicleReg} ${
        m.landmarkName
      }  🚗 🚗 `,
    );
    return m;
  }
  public static async getVehicles(): Promise<any> {
    console.log(` 🌀 getVehicles ....   🌀  🌀  🌀 `);
    const VehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = await VehicleModel.find();
    return list;
  }
  public static async addVehicleType(
    make: string,
    model: string,
    capacity: number,
    countryID: string,
    countryName: string,
  ): Promise<any> {
    console.log(
      `\n\n🌀 🌀  VehicleHelper: addVehicleType  🍀  ${make} ${model} capacity: ${capacity}\n`,
    );

    const vehicleTypeID = v1();
    const vehicleTypeModel = new VehicleType().getModelForClass(VehicleType);
    const u = new vehicleTypeModel({
      capacity,
      countryID,
      countryName,
      make,
      model,
      vehicleTypeID,
    });

    const m = await u.save();
    return m;
  }
  public static async getVehicleTypes(): Promise<any> {
    console.log(`🌀 getVehicleTypes ....   🌀 🌀 🌀 `);
    const vehicleModel = new VehicleType().getModelForClass(VehicleType);
    const list = await vehicleModel.find();
    return list;
  }
  public static async getVehiclesByOwner(ownerID: string): Promise<any> {
    console.log(`🌀 getVehiclesByOwner ....   🌀 🌀 🌀 `);
    const VehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = await VehicleModel.find({ ownerID });
    return list;
  }
  public static async getVehiclesByAssociation(
    associationID: string,
  ): Promise<any> {
    console.log(`🌀 getVehiclesByAssociation ....   🌀 🌀 🌀 `);
    const VehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = await VehicleModel.find({ associationID });
    return list;
  }

  public static async findVehiclesByLocation(
    latitude: number,
    longitude: number,
    minutes: number,
    radiusInKM: number,
  ) {
    console.log(
      `find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${minutes}`,
    );
    const cutOff: string = moment()
      .subtract(minutes, "minutes")
      .toISOString();
    const METERS = radiusInKM * 1000;
    const vehicleLocationModel = new VehicleLocation().getModelForClass(
      VehicleLocation,
    );
    const list: any = await vehicleLocationModel
      .find({
        created: { $gt: cutOff },
        position: {
          $near: {
            $geometry: {
              coordinates: [longitude, latitude],
              type: "Point",
            },
            $maxDistance: METERS,
          },
        },
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(`🏓  🏓  vehicleLocations found ${list.length}`);
    console.log(list);
    return list;
  }
  ///////////
  public static async findVehicleArrivalsByLocation(
    latitude: number,
    longitude: number,
    minutes: number,
    radiusInKM: number,
  ) {
    console.log(
      `find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${minutes}`,
    );
    const cutOff: string = moment()
      .subtract(minutes, "minutes")
      .toISOString();
    const METERS = radiusInKM * 1000;
    const vehicleArrivalModel = new VehicleArrival().getModelForClass(VehicleArrival);
    const list: any = await vehicleArrivalModel
      .find({
        dateArrived: { $gt: cutOff },
        position: {
          $near: {
            $geometry: {
              coordinates: [longitude, latitude],
              type: "Point",
            },
            $maxDistance: METERS,
          },
        },
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(`🏓  🏓  vehicleArrivals found ${list.length}`);
    return list;
  }
  public static async findVehicleArrivalsByLandmark(
    landmarkId: string,
    minutes: number,
  ) {

    const vehicleArrivalModel = new VehicleArrival().getModelForClass(
      VehicleArrival,
    );
    const list = await vehicleArrivalModel.findByLandmarkId(landmarkId, minutes);
    console.log(`🏓  🏓  vehicleArrivalss found ${list.length}`);
    return list;
  }
  public static async findVehicleArrivalsByVehicle(
    vehicleId: string,
    minutes: number,
  ) {

    const vehicleArrivalModel = new VehicleArrival().getModelForClass(
      VehicleArrival,
    );
    const list = await vehicleArrivalModel.findByVehicleId(vehicleId, minutes);
    console.log(`🏓  🏓  findVehicleArrivalsByVehicle found ${list.length}`);
    return list;
  }
  public static async findAllVehicleArrivalsByVehicle(
    vehicleId: string,
  ) {

    const vehicleArrivalModel = new VehicleArrival().getModelForClass(
      VehicleArrival,
    );
    const list = await vehicleArrivalModel.findAllByVehicleId(vehicleId);
    console.log(`🏓  🏓  findAllVehicleArrivalsByVehicle found ${list.length}`);
    return list;
  }
  public static async findAllVehicleArrivals(
    minutes: number,
  ) {

    const vehicleArrivalModel = new VehicleArrival().getModelForClass(
      VehicleArrival,
    );
    const list = await vehicleArrivalModel.findAll(minutes);
    console.log(`c  🏓  findAllVehicleArrivals found ${list.length}`);
    return list;
  }
  /////////////
  public static async findVehicleDeparturesByLocation(
    latitude: number,
    longitude: number,
    minutes: number,
    radiusInKM: number,
  ) {
    console.log(
      `find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${minutes}`,
    );
    const cutOff: string = moment()
      .subtract(minutes, "minutes")
      .toISOString();
    const METERS = radiusInKM * 1000;
    const vehicleArrivalModel = new VehicleDeparture().getModelForClass(VehicleArrival);
    const list: any = await vehicleArrivalModel
      .find({
        dateArrived: { $gt: cutOff },
        position: {
          $near: {
            $geometry: {
              coordinates: [longitude, latitude],
              type: "Point",
            },
            $maxDistance: METERS,
          },
        },
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(`🏓  🏓  vehicleArrivals found ${list.length}`);
    return list;
  }
  public static async findVehicleDeparturesByLandmark(
    landmarkId: string,
    minutes: number,
  ) {

    const vehicleDepModel = new VehicleDeparture().getModelForClass(
      VehicleDeparture,
    );
    const list = await vehicleDepModel.findByLandmarkId(landmarkId, minutes);
    console.log(`🏓  🏓  findVehicleDeparturesByLandmark found ${list.length}`);
    return list;
  }
  public static async findVehicleDeparturesByVehicle(
    vehicleId: string,
    minutes: number,
  ) {

    const vehicleDepModel = new VehicleDeparture().getModelForClass(
      VehicleDeparture,
    );
    const list = await vehicleDepModel.findByVehicleId(vehicleId, minutes);
    console.log(`🏓  🏓  findVehicleArrivalsByVehicle found ${list.length}`);
    return list;
  }
  public static async findAllVehicleDeparturesByVehicle(
    vehicleId: string,
  ) {

    const vehicleDepModel = new VehicleDeparture().getModelForClass(
      VehicleDeparture,
    );
    const list = await vehicleDepModel.findAllByVehicleId(vehicleId);
    console.log(`🏓  🏓  findAllVehicleDeparturesByVehicle found ${list.length}`);
    return list;
  }
  public static async findAllVehicleDepartures(
    minutes: number,
  ) {

    const vehicleDepModel = new VehicleDeparture().getModelForClass(
      VehicleDeparture,
    );
    const list = await vehicleDepModel.findAll(minutes);
    console.log(`🏓  🏓  findAllVehicleDepartures found ${list.length}`);
    return list;
  }
}
