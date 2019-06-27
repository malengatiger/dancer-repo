import { Request, Response } from "express";
import { RouteHelper } from "../helpers/route_helper";
import Util from "../util";

export class RouteExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n\n🏓🏓🏓🏓🏓    RouteExpressRoutes: 💙  setting up default route routes ...`,
    );
    /////////
    app.route("/addRoute").post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /routes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = await RouteHelper.addRoute(
            req.body.name,
            req.body.associations,
            req.body.color,
          );
          console.log("about to return result from Helper ............");
          res.status(200).json({
            message: `🏓  🏓  route: ${req.body.name} :
            🏓  ${req.body.associationName}: 🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "addRoute failed");

        }
      });
      /////////
    app.route("/deleteRoutePoints").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /deleteRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await RouteHelper.deleteRoutePoints(
          req.body.routeID,
        );
        res.status(200).json({
          message: `🏓  🏓  route: ${req.body.routeID} points deleted :
           🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "deleteRoutePoints failed");

      }
    });
     /////////
    app.route("/getRoutes").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getRoutes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await RouteHelper.getRoutes();
        console.log("\n................ about to return result from Helper ............");
        console.log(result);
        res.status(200).json({
          message: `🏓  🏓  getRoutes OK :: 🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getRoutes failed");

      }
    });

  }
}
