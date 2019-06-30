import { Request, Response } from "express";
import { CommuterArrivalLandmarkHelper } from '../helpers/commuter_arrival_helper';
import Util from "../util";

export class CommuterArrivalLandmarkExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    CommuterArrivalLandmarkExpressRoutes:  💙  setting up default home routes ...`,
    );
    app.route("/addCommuterArrivalLandmark").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  addCommuterArrivalLandmark route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.addCommuterArrivalLandmark(req.body);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "addCommuterArrivalLandmark failed");
      }
    });

    app.route("/findCommuterArrivalLandmarksByLocation").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.findByLocation(
          parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM),
          parseInt(req.body.minutes));
         
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterArrivalLandmarksByLocation failed");
      }
    });

    app.route("/findCommuterArrivalLandmarksByFromLandmark").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.findByFromLandmark(
          req.body.landmarkID, parseInt(req.body.minutes));
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterArrivalLandmarksByFromLandmark failed");
      }
    });

    app.route("/findCommuterArrivalLandmarksByToLandmark").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByToLandmark route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.findByToLandmark(
          req.body.landmarkID, parseInt(req.body.minutes));
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterArrivalLandmarksByToLandmark failed");
      }
    });

    app.route("/findCommuterArrivalLandmarksByRoute").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByRoute route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.findByRoute(
          req.body.routeID, parseInt(req.body.minutes));
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterArrivalLandmarksByRoute failed");
      }
    });

    app.route("/findCommuterArrivalLandmarksByUser").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.findByUser(
          req.body.user);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterArrivalLandmarksByUser failed");
      }
    });

    app.route("/findAllCommuterArrivalLandmarks").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findAllCommuterArrivalLandmarks route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterArrivalLandmarkHelper.findAll(
          parseInt(req.body.minutes));
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findAllCommuterArrivalLandmarks failed");
      }
    });
  }
}
