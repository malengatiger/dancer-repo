import Association from "../models/association";
import Route from "../models/route";
import RoutePoint from "../models/route_point";
import Landmark from "../models/landmark";
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
export class RouteHelper {
  public static async onRouteAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onRouteChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  route in stream:  🍀  🍀  🍎 `,
    );
  }

  public static async addRoute(
    name: string,
    color: string,
    associationID: string,
  ): Promise<any> {
    const routeModel = new Route().getModelForClass(Route);
    const assModel = new Association().getModelForClass(Association);
    const list1: any[] = [];
    const list2: any[] = [];

    const ass = await assModel.findByAssociationId(associationID).exec();
    if (ass) {
      list1.push(ass.associationId);
      list2.push({
        associationId: ass.associationId,
        associationName: ass.associationName,
      });
    }

    if (!color) {
      color = "white";
    }
    const mRoute = new routeModel({
      associationDetails: list2,
      associationIDs: list1,
      color,
      name,
      routePoints: [],
      rawRoutePoints: [],
      calculatedDistances: [],
    });
    const m = await mRoute.save();
    m.routeID = m.id;
    await m.save();

    console.log(
      `\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${name}  💙  💚  💛`,
    );
    return m;
  }

  public static async getRoutes(): Promise<any> {
    console.log(` 🌀 getRoutes find all routes in Mongo ....   c  🌀  🌀 `);
    const routeModel = new Route().getModelForClass(Route);
    const list = await routeModel.find();
    return list;
  }
  public static async addRoutePoints(
    routeId: string,
    routePoints: RoutePoint[],
    clear: boolean,
  ) {
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId).exec();
    if (!route) {
      throw new Error(`${routeId} route not found`);
    }
    if (clear) {
      route.routePoints = [];
    }
    for (const p of routePoints) {
      route.routePoints.push(p);
    }
    await route.save();
    const msg = `${routePoints.length} route points added to route  ${
      route.name
    }`;
    console.log(`💛💛 ${msg}`);
    return {
      message: msg,
    };
  }
  public static async addRawRoutePoints(
    routeId: string,
    routePoints: RoutePoint[],
    clear: boolean,
  ) {
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId).exec();
    if (!route) {
      throw new Error(`${routeId} route not found`);
    }
    if (clear) {
      route.rawRoutePoints = [];
    }
    for (const p of routePoints) {
      route.rawRoutePoints.push(p);
    }
    await route.save();
    const msg = `${routePoints.length} route points added to route  ${
      route.name
    }`;
    console.log(`💛💛 ${msg}`);
    return {
      message: msg,
    };
  }
  public static async updateRoute(
    routeId: string,
    name: string,
    color: string,
  ) {
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId).exec();
    if (!route) {
      throw new Error(`${routeId} route not found`);
    }
    route.name = name;
    route.color = color;
    await route.save();
    const msg = `💛💛 Route ${route.name} updated`;
    console.log(msg);
    return {
      message: msg,
    };
  }
  public static async updateRoutePoint(
    routeId: string,
    created: string,
    landmarkId: string,
  ) {
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeId).exec();
    if (!route) {
      throw new Error(`${routeId} route not found`);
    }
    let found = false;
    const markModel = new Landmark().getModelForClass(Landmark);
    const mark = await markModel.findByLandmarkID(landmarkId).exec();
    if (mark) {
      for (const p of route.routePoints) {
        if (p.created === created) {
          p.landmarkId = landmarkId;
          p.landmarkName = mark.landmarkName;
          await mark.save();
          const msg = `💛💛 Route ${route.name} updated`;
          console.log(msg);
          found = true;
          return {
            message: msg,
          };
        }
      }
      if (!found) {
        const msg = `🦀 Route Point ${created} not found`;
        throw new Error(msg);
      }
    } else {
      const msg = `🦀 Landmark ${landmarkId} not found`;
      throw new Error(msg);
    }
  }
  public static async findRoutePointsByLocation(
    routeId: string,
    latitude: number,
    longitude: number,
    radiusInKM: number,
  ) {
    const routeModel = new Route().getModelForClass(Route);
    const RADIUS = radiusInKM * 1000;
    const route = await routeModel.find({
      "routePoints.position": {
        $near: {
          $geometry: {
            coordinates: [longitude, latitude],
            type: "Point",
          },
          $maxDistance: RADIUS,
        },
      },
    });
    if (!route) {
      throw new Error(`${routeId} route points not found`);
    }
  }

  public static async getRoute(routeID: string): Promise<any> {
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findByRouteID(routeID).exec();
    return route;
  }
}
