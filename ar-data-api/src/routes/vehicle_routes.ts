import { Request, Response } from "express";
import { VehicleHelper } from "../helpers/Vehicle_helper";
import Util from "./util";

export class VehicleExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    VehicleExpressRoutes: 💙  setting up default Vehicle related express routes ...`,
    );

    app.route("/addVehicle").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.addVehicle(
          req.body.vehicleReg,
          req.body.associationID,
          req.body.associationName,
          req.body.ownerID,
          req.body.ownerName,
          req.body.vehicleTypeID,
          req.body.photos,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addVehicle: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "addVehicle failed");
      }
    });
    app.route("/addVehicleArrival").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addVehicleArrival requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.addVehicleArrival(
          req.body.vehicleReg,
          req.body.vehicleId,
          req.body.landmarkName,
          req.body.landmarkId,
          req.body.latitude,
          req.body.longitude,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addVehicleArrival: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "addVehicleArrival failed");
      }
    });
    app.route("/addVehicleDeparture").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addVehicleDeparture requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.addVehicleDeparture(
          req.body.vehicleReg,
          req.body.vehicleId,
          req.body.landmarkName,
          req.body.landmarkId,
          req.body.latitude,
          req.body.longitude,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addVehicleDeparture: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "addVehicleDeparture failed");
      }
    });
    app.route("/addVehicleType").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addVehicleType requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.addVehicleType(
          req.body.make,
          req.body.model,
          req.body.capacity,
          req.body.countryID,
          req.body.countryName,
        );
        res.status(200).json({
          message: `🏓  🏓  addVehicleType: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "addVehicleType failed");
      }
    });
    //
    app.route("/findVehiclesByLocation").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getVehiclesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.findVehiclesByLocation(
          req.body.latitude,
          req.body.longitude,
          req.body.withinMinutes,
          req.body.radiusInKM,

        );
        res.status(200).json({
          message: `🏓  🏓  🏓  getVehiclesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "findVehiclesByLocation failed");
      }
    });
    app.route("/getVehiclesByAssociation").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getVehiclesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.getVehiclesByAssociation(
          req.body.associationID,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addVehicle: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getVehiclesByAssociation failed");
      }
    });
    app.route("/getVehiclesByOwner").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getVehiclesByOwner requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.getVehiclesByOwner(
          req.body.ownerID,
        );
        res.status(200).json({
          message: `🏓  🏓 getVehiclesByOwner: ${req.body.ownerID} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getVehiclesByOwner failed");
      }
    });
    app.route("/getAllVehicles").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getAllVehicles requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await VehicleHelper.getVehicles();
        res.status(200).json({
          message: `🏓  🏓 getAllVehicles OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err, "getAllVehicles failed");
      }
      });
    app.route("/findVehicleArrivalsByLocation").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findVehicleArrivalsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findVehicleArrivalsByLocation(
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseInt(req.body.minutes),
            parseFloat(req.body.radiusInKM),
          );
          res.status(200).json({
            message: `🏓  🏓 findVehicleArrivalsByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findVehicleArrivalsByLocation failed");
        }
      });
    app.route("/findVehicleDeparturesByLocation").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findVehicleDeparturesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findVehicleDeparturesByLocation(
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseInt(req.body.minutes),
            parseFloat(req.body.radiusInKM),
          );
          res.status(200).json({
            message: `🏓  🏓 findVehicleDeparturesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findVehicleDeparturesByLocation failed");
        }
      });
    
    app.route("/findVehicleArrivalsByLandmark").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findVehicleArrivalsByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findVehicleArrivalsByLandmark(
            req.body.landmarkId,
            parseInt(req.body.minutes),
          );
          res.status(200).json({
            message: `🏓  🏓 findVehicleArrivalsByLandmark OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findVehicleArrivalsByLandmark failed");
        }
      });
    
    app.route("/findVehicleDeparturesByLandmark").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findVehicleDeparturesByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findVehicleDeparturesByLandmark(
            req.body.landmarkId,
            parseInt(req.body.minutes),
          );
          res.status(200).json({
            message: `🏓  🏓 findVehicleDeparturesByLandmark OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findVehicleDeparturesByLandmark failed");
        }
      });
    app.route("/findVehicleArrivalsByVehicle").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findVehicleArrivalsByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findVehicleArrivalsByVehicle(
            req.body.vehicleId,
            parseInt(req.body.minutes),
          );
          res.status(200).json({
            message: `🏓  🏓 findVehicleArrivalsByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findVehicleArrivalsByVehicle failed");
        }
      });
    
    app.route("/findVehicleDeparturesByVehicle").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findVehicleDeparturesByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findVehicleDeparturesByVehicle(
            req.body.vehicleId,
            parseInt(req.body.minutes),
          );
          res.status(200).json({
            message: `🏓  🏓 findVehicleDeparturesByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findVehicleDeparturesByVehicle failed");
        }
      });

    app.route("/findAllVehicleArrivalsByVehicle").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findAllVehicleArrivalsByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findAllVehicleArrivalsByVehicle(
            req.body.vehicleId,
          );
          res.status(200).json({
            message: `🏓  🏓 findAllVehicleArrivalsByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findAllVehicleArrivalsByVehicle failed");
        }
      });
    
    app.route("/findAllVehicleDeparturesByVehicle").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findAllVehicleDeparturesByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findAllVehicleDeparturesByVehicle(
            req.body.vehicleId,
          );
          res.status(200).json({
            message: `🏓  🏓 findAllVehicleDeparturesByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findAllVehicleDeparturesByVehicle failed");
        }
      });
    
    app.route("/findAllVehicleArrivals").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findAllVehicleArrivals requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findAllVehicleArrivals(
            parseInt(req.body.minutes),
          );
          res.status(200).json({
            message: `🏓  🏓 findAllVehicleArrivals OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findAllVehicleArrivals failed");
        }
      });
    
    app.route("/findAllVehicleDepartures").post(
        async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findAllVehicleDepartures requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        try {
          const result = await VehicleHelper.findAllVehicleDepartures(
            parseInt(req.body.minutes),
          );
          res.status(200).json({
            message: `🏓  🏓 findAllVehicleDepartures OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err, "findAllVehicleDepartures failed");
        }
      });
  }
}
