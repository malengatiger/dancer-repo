import { Request, Response } from "express";
import Route from "../models/route";
import { log } from "../log";
import uuid = require("uuid");
import RouteDistanceEstimation from "../models/route_distance";
import Messaging from "../helpers/messaging";
import RouteFare from "../models/route_fare";
import moment = require("moment");
import Heading from "../helpers/Heading";
import DistanceUtilNew from "../helpers/distance_util_new";
import * as zlib from "zlib";
import * as fs from "fs";
import * as path from "path";
import Landmark from "../models/landmark";

export class RouteController {
  public routes(app: any): void {
    console.log(`🏓    RouteController: 💙  setting up default Route routes ... `);

    app
      .route("/getUpdatedRoutesByAssociation")
      .post(async (req: Request, res: Response) => {
        
        try {
          const assID: any = req.body.associationID;
          const startDate: any = req.body.startDate;
          const now = new Date().getTime();
          
          const result = await Route.find({
            associationID: assID,
            updated: { $gt: startDate },
          });
          const end = new Date().getTime();
          console.log(
            `💦 💦 💦 💦 💦 💦 getUpdatedRoutesByAssociation: elapsed time: ${
              end / 1000 - now / 1000
            } seconds for query. found 😍 ${result.length} routes`
          );

          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getUpdatedRoutesByAssociation failed",
          });
        }
      });
    app
      .route("/getLatestRoutesByAssociation")
      .post(async (req: Request, res: Response) => {
       
        try {
          const assID: any = req.body.associationID;
          const startDate: any = req.body.startDate;
          const now = new Date().getTime();

          const result = await Route.find({
            associationID: assID,
            created: { $gt: startDate },
          });
          const end = new Date().getTime();
          console.log(
            `💦 💦 💦 💦 💦 💦 getLatestRoutesByAssociation: elapsed time: ${
              end / 1000 - now / 1000
            } seconds for query. found 😍 ${result.length} routes`
          );

          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getLatestRoutesByAssociationRoutes failed",
          });
        }
      });
    app
      .route("/getRoutesByAssociation")
      .post(async (req: Request, res: Response) => {
       
        try {
          const assID: any = req.body.associationID;
          const now = new Date().getTime();
          const result = await Route.find({ associationID: assID });

          result.forEach((m: any) => {
            console.log(
              `😍 ${m.name} - 😍 - association ${assID} is OK: route: ${m.name} 🍎 routePoints: ${m.routePoints.length} 
              🍎 rawRoutePoints: ${m.rawRoutePoints.length} `
            );
          });
          const end = new Date().getTime();
          console.log(
            `🔆🔆🔆 elapsed time: ${
              end / 1000 - now / 1000
            } seconds for query. found 😍 ${result.length} routes`
          );

          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 getRoutes failed",
          });
        }
      });
    app
      .route("/getRouteIDsByAssociation")
      .post(async (req: Request, res: Response) => {
        
        try {
          const assID: any = req.body.associationID;
          const result = await Route.find(
            { associationID: assID },
            { routeID: 1, name: 2 }
          );
          res.status(200).json(result);
          console.log(`🍎 Routes (id and name only) info found: ${result.length}`);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: `🍎 getRouteIDsByAssociation failed: ${err}`,
          });
        }
      });
    app.route("/getRouteById").get(async (req: Request, res: Response) => {
      
      if (!req.query.routeID) {
        res.status(400).json({
          error: "routeID is null",
          message: `🍎 getRouteByID failed`,
        });
        return;
      }

      try {
        const routeID: any = req.query.routeID;
        const now = new Date().getTime();
        console.log(`🧩🧩 Getting route: ${routeID}`);
        const route: any = await Route.findOne({ routeID: routeID });

        if (route) {
          console.log(
            `🧩🧩 EXPENSIVE CALL! 🍎 route: ${route.name}, routePoints: 🍎 ${route.routePoints.length} 🍎 `
          );
          if (route.routePoints.length > 0) {
            if (
              !route.heading ||
              route.heading === 0.0 ||
              route.heading === 0
            ) {
              const haeding = Heading.getRouteHeading(route);
              let length: Number = DistanceUtilNew.calculateRouteLength(route);

              route.lengthInMetres = length;
              route.heading = haeding;
              route.updated = new Date().toISOString();
              await route.save();
              console.log(
                `💦 route heading 🍎 ${route.heading} lengthInMetres:: 🍎 ${route.lengthInMetres} 🍎 ... updated on DB`
              );
            }
          }

          const end = new Date().getTime();
          console.log(
            `🔆 getRouteById: elapsed time: ${
              end / 1000 - now / 1000
            } seconds for query. found 😍 route: ${route.name} - routePoints: ${
              route.routePoints.length
            }`
          );
        } else {
          res.status(400).json({
            message: `🍎 getRouteByID failed: Route not found`,
          });
          return;
        }
        res.status(200).json(route);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: `🍎 🍎 🍎 🍎 getRouteByID failed: ${err}`,
        });
      }
    });
    app.route("/addRoute").post(async (req: Request, res: Response) => {
      
      try {
        const route: any = new Route(req.body);
        route.created = new Date().toISOString();
        if (!req.body.heading) {
          route.heading = 0;
        }
        const result = await route.save();
        console.log(
          `result ${result.routePoints.length} from rawPoints: ${result.rawRoutePoints.length} `
        );
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 addRoute failed",
        });
      }
    });
    app.route("/addFullRoute").post(async (req: Request, res: Response) => {
      
      try {
        const route: any = new Route(req.body);
        route.created = new Date().toISOString();
        if (!req.body.heading) {
          route.heading = 0;
        }
        const result = await route.save();
        console.log(
          `result ${result.routePoints.length} from rawPoints: ${result.rawRoutePoints.length} `
        );
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 addFullRoute failed",
        });
      }
    });
    app.route("/addRouteFare").post(async (req: Request, res: Response) => {
      try {
        const routeFare: any = new RouteFare(req.body);
        routeFare.created = new Date().toISOString();
        const result = await routeFare.save();
        console.log(`routeFare added to db: ${result}`);
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: ` 🍎🍎🍎🍎 addRouteFare failed: ${err}`,
        });
      }
    });
    app.route("/addLandmarkFare").post(async (req: Request, res: Response) => {
      try {
        const routeFare: any = RouteFare.find({ routeID: req.body.routeID });
        if (!routeFare.landmarkFares) {
          routeFare.landmarkFares = [];
        }
        routeFare.landmarkFares.push(req.body);
        const result = await routeFare.save();
        console.log(`landmarkFare added to db: ${result}`);
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: ` 🍎 addLandmarkFare failed: ${err}`,
        });
      }
    });
    app
      .route("/getRouteFaresByAssociation")
      .post(async (req: Request, res: Response) => {
        try {
          const assID: any = req.body.associationID;
          const now = new Date().getTime();
          const result = await RouteFare.find({ associationID: assID });
          const end = new Date().getTime();
          console.log(
            `🔆🔆🔆 elapsed time: ${
              end / 1000 - now / 1000
            } seconds for query. found 😍 ${result.length} routes`
          );

          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: ` 🍎🍎🍎🍎 getRouteFaresByAssociation failed: ${err}`,
          });
        }
      });
    app.route("/getRouteFares").post(async (req: Request, res: Response) => {
      
      try {
        const routeID: any = req.body.routeID;
        const now = new Date().getTime();
        const result = await RouteFare.find({ routeID: routeID });
        console.log(result);
        const end = new Date().getTime();
        console.log(
          `🔆🔆🔆 elapsed time: ${end / 1000 - now / 1000} seconds for query`
        );

        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: ` 🍎🍎🍎🍎 getRouteFare failed: ${err}`,
        });
      }
    });
    app
      .route("/addRouteDistanceEstimation")
      .post(async (req: Request, res: Response) => {
        try {
         
          const estimation: any = new RouteDistanceEstimation(req.body);
          if (!estimation.vehicle) {
            throw new Error(`Vehicle missing from estimation`);
          }
          estimation.created = new Date().toISOString();
          await estimation.save();
          console.log(
            "... Estimation has been saved; sending fcm message ... "
          );
          await Messaging.sendRouteDistanceEstimation(req.body);

          res.status(200).json({
            message: `Route Distance Estimation FCM message sent`,
          });
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: "🍎🍎 addRouteDistanceEstimation failed",
          });
        }
      });

    app
      .route("/getRouteDistanceEstimationsByRoute")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = req.body.minutes;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = RouteDistanceEstimation.find({
            routeID: req.body.routeID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎 getRouteDistanceEstimationsByRoute failed",
          });
        }
      });
    app
      .route("/getRouteDistanceEstimationsByLandmark")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = req.body.minutes;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = RouteDistanceEstimation.find({
            "dynamicDistances.landmarkID": req.body.landmarkID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎 getRouteDistanceEstimationsByLandmark failed",
          });
        }
      });
    app
      .route("/getRouteDistanceEstimationsByVehicle")
      .post(async (req: Request, res: Response) => {
        try {
          const minutes = req.body.minutes;
          const cutOff: string = moment()
            .subtract(minutes, "minutes")
            .toISOString();
          const result = RouteDistanceEstimation.find({
            "vehicle.vehicleID": req.body.vehicleID,
            created: { $gt: cutOff },
          });

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎🍎 getRouteDistanceEstimationsByVehicle failed",
          });
        }
      });

    app
      .route("/addRouteDistanceEstimations")
      .post(async (req: Request, res: Response) => {
        try {
          const list: any[] = req.body.estimations;
          let cnt = 0;
          for (const estimate of list) {
            const estimation: any = new RouteDistanceEstimation(req.body);
            if (!estimation.vehicle) {
              throw new Error(`Vehicle missing from estimation`);
            }
            estimation.created = new Date().toISOString();
            await estimation.save();
            console.log(
              `.... ...... Added RouteDistanceEstimation: ${req.body.vehicleReg}`
            );
            await Messaging.sendRouteDistanceEstimation(estimate);
            cnt++;
          }

          res.status(200).json({
            message: `Route Distance Estimations: ${cnt} FCM messages sent`,
          });
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: ` 🍎 🍎 🍎 🍎 addRouteDistanceEstimations failed: ${err}`,
          });
        }
      });
    app
      .route("/addCalculatedDistances")
      .post(async (req: Request, res: Response) => {
        try {
          const route: any = await Route.findOne({ routeID: req.body.routeID });
          route.calculatedDistances = req.body.calculatedDistances;
          const result = await route.save();
          console.log(
            `💙 Distances added to route: ${route.calculatedDistances.length} - 🧡 ${route.name}`
          );

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: "🍎 addCalculatedDistances failed",
          });
        }
      });
    app
      .route("/updateRouteHeading")
      .post(async (req: Request, res: Response) => {
        try {
          const route: any = await Route.findOne({ routeID: req.body.routeID });
          route.heading = req.body.heading;
          const result = await route.save();
          console.log(
            `💙💙 Route heading updated; heading: ${route.heading} - 🧡💛 ${route.name}`
          );

          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 updateRouteHeading failed",
          });
        }
      });
    app.route("/addRoutePoints").post(async (req: Request, res: Response) => {
      try {
        const routeID = req.body.routeID;
        const route: any = await Route.findOne({ routeID: routeID });
        if (!route) {
          res.status(400).json({
            message: `🍎 addRoutePoints failed: Route ${routeID} not found`,
          });
          return;
        }
        if (req.body.clear === true) {
          route.routePoints = [];
        }
        const list: any[] = req.body.routePoints;
        list.forEach((p: any) => {
          route.routePoints.push(p);
        });
        route.updated = new Date().toISOString();
        const result = await route.save();
        console.log(
          `${route.routePoints.length} routePoints added to route ${route.name}`
        );

        const result2 = await RouteController.setRoutePointIndexes(result);
        res.status(200).json(result2);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 addRoutePoints failed",
        });
      }
    });
    app.route("/updateRoute").post(async (req: Request, res: Response) => {
      try {
        const route: any = await Route.findOne({ routeID: req.body.routeID });

        if (req.body.name) {
          route.name = req.body.name;
        }
        if (req.body.associationID) {
          route.associationID = req.body.associationID;
        }
        if (req.body.associationName) {
          route.associationName = req.body.associationName;
        }
        if (req.body.color) {
          route.color = req.body.color;
        }
        // Heading.getRouteHeading(route);
        // const length = DistanceUtilNew.calculateRouteLength(route);
        // route.lengthInMetres = length;
        route.updated = new Date().toISOString();
        const result = await route.save();
        console.log(
          `💙💙 Points added to route: ${route.routePoints.length} - 🧡💛 ${route.name}`
        );
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 updateRoute failed",
        });
      }
    });
    app
      .route("/addRawRoutePoints")
      .post(async (req: Request, res: Response) => {
        try {
          const route: any = await Route.findOne({ routeID: req.body.routeID });
          if (!route) {
            // throw new Error('Route not found')
            console.log(`No route found ... quit! 🍎 🍎 🍎`);
            res.status(400).json({
              message: "Yor shit is cooked! No route here!!",
            });
            return;
          }
          if (req.body.clear === true) {
            route.rawRoutePoints = [];
          }
          req.body.routePoints.forEach((p: any) => {
            route.rawRoutePoints.push(p);
          });

          const result = await route.save();

          res.status(200).json(result);
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: `🍎🍎🍎🍎 addRawRoutePoints failed`,
          });
        }
      });
    app
      .route("/updateLandmarkRoutePoint")
      .post(async (req: Request, res: Response) => {
        try {
          const routeID = req.body.routeID;
          const routePoint: any = req.body.routePoint;

          const route: any = await Route.findOne({ routeID: routeID });
          if (!route) {
            throw new Error("Route not found");
          }

          const list: any[] = [];
          route.routePoints.forEach((p: any) => {
            if (p.index === routePoint.index) {
              list.push(routePoint);
            } else {
              list.push(p);
            }
          });

          const heading = Heading.getRouteHeading(route);
          const length = DistanceUtilNew.calculateRouteLength(route);
          route.lengthInMetres = length;
          route.heading = heading;
          route.routePoints = list;
          route.updated = new Date().toISOString();
          await route.save();
          console.log(
            `🔵 🔵 🔵 RoutePoint ${routePoint.index} updated and marked as a Landmark: ${routePoint.landmarkName}`
          );
          res.status(200).json({
            message: `route point ${JSON.stringify(
              routePoint
            )} updated as Landmark routePoint`,
          });
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎 updateLandmarkRoutePoint failed",
          });
        }
      });

    app
      .route("/findRoutePointNearestToPosition")
      .post(async (req: Request, res: Response) => {
        
        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const routeID = req.body.routeID;
          const route = await Route.findOne({
            routeID: routeID,
          });
          //TODO - calculate distance from each route point and take those within 100 metres
          res.status(200).json(route);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findRoutePointNearestToPosition failed",
          });
        }
      });
    //
    app
      .route("/findRoutesByLocation")
      .get(async (req: Request, res: Response) => {
        
        try {
          const now = new Date().getTime();
          const latitude = Number(req.query.latitude);
          const longitude = Number(req.query.longitude);
          const RADIUS = Number(req.query.radiusInKM) * 1000;

          const result = await Route.find({
            "routePoints.position": {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
            },
          });
          console.log(`🍎 ROUTES FOUND  🍎 ${result.length}`);
          if (result.length == 0) {
            console.log(
              `No routes found around lat: ${latitude} lng: ${longitude}`
            );
            res.status(400).json({
              message: `No Data Found`,
            });
            return;
          }
          // Calling gzip method
          zlib.gzip(JSON.stringify(result), (err, buffer) => {
            if (!err) {
              const end = new Date().getTime();
              console.log(
                `🔆🔆🔆 elapsed time: 💙 ${
                  end / 1000 - now / 1000
                } 💙 seconds for query: ${
                  result.length
                } routes found: 🍎 result: ${JSON.stringify(result).length} 
                compressed: ${buffer.toString("base64").length} 🍎`
              );
              //todo - write buffer to a file
              const fileName = `f_${new Date().getTime()}.zip`;
              const mPath = path.join(fileName);

              fs.writeFileSync(mPath, buffer);
              console.log(`............ downloading zipfile ... ${mPath}`);
              res.download(mPath); // Set disposition and send it.

              // res.status(200).send(path.);
            } else {
              console.log(err);
            }
          });
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findRoutesByLocation failed",
          });
        }
      });

    app
      .route("/findRoutesByLocationDate")
      .post(async (req: Request, res: Response) => {

        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const date = req.body.date;
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;

          const result = await Route.find({
            updated: { $gt: date },
            "routePoints.position": {
              $near: {
                $geometry: {
                  coordinates: [longitude, latitude],
                  type: "Point",
                },
                $maxDistance: RADIUS,
              },
            },
          });
          console.log(`🍎 ROUTES FOUND  🍎 ${result.length}`);
          const end = new Date().getTime();
          console.log(
            `🔆 findRoutesByLocationDate: elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query: routes found: 🍎 ${result.length} 🍎`
          );
          if (result.length == 0) {
            console.log(
              `No routes found around lat: ${latitude} lng: ${longitude}`
            );
            res.status(400).json({
              error: `No routes found at this location within ${RADIUS} metres`,
            });
            return;
          }
          // Calling gzip method
          zlib.gzip(JSON.stringify(result), (err, buffer) => {
            if (!err) {
              const end = new Date().getTime();
              console.log(
                `🔆🔆🔆 elapsed time: 💙 ${
                  end / 1000 - now / 1000
                } 💙 seconds for query: ${
                  result.length
                } routes found: 🍎 result: ${JSON.stringify(result).length} 
                compressed: ${buffer.toString("base64").length} 🍎`
              );
              //todo - write buffer to a file
              const fileName = `f_${new Date().getTime()}.zip`;
              const mPath = path.join(fileName);

              fs.writeFileSync(mPath, buffer);
              console.log(`............ downloading zipfile ... ${mPath}`);
              res.download(mPath); // Set disposition and send it.

              // res.status(200).send(path.);
            } else {
              console.log(err);
            }
          });
        } catch (err) {
          console.error(err);
          res.status(400).json({
            error: err,
            message: " 🍎🍎🍎🍎 findRoutesByLocationDate failed",
          });
        }
      });

    app.route("/updateRoutePoint").post(async (req: Request, res: Response) => {
      
      try {
        const routePoint = req.body;
        if (!routePoint.landmarkID) {
          throw new Error(`landmarkID is not found in routePoint`);
        }
        if (!routePoint.landmarkName) {
          throw new Error(`landmarkName is not found in routePoint`);
        }
        if (!routePoint.routeID) {
          throw new Error(`routeID is not found in routePoint`);
        }
        const route: any = await Route.findOne({ routeID: routePoint.routeID });

        const list: any[] = [];
        route.routePoints.forEach((p: any) => {
          if (p.index === routePoint.index) {
            list.push(routePoint);
          } else {
            list.push(p);
          }
        });
        route.routePoints = list;
        route.updated = new Date().toISOString();
        const length = DistanceUtilNew.calculateRouteLength(route);
        route.lengthInMetres = length;
        await route.save();
        console.log(
          `💙💙 💙💙 💙💙 RoutePoint index: ${routePoint.index} updated on route: 🧡💛 ${route.name}`
        );
        res.status(200).json({
          status: "OK",
          message: `RoutePoint index ${routePoint.index} updated route: 🧡💛 ${route.name} - landmark: ${routePoint.landmarkName}`,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: err,
          message: " 🍎🍎🍎🍎 updateRoutePoint failed",
        });
      }
    });

    app.route("/deleteRoute").post(async (req: Request, res: Response) => {
      
      try {
        const routeID = req.body.routeID;

        const route: any = await Route.findOne({ routeID: routeID });
        if (!route) {
          res.status(400).json({
            message: `🍎🍎🍎🍎 deleteRoute failed; route ${routeID} not found`,
          });
          return;
        }
        console.log(
          `💦 💦 This route ${route.name} is about to be removed ...`
        );
        const landmarks = await Landmark.find({
          "routeDetails.routeID": routeID,
        });

        console.log(
          `💦 💦 This route ${route.name} passes thru ${landmarks.length} landmarks`
        );
        landmarks.forEach(async (landmark: any) => {
          const list: any[] = [];
          landmark.routeDetails.forEach(async (rd: any) => {
            if (rd.routeID === routeID) {
              console.log(
                `This route ${route.name} is removed from ${landmark.landmarkName}`
              );
            } else {
              list.push(rd);
            }
          });
          landmark.routeDetails = list;
          console.log(
            `💦 💦 ... about to update landmark ${landmark.landmarkName} `
          );
          await landmark.save();
        });
        console.log(`💦 💦 ... about to delete route ${route.name}`);
        await Route.deleteOne({ routeID: routeID });
        console.log(`💙 💙 Route ${route.name} has been removed: `);
        res.status(200).json({
          message: `💙 💙 Route ${route.name} has been removed; Yebo! `,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: err,
          message: `🍎🍎🍎🍎 deleteRoute failed: ${err}`,
        });
      }
    });

    //////
    app.route("/fixRoutes").post(async (req: Request, res: Response) => {
      console.log(req.body);
      try {
        const now = new Date().getTime();
        await RouteController.fixRoutes();
        const end = new Date().getTime();
        console.log(
          `🔆🔆🔆 elapsed time: 💙 ${
            end / 1000 - now / 1000
          } 💙 seconds for /fixRoutes`
        );
        res.status(200).json({
          message: `💙 💙 Routes have been fixed ... please check routePoint indexes`,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: err,
          message: `🍎 fixRoutes failed: ${err}`,
        });
      }
    });
  }

  public static async fixRoutes() {
    const list: any[] = await Route.find();
    console.log(`fixRoutes started for ${list.length} routes .....`);
    for (const route of list) {
      RouteController.setRoutePointIndexes(route);
    }
    return {
      message: `${list.length} routes have been updated`,
    };
  }
  public static async setRoutePointIndexes(route: any) {
    const points: any[] = [];
    if (route.routePoints) {
      let cnt = 0;
      route.routePoints.forEach((r: any) => {
        r.index = cnt;
        points.push(r);
        cnt++;
      });
    }
    route.routePoints = [];
    const routeWithNoPoints = await route.save();
    console.log(
      `saved route without points ... about to add ${points.length} points`
    );
    routeWithNoPoints.routePoints = points;
    const finalRoute = await routeWithNoPoints.save();
    console.log(
      `❇️❇️❇️ Route: ${finalRoute.routeID} 🍎 ${finalRoute.name} updated with ${finalRoute.routePoints.length} routePoints 🍎 `
    );
    return finalRoute
  }
}

export default RouteController;
