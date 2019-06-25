import { Request, Response } from "express";
import { AssociationHelper } from "../helpers/association_helper";
import { LandmarkHelper } from "../helpers/landmark_helper";
import Util from "./util";

export class LandmarkExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    LandmarkExpressRoutes: 💙  setting up default landmark related express routes ...`,
    );

    app.route("/addLandmark").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.addLandmark(
          req.body.landmarkName,
          req.body.latitude,
          req.body.longitude,
          req.body.routeIDs,
          req.body.routeDetails,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  landmark: ${req.body.name} : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
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
        res.status(200).json({
          message: `🏓  🏓  🏓  findLandmarksByLocation: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
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
        res.status(200).json({
          message: `🏓  🏓  🏓  addLandmarkRoute: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
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
        res.status(200).json({
          message: `🏓  🏓  🏓  getLandmarks: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getLandmarks failed");
      }
    });

  }
}
