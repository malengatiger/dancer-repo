import Association from "../models/association";
import Route from "../models/route";
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
    route: Route,
  ): Promise<any> {

    const routeModel = new Route().getModelForClass(Route);
    const assModel = new Association().getModelForClass(Association);
    const list1: any[] = [];
    const list2: any[] = [];


    for (const id of route.associationIDs) {
      const ass = await assModel.findByAssociationId(id);
      if (ass) {
        list1.push(ass.associationId);
        list2.push({
          associationId: ass.associationId,
          associationName: ass.associationName,
        });
      }
    }

    if (!route.color) {
      route.color = "white";
    }
    const mRoute = new routeModel({
      associationDetails: list2,
      associationIDs: list1,
      color: route.color,
      name: route.name,
      routePoints: route.routePoints,
      rawRoutePoints: route.rawRoutePoints,
      calculatedDistances: route.calculatedDistances,
      routeID: route.routeID,
    });
    const m = await mRoute.save();
    if (!route.routeID) {
      m.routeID = m.id;
      await m.save();
    }
    console.log(
      `\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${route.name}  💙  💚  💛`,
    );
    return m;
  }

  public static async getRoutes(): Promise<any> {
    console.log(` 🌀 getRoutes find all routes in Mongo ....   c  🌀  🌀 `);
    const routeModel = new Route().getModelForClass(Route);
    const list = await routeModel.find();
    return list;
  }
}
