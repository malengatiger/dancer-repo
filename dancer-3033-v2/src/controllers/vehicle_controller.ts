import { Request, Response } from "express";
import log from '../log';
import Vehicle from "../models/vehicle";
import VehicleLocation from "../models/vehicle_location";
import VehicleArrival from "../models/vehicle_arrival";
import VehicleDeparture from "../models/vehicle_departure";
import moment from "moment";
import VehicleType from "../models/vehicle_type";
import uuid = require("uuid");

export class VehicleController {

  public routes(app: any): void {
    console.log(
      `🏓🏓🏓🏓🏓    VehicleController:  💙  setting up default Vehicle routes ...`,
    );
    app.route("/findVehiclesByLocation").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /findVehiclesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const now = new Date().getTime();
        
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
        const minutes = parseInt(req.body.minutes);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await VehicleLocation.find({
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
        //const result = await Landmark.find();
        log(result);
        const end = new Date().getTime();
        log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findVehiclesByLocation failed'
          }
        )
      }
    });
    app.route("/findVehicleArrivalsByLocation").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /findVehicleArrivalsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const now = new Date().getTime();
        const minutes = parseInt(req.body.minutes);
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
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
        log(result);
        const end = new Date().getTime();
        log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findVehicleArrivalsByLocation failed'
          }
        )
      }
    });
    app.route("/findVehicleDeparturesByLocation").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /findVehicleDeparturesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const now = new Date().getTime();
        const minutes = parseInt(req.body.minutes);
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
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
        log(result);
        const end = new Date().getTime();
        log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findVehicleDeparturesByLocation failed'
          }
        )
      }
    });
    app.route("/addVehicle").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicle requested `;
      console.log(msg);

      try {
        const c: any = new Vehicle(req.body);
        c.vehicleID = uuid();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addVehicle failed'
          }
        )
      }
    });
    app.route("/addVehicleArrival").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleArrival requested `;
      console.log(msg);

      try {
        const c: any = new VehicleArrival(req.body);
        c.vehicleArrivalID = uuid();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addVehicleArrival failed'
          }
        )
      }
    });
    app.route("/addVehicleDeparture").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleDeparture requested `;
      console.log(msg);

      try {
        const c: any = new VehicleDeparture(req.body);
        c.vehicleDepartureID = uuid();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addVehicleDeparture failed'
          }
        )
      }
    });
    app.route("/addVehicleLocation").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleLocation requested `;
      console.log(msg);

      try {
        const c: any = new VehicleLocation(req.body);
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addVehicleLocation failed'
          }
        )
      }
    });
    app.route("/addVehicleLog").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleLog requested `;
      console.log(msg);

      try {
        const vehicle: any = await Vehicle.findOne({ vehicleID: req.body.vehicleID });
        vehicle.vehicleLogs.push(req.body.vehicleLog);
        const result = await vehicle.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addVehicleLog failed'
          }
        )
      }
    });
    app.route("/addVehicleType").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleType requested `;
      console.log(msg);
      try {
        const vehicleType: any = new VehicleType(req.body);
        vehicleType.vehicleTypeID = uuid();
        const result = await vehicleType.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addVehicleType failed'
          }
        )
      }
    });
    app.route("/getVehicleTypes").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getVehicleTypes requested `;
      console.log(msg);
      try {
        const result = await VehicleType.find();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getVehicleTypes failed'
          }
        )
      }
    });
    app.route("/getVehiclesByOwner").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getVehiclesByOwner requested `;
      console.log(msg);
      try {
        const result = await Vehicle.find({ ownerID: req.body.ownerID });
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getVehiclesByOwner failed'
          }
        )
      }
    });
    app.route("/getVehiclesByAssociation").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getVehiclesByAssociation requested `;
      console.log(msg);
      try {
        const result = await Vehicle.find({ associationID: req.body.associationID });
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getVehiclesByAssociation failed'
          }
        )
      }
    });
  }
}