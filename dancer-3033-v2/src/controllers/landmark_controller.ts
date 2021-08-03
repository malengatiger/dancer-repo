import { Request, Response } from "express";
import Landmark from "../models/landmark";
import db from "../database";
import { log } from "../log";
import Route from "../models/route";
import uuid = require("uuid");
import { ObjectID } from "bson";
import { Error, Types } from "mongoose";
import chalk = require("chalk");
import DistanceUtil from "../helpers/distance_util";
import DistanceUtilNew from "../helpers/distance_util_new";
import City from "../models/city";
export class LandmarkController {
  public routes(app: any): void {
    log(
      `🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${db.name} 🥦🥦🥦`
    );
    /////////
    app
      .route("/addRouteToLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const now = new Date().getTime();
          const routeID = req.body.routeID;
          const landmarkID = req.body.landmarkID;
          const routePoint = req.body.routePoint;

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
            name: route.name,
          });
          const result = await landmark.save();
          console.log(
            `🔆🔆🔆 addRouteToLandmark: ${landmark.landmarkName} updated with route:  💦 💦 ${route.name} 💦 💦`
          );
          console.log(result.toJSON());
          await Route.updateOne(
            {
              _id: new Types.ObjectId(route.id),
              "routePoints.index": routePoint.index,
            },
            {
              $set: {
                "routePoints.$.landmarkID": landmark.landmarkID,
                "routePoints.$.landmarkName": landmark.landmarkName,
              },
            }
          );
          console.log(
            `🔆🔆🔆 addRouteToLandmark: routePoint inside route updated. 🍎🍎🍎🍎 sweet!: 💙 `
          );
          const end = new Date().getTime();
          res.status(200).json({
            message: `Route ${route.name} added to Landmark: ${result.landmarkName}:  `,
            landmark: result,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err.message,
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
            error: err.message,
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
        console.log(
          `😍 😍 😍 😍 addCitiesToLandmark: landmarkID: ${req.body.landmarkID}`
        );
        try {
          const result = await addCities(req.body.landmarkID);
          console.log(
            `😍 😍 😍 😍  🥦🥦🥦 addCitiesToLandmark: check landmark below:  🥦🥦🥦 `
          );
          console.log(JSON.stringify(result));
          res.status(200).json(result);
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err.message,
            message: `🍎🍎 addCitiesToLandmark failed: ${err}`,
          });
        }
      });

    function findCity(landmark: any, city: any) {
      landmark.cities.forEach((c: any) => {
        if (c.cityID == city.cityID) {
          return true;
        }
      });
      return false;
    }

    async function addCities(landmarkID: String) {
      //get cities near the landmark
      console.log(`😍 😍 😍 😍  addCities:  ... find landmark: ${landmarkID}`);
      const landmark: any = await Landmark.findOne({
        landmarkID: landmarkID,
      });
      console.log(
        `😍 😍 😍 😍 adding cities to landmark: ${landmark.landmarkName}`
      );
      console.log(
        `😍 😍 😍 😍 landmark position: ${JSON.stringify(landmark.position)}`
      );
      const pos = JSON.parse(JSON.stringify(landmark.position));
      console.log(
        `😍 😍 😍 😍 landmark coordinates: lat: ${pos.coordinates[1]} lng: ${pos.coordinates[0]}`
      );
      const now = new Date().getTime();
      const latitude = pos.coordinates[1];
      const longitude = pos.coordinates[0];
      const RADIUS = 5000;
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

      console.log(
        `💛 💛 💛 💛 ${cities.length} cities found around location: ${landmark.landmarkName}`
      );
      console.log(
        `💛 💛 💛 💛 current cities in landmark: ${landmark.cities.length}`
      );

      landmark.cities = [];

      cities.forEach((city: any) => {
        landmark.cities.push(city);
      });

      const result = await landmark.save();

      log(
        `💛 💛 💛 💛 💙 cities added to landmark: 💙 ${landmark.landmarkName} 💙  🍎 ${result.cities.length} cities! Yebo!!!: 💙 `
      );
      console.log(result);
      const end = new Date().getTime();

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
          res.status(200).json(result);
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
          const date = req.body.date
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
          res.status(200).json(result);
        } catch (err) {
          console.log(err)
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
          const route = await Route.findOne({
            routeID: req.body.routeID,
          });
          const list: any[] = [];
          result.forEach((r) => {
            list.push(r.toJSON());
          });

          const sorted = DistanceUtilNew.reorder(route?.toJSON(), list);
          res.status(200).json(sorted);
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
        const now = new Date().getTime();
        const result = await Landmark.find();
        const end = new Date().getTime();

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
        console.log(result);
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
