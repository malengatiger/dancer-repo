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

export class CommuterController {

  //CommuterRatingsAggregate
  public routes(app: any): void {
    console.log(
      `🏓🏓🏓🏓🏓    CommuterController:  💙  setting up default Commuter routes ...`,
    );
    app.route("/addCommuterRequest").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRequest requested `;
      console.log(msg);

      try {
        const comm : any= new CommuterRequest(req.body);
        const result0 = await comm.save();
        comm.commuterRequestId = result0._id;
        const result = await comm.save();
        log(result);
        res.status(200).json(result0);
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
        const commuterRequestId = req.body.commuterRequestId;
        const commReq: any = await CommuterRequest.findOne({commuterRequestId: commuterRequestId});
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
    app.route("/updateCommuterRequestAutoDetected").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 updateCommuterRequestAutoDetected requested `;
      console.log(msg);

      try {
        const commuterRequestId = req.body.commuterRequestId;
        const commReq: any = await CommuterRequest.findOne({commuterRequestId: commuterRequestId});
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
    app.route("/addCommuterRatingsAggregate").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRatingsAggregate requested `;
      console.log(msg);

      try {
        const result = new CommuterRatingsAggregate(req.body);
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
    app.route("/addCommuterArrivalLandmark").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterArrivalLandmark requested `;
      console.log(msg);

      try {
        const result = new CommuterArrivalLandmark(req.body);
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
    app.route("/addCommuterPickupLandmark").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterPickupLandmark requested `;
      console.log(msg);

      try {
        const result = new CommuterPickupLandmark(req.body);
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
        const landmarkId = req.body.landmarkId;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = CommuterPickupLandmark.find({
          fromLandmarkId: landmarkId,
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
        const landmarkId = req.body.landmarkId;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = CommuterArrivalLandmark.find({
          fromLandmarkId: landmarkId,
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
        const landmarkId = parseInt(req.body.landmarkId);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = CommuterStartingLandmark.find({
          landmarkId: landmarkId,
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
    app.route("/addCommuterStartingLandmark").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterStartingLandmark requested `;
      console.log(msg);

      try {
        const result = new CommuterStartingLandmark(req.body);
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
    app.route("/addCommuterRating").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRating requested `;
      console.log(msg);

      try {
        const result = new CommuterRating(req.body);
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
        const result0 = await panic.save();
        panic.commuterPanicId = result0._id;
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
        const fromLandmarkId = parseInt(req.body.fromLandmarkId);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({fromLandmarkId: fromLandmarkId, created: { $gt: cutOff },});
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
        const toLandmarkId = req.body.toLandmarkId;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({toLandmarkId: toLandmarkId, created: { $gt: cutOff },});
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
    app.route("/getCommuterRequestsByLocation").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCommuterRequestsByLocation requested `;
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
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByLocation failed'
          }
        )
      }
    });


  }
}