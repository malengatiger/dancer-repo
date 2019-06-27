import { Request, Response } from "express";
import { DispatchRecordHelper } from "../helpers/dispatch_record_helper";
import Util from "../util";

export class DispatchRecordExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n\n🏓🏓🏓🏓🏓    DispatchRecordExpressRoutes:  💙  setting up default DispatchRecord Routes routes ...`,
    );
    app
      .route("/addDispatchRecord")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  addDispatchRecord route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.addDispatchRecord(req.body);
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "addDispatchRecord failed");
        }
      });

    app
      .route("/findDispatchRecordsByLocation")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findDispatchRecordsByLocation route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findByLocation(
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseFloat(req.body.radiusInKM),
            // tslint:disable-next-line: radix
            parseInt(req.body.minutes),
          );

          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findDispatchRecordsByLocation failed");
        }
      });
    app
      .route("/findDispatchRecordsByVehicle")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findDispatchRecordsByVehicle route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findByVehicleId(
            req.body.vehicleId,
            parseInt(req.body.minutes),
          );

          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findDispatchRecordsByVehicle failed");
        }
      });
    app
      .route("/findAllDispatchRecordsByVehicle")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findDispatchRecordsByVehicle route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findAllByVehicleId(
            req.body.vehicleId,
          );

          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findDispatchRecordsByVehicle failed");
        }
      });

    app
      .route("/findDispatchRecordsByLandmark")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findDispatchRecordsByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findByLandmark(
            req.body.landmarkID,
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findDispatchRecordsByFromLandmark failed");
        }
      });

    app
      .route("/findDispatchRecordsByRoute")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findDispatchRecordsByRoute route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findByRoute(
            req.body.routeID,
            parseInt(req.body.minutes),
          );
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findDispatchRecordsByRoute failed");
        }
      });

    app
      .route("/findDispatchRecordsByMarshal")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findDispatchRecordsByUser route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findByMarshal(req.body.marshalId);
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findDispatchRecordsByMarshal failed");
        }
      });

    app
      .route("/findAllDispatchRecords")
      .post(async (req: Request, res: Response) => {
        const msg = `🏓  🏓  🏓  findAllDispatchRecords route picked   🌽 ${new Date().toISOString()}`;
        console.log(msg);
        try {
          const result = await DispatchRecordHelper.findAll(
            parseInt(req.body.minutes));
          res.status(200).json(result);
        } catch (e) {
          Util.sendError(res, e, "findAllDispatchRecords failed");
        }
      });
  }
}
