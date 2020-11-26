import { Request, Response } from "express";
import CommuterRequest from "../models/commuter_request";
import {log} from '../log';
import moment from 'moment';
import CommuterArrivalLandmark from "../models/commuter_arrival_landmark";
import CommuterPickupLandmark from "../models/commuter_pickup_landmark";
import CommuterStartingLandmark from "../models/commuter_starting_landmark";
import CommuterRating from "../models/commuter_rating";
import CommuterPanic from "../models/commuter_panic";
import CommuterRatingsAggregate from "../models/commuter_ratings_aggregate";
import bodyParser = require("body-parser");
import uuid from 'uuid/v1';
import User from "../models/user";
import CommuterPanicLocation from "../models/commuter_panic_location";
import SafetyNetworkBuddy from "../models/safety_network_buddy";
import CommuterPrize from "../models/commuter_prize";
import CommuterIncentiveType from "../models/commuter_incentive_type";
import CommuterIncentive from "../models/commuter_incentive";
import CommuterFenceEvent from "../models/commuter_fence_dwell_event";
import CommuterFenceDwellEvent from "../models/commuter_fence_dwell_event";
import CommuterFenceExitEvent from "../models/commuter_fence_exit_event";
import Payment from "../models/payment";
import CommuterVehicleNearby from "../models/commuter_vehicle_nearby";
import Messaging from "../helpers/messaging";

export class CommuterController {

  public routes(app: any): void {
    console.log(
      `🏓    CommuterController:  💙  setting up default Commuter routes ...`,
    );
    app.route("/addCommuterRequest").post(async (req: Request, res: Response) => {
      const msg = `🌽 POST 🌽🌽 addCommuterRequest requested `;
      console.log(msg);

      try {
        const walletFlag = req.body.isWallet;
        
        const comm : any= new CommuterRequest(req.body);
        comm.commuterRequestID = uuid();
        comm.created = new Date().toISOString();
        comm.scanned = false;
        comm.autoDetected = false;
        if (walletFlag === true) {
          console.log(`about to set isWallet to true .....`);
          comm.isWallet = true;
          
        } else {
          console.log(`about to set isWallet to false .....`);
          comm.isWallet = false;
        }
        console.log(`stringWallet: ${walletFlag} .................... Check the incoming isWallet boolean below`);
        console.log(comm);
        const result = await comm.save();
        Messaging.sendCommuterRequest(result);
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
      const msg = `🌽 POST 🌽🌽 updateCommuterRequestScanned requested `;
      console.log(msg);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        console.log(`🍎🍎🍎incoming requestID: 🍎🍎🍎 ${commuterRequestID}`);
        
        const commReq: any = await CommuterRequest.findOne(
          {commuterRequestID: commuterRequestID});
        if (!commReq) {
          throw new Error('CommuterRequest not found');
        }
        console.log(commReq);
        commReq.scanned = true;
        const result = await commReq.save();
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 updateCommuterRequestScanned failed'
          }
        )
      }
    });
    app.route("/addPayment").post(async (req: Request, res: Response) => {
      const msg = `🌽 POST 🌽🌽 addPayment requested `;
      console.log(msg);
      console.log(req.body);

      try {
        const comm : any= new Payment(req.body);
        comm.created = new Date().toISOString();
        const result = await comm.save();
        res.status(200).json(result);
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addPayment failed'
          }
        )
      }
    });
    app.route("/updateCommuterRequestVehicle").post(async (req: Request, res: Response) => {
      const msg = `🌽 POST 🌽🌽 updateCommuterRequestVehicle requested `;
      console.log(msg);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        const commReq: any = await CommuterRequest.findOne({commuterRequestID: commuterRequestID});
        if (!commReq) {
          throw new Error('CommuterRequest not found');
        }
        commReq.associationID = req.body.associationID;
        commReq.associationName = req.body.associationName;
        commReq.vehicleID = req.body.vehicleID;
        commReq.vehicleReg = req.body.vehicleReg;
        const result = await commReq.save();
        // log(result);
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
      const msg = `🌽 POST 🌽🌽 updateCommuterRequestAutoDetected requested `;
      console.log(msg);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        const commReq: any = await CommuterRequest.findOne({commuterRequestID: commuterRequestID});
        if (!commReq) {
          throw new Error('CommuterRequest not found');
        }
        commReq.autoDetected = req.body.autoDetected;
        commReq.associationID = req.body.associationID;
        commReq.associationName = req.body.associationName;
        commReq.vehicleID = req.body.vehicleID;
        commReq.vehicleReg = req.body.vehicleReg;
        const result = await commReq.save();
        // log(result);

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
      const msg = `🌽 POST 🌽🌽 addCommuterRatingsAggregate requested `;
      console.log(msg);

      try {
        const c: any = new CommuterRatingsAggregate(req.body);
        c.commuterRatingsAggregateID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        // log(result);
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
      const msg = `🌽 POST 🌽🌽 addCommuterArrivalLandmark requested `;
      console.log(msg);

      try {
        const c: any = new CommuterArrivalLandmark(req.body);
        c.commuterArrivalLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        Messaging.sendCommuterArrivalLandmark(result);
        res.status(200).json(result);
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: JSON.stringify(err),
            message: ' 🍎🍎🍎🍎 addCommuterArrivalLandmark failed'
          }
        )
      }
    });
    app.route("/addCommuterPickupLandmark").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterPickupLandmark requested `;
      console.log(msg);

      try {
        const c: any = new CommuterPickupLandmark(req.body);
        c.commuterPickupLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        Messaging.sendCommuterPickupLandmark(result);
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
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterPickupLandmarks requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkID = req.body.landmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await CommuterPickupLandmark.find({
          fromLandmarkID: landmarkID,
          created: {$gt: cutOff}
        });
        // log(result);
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
    app.route("/getCommuterPickupByLandmarkIDs").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterPickupByLandmarkIDs requested `;
      console.log(msg);
      log(req.body);
    
      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkIDs = req.body.landmarkIDs;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await CommuterPickupLandmark.find({
        fromLandmarkID: {$in: landmarkIDs}, created: {$gt: cutOff}});
        // log(result);
        res.status(200).json(result);
        log(`🍎 getCommuterPickupByLandmarkIDs: found : 🍎 ${result.length} 🍎`)
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterPickupByLandmarkIDs failed'
          }
        )
      }
    });
    app.route("/getCommuterArrivalLandmarks").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterArrivalLandmarks requested `;
      console.log(msg);
      log(req.body);

      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkID = req.body.landmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await CommuterArrivalLandmark.find({
          fromLandmarkID: landmarkID,
          created: {$gt: cutOff}
        });
        // log(result);
        res.status(200).json(result);
        log(`🍎 getCommuterArrivalLandmarks: found : 🍎 ${result.length} 🍎`)
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterArrivalLandmarks failed'
          }
        )
      }
    });
    app.route("/getCommuterArrivalByLandmarkIDs").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterArrivalByLandmarkIDs requested `;
      console.log(msg);
      log(req.body);
    
      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkIDs = req.body.landmarkIDs;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await CommuterArrivalLandmark.find({
        fromLandmarkID: {$in: landmarkIDs}, created: {$gt: cutOff}});
        // log(result);
        res.status(200).json(result);
        log(`🍎 getCommuterArrivalByLandamrkIDs: found : 🍎 ${result.length} 🍎`)
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterArrivalByLandmarkIDs failed'
          }
        )
      }
    });
    //findCommuterRequestByID
    app.route("/getCommuterStartingLandmarks").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterStartingLandmarks requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkID = parseInt(req.body.landmarkID);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await CommuterStartingLandmark.find({
          landmarkID: landmarkID,
          created: {$gt: cutOff}
        });
        // log(result);
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
    app.route("/findCommuterRequestByID").post(async(req: Request, res: Response) => {
      const msg = `\n🌽 POST 🌽🌽 findCommuterRequestByID requested `;
      console.log(msg);
      console.log(req.body);

      try {
        const commuterRequestID = req.body.commuterRequestID;
        const result = await CommuterRequest.findOne({
          commuterRequestID: commuterRequestID,
        });
        
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findCommuterRequestByID failed'
          }
        )
      }
    });
    app.route("/addCommuterStartingLandmark").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterStartingLandmark requested `;
      console.log(msg);
      log(req.body)
      try {
        const c: any = new CommuterStartingLandmark(req.body);
        c.commuterStartingLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        
        res.status(200).json({
          result
        });
      } catch (err) {
        log(err)
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterStartingLandmark failed'
          }
        )
      }
    });
    app.route("/addCommuterArrivalLandmark").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterArrivalLandmark requested `;
      console.log(msg);

      try {
        const c: any = new CommuterArrivalLandmark(req.body);
        c.commuterArrivalLandmarkID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        Messaging.sendCommuterArrivalLandmark(result);
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
    app.route("/addCommuterRating").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterRating requested `;
      console.log(msg);

      try {
        const commuterRequest = await CommuterRequest.findOne({
          userID: req.body.userID
        })

        if (commuterRequest != null) {
          const c: any = new CommuterRating({
            ...req.body,
            commuterRequestID: commuterRequest._id
          });
          c.commuterRatingID = uuid();
          c.created = new Date().toISOString();
          const result = await c.save();
          // log(result);
          res.status(200).json(result);
        } else {
          res.status(400).json({
            err: 'Commuter request not found'
          })
        }
        
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterRating failed'
          }
        )
      }
    });
    app.route("/addSafetyNetworkBuddy").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addSafetyNetworkBuddy requested `;
      console.log(msg);

      try {
        const buddy = new SafetyNetworkBuddy(req.body)
          const result = await buddy.save();
          res.status(200).json(result);
        }

       catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addSafetyNetworkBuddy failed'
          }
        )
      }
    });
    app.route("/commuterClaimPrize").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 commuterClaimPrize requested `;
      console.log(msg);

      try {
        const prize = new CommuterPrize(req.body)
        const result = await prize.save();
          res.status(200).json(result);
      }
       catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 commuterClaimPrize failed'
          }
        )
      }
    });
    app.route("/getIncentiveTypeByAssociation").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getIncentiveTypeByAssociation requested `;
      console.log(msg);

      try {
        const incentiveType: any = await CommuterIncentiveType.findOne({
          associationID: req.body.associationID
        })
        // log(result);
        res.status(200).json(incentiveType);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getIncentiveTypeByAssociation failed'
          }
        )
      }
    });
    app.route("/addCommuterIncentiveType").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterIncentiveType requested `;
      console.log(msg);

      try {
        const incentiveType: any = new CommuterIncentiveType(req.body);
        const result = await incentiveType.save();
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterIncentiveType failed'
          }
        )
      }
    });
    app.route("/addCommuterIncentive").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterIncentive requested `;
      console.log(msg);

      try {
        const incentiveType = await CommuterIncentiveType.findById(req.body.incentiveTypeID)
        if (incentiveType === null) {
          throw {
            message: 'Incentive type not found'
          }
        }
        
        const user = await User.findOne({userID: req.body.userID})
        if (user === null) {
          throw {
            message: 'User type not found'
          }
        }
        const incentive: any = new CommuterIncentive({
          ...req.body,
          incentive: incentiveType,
          user: user
        });
        const result = await incentive.save();
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterIncentive failed'
          }
        )
      }
    });
    app.route("/findSafetyNetworkBuddiesByUserID").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 findSafetyNetworkBuddiesByUserID requested `;
      console.log(msg);

      try {
        const buddies = await SafetyNetworkBuddy.find({userID: req.body.userID})
          res.status(200).json(buddies);
        }

       catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findSafetyNetworkBuddiesByUserID failed'
          }
        )
      }
    });
    app.route("/addCommuterPanicLocation").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterPanicLocation requested `;
      console.log(msg);

      if (!req.body.commuterPanicID) {
        throw Error('panicID not present in call parameters')
      }
      if (!req.body.longitude) {
        throw Error('longitude not present in call parameters')
      }
      if (!req.body.longitude) {
        throw Error('longitude not present in call parameters')
      }
      try {
        const commuterPanic = await CommuterPanic.findById(req.body.commuterPanicID)

        if (commuterPanic) {
          const panicData: any = {
            position: {
              type: 'Points',
              coordinates: [
                req.body.longitude,
                req.body.latitude
              ]
            },
            commuterPanicID: req.body.commuterPanicID
          }
          const panic: any = new CommuterPanicLocation(panicData);
          panic.created = new Date().toISOString();
          const result = await panic.save();
          res.status(200).json(result);
        } else {
          res.status(400).json({
            message: 'addCommuterPanicLocation failed: commuterPanic'
          })
        }
        
        // log(result);
        
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterPanicLocation failed'
          }
        )
      }
    });
    app.route("/addCommuterPanic").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterPanic requested `;
      console.log(msg);

      try {
        const panic: any = new CommuterPanic(req.body);
        panic.created = new Date().toISOString();
        panic.updated = new Date().toISOString();
        panic.commuterPanicID = uuid();

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
    app.route("/addCommuterFenceDwellEvent").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterFenceDwellEvent requested `;
      console.log(msg);

      try {
        const event: any = new CommuterFenceDwellEvent(req.body);
        event.created = new Date().toISOString();
        event.commuterFenceEventID = uuid();

        const result = await event.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterFenceDwellEvent failed'
          }
        )
      }
    });
    app.route("/addCommuterFenceExitEvent").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterFenceExitEvent requested `;
      console.log(msg);

      try {
        const event: any = new CommuterFenceExitEvent(req.body);
        event.created = new Date().toISOString();
        event.commuterFenceEventID = uuid();

        const result = await event.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterFenceExitEvent failed'
          }
        )
      }
    });
    app.route("/addCommuterVehicleNearby").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 addCommuterVehicleNearby requested `;
      console.log(msg);
      console.log(req.body);
      try {
        const event: any = new CommuterVehicleNearby(req.body);
        event.created = new Date().toISOString();
        const result = await event.save();
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addCommuterVehicleNearby failed'
          }
        )
      }
    });
    app.route("/getCommuterPanicsByUserID").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterPanicsByUserID requested `;
      console.log(msg);

      try {
        const panics: any = await CommuterPanic.find({userID: req.body.userID})
        
        // log(result);
        res.status(200).json(panics);
      } catch (err) {
        console.log(err)
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterPanicsByUserID failed'
          }
        )
      }
    });
    app.route("/getPanicLocations").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getPanicLocations requested `;
      console.log(msg);

      try {
        const panics: any = await CommuterPanicLocation.find({commuterPanicID: req.body.commuterPanicID})
        
        // log(result);
        res.status(200).json(panics);
      } catch (err) {
        console.log(err)
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getPanicLocations failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByUserID").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByFromLandmark requested `;
      console.log(msg);

      try {
        const uid = req.body.firebaseUID;
        const result = (await  User.find({userID: uid})).reverse();

        if (result == null) {
          res.status(400).json({
            error: 'User not found',
            message: 'User not found'
          })
        }
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByUserID failed'
          }
        )
      }
    });
    app.route("/getCommuterFenceDwellEvents").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterFenceDwellEvents requested `;
      console.log(msg);

      try {
        const landmarkID = req.body.landmarkID;
        const minutes = parseInt(req.body.minutes);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterFenceDwellEvent.find(
          {landmarkID: landmarkID, created: {$gt: cutOff}}
          );

        if (result == null) {
          res.status(400).json({
            error: 'getCommuterFenceDwellEvents failed',
          })
        }
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterFenceDwellEvents failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByLandmark").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByLandmark requested `;
      console.log(msg);

      try {
        const landmarkID = req.body.landmarkID;
        const minutes = parseInt(req.body.minutes);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find(
          {fromLandmarkID: landmarkID, created: {$gt: cutOff}}
          );

        if (result == null) {
          res.status(400).json({
            error: 'getCommuterRequestsByLandmark failed',
          })
        }
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByLandmark failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByLandmarkIDs").post(async(req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByLandmarkIDs requested `;
      console.log(msg);
      log(req.body);
    
      try {
        const minutes = parseInt(req.body.minutes);
        const landmarkIDs = req.body.landmarkIDs;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await CommuterRequest.find({
        fromLandmarkID: {$in: landmarkIDs}, created: {$gt: cutOff}});
        // log(result);
        res.status(200).json(result);
        log(`🍎 getCommuterRequestsByLandmarkIDs: found : 🍎 ${result.length} 🍎`)
      } catch (err) {
        log(err);
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByLandmarkIDs failed'
          }
        )
      }
    });
    app.route("/getCommuterFenceExitEvents").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterFenceExitEvents requested `;
      console.log(msg);

      try {
        const landmarkID = req.body.landmarkID;
        const minutes = parseInt(req.body.minutes);
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterFenceExitEvent.find(
          {landmarkID: landmarkID, created: {$gt: cutOff}}
          );

        if (result == null) {
          res.status(400).json({
            error: 'getCommuterFenceExitEvents failed',
          })
        }
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterFenceExitEvents failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByID").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByID requested `;
      console.log(msg);

      try {
        const id = req.body.commuterRequestID;
        const result = await  CommuterRequest.findById(id);

        if (result == null) {
          res.status(400).json({
            error: 'Commuter request not found',
            message: 'Commuter request not found'
          })
        }
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByID failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByFromLandmark").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByFromLandmark requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const fromLandmarkID = req.body.fromLandmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({fromLandmarkID: fromLandmarkID, created: { $gt: cutOff },});
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        log(err)
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 getCommuterRequestsByFromLandmark failed'
          }
        )
      }
    });
    app.route("/getCommuterRequestsByToLandmark").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByToLandmark requested `;
      console.log(msg);

      try {
        const minutes = parseInt(req.body.minutes);
        const toLandmarkID = req.body.toLandmarkID;
        const cutOff: string = moment().subtract(minutes, "minutes").toISOString();
        const result = await  CommuterRequest.find({toLandmarkID: toLandmarkID, created: { $gt: cutOff },});
        // log(result);
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
    app.route("/findCommuterRequestsByUserID").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 findCommuterRequestsByUserID requested `;
      console.log(msg);

      try {
        const uid = req.body.UID;
        const result = (await  CommuterRequest.find({userID: uid})).reverse();
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 findCommuterRequestsByUserID failed'
          }
        )
      }
    });
    app.route("/findCommuterRequestsByLocation").post(async (req: Request, res: Response) => {
      const msg = `\n\n🌽 POST 🌽🌽 findCommuterRequestsByLocation requested `;
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
          },
          createdAt: { $gt: cutOff }
        });
        // log(result);
        res.status(200).json(result);
      } catch (err) {
        console.log(err)
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
