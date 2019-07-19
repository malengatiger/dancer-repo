import { Request, Response } from "express";
import CommuterRequest from "../models/commuter_request";
import log from '../log';
import CommuterArrivalLandmark from "../models/commuter_arrival_landmark";
import CommuterPickupLandmark from "../models/commuter_pickup_landmark";
import CommuterStartingLandmark from "../models/commuter_starting_landmark";
import CommuterRating from "../models/commuter_rating";
import CommuterPanic from "../models/commuter_panic";

export class CommuterController {

  public routes(app: any): void {
    console.log(
      `🏓🏓🏓🏓🏓    CommuterController:  💙  setting up default Commuter routes ...`,
    );
    app.route("/addCommuterRequest").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterRequest requested `;
      console.log(msg);

      try {
        const result = new CommuterRequest(req.body);
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
    app.route("/addCommuterPanic").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCommuterPanic requested `;
      console.log(msg);

      try {
        const result = new CommuterPanic(req.body);
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


  }
}