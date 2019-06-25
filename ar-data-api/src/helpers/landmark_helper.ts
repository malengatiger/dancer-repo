import { getDistance } from "geolib";
import { BulkWriteOpResultObject } from "mongodb";
import v1 from "uuid/v1";
import Landmark from "../models/landmark";
import Route from "../models/route";

export class LandmarkHelper {
  public static async onLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  landmark in stream:   🍀   🍀  ${
        event.fullDocument.landmarkName
      } 🍎  `,
    );
  }
  public static async addLandmarks(
    landmarks: any[],
    routeID: string,
  ): Promise<any> {
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findById(routeID);
    console.log(
      `💦 💦  adding landmarks - 👽 route from mongo: 💦 💦 ${route.name}`,
    );
    const bulkWriteList: any = [];
    for (const m of landmarks) {
      if (m.latitude && m.longitude) {
        const landmark = new landmarkModel({
          landmarkName: m.landmarkName,
          position: {
            coordinates: [m.longitude, m.latitude],
            type: "Point",
          },
          routes: [route],
        });
        bulkWriteList.push({
          insertOne: {
            document: landmark,
          },
        });
      } else {
        console.warn(
          `\n\n👿👿👿👿👿👿👿👿👿👿👿👿👿 coordinates missing for ${
            m.landmarkName
          } 👿👿👿👿👿👿👿`,
        );
      }
    }
    console.log(
      `\n\n🍀 🍀 🍀 🍀  ..... about to write batch: ${
        bulkWriteList.length
      } 🍀 🍀`,
    );
    if (bulkWriteList.length === 0) {
      console.error(`👿👿👿👿👿👿👿 Ignoring empty batch ... 🍀  ciao!`);
      return;
    }
    try {
      const res: BulkWriteOpResultObject = await landmarkModel.bulkWrite(
        bulkWriteList,
      );
      console.log(
        `\n\n🍀 🍀 🍀 🍀  Batched: ${landmarks.length}. inserted: 🍎  ${
          res.insertedCount
        } 🍎`,
      );
      console.log(res);
    } catch (e) {
      console.error(
        `👿👿👿👿👿👿👿 Something fucked up! 👿👿👿👿👿👿👿👿\n`,
        e,
      );
    }
  }
  public static async addLandmark(
    landmarkName: string,
    latitude: number,
    longitude: number,
    routeIDs: string[],
    routeDetails: any[],
  ): Promise<any> {
    if (!latitude || !longitude) {
      throw new Error("Missing coordinates");
    }
    const landmarkModel = new Landmark().getModelForClass(Landmark);

    console.log(`😍 😍 😍  about to add landmark: ${landmarkName}`);
    const landmarkID = v1();
    const landmark = new landmarkModel({
      landmarkID,
      landmarkName,
      latitude,
      longitude,
      position: {
        coordinates: [longitude, latitude],
        type: "Point",
      },
      routeDetails,
      routeIDs,
    });
    const m = await landmark.save();
    console.log(
      `\n👽 👽 👽 👽 👽 👽 👽 👽  Landmark added  🍎  ${landmarkName} \n\n`,
    );
    return m;
  }

  public static async addRoute(
    landmarkID: string,
    routeID: string,
  ): Promise<any> {
    console.log(` 🌀 addRoute to landmark; landmarkID: ${landmarkID} routeID: ${routeID} ....   🌀  🌀  🌀 `);
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const routeModel = new Route().getModelForClass(Route);

    const route: any = await routeModel.findByRouteID(routeID);
    console.log(route);
    const mark: any = await landmarkModel.findByLandmarkID(landmarkID);
    if (!mark.routes) {
      mark.routes = [];
    }
    if (!mark.routeDetails) {
      mark.routeDetails = [];
    }
    mark.routes.push(route.routeID);
    mark.routeDetails.push({
      routeID: route.routeID,
      routeName: route.name,
    });
  }

  public static async findAll(): Promise<any> {
    console.log(` 🌀 LandmarkHelper: findAll ....   🌀  🌀  🌀 `);
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const list = await landmarkModel.find();
    console.log(
      ` 🌀 LandmarkHelper: findAll .... found: ${list.length}   🌀  🌀  🌀 `,
    );

    console.log(list);
    return list;
  }
  public static async findByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
  ) {
    // tslint:disable-next-line: max-line-length
    console.log(
      `\n💦 💦  find landmarks ByLocation .... 🔆 lat: ${latitude}  🔆 lng: ${longitude} radiusInKM: ${radiusInKM}`,
    );
    const start = new Date().getTime();
    const RADIUS = radiusInKM * 1000;
    const landmarkModel = new Landmark().getModelForClass(Landmark);

    const list: any = await landmarkModel
      .find({
        position: {
          $near: {
            $geometry: {
              coordinates: [longitude, latitude],
              type: "Point",
            },
            $maxDistance: RADIUS,
          },
        },
      })
      .catch((err) => {
        console.error(err);
      });
    const end = new Date().getTime();
    console.log(
      `\n🏓  🏓  landmarks found:   🌺 ${list.length}  elapsed: 💙  ${(end -
        start) /
        1000} seconds  💙 💚\n`,
    );

    list.forEach((m) => {
      const route = m.routeDetails[0];
      console.log(`💙 💚  ${m.landmarkName}  🍎 ${route.name}  💛`);
    });
    console.log(
      `\n\n🌺  Calculated distances between landmarks   🌺 🌸 \n`,
    );
    this.calculateDistances(list, latitude, longitude);
    console.log(list);
    console.log(
      `\n💙 💙 💙 landmarks found:  🌸  ${
        list.length
      }  elapsed: 💙  ${(end - start) / 1000} seconds  💙 💚 💛\n`,
    );
    return list;
  }
  public static async calculateDistances(
    landmarks: any[],
    latitude: number,
    longitude: number,
  ) {
    const from = {
      latitude,
      longitude,
    };

    for (const m of landmarks) {
      const to = {
        latitude: m.position.coordinates[1],
        longitude: m.position.coordinates[0],
      };
      const dist = getDistance(from, to);
      const f = new Intl.NumberFormat("en-us", { maximumSignificantDigits: 3 }).format(dist / 1000);
      m.distance = f + " km (as the crow flies)";
      console.log(
        `🌸  ${f}  🍎  ${m.landmarkName}  🍀  ${
          m.routeDetails[0].name
        }`,
      );
    }
  }
}
