import { Request, Response } from "express";
import CommuterRequest from "../models/commuter_request";
import log from '../log';
import moment from 'moment';
import CommuterArrivalLandmark from "../models/commuter_arrival_landmark";
import CommuterPickupLandmark from "../models/commuter_pickup_landmark";
import CommuterStartingLandmark from "../models/commuter_starting_landmark";
import CommuterRating from "../models/commuter_rating";
import CommuterPanic from "../models/commuter_panic";
import CommuterRatingsAggregate from "../models/commuter_ratings_aggregate";
import bodyParser = require("body-parser");
import uuid from 'uuid/v1';

export class CommuterController {

  //CommuterRatingsAggregate
  public routes(app: any): void {
    console.log(
      `🏓🏓🏓    CommuterController:  💙  setting up default Commuter routes ...`,
    );
    app.route("/addCommuterRequest").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRequest requested `;
      console.log(msg);

      try {
        const comm : any= new CommuterRequest(req.body);
        comm.commuterRequestID = uuid();
        comm.created = new Date().toISOString();
        const result = await comm.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterRequest failed'
          }
        )
      }
    });
    app.route("/updateCommuterRequestScanned").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 updateCommuterRequestScanned requested `;
      console.log(msg);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        const commReq: any = await CommuterRequest.findOne({commuterRequestID: commuterRequestID});
        if (!commReq) {
          throw new Error('CommuterRequest not found');
        }
        commReq.scanned = req.body.scanned;
        const result = await commReq.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 updateCommuterRequestScanned failed'
          }
        )
      }
    });
    app.route("/updateCommuterRequestVehicle").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 updateCommuterRequestVehicle requested `;
      console.log(msg);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        const commReq: any = await CommuterRequest.findOne({commuterRequestID: commuterRequestID});
        if (!commReq) {
          throw new Error('CommuterRequest not found');
        }
        commReq.vehicleID = req.body.vehicleID;
        commReq.vehicleReg = req.body.vehicleReg;
        const result = await commReq.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 updateCommuterRequestVehicle failed'
          }
        )
      }
    });
    app.route("/updateCommuterRequestAutoDetected").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 updateCommuterRequestAutoDetected requested `;
      console.log(msg);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        const commReq: any = await CommuterRequest.findOne({commuterRequestID: commuterRequestID});
        if (!commReq) {
          throw new Error('CommuterRequest not found');
        }
        commReq.autoDetected = req.body.autoDetected;
        const result = await commReq.save();
        log(result);

        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 updateCommuterRequestAutoDetected failed'
          }
        )
      }
    });
    app.route("/addCommuterRatingsAggregate").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRatingsAggregate requested `;
      console.log(msg);

      try {
        const c: any = new CommuterRatingsAggregate(req.body);
        c.commuterRatingsAggregateID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterRatingsAggregate failed'
          }
        )
      }
    });
    app.route("/addCommuterArrivalLandmark").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterArrivalLandmark requested `;
      console.log(msg);

      try {
        const c: any = new CommuterArrivalLandmark(req.body);
        c.commuterArrivalLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterArrivalLandmark failed'
          }
        )
      }
    });
    app.route("/addCommuterPickupLandmark").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterPickupLandmark requested `;
      console.log(msg);

      try {
        const c: any = new CommuterPickupLandmark(req.body);
        c.commuterPickupLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterPickupLandmark failed'
          }
        )
      }
    });
    app.route("/getCommuterPickupLandmarks").post(async(req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCommuterPickupLandmarks requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkID = req.body.landmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = CommuterPickupLandmark.find({
          fromLandmarkID: landmarkID,
          created: {$gt: cutOff}
        });
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterPickupLandmarks failed'
          }
        )
      }
    });
    app.route("/getCommuterArrivalLandmarks").post(async(req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCommuterArrivalLandmarks requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkID = req.body.landmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = CommuterArrivalLandmark.find({
          fromLandmarkID: landmarkID,
          created: {$gt: cutOff}
        });
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterArrivalLandmarks failed'
          }
        )
      }
    });
    app.route("/getCommuterStartingLandmarks").post(async(req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCommuterStartingLandmarks requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkID = parseInt(req.body.landmarkID);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = CommuterStartingLandmark.find({
          landmarkID: landmarkID,
          created: {$gt: cutOff}
        });
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterStartingLandmarks failed'
          }
        )
      }
    });
    app.route("/addCommuterStartingLandmark").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterStartingLandmark requested `;
      console.log(msg);

      try {
        const c: any = new CommuterStartingLandmark(req.body);
        c.commuterStartingLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterStartingLandmark failed'
          }
        )
      }
    });
    app.route("/addCommuterRating").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRating requested `;
      console.log(msg);

      try {
        const c: any = new CommuterRating(req.body);
        c.commuterRatingID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterRating failed'
          }
        )
      }
    });
    app.route("/addCommuterPanic").post(async(req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterPanic requested `;
      console.log(msg);

      try {
        const panic: any = new CommuterPanic(req.body);
        panic.commuterPanicID = uuid();
        panic.created = new Date().toISOString();
        const result = await panic.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterPanic failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByFromLandmark").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCommuterRequestsByFromLandmark requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const fromLandmarkID = parseInt(req.body.fromLandmarkID);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({fromLandmarkID: fromLandmarkID, created: { $gt: cutOff },});
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByFromLandmark failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByToLandmark").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCommuterRequestsByToLandmark requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const toLandmarkID = req.body.toLandmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({toLandmarkID: toLandmarkID, created: { $gt: cutOff },});
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByToLandmark failed'
          }
        )
      }
    });
    app.route("/findCommuterRequestsByLocation").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 findCommuterRequestsByLocation requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({
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
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findCommuterRequestsByLocation failed'
          }
        )
      }
    });


  }
}