import { Request, Response } from "express";
import { CommuterPickupLandmarkHelper } from "../helpers/commuter_pickup_helper";
import Util from "../util";

export class CommuterPickupLandmarkExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n\n🔆🔆🔆🔆🔆    CommuterPickupLandmarkExpressRoutes:  💙  setting up default home routes ...`,
    );
    app
      .route("/addCommuterPickupLandmark")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  addCommuterPickupLandmark route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.addCommuterPickupLandmark(
            req.body.commuterRequestId,
            req.body.fromLandmarkId,
            req.body.toLandmarkId,
            req.body.fromLandmarkName,
            req.body.toLandmarkName,
            req.body.latitude,
            req.body.longitude,
            req.body.vehicleId,
            req.body.vehicleReg,
            req.body.userId,
            req.body.routeId,
            req.body.routeName,
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "addCommuterPickupLandmark failed");
        }
      });

    app
      .route("/findCommuterPickupLandmarksByLocation")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findCommuterPickupLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.findByLocation(
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseFloat(req.body.radiusInKM),
            parseInt(req.body.minutes),
          );

          res.status(200).json(result);
        } catch (e) {
          Util.sendError(
            res,
            e,
            "findCommuterPickupLandmarksByLocation failed",
          );
        }
      });

    app
      .route("/findCommuterPickupLandmarksByFromLandmark")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓  findCommuterPickupLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.findByFromLandmark(
            req.body.landmarkID,
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(
            res,
            e,
            "findCommuterPickupLandmarksByFromLandmark failed",
          );
        }
      });

    app
      .route("/findCommuterPickupLandmarksByToLandmark")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findCommuterPickupLandmarksByToLandmark route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.findByToLandmark(
            req.body.landmarkID,
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(
            res,
            e,
            "findCommuterPickupLandmarksByToLandmark failed",
          );
        }
      });

    app
      .route("/findCommuterPickupLandmarksByRoute")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findCommuterPickupLandmarksByRoute route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.findByRoute(
            req.body.routeID,
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findCommuterPickupLandmarksByRoute failed");
        }
      });

    app
      .route("/findCommuterPickupLandmarksByUser")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findCommuterPickupLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.findByUser(
            req.body.user,
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findCommuterPickupLandmarksByUser failed");
        }
      });

    app
      .route("/findAllCommuterPickupLandmarks")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findAllCommuterPickupLandmarks route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterPickupLandmarkHelper.findAll(
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findAllCommuterPickupLandmarks failed");
        }
      });
  }
}
