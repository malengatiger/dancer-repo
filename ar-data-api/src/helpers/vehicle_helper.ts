import moment from "moment";
import v1 from "uuid/v1";
import Photo from "../models/photo";
import Vehicle from "../models/vehicle";
import VehicleLocation from "../models/vehicle_location";
import VehicleType from "../models/vehicle_type";

export class VehicleHelper {
  public static async onVehicleAdded(event: any) {
    console.log(`onVehicleAdded event has occured ....`);
    console.log(event);
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  vehicle in stream:   🍀   🍀  ${event.fullDocument.name} 🍎  _id: ${
        event.fullDocument._id
      } 🍎 `,
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
    console.log(`🍊 🍊  vehicle added:  🍊 ${m.vehicleReg} ${m.vehicleType.make} ${m.vehicleType.model}  🚗 🚗 `);
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
    withinMinutes: number,
    radiusInKM: number,
  ) {
    console.log(`find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${withinMinutes}`);
    const cutOff: string = moment().subtract(withinMinutes, "minutes").toISOString();
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
}
