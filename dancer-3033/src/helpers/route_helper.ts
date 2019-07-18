import Association from "../models/association";
import Route from "../models/route";
import RoutePoint from "../models/route_point";
import Landmark from "../models/landmark";

const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const MongoClient = require('mongodb').MongoClient;
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
const client = new MongoClient(mongoConnectionString, { useNewUrlParser: true });
client.connect((err: any) => {
  console.log('are we connected ????');
  const collection: any = client.db("monitordb").collection("routes");
  console.log(`🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦 ${collection}`);
  // perform actions on the collection object
  //client.close();
});
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

    const ass: any = await assModel.findById(associationID).exec();
    if (ass) {
      list1.push(ass.associationID);
      list2.push({
        associationID: ass.associationID,
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
  public static async getRoutesByAssociation(associationID: string): Promise<any> {
    console.log(` 🌀 getRoutesByAssociation....   ${associationID}  🌀  🌀 `);

    try {
      const routeModel = new Route().getModelForClass(Route);
      const list = await routeModel.find({'associationIDs': associationID});
      return list;
    } catch (e) {
      console.log('wtf wtf wtf');
    }
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
