import { getDistance } from "geolib";
import { BulkWriteOpResultObject } from "mongodb";
import Landmark from "../models/landmark";
import Route from "../models/route";
import City from "../models/city";

export class LandmarkHelper {
  public static async onLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  landmark in stream:   🍀  🍎  `,
    );
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
    
    const landmark = new landmarkModel({
      landmarkName,
      latitude,
      longitude,
      position: {
        coordinates: [longitude, latitude],
        type: "Point",
        createdAt: new Date().toISOString(),
      },
      routeDetails,
      routeIDs,
    });
    const m = await landmark.save();
    m.landmarkID = m.id;
    m.save();
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

    list.forEach((m: any) => {
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
   public static  async addRouteToLandmark(routeId: string, landmarkId: string) {
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const mark = await landmarkModel.findByLandmarkID(landmarkId).exec();
    if (!mark) {
      const msg = `landmark ${landmarkId} not found`;
      console.log(msg);
      throw new Error(msg);
    }
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId).exec();
    if (!route) {
      const msg = `route ${routeId} not found`;
      console.log(msg);
      throw new Error(msg);
    }
    mark.routeIDs.push(route.routeID);
    mark.routeDetails.push({
      routeID: routeId,
      name: route.name,
    });
    await mark.save();
    const msg = `🍎🍎  route ${route.name} added to landmark ${mark.landmarkName}`;
    console.log(msg);
    return {
      message: msg,
    }
  }
  public static async getRouteLandmarks(routeId: string) {
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const list = await landmarkModel.findByRouteID(routeId).exec();

    return list;
  }

    public static  async addCityToLandmark(landmarkId: string, cityId: string) {
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const mark = await landmarkModel.findByLandmarkID(landmarkId).exec();
    if (!mark) {
      const msg = `landmark ${landmarkId} not found`;
      console.log(msg);
      throw new Error(msg);
    }
    const cityModel = new City().getModelForClass(City);
    const city = await cityModel.findOne(cityId).exec();
    if (!city) {
      const msg = `city ${cityId} not found`;
      console.log(msg);
      throw new Error(msg);
    }
    mark.cities.push(city);
    await mark.save();
    const msg = `🍎🍎  city ${city.name} added to landmark ${mark.landmarkName}`;
    console.log(msg);
    return {
      message: msg,
    }
  }
}
