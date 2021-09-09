import { Request, Response } from "express";
import CommuterRequest from "../models/commuter_request";
import { log, logGreen } from "../log";
import moment from "moment";
import CommuterArrivalLandmark from "../models/commuter_arrival_landmark";
import CommuterPickupLandmark from "../models/commuter_pickup_landmark";
import CommuterStartingLandmark from "../models/commuter_starting_landmark";
import CommuterRating from "../models/commuter_rating";
import CommuterPanic from "../models/commuter_panic";
import CommuterRatingsAggregate from "../models/commuter_ratings_aggregate";
import uuid from "uuid/v1";
import User from "../models/user";
import CommuterPanicLocation from "../models/commuter_panic_location";
import SafetyNetworkBuddy from "../models/safety_network_buddy";
import CommuterPrize from "../models/commuter_prize";
import CommuterIncentiveType from "../models/commuter_incentive_type";
import CommuterIncentive from "../models/commuter_incentive";
import CommuterFenceDwellEvent from "../models/commuter_fence_dwell_event";
import CommuterFenceExitEvent from "../models/commuter_fence_exit_event";
import Payment from "../models/payment";
import CommuterVehicleNearby from "../models/commuter_vehicle_nearby";
import Messaging from "../helpers/messaging";

export class CommuterController {
  public routes(app: any): void {
    console.log(
      `🏓    CommuterController:  💙  setting up default Commuter routes ...`
    );
    app
      .route("/addCommuterRequest")
      .post(async (req: Request, res: Response) => {
        try {
          const walletFlag = req.body.isWallet;

          const comm: any = new CommuterRequest(req.body);
          comm.commuterRequestID = uuid();
          comm.created = new Date().toISOString();
          comm.scanned = false;
          comm.autoDetected = false;
          if (walletFlag === true) {
            comm.isWallet = true;
          } else {
            comm.isWallet = false;
          }
          const result = await comm.save();
          // Messaging.sendCommuterRequest(result);
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterRequest failed",
          });
        }
      });
    app
      .route("/updateCommuterRequestScanned")
      .post(async (req: Request, res: Response) => {
        try {
          console.log(
            `🍎🍎🍎 request body, commuterRequestID: ${JSON.stringify(
              req.body.commuterRequestID
            )}`
          );
          const commuterRequestID = req.body.commuterRequestID;
          const commReq: any = await CommuterRequest.findOne({
            commuterRequestID: commuterRequestID,
          });

          if (!commReq) {
            throw new Error("CommuterRequest not found");
          } else {
            console.log(`🍎🍎🍎 request from db: ${JSON.stringify(commReq)}`);
          }
          // if (commReq.scanned === true) {
          //   logGreen('🥦🥦 CommuterRequest already scanned, 🥦 ignored')
          //   res.status(200).json(commReq);
          //   return
          // }
          commReq.scanned = true;
          const result = await commReq.save();
          const token = commReq.fcmToken;
          console.log(`🍎 🍎 🍎 token for commuterRequest: ${token}`);
          //send scanned messaged to commuter's device
          await Messaging.sendScannedResultToCommuter(
            token,
            commReq.commuterRequestID
          );

          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: `🍎 updateCommuterRequestScanned failed: ${err}`,
          });
        }
      });
    app.route("/addPayment").post(async (req: Request, res: Response) => {
      try {
        const comm: any = new Payment(req.body);
        comm.created = new Date().toISOString();
        const result = await comm.save();
        res.status(200).json(result);
      } catch (err) {
        log(err);
        res.status(400).json({
          error: err,
          message: " 🍎 addPayment failed",
        });
      }
    });
    app
      .route("/updateCommuterRequestVehicle")
      .post(async (req: Request, res: Response) => {
        try {
          const commuterRequestID = req.body.commuterRequestID;
          const commReq: any = await CommuterRequest.findOne({
            commuterRequestID: commuterRequestID,
          });
          if (!commReq) {
            throw new Error("CommuterRequest not found");
          }
          commReq.associationID = req.body.associationID;
          commReq.associationName = req.body.associationName;
          commReq.vehicleID = req.body.vehicleID;
          commReq.vehicleReg = req.body.vehicleReg;
          const result = await commReq.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 updateCommuterRequestVehicle failed",
          });
        }
      });
    app
      .route("/updateCommuterRequestAutoDetected")
      .post(async (req: Request, res: Response) => {
        try {
          const commuterRequestID = req.body.commuterRequestID;
          const commReq: any = await CommuterRequest.findOne({
            commuterRequestID: commuterRequestID,
          });
          if (!commReq) {
            throw new Error("CommuterRequest not found");
          }
          commReq.autoDetected = req.body.autoDetected;
          commReq.associationID = req.body.associationID;
          commReq.associationName = req.body.associationName;
          commReq.vehicleID = req.body.vehicleID;
          commReq.vehicleReg = req.body.vehicleReg;
          const result = await commReq.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 updateCommuterRequestAutoDetected failed",
          });
        }
      });
    app
      .route("/updateCommuterRequestExpired")
      .post(async (req: Request, res: Response) => {
        try {
          const commuterRequestID = req.body.commuterRequestID;
          const commReq: any = await CommuterRequest.findOne({
            commuterRequestID: commuterRequestID,
          });
          if (!commReq) {
            throw new Error("CommuterRequest not found");
          }
          commReq.expiredDate = new Date().toISOString();
          const result = await commReq.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `🍎 updateCommuterRequestExpired failed: ${err}`,
          });
        }
      });
    app
      .route("/addCommuterRatingsAggregate")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new CommuterRatingsAggregate(req.body);
          c.commuterRatingsAggregateID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterRatingsAggregate failed",
          });
        }
      });
    app
      .route("/addCommuterArrivalLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new CommuterArrivalLandmark(req.body);
          c.commuterArrivalLandmarkID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();
          Messaging.sendCommuterArrivalLandmark(result);
          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: JSON.stringify(err),
            message: " 🍎 addCommuterArrivalLandmark failed",
          });
        }
      });
    app
      .route("/addCommuterPickupLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new CommuterPickupLandmark(req.body);
          c.commuterPickupLandmarkID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();
          Messaging.sendCommuterPickupLandmark(result);
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterPickupLandmark failed",
          });
        }
      });
    app
      .route("/getCommuterPickupLandmarks")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const landmarkID = req.body.landmarkID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterPickupLandmark.find({
            fromLandmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterPickupLandmarks failed",
          });
        }
      });
    app
      .route("/getCommuterPickupByLandmarkIDs")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const landmarkIDs = req.body.landmarkIDs;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterPickupLandmark.find({
            fromLandmarkID: { $in: landmarkIDs },
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterPickupByLandmarkIDs failed",
          });
        }
      });
    app
      .route("/getCommuterArrivalLandmarks")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const landmarkID = req.body.landmarkID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterArrivalLandmark.find({
            fromLandmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
          log(`🍎 getCommuterArrivalLandmarks: found : 🍎 ${result.length} 🍎`);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterArrivalLandmarks failed",
          });
        }
      });
    app
      .route("/getCommuterArrivalByLandmarkIDs")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const landmarkIDs = req.body.landmarkIDs;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterArrivalLandmark.find({
            fromLandmarkID: { $in: landmarkIDs },
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterArrivalByLandmarkIDs failed",
          });
        }
      });

    app
      .route("/getCommuterStartingLandmarks")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const landmarkID = parseInt(req.body.landmarkID);
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterStartingLandmark.find({
            landmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterStartingLandmarks failed",
          });
        }
      });
    app
      .route("/findCommuterRequestByID")
      .post(async (req: Request, res: Response) => {
        try {
          const commuterRequestID = req.body.commuterRequestID;
          const result = await CommuterRequest.findOne({
            commuterRequestID: commuterRequestID,
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 findCommuterRequestByID failed",
          });
        }
      });
    app
      .route("/addCommuterStartingLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new CommuterStartingLandmark(req.body);
          c.commuterStartingLandmarkID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();

          res.status(200).json({
            result,
          });
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterStartingLandmark failed",
          });
        }
      });
    app
      .route("/addCommuterArrivalLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const c: any = new CommuterArrivalLandmark(req.body);
          c.commuterArrivalLandmarkID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();
          Messaging.sendCommuterArrivalLandmark(result);
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterArrivalLandmark failed",
          });
        }
      });
    app
      .route("/addCommuterRating")
      .post(async (req: Request, res: Response) => {
        try {
          const commuterRequest = await CommuterRequest.findOne({
            userID: req.body.userID,
          });

          if (commuterRequest != null) {
            const c: any = new CommuterRating({
              ...req.body,
              commuterRequestID: commuterRequest._id,
            });
            c.commuterRatingID = uuid();
            c.created = new Date().toISOString();
            const result = await c.save();

            res.status(200).json(result);
          } else {
            res.status(400).json({
              err: "Commuter request not found",
            });
          }
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterRating failed",
          });
        }
      });
    app
      .route("/addSafetyNetworkBuddy")
      .post(async (req: Request, res: Response) => {
        try {
          const buddy = new SafetyNetworkBuddy(req.body);
          const result = await buddy.save();
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 addSafetyNetworkBuddy failed",
          });
        }
      });
    app
      .route("/commuterClaimPrize")
      .post(async (req: Request, res: Response) => {
        try {
          const prize = new CommuterPrize(req.body);
          const result = await prize.save();
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 commuterClaimPrize failed",
          });
        }
      });
    app
      .route("/getIncentiveTypeByAssociation")
      .post(async (req: Request, res: Response) => {
        try {
          const incentiveType: any = await CommuterIncentiveType.findOne({
            associationID: req.body.associationID,
          });

          res.status(200).json(incentiveType);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getIncentiveTypeByAssociation failed",
          });
        }
      });
    app
      .route("/addCommuterIncentiveType")
      .post(async (req: Request, res: Response) => {
        try {
          const incentiveType: any = new CommuterIncentiveType(req.body);
          const result = await incentiveType.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterIncentiveType failed",
          });
        }
      });
    app
      .route("/addCommuterIncentive")
      .post(async (req: Request, res: Response) => {
        try {
          const incentiveType = await CommuterIncentiveType.findById(
            req.body.incentiveTypeID
          );
          if (incentiveType === null) {
            throw {
              message: "Incentive type not found",
            };
          }

          const user = await User.findOne({ userID: req.body.userID });
          if (user === null) {
            throw {
              message: "User type not found",
            };
          }
          const incentive: any = new CommuterIncentive({
            ...req.body,
            incentive: incentiveType,
            user: user,
          });
          const result = await incentive.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterIncentive failed",
          });
        }
      });
    app
      .route("/findSafetyNetworkBuddiesByUserID")
      .post(async (req: Request, res: Response) => {
        try {
          const buddies = await SafetyNetworkBuddy.find({
            userID: req.body.userID,
          });
          res.status(200).json(buddies);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 findSafetyNetworkBuddiesByUserID failed",
          });
        }
      });
    app
      .route("/addCommuterPanicLocation")
      .post(async (req: Request, res: Response) => {
        if (!req.body.commuterPanicID) {
          throw Error("panicID not present in call parameters");
        }
        if (!req.body.longitude) {
          throw Error("longitude not present in call parameters");
        }
        if (!req.body.longitude) {
          throw Error("longitude not present in call parameters");
        }
        try {
          const commuterPanic = await CommuterPanic.findById(
            req.body.commuterPanicID
          );

          if (commuterPanic) {
            const panicData: any = {
              position: {
                type: "Points",
                coordinates: [req.body.longitude, req.body.latitude],
              },
              commuterPanicID: req.body.commuterPanicID,
            };
            const panic: any = new CommuterPanicLocation(panicData);
            panic.created = new Date().toISOString();
            const result = await panic.save();
            res.status(200).json(result);
          } else {
            res.status(400).json({
              message: "addCommuterPanicLocation failed: commuterPanic",
            });
          }
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterPanicLocation failed",
          });
        }
      });
    app.route("/addCommuterPanic").post(async (req: Request, res: Response) => {
      try {
        const panic: any = new CommuterPanic(req.body);
        panic.created = new Date().toISOString();
        panic.updated = new Date().toISOString();
        panic.commuterPanicID = uuid();

        const result = await panic.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: err,
          message: " 🍎 addCommuterPanic failed",
        });
      }
    });
    app
      .route("/addCommuterFenceDwellEvent")
      .post(async (req: Request, res: Response) => {
        try {
          const event: any = new CommuterFenceDwellEvent(req.body);
          event.created = new Date().toISOString();
          event.commuterFenceEventID = uuid();

          const result = await event.save();
          log(result);
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterFenceDwellEvent failed",
          });
        }
      });
    app
      .route("/addCommuterFenceExitEvent")
      .post(async (req: Request, res: Response) => {
        try {
          const event: any = new CommuterFenceExitEvent(req.body);
          event.created = new Date().toISOString();
          event.commuterFenceEventID = uuid();

          const result = await event.save();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterFenceExitEvent failed",
          });
        }
      });
    app
      .route("/addCommuterVehicleNearby")
      .post(async (req: Request, res: Response) => {
        try {
          const event: any = new CommuterVehicleNearby(req.body);
          event.created = new Date().toISOString();
          const result = await event.save();
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addCommuterVehicleNearby failed",
          });
        }
      });
    app
      .route("/getCommuterPanicsByUserID")
      .post(async (req: Request, res: Response) => {
        try {
          const panics: any = await CommuterPanic.find({
            userID: req.body.userID,
          });

          res.status(200).json(panics);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterPanicsByUserID failed",
          });
        }
      });
    app
      .route("/getPanicLocations")
      .post(async (req: Request, res: Response) => {
        try {
          const panics: any = await CommuterPanicLocation.find({
            commuterPanicID: req.body.commuterPanicID,
          });

          res.status(200).json(panics);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getPanicLocations failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByUser")
      .post(async (req: Request, res: Response) => {
        try {
          const uid = req.body.userID;
          const result = (
            await CommuterRequest.find({ userID: uid })
          ).reverse();

          if (result == null || result.length == 0) {
            res.status(400).json({
              error: "CommuterRequest failed",
              message: "CommuterRequests not found",
            });
          }

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByUser failed",
          });
        }
      });
    app
      .route("/getCommuterFenceDwellEvents")
      .post(async (req: Request, res: Response) => {
        try {
          const landmarkID = req.body.landmarkID;
          const minutes = parseInt(req.body.minutes);
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterFenceDwellEvent.find({
            landmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          if (result == null) {
            res.status(400).json({
              error: "getCommuterFenceDwellEvents failed",
            });
          }

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterFenceDwellEvents failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const landmarkID = req.body.landmarkID;
          const minutes = parseInt(req.body.minutes);
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterRequest.find({
            fromLandmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          if (result == null) {
            res.status(400).json({
              error: "getCommuterRequestsByLandmark failed",
            });
          }

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByLandmark failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const routeID = req.body.routeID;
          const minutes = parseInt(req.body.minutes);
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterRequest.find({
            routeID: routeID,
            created: { $gt: cutOff },
          });

          if (result == null) {
            res.status(400).json({
              error: "getCommuterRequestsByRoute failed",
            });
          }

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByRoute failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByLandmarkIDs")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const landmarkIDs = req.body.landmarkIDs;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterRequest.find({
            fromLandmarkID: { $in: landmarkIDs },
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByLandmarkIDs failed",
          });
        }
      });
    app
      .route("/getCommuterFenceExitEvents")
      .post(async (req: Request, res: Response) => {
        try {
          const landmarkID = req.body.landmarkID;
          const minutes = parseInt(req.body.minutes);
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterFenceExitEvent.find({
            landmarkID: landmarkID,
            created: { $gt: cutOff },
          });

          if (result == null) {
            res.status(400).json({
              error: "getCommuterFenceExitEvents failed",
            });
          }

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterFenceExitEvents failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByID")
      .post(async (req: Request, res: Response) => {
        try {
          const id = req.body.commuterRequestID;
          const result = await CommuterRequest.findById(id);

          if (result == null) {
            res.status(400).json({
              error: "Commuter request not found",
              message: "Commuter request not found",
            });
          }

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByID failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByFromLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const fromLandmarkID = req.body.fromLandmarkID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterRequest.find({
            fromLandmarkID: fromLandmarkID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByFromLandmark failed",
          });
        }
      });
    app
      .route("/getCommuterRequestsByToLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const toLandmarkID = req.body.toLandmarkID;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterRequest.find({
            toLandmarkID: toLandmarkID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCommuterRequestsByToLandmark failed",
          });
        }
      });
    app
      .route("/findCommuterRequestsByUserID")
      .post(async (req: Request, res: Response) => {
        try {
          const uid = req.body.UID;
          const result = (
            await CommuterRequest.find({ userID: uid })
          ).reverse();

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 findCommuterRequestsByUserID failed",
          });
        }
      });
    app
      .route("/findCommuterRequestsByLocation")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = parseInt(req.body.minutes);
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = await CommuterRequest.find({
            position: {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
            },
            createdAt: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 findCommuterRequestsByLocation failed",
          });
        }
      });
  }
}
