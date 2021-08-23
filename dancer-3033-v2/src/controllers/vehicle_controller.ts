import { Request, Response } from "express";
import { log } from "../log";
import Vehicle from "../models/vehicle";
import VehicleLocation from "../models/vehicle_location";
import VehicleArrival from "../models/vehicle_arrival";
import VehicleDeparture from "../models/vehicle_departure";
import moment from "moment";
import VehicleType from "../models/vehicle_type";
import uuid = require("uuid");
import VehicleRouteAssignment from "../models/vehicle_route_assignment";
import VehicleCommuterNearby from "../models/vehicle_commuter_nearby";
import Messaging from "../helpers/messaging";
import VehicleOccupancyRecord from "../models/vehicle_occupancy_record";

export class VehicleController {
  public routes(app: any): void {
    console.log(
      `🏓    VehicleController:  💙  setting up default Vehicle routes ...`
    );
    app
      .route("/addVehicleCommuterNearby")
      .post(async (req: Request, res: Response) => {
        try {
          const event: any = new VehicleCommuterNearby(req.body);
          event.created = new Date().toISOString();
          const result = await event.save();
          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 addVehicleCommuterNearby failed",
          });
        }
      });
    app
      .route("/findVehiclesByLocation")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /findVehiclesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();

          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const minutes = parseInt(req.body.minutes);
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          log(`🔆🔆🔆 cutoff time: 💙 ${cutOff} 💙`);
          const result = await VehicleLocation.find({
            created: { $gt: cutOff },
            position: {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
            },
          });
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for findVehiclesByLocation query. found 💙 ${
              result.length
            }`
          );
          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err.message,
            message: " 🍎🍎🍎🍎 findVehiclesByLocation failed",
          });
        }
      });
    app
      .route("/findVehicleArrivalsByLocation")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /findVehicleArrivalsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleArrival.find({
            position: {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
              created: { $gt: cutOff },
            },
          });
          // log(result);
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for query`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findVehicleArrivalsByLocation failed",
          });
        }
      });
    app
      .route("/getVehicleArrivalsByLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const landmarkID = req.body.landmarkID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleArrival.find({
            landmarkID: landmarkID,
            created: { $gt: cutOff },
          });
          const end = new Date().getTime();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getVehicleArrivalsByLandmark failed",
          });
        }
      });
    app
      .route("/getVehicleArrivalsByLandmarkIDs")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /getVehicleArrivalsByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const landmarkIDs = req.body.landmarkIDs;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleArrival.find({
            landmarkID: { $in: landmarkIDs },
            created: { $gt: cutOff },
          });
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for query. arrivals found: 🍎 ${result.length} 🍎`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getVehicleArrivalsByLandmarkIDs failed",
          });
        }
      });
    app
      .route("/getVehicleArrivalsByVehicle")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /getVehicleArrivalsByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const vehicleID = req.body.vehicleID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleArrival.find({
            vehicleID: vehicleID,
            created: { $gt: cutOff },
          });
          // log(result);
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for query. arrivals found: 🍎 ${result.length} 🍎`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getVehicleArrivalsByVehicle failed",
          });
        }
      });
    app
      .route("/getVehicleDeparturesByVehicle")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const vehicleID = req.body.vehicleID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleDeparture.find({
            vehicleID: vehicleID,
            created: { $gt: cutOff },
          });

          const end = new Date().getTime();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getVehicleDeparturesByVehicle failed",
          });
        }
      });
    app
      .route("/getVehicleDeparturesByLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const landmarkID = req.body.landmarkID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleDeparture.find({
            landmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          const end = new Date().getTime();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getVehicleArrivalsByLandmark failed",
          });
        }
      });
    app
      .route("/getVehicleDeparturesByLandmarkIDs")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const landmarkIDs = req.body.landmarkIDs;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleDeparture.find({
            landmarkID: { $in: landmarkIDs },
            created: { $gt: cutOff },
          });
          const end = new Date().getTime();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getVehicleDeparturesByLandmarkIDs failed",
          });
        }
      });
    app
      .route("/findVehicleDeparturesByLocation")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /findVehicleDeparturesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();
          const minutes = parseInt(req.body.minutes);
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await VehicleDeparture.find({
            position: {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
              created: { $gt: cutOff },
            },
          });
          // log(result);
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for query: found: 🍎 ${result.length} 🍎`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findVehicleDeparturesByLocation failed",
          });
        }
      });
    app.route("/addVehicle").post(async (req: Request, res: Response) => {
      try {
        const c: any = new Vehicle(req.body);
        c.vehicleID = uuid();
        c.created = new Date().toISOString();
        if (!req.body.assignments) {
          c.assignments = [];
        }
        const result = await c.save();

        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 addVehicle failed",
        });
      }
    });
    app
      .route("/addVehicleOccupancyRecord")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new VehicleOccupancyRecord(req.body);
          c.date = new Date().toISOString();
          const result = await c.save();

          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 addVehicleOccupancyRecord failed",
          });
        }
      });
    app
      .route("/updateVehicleOwner")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = Vehicle.findOne({ vehicleID: req.body.vehicleID });
          if (!c) {
            res.status(400).json({
              message: "🍎🍎🍎🍎 updateVehicleOwner failed. Vehicle not found",
            });
          }
          c.ownerID = req.body.ownerID;
          c.ownerName = req.body.ownerName;
          const result = await c.save();
          res.status(200).json({
            message: "vehicle owner updated",
          });
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 updateVehicleOwner failed",
          });
        }
      });
    app.route("/addVehiclePhoto").post(async (req: Request, res: Response) => {
      try {
        const c: any = Vehicle.findOne({ vehicleID: req.body.vehicleID });
        if (!c) {
          res.status(400).json({
            message: "🍎🍎🍎🍎 addVehiclePhoto failed. Vehicle not found",
          });
        }
        const photo = {
          url: req.body.url,
          comment: req.body.comment,
          created: new Date().toISOString(),
        };
        c.photos.push(photo);
        const result = await c.save();

        res.status(200).json({
          message: `vehicle photo added. photos: 🍎 ${c.photos.length}`,
        });
      } catch (err) {
        res.status(400).json({
          error: err,
          message: "🍎🍎🍎🍎 addVehiclePhoto failed",
        });
      }
    });
    app.route("/addVehicleVideo").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleVideo requested `;
      console.log(msg);

      try {
        const c: any = Vehicle.findOne({ vehicleID: req.body.vehicleID });
        if (!c) {
          res.status(400).json({
            message: "🍎🍎🍎🍎 addVehicleVideo failed. Vehicle not found",
          });
        }
        const video = {
          url: req.body.url,
          comment: req.body.comment,
          created: new Date().toISOString(),
        };
        c.videos.push(video);
        const result = await c.save();
        // log(result);
        res.status(200).json({
          message: `vehicle video added. videos: 🍎 ${c.photos.length}`,
        });
      } catch (err) {
        res.status(400).json({
          error: err,
          message: "🍎🍎🍎🍎 addVehicleVideo failed",
        });
      }
    });
    app
      .route("/addVehicleArrival")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new VehicleArrival(req.body);
          c.vehicleArrivalID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();

          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 addVehicleArrival failed",
          });
        }
      });
    app
      .route("/addVehicleRouteAssignment")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new VehicleRouteAssignment(req.body);
          c.routeAssignmentID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();
          const assignments = await VehicleRouteAssignment.find({
            vehicleID: req.body.vehicleID,
          });
          res.status(200).json(assignments);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 addVehicleRouteAssignment failed",
          });
        }
      });
    app
      .route("/addVehicleDeparture")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new VehicleDeparture(req.body);
          c.vehicleDepartureID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();
          // Messaging.sendVehicleDeparture(result);
          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 addVehicleDeparture failed",
          });
        }
      });
    app
      .route("/addVehicleLocation")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new VehicleLocation(req.body);
          c.created = new Date().toISOString();
          const result = await c.save();
          console.log(
            `💙 💙 .... Added vehicle location: ${
              req.body.vehicleReg
            } : at: ${new Date()}`
          );
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 addVehicleLocation failed",
          });
        }
      });
    app.route("/addVehicleType").post(async (req: Request, res: Response) => {
      try {
        const vehicleType: any = new VehicleType(req.body);
        vehicleType.vehicleTypeID = uuid();
        const result = await vehicleType.save();

        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: "🍎🍎🍎🍎 addVehicleType failed",
        });
      }
    });
    app.route("/getVehicleTypes").post(async (req: Request, res: Response) => {
      try {
        const result = await VehicleType.find();
        log(`🌽🌽🌽 getVehicleTypes  found: ${result.length}`);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: "🍎🍎🍎🍎 getVehicleTypes failed",
        });
      }
    });
    app.route("/getVehicles").post(async (req: Request, res: Response) => {
      try {
        const result = await Vehicle.find();
        log(`🌽🌽🌽 getVehicles  found: ${result.length}`);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: "🍎🍎🍎🍎 getVehicles failed",
        });
      }
    });
    app
      .route("/getVehiclesByOwner")
      .post(async (req: Request, res: Response) => {
        try {
          const result = await Vehicle.find({ ownerID: req.body.ownerID });
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎 getVehiclesByOwner failed",
          });
        }
      });
    app
      .route("/getVehiclesByAssociation")
      .post(async (req: Request, res: Response) => {
        try {
          const result = await Vehicle.find({
            associationID: req.body.associationID,
          });
          log(
            `🌽 getVehiclesByAssociation vehicles found: ${result.length} cars`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎 getVehiclesByAssociation failed",
          });
        }
      });
    app
      .route("/getLatestVehiclesByAssociation")
      .post(async (req: Request, res: Response) => {
        const startDate: any = req.body.startDate;
        const associationID: any = req.body.associationID;
        try {
          const result = await Vehicle.find({
            associationID: associationID,
            created: { $gt: startDate },
          });
          log(
            `🌽 getLatestVehiclesByAssociation vehicles found: ${result.length}`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎 getLatestVehiclesByAssociation failed",
          });
        }
      });
    app
      .route("/getUpdatedVehiclesByAssociation")
      .post(async (req: Request, res: Response) => {
        const startDate: any = req.body.startDate;
        const associationID: any = req.body.associationID;
        try {
          const result = await Vehicle.find({
            associationID: associationID,
            updated: { $gt: startDate },
          });
          log(
            `🌽 getUpdatedVehiclesByAssociation vehicles found: ${result.length}`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎 getUpdatedVehiclesByAssociation failed",
          });
        }
      });
    app
      .route("/getVehicleRoutesByAssociation")
      .post(async (req: Request, res: Response) => {
        try {
          const days = parseInt(req.body.days);
          const cutOff: string = moment().subtract(days, "days").toISOString();
          const result = await VehicleRouteAssignment.find({
            associationID: req.body.associationID,
          });
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 getVehicleRoutesByAssociation failed",
          });
        }
      });
    app
      .route("/getVehicleRoutesByVehicle")
      .post(async (req: Request, res: Response) => {
        try {
          const result = await VehicleRouteAssignment.find({
            vehicleID: req.body.vehicleID,
          });
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 getVehicleRoutesByVehicle failed",
          });
        }
      });
    app
      .route("/getVehicleOccupancyRecordsByVehicle")
      .post(async (req: Request, res: Response) => {
        try {
          const days = req.body.days;
          const cutOff: string = moment().subtract(days, "days").toISOString();
          const result = await VehicleOccupancyRecord.find({
            vehicleID: req.body.vehicleID,
            date: { $gt: cutOff },
          });
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 getVehicleOccupancyRecordsByVehicle failed",
          });
        }
      });
    app
      .route("/getVehicleOccupancyRecordsByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const days = req.body.days;
          const cutOff: string = moment().subtract(days, "days").toISOString();
          const result = await VehicleOccupancyRecord.find({
            routeID: req.body.routeID,
            date: { $gt: cutOff },
          });
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 getVehicleOccupancyRecordsByRoute failed",
          });
        }
      });
    app
      .route("/getVehicleOccupancyRecordsByLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const days = req.body.days;
          const cutOff: string = moment().subtract(days, "days").toISOString();
          const result = await VehicleOccupancyRecord.find({
            landmarkID: req.body.landmarkID,
            date: { $gt: cutOff },
          });
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎🍎🍎 getVehicleOccupancyRecordsByLandmark failed",
          });
        }
      });
  }
}
