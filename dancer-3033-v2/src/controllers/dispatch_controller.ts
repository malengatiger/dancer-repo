import { Request, Response } from "express";
import DispatchRecord from "../models/dispatch_record";
import { log } from '../log';
import moment from "moment";
import uuid = require("uuid");
import MarshalFenceDwellEvent from "../models/marshal_fence_dwell_event";
import MarshalFenceExitEvent from "../models/marshal_fence_exit_event";
import VehicleArrival from "../models/vehicle_arrival";

export class DispatchController {

  public routes(app: any): void {
    console.log(
      `🏓    DispatchController:  💙  setting up default Dispatch routes ...`,
    );
    app.route("/addDispatchRecord").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 DispatchController: ...........  💦  💦  💦  addDispatchRecord requested ........ `;
      console.log(msg);
      console.log(req.body);
      try {
        //validate main data elements
        if (!req.body.routeID) {
          const msg = 'DispatchController: 🍎🍎🍎🍎 Dispatch recording failed: Missing route info'
          console.error(msg)
          res.status(400).json(
            {
              message: msg
            }
          )
          return
        }
        if (!req.body.vehicleID) {
          const msg = 'DispatchController: 🍎🍎🍎🍎 Dispatch recording failed: Missing vehicle info'
          console.error(msg)
          res.status(400).json(
            {
              message: msg
            }
          )
          return
        }
        if (!req.body.landmarkID) {
          const msg = 'DispatchController: 🍎🍎🍎🍎 Dispatch recording failed: Missing landmark info'
          console.error(msg)
          res.status(400).json(
            {
              message: msg
            }
          )
          return
        }
        const c: any = new DispatchRecord(req.body);
        c.dispatchRecordID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        console.log('💦💦 DispatchController: 💦 Result of addDispatchRecord save operation ...... : ')
        console.log(result);
        // todo - use vehicleArrivalID to update the dispatched flag
        if (req.body.vehicleArrivalID) {
          const arrival: any = await VehicleArrival.findOne({ vehicleArrivalID: req.body.vehicleArrivalID })
          if (arrival) {
            arrival.dispatched = true;
            arrival.update();
            log(`🔆🔆 DispatchRecord has VehicleArrival updated 😍 dispatched = true 😍`)
          } else {
            log(`VehicleArrival not found; 🍎🍎🍎 was expected. This is an ERROR`)
          }
        } else {
          log(`🔆🔆DispatchRecord has NO VehicleArrivalID, ....... no need to update`)
        }

        res.status(200).json(result);
      } catch (err) {
        console.error('DispatchController: 💦 Dispatch recording failed', err)
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addDispatchRecord failed'
          }
        )
      }
    });
    app.route("/findDispatchRecordsByLocation").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 findDispatchRecordsByLocation requested `;
      log(msg);

      try {
        const now = new Date().getTime();
        const minutes = parseInt(req.body.minutes);
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await DispatchRecord.find({
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
        log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
        res.status(200).json(result);
        log(result);
        res.status(200).json(result);
      } catch (err) {
        log(err);
        console.log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findDispatchRecordsByLocation failed'
          }
        )
      }
    });
    app.route("/getDispatchRecordsByVehicle").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getDispatchRecordsByVehicle requested `;
      console.log(msg);

      try {
        const days = req.body.days;
        const cutOff: string = moment().subtract(days, "days").toISOString();
        const result = DispatchRecord.find({ vehicleID: req.body.vehicleID, created: { $gt: cutOff }, });
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getDispatchRecordsByVehicle failed'
          }
        )
      }
    });
    app.route("/getDispatchRecordsByLandmark").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getDispatchRecordsByLandmark requested `;
      console.log(msg);

      try {
        const days = req.body.days;
        const cutOff: string = moment().subtract(days, "days").toISOString();
        const result = DispatchRecord.find({ landmarkID: req.body.landmarkID, created: { $gt: cutOff }, });
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getDispatchRecordsByLandmark failed'
          }
        )
      }
    });
    app.route("/getDispatchRecordsByRoute").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getDispatchRecordsByRoute requested `;
      console.log(msg);

      try {
        const days = req.body.days;
        const cutOff: string = moment().subtract(days, "days").toISOString();
        const result = DispatchRecord.find({ routeID: req.body.routeID, created: { $gt: cutOff }, });
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getDispatchRecordsByRoute failed'
          }
        )
      }
    });
    app.route("/getDispatchRecordsByOwner").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getDispatchRecordsByOwner requested `;
      console.log(msg);

      try {
        const days = req.body.days;
        const cutOff: string = moment().subtract(days, "days").toISOString();
        const result = DispatchRecord.find({ ownerID: req.body.ownerID, created: { $gt: cutOff }, });
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getDispatchRecordsByVehicle failed'
          }
        )
      }
    });

    app.route("/addMarshalFenceDwellEvent").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addMarshalFenceDwellEvent requested `;
      console.log(msg);

      try {
        const event: any = new MarshalFenceDwellEvent(req.body);
        event.created = new Date().toISOString();
        event.marshalFenceEventID = uuid();

        const result = await event.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addMarshalFenceDwellEvent failed'
          }
        )
      }
    });
    app.route("/addMarshalFenceExitEvent").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addMarshalFenceExitEvent requested `;
      console.log(msg);

      try {
        const event: any = new MarshalFenceExitEvent(req.body);
        event.created = new Date().toISOString();
        event.marshalFenceEventID = uuid();
        const result = await event.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addMarshalFenceExitEvent failed'
          }
        )
      }
    });
  }
}