import { Request, Response } from "express";
import { CommuterStartingLandmarkHelper } from "../helpers/commuter_starting_helper";
import Util from "../util";

export class CommuterStartingLandmarkExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    CommuterStartingLandmarkExpressRoutes:  💙  setting up CommuterStartingLandmark Express Route ...`,
    );
    app
      .route("/addCommuterStartingLandmark")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  addCommuterStartingLandmark route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterStartingLandmarkHelper.addCommuterStartingLandmark(
            req.body.landmarkId,
            req.body.latitude,
            req.body.longitude,
            req.body.userId,
            
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "addCommuterStartingLandmark failed");
        }
      });

    app
      .route("/findCommuterStartingLandmarksByLocation")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findCommuterStartingLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterStartingLandmarkHelper.findByLocation(
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
            "findCommuterStartingLandmarksByLocation failed",
          );
        }
      });

    app
      .route("/findCommuterStartingLandmarksByLandmark")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findCommuterStartingLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterStartingLandmarkHelper.findByLandmark(
            req.body.landmarkId,
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(
            res,
            e,
            "findCommuterStartingLandmarksByFromLandmark failed",
          );
        }
      });

    app
      .route("/findCommuterStartingLandmarksByUser")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findCommuterStartingLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterStartingLandmarkHelper.findByUser(
            req.body.userId,
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findCommuterStartingLandmarksByUser failed");
        }
      });

    app
      .route("/findAllCommuterStartingLandmarks")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓🏓🏓  findAllCommuterStartingLandmarks route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await CommuterStartingLandmarkHelper.findAll(
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findAllCommuterStartingLandmarks failed");
        }
      });
  }
}
