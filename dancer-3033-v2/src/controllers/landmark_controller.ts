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
    console.log(
      `🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${db.name} 🥦🥦🥦`
    );
    /////////
    app.route("/getLandmarkByID").get(async (req: Request, res: Response) => {
      

      try {
        const c: any = await Landmark.findOne({
          landmarkID: req.query.landmarkID,
        });
        res.status(200).json(c);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: ` 🍎 getLandmarkByID failed: ${err}`,
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

          const landmark: any = await Landmark.findOne({
            landmarkID: landmarkID,
          });
          const route: any = await Route.findOne({
            routeID: routeID,
          });
          
          console.log(`addRouteToLandmark: Route mongodb id: ${route.id} `)
          const id = route.id
          const upd = await Route.updateOne(
            {
              _id: new Types.ObjectId(id),
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
          
          console.log(`addRouteToLandmark: Route: ${route.name} landmark: ${landmark.landmarkName}`)
          const point = route.routePoints[index];
          console.log(`addRouteToLandmark: RoutePoint: ${JSON.stringify(point)} `)
          route.routePoints[index] = {
            'routeID': routeID,
            'name': routeName,
            'index': index,
            'landmarkID': landmarkID,
            'landmarkName': landmark.landmarkName,
            'position': point.position,
            'latitude': point.latitude,
            'longitude': point.longitude
          };
          const savedRoute = await route.save();
          const pointSaved = savedRoute.routePoints[index];
          console.log(
            `Route point ${index} updated routePoint  
            - pointSaved: ${JSON.stringify(pointSaved)}`
          
          );
          console.log(
            `🔆🔆🔆 addRouteToLandmark: routePoint inside route updated. 🍎 sweet!: 💙 `
          );

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
            `🔆🔆🔆 addRouteToLandmark: ${landmark.landmarkName} updated with route:  💦 💦 ${route.name} 💦 💦`
          );

         

          res.status(200).json({
            message: `Route ${routeName} added to Landmark: ${result.landmarkName}:  `,
            landmark: result,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 addRouteToLandmark failed",
          });
        }
      });

    app
      .route("/deleteRouteFromLandmarks")
      .post(async (req: Request, res: Response) => {
        try {
          const routeID = req.body.routeID;
          const landmarks: any[] = await Landmark.find({
            "routeDetails.routeID": routeID,
          });

          console.log(
            `.... 🔆 deleteRouteFromLandmarks: ${landmarks.length} landmarks found`
          );

          const route: any = await Route.findOne({
            routeID: routeID,
          });

          if (!route) {
            res.status(400).json({
              message: `🍎 deleteRouteFromLandmarks failed; route ${routeID} not found`,
            });
            return;
          }
          console.log(
            `.... 🔆 deleteRouteFromLandmarks: route: ${route.name}found`
          );
          const list: any[] = [];
          console.log(
            `.... 🔆 update route: ${route.name} with ${route.routePoints.length} routePoints set to landmark nulled`
          );

          route.routePoints.forEach(async (rp: any) => {
            list.push({
              'routeID': routeID,
              'index': rp.index,
              'position': rp.position,
              'created': rp.created,
              'latitude': rp.latitude,
              'longitude': rp.longitude,
            });
          });
        //10213
          console.log(
            `.... 🔆 route: ${route.name} has ${list.length} nulled points, no landmarks here`
          );
          route.routePoints = []
          const updatedRoute = await route.save();
          updatedRoute.routePoints = list;
          updatedRoute.calculatedDistances = [];
          updatedRoute.updated = new Date().toISOString();
          await updatedRoute.save();
          console.log(
            `.... 🔆 route updated: ${updatedRoute.name}, all routePoints must be nulled out re landmark`
          );

          landmarks.forEach(async (mark: any) => {
            const list: any[] = [];
            mark.routeDetails.forEach((element: any) => {
              if (element.routeID === routeID) {
                console.log(
                  `.... 🔆 removing route ${element.name} from landmark: ${mark.landmarkName}`
                );
              } else {
                list.push(element);
              }
            });
            mark.routeDetails = list;
            mark.updated = new Date().toISOString();
            await mark.save();
            console.log(`.... 🔆 removed route from ${mark.landmarkName}`);
          });

          console.log(
            `Route ${route.name} removed from ${landmarks.length} Landmarks  `
          );

          res.status(200).json({
            message: `Route ${route.name} removed from  ${landmarks.length} Landmarks`,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎 deleteRouteFromLandmarks failed",
          });
        }
      });

    app
      .route("/deleteRouteFromLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const routeID = req.body.routeID;
          const landmarkID = req.body.landmarkID;
          const index = req.body.index;
          const landmark: any = await Landmark.findOne({
            landmarkID: landmarkID,
          });
          const route: any = await Route.findOne({
            routeID: routeID,
          });
          if (!landmark) {
            res.status(400).json({
              message: `🍎deleteRouteFromLandmark failed; landmark ${landmarkID} not found`,
            });
            return;
          }
          if (!route) {
            res.status(400).json({
              message: `🍎deleteRouteFromLandmark failed; route ${routeID} not found`,
            });
            return;
          }

          const list: any[] = [];
          landmark.routeDetails.forEach((element: any) => {
            if (element.routeID === routeID) {
              console.log(`.... 🔆 removing route: ${element.name}`);
            } else {
              list.push(element);
            }
          });
          landmark.routeDetails = list;
          landmark.updated = new Date().toISOString();
          await landmark.save();
          
          const list2: any[] = [];
          route.routePoints.forEach((element: any) => {
            if (element.index === index) {
              console.log(`.... 🔆 removing landmark, index: ${element.index}`);
              element.landmarkID = null;
              element.landmarkName = null;
            }
            list2.push(element);
          });
          route.routePoints = list2;
          route.updated = new Date().toISOString();
          await route.save();
          console.log(`.... 🔆 removed route from: ${landmark.landmarkName}`);

          res.status(200).json({
            message: `Route: ${routeID} removed from Landmark: ${landmark.landmarkName} `,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 deleteRouteFromLandmark failed",
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

      console.log(
        `💛 ${result.cities.length} cities added to landmark: 💙 ${landmark.landmarkName} - Yebo!!!: 💙 `
      );
      return result;
    }

    app
      .route("/findLandmarksByLocation")
      .post(async (req: Request, res: Response) => {
        
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
          console.log(
            `🔆 findLandmarksByLocation: elapsed time: 💙 ${
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
            message: "🍎 findLandmarksByLocation failed",
          });
        }
      });

    app
      .route("/findLandmarksByLocationDate")
      .post(async (req: Request, res: Response) => {
        
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
          console.log(
            `🔆 findLandmarksByLocationDate: elapsed time: 💙 ${
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
            message: "🍎 findLandmarksByLocation🍎 Date failed",
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
          console.log(
            `🔆 getLandmarksByRoute: elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query. found ${result.length} landmarks`
          );

          const list: any[] = [];
          result.forEach((r) => {
            list.push(r.toJSON());
          });

          res.status(200).json(list);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getLandmarks failed",
          });
        }
      });
     app
       .route("/getLandmarksByRoutes")
       .post(async (req: Request, res: Response) => {
         try {
           const now = new Date().getTime();

           const result = await Landmark.find({
             "routeDetails.routeID": { $in: req.body.routeIDs },
           });
           const end = new Date().getTime();
           console.log(
             `🔆 getLandmarksByRoutes: elapsed time: 💙 ${
               end / 1000 - now / 1000
             } 💙 seconds for query. found ${result.length} landmarks`
           );
           if (result.length == 0) {
             res.status(200).json([]);
           } else {
           res.status(200).json(result);
           }
         } catch (err) {
           res.status(400).json({
             error: err,
             message: "🍎 getLandmarks failed",
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
          message: " 🍎 addLandmark failed",
        });
      }
    });
  }
}

export default LandmarkController;
