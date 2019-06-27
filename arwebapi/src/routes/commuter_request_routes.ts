import { Request, Response } from "express";
import { CommuterRequestHelper } from './../helpers/commuter_request_helper';
import Util from "../util";

export class CommuterRequestExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n\n🏓🏓🏓🏓🏓    CommuterRequestExpressRoutes:  💙  setting up default CommuterRequest Routes ...`,
    );
    app.route("/addCommuterRequest").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  addCommuterRequest route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.addCommuterRequest(req.body);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "addCommuterRequest failed");
      }
    });

    app.route("/findCommuterRequestsByLocation").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  findCommuterRequestsByLocation route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.findByLocation(
          parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM),
// tslint:disable-next-line: radix
          parseInt(req.body.minutes));
         
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterRequestsByLocation failed");
      }
    });

    app.route("/findCommuterRequestsByFromLandmark").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  findCommuterRequestsByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.findByFromLandmark(
          req.body.landmarkID, req.body.minutes);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterRequestsByFromLandmark failed");
      }
    });

    app.route("/findCommuterRequestsByToLandmark").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  findCommuterRequestsByToLandmark route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.findByToLandmark(
          req.body.landmarkID, req.body.minutes);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterRequestsByToLandmark failed");
      }
    });

    app.route("/findCommuterRequestsByRoute").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  findCommuterRequestsByRoute route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.findByRoute(
          req.body.routeID, req.body.minutes);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterRequestsByRoute failed");
      }
    });

    app.route("/findCommuterRequestsByUser").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  findCommuterRequestsByUser route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.findByUser(
          req.body.user);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterRequestsByUser failed");
      }
    });

    app.route("/findAllCommuterRequests").post(async (req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  findAllCommuterRequests route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRequestHelper.findAll(
          req.body.minutes);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findAllCommuterRequests failed");
      }
    });
  }
}
