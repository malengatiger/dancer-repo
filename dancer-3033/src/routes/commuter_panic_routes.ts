import { Request, Response } from "express";
import { CommuterPanicHelper } from '../helpers/commuter_panic_helper';
import Util from "../util";

export class CommuterPanicExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    CommuterPanicExpressRoutes:  💙  setting up CommuterPanic Express Routes  ...`,
    );
    app.route("/addCommuterPanic").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  addCommuterPanic route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.addCommuterPanic(
          req.body.active,
          req.body.type,
          req.body.userId,
          parseFloat(req.body.latitude),
          parseFloat(req.body.longitude),
          req.body.vehicleId,
          req.body.vehicleReg,
        );
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "addCommuterPanic failed");
      }
    });

    app.route("/addCommuterPanicLocation").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  addCommuterPanicLocation route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.addCommuterPanicLocation(
          req.body.commuterPanicId,
          parseFloat(req.body.latitude),
          parseFloat(req.body.longitude),
          );
         
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "addCommuterPanicLocation failed");
      }
    });

    app.route("/updateCommuterPanicActive").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  updateCommuterPanicActive route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.updateCommuterPanicActive(
          req.body.active,
          req.body.commuterPanicId);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "updateCommuterPanicActive failed");
      }
    });

    app.route("/findByUserId").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findByUserId route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.findByUserId(
          req.body.userID);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findByUserId failed");
      }
    });

    app.route("/findByPanicId").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findByPanicId route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.findByPanicId(
          req.body.commuterPanicId);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findByPanicId failed");
      }
    });

    app.route("/findAllPanicsWithinMinutes").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findAllPanicsWithinMinutes route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.findAllPanicsWithinMinutes(
          parseInt(req.body.minutes));
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findAllPanicsWithinMinutes failed");
      }
    });

    app.route("/findAllPanics").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findAllPanics route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterPanicHelper.findAllPanics();
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findAllPanics failed");
      }
    });
  }
}
