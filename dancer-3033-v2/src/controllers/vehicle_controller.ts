import { Request, Response } from "express";
import log from '../log';
import Vehicle from "../models/vehicle";
import VehicleLocation from "../models/vehicle_location";
import VehicleArrival from "../models/vehicle_arrival";
import VehicleDeparture from "../models/vehicle_departure";

export class VehicleController {

  public routes(app: any): void {
    console.log(
      `🏓🏓🏓🏓🏓    VehicleController:  💙  setting up default Vehicle routes ...`,
    );
    app.route("/addVehicle").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicle requested `;
      console.log(msg);

      try {
        const result = new Vehicle(req.body);
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
    app.route("/addVehicleArrival").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleArrival requested `;
      console.log(msg);

      try {
        const result = new VehicleArrival(req.body);
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
    app.route("/addVehicleDeparture").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleDeparture requested `;
      console.log(msg);

      try {
        const result = new VehicleDeparture(req.body);
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
    app.route("/addVehicleLocation").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addVehicleLocation requested `;
      console.log(msg);

      try {
        const result = new VehicleLocation(req.body);
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
        const vehicle: any = await Vehicle.findOne({vehicleId: req.body.vehicleId});
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
  }
}