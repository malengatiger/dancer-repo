import { Request, Response } from "express";
import { RouteHelper } from "../helpers/route_helper";
import Util from "../util";
import Route from "../models/route";

export class RouteExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    RouteExpressRoutes: 💙  setting up default route routes ...`,
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
          req.body.color,
          req.body.associationID,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "addRoute failed");
      }
    });
    /////////
    app.route("/getRoutes").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getRoutes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await RouteHelper.getRoutes();
        console.log(result);
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "getRoutes failed");
      }
    });
    /////////
    app
      .route("/addRoutePoints")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /addRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = RouteHelper.addRoutePoints(
            req.body.routeId,
            req.body.routePoints,
            req.body.clear,
          );
          res.send(200).send(result);
        } catch (err) {
          Util.sendError(res, err, "addRoutePoints failed");
        }
      });
      ///////
    app
      .route("/addRawRoutePoints")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /addRawRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = RouteHelper.addRawRoutePoints(
            req.body.routeId,
            req.body.routePoints,
            req.body.clear,
          );
          res.send(200).send(result);
        } catch (err) {
          Util.sendError(res, err, "addRawRoutePoints failed");
        }
      });
      /////////
    app
      .route("/updateRoute")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /updateRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = RouteHelper.updateRoute(
            req.body.routeId,
            req.body.name,
            req.body.color,
          );
          res.send(200).send(result);
        } catch (err) {
          Util.sendError(res, err, "updateRoute failed");
        }
      });
    app
      .route("/updateRoutePoint")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /updateRoutePoint requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = RouteHelper.updateRoutePoint(
            req.body.routeId,
            req.body.created,
            req.body.landmarkId,
          );
          res.send(200).send(result);
        } catch (err) {
          Util.sendError(res, err, "updateRoutePoint failed");
        }
      });
    app
      .route("/findRoutePointsByLocation")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findRoutePointsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = RouteHelper.findRoutePointsByLocation(
            req.body.routeId,
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseFloat(req.body.radiusInKM),
          );
          res.send(200).send(result);
        } catch (err) {
          Util.sendError(res, err, "findRoutePointsByLocation failed");
        }
      });
  }
}
