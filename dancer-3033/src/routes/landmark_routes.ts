import { Request, Response } from "express";
import { AssociationHelper } from "../helpers/association_helper";
import { LandmarkHelper } from "../helpers/landmark_helper";
import Util from "../util";
import { RouteHelper } from "../helpers/route_helper";

export class LandmarkExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    LandmarkExpressRoutes: 💙  setting up default landmark related express routes ...`,
    );

    app.route("/addLandmark").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.addLandmark(
          req.body.landmarkName,
          parseFloat(req.body.latitude),
          parseFloat(req.body.longitude),
          req.body.routeIDs,
          req.body.routeDetails,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "addLandmark failed");
      }
    });

    app.route("/findLandmarksByLocation").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /findLandmarksByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.findByLocation(
          parseFloat(req.body.latitude),
          parseFloat(req.body.longitude),
          parseFloat(req.body.radiusInKM),
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "findLandmarksByLocation failed");
      }
    });

    app.route("/addLandmarkRoute").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addLandmarkRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.addRoute(
          req.body.landmarkID,
          req.body.routeID,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "addLandmarkRoute failed");
      }
    });
    app.route("/getLandmarks").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getLandmarks requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await LandmarkHelper.findAll();
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "getLandmarks failed");
      }
    });
    app.route("/getRouteLandmarks").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getRouteLandmarks requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await LandmarkHelper.getRouteLandmarks(
          req.body.routeId,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "getRouteLandmarks failed");
      }
    });
    app.route("/getRoute").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await RouteHelper.getRoute(
          req.body.routeID,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "getRoute failed");
      }
    });

    app.route("/addRouteToLandmark").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addRouteToLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await LandmarkHelper.addRouteToLandmark(
          req.body.routeId,
          req.body.landmarkId,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "addRouteToLandmark failed");
      }
    });
    app.route("/addCityToLandmark").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addCityToLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await LandmarkHelper.addCityToLandmark(
          req.body.landmarkId,
          req.body.cityId,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "addCityToLandmark failed");
      }
    });
  }
}
