import { Request, Response } from "express";
import Landmark from "../models/landmark";
import db from "../database";
import { log } from "../log";
import Route from "../models/route";
import uuid = require("uuid");
import { Error, Types } from "mongoose";
import DistanceUtilNew from "../helpers/distance_util_new";
import City from "../models/city";
export class LandmarkController {
  public routes(app: any): void {
    log(
      `🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${db.name} 🥦🥦🥦`
    );
    /////////
    app.route("/getLandmarkByID").get(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getLandmarkByID requested `;
      console.log(msg);

      try {
        const c: any = await Landmark.findOne({
          landmarkID: req.query.landmarkID,
        });
        res.status(200).json(c);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: ` 🍎🍎🍎🍎 getLandmarkByID failed: ${err}`,
        });
      }
    });
    app
      .route("/addRouteToLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const routeID = req.body.routeID;
          const landmarkID = req.body.landmarkID;
          const index = req.body.index;
          const routeName = req.body.routeName;
          

          const route: any = await Route.findOne({
            routeID: routeID,
           });

          const landmark: any = await Landmark.findOne({
            landmarkID: landmarkID,
          });

          let isFound: boolean = false;
          landmark.routeDetails.forEach((element: any) => {
            if (element.routeID === routeID) {
              isFound = true;
            }
          });
          if (isFound) {
            res.status(200).json({
              message: `Route already listed in Landmark: ${landmark.landmarkID}`,
              landmark: landmark,
            });
            return;
          }
          landmark.routeDetails.push({
            routeID: routeID,
            name: routeName,
          });
          landmark.routePoints.push({
            routeID: routeID,
            name: routeName,
            index: index,
          });
          landmark.updated = new Date().toISOString();
          const result = await landmark.save();
          console.log(
            `🔆🔆🔆 addRouteToLandmark: ${landmark.landmarkName} updated with route:  💦 💦 ${routeName} 💦 💦`
          );
          
          await Route.updateOne(
            {
              _id: new Types.ObjectId(route.id),
              "routePoints.index": index,
            },
            {
              $set: {
                "routePoints.$.landmarkID": landmark.landmarkID,
                "routePoints.$.landmarkName": landmark.landmarkName,
                "routePoints.$.index": index,
              },
            }
          );
          console.log(
            `🔆🔆🔆 addRouteToLandmark: routePoint inside route updated. 🍎🍎🍎🍎 sweet!: 💙 `
          );
          res.status(200).json({
            message: `Route ${routeName} added to Landmark: ${result.landmarkName}:  `,
            landmark: result,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 addRouteToLandmark failed",
          });
        }
      });

    app
      .route("/addCitiesToAllLandmarks")
      .post(async (req: Request, res: Response) => {
        let cnt = 0;
        console.log(`💙 💙 💙 💙 💙  addCitiesToAllLandmarks started ...`);
        const start = new Date().getUTCMilliseconds();
        try {
          const landmarks = await Landmark.find().lean();
          landmarks.forEach(async (doc) => {
            const b = JSON.parse(JSON.stringify(doc));
            await addCities(b.landmarkID);
            cnt++;
          });
          const end = new Date().getUTCMilliseconds();
          console.log(
            `💙 💙 💙 💙 💙 ${
              (end - start) / 1000
            } seconds elapsed for addCitiesToAllLandmarks`
          );
          res.status(200).json({
            message: `💙 💙 💙 💙 💙 ${cnt} Landmarks with cities added`,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: `🍎🍎 addCitiesToAllLandmarks failed: ${err}`,
          });
        }
      });

    app
      .route("/addCitiesToLandmark")
      .post(async (req: Request, res: Response) => {
        if (!req.body.landmarkID) {
          throw new Error("fucking landmarkID is missing");
        }
        
        try {
          const result = await addCities(req.body.landmarkID);
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: `🍎🍎 addCitiesToLandmark failed: ${err}`,
          });
        }
      });

    async function addCities(landmarkID: String) {
      const landmark: any = await Landmark.findOne({
        landmarkID: landmarkID,
      });
      console.log(
        `😍 😍 😍 😍 adding cities to landmark: ${landmark.landmarkName}`
      );

      const pos = JSON.parse(JSON.stringify(landmark.position));
      const latitude = pos.coordinates[1];
      const longitude = pos.coordinates[0];
      const RADIUS = 3000;
      const cities = await City.find({
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

      landmark.cities = [];

      cities.forEach((city: any) => {
        landmark.cities.push(city);
      });

      landmark.updated = new Date().toISOString();
      const result = await landmark.save();

      log(
        `💛 💛 💛 💛 💙 cities added to landmark: 💙 ${landmark.landmarkName} 
        🍎 = ${result.cities.length} cities added! Yebo!!!: 💙 `
      );
      return result;
    }

    app
      .route("/findLandmarksByLocation")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /findLandmarksByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const result = await Landmark.find({
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
            `🔆🔆🔆 findLandmarksByLocation: elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for query: landmarks found: 🍎 ${result.length} 🍎`
          );
          if (result.length == 0) {
            res.status(400).json({
              message: "No Data Found",
            });
          } else {
            res.status(200).json(result);
          }
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findLandmarksByLocation failed",
          });
        }
      });

    app
      .route("/findLandmarksByLocationDate")
      .post(async (req: Request, res: Response) => {
        log(
          `\n\n💦  POST: /findLandmarksByLocationDate requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
        );
        console.log(req.body);
        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const date = req.body.date;
          const result = await Landmark.find({
            created: { $gt: date },
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
            `🔆🔆🔆 findLandmarksByLocationDate: elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query: landmarks found: 🍎 ${result.length} 🍎`
          );
          if (result.length == 0) {
            res.status(400).json({
              message: "No Data Found",
            });
          } else {
            res.status(200).json(result);
          }
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findLandmarksByLocationDate failed",
          });
        }
      });
    //
    app
      .route("/getLandmarksByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const result = await Landmark.find({
            "routeDetails.routeID": req.body.routeID,
          });
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 getLandmarksByRoute: elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query. found ${result.length} landmarks`
          );
         
          const list: any[] = [];
          result.forEach((r) => {
            list.push(r.toJSON());
          });
          if (list.length == 0) {
              res.status(400).json({
              message: "No Data Found",
            });
            return;
          }

          //const sorted = DistanceUtilNew.reorder(route?.toJSON(), list);
          res.status(200).json(list);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getLandmarks failed",
          });
        }
      });
    app
      .route("/getLandmarksByRoutes")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();

          log(`💦 💦 💦 💦 💦 💦 routeIDs: ☘️☘️ ${req.body.routeIDs} ☘️☘️`);
          const result = await Landmark.find({
            "routeDetails.routeID": { $in: req.body.routeIDs },
          });
          const end = new Date().getTime();
          log(
            `🔆🔆🔆 getLandmarksByRoutes: elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query. found ${result.length} landmarks`
          );

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getLandmarks failed",
          });
        }
      });

    app.route("/getLandmarks").post(async (req: Request, res: Response) => {
      try {
        const result = await Landmark.find();

        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 getLandmarks failed",
        });
      }
    });
    app.route("/addLandmark").post(async (req: Request, res: Response) => {
      try {
        console.log(req.body);
        const landmark: any = new Landmark(req.body);
        landmark.landmarkID = uuid();
        landmark.created = new Date().toISOString();

        const result = await landmark.save();
        await addCities(landmark.landmarkID);
        
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 addLandmark failed",
        });
      }
    });
  }
}

export default LandmarkController;
