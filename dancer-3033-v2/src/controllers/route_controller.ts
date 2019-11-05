import { Request, Response } from "express";
import Route from "../models/route";
import db from '../database';
import log from '../log';
import Association from "../models/association";
import uuid = require("uuid");
import Database from '../database';
import { Db, Cursor } from "mongodb";
import { Types } from "mongoose";
export class RouteController {
    public routes(app: any): void {
        log(
            `🏓🏓🏓    RouteController: 💙  setting up default Route routes ... `,
        );
        /////////
        app.route("/getRoutesByAssociation").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getRoutesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const assID: any = req.body.associationID;
                const now = new Date().getTime();
                log(`💦 💦 💦 💦 💦 💦 associationID for routes: ☘️☘️ ${assID} ☘️☘️`)
                const result = await Route.find({ associationID: assID }, 'name associationID routeID id');
                log(result);
                result.forEach((m: any) => {
                    if (m.associationID === assID) {
                        log(`😍 ${m.name} - 😍 - association is OK: ${m.associationID}`);
                    }
                });
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: ${end / 1000 - now / 1000} seconds for query. found 😍 ${result.length} routes`);

                res.status(200).json(result);
            } catch (err) {
                console.error(err);
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getRoutes failed'
                    }
                )
            }
        });
        app.route("/getRouteById").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getRoutesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const routeID: any = req.body.routeID;
                const now = new Date().getTime();
                log(`💦 💦 💦 💦 💦 💦 associationID for routes: ☘️☘️ ${routeID} ☘️☘️`)
                const result = await Route.findOne({ routeID: routeID })
                log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: ${end / 1000 - now / 1000} seconds for query. found 😍route`);

                res.status(200).json(result);
            } catch (err) {
                console.error(err);
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getRoutes failed'
                    }
                )
            }
        });
        app.route("/addRoute").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const route: any = new Route(req.body);
                route.routeID = uuid();
                route.created = new Date().toISOString();
                const result = await route.save();
                log(`result ${result}`);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addRoute failed'
                    }
                )
            }
        });
        app.route("/addCalculatedDistances").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addCalculatedDistances requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const route: any = await Route.findOne({ routeID: req.body.routeID });
                route.calculatedDistances = req.body.calculatedDistances;
                const result = await route.save();
                log(`💙💙 Distances added to route. ${route.calculatedDistances.length} - 🧡💛 ${route.name}`);
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addCalculatedDistances failed'
                    }
                )
            }
        });
        app.route("/addRoutePoints").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const route: any = await Route.findOne({ routeID: req.body.routeID });
                // check clear flag
                if (req.body.clear == true) {
                    route.routePoints = [];
                }
                let index = 0;
                req.body.routePoints.forEach((p: any) => {
                    route.routePoints.push(p);
                });

                const result = await route.save();
                log(`💙💙 Points added to route. ${route.routePoints.length} - 🧡💛 ${route.name}`);
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addRoutePoints failed'
                    }
                )
            }
        });
        app.route("/addRoutePoints").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const route: any = await Route.findOne({ routeID: req.body.routeID });
                // check clear flag
                if (req.body.clear == true) {
                    route.routePoints = [];
                    await route.save();
                }

                req.body.routePoints.forEach((p: any) => {
                    route.routePoints.push(p);
                });

                const result = await route.save();
                log(`💙💙 Points added to route. ${route.routePoints.length} - 🧡💛 ${route.name}`);
                const routeX: any = await Route.findOne({ routeID: req.body.routeID });
                log(`💙💙 AFTER reread: Points: ${routeX.routePoints.length} - 🧡💛 ${route.name}`);
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addRoutePoints failed'
                    }
                )
            }
        });
        app.route("/addRawRoutePoints").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addRawRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const route: any = await Route.findOne({ routeID: req.body.routeID });
                // check clear flag
                if (req.body.clear == true) {
                    route.rawRoutePoints = [];
                }
                req.body.rawRoutePoints.forEach((p: any) => {
                    route.rawRoutePoints.push(p);
                });

                const result = await route.save();
                log(`💙💙 Points added to route. ${route.rawRoutePoints.length} - 🧡💛 ${route.name}`);
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addRawRoutePoints failed'
                    }
                )
            }
        });
        app.route("/updateLandmarkRoutePoints").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /updateLandmarkRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const routeID = req.body.routeID;
                const routePoints: any[] = req.body.routePoints;

                const route: any = await Route.findOne({ routeID: routeID });
                if (!route) {
                    throw new Error('Route not found');
                }
                log(`🔆🔆🔆 💙 ROUTE: ${route.name} updated. Will update route points ....`)
                for (const routePoint of routePoints) {
                    const mRes = await Route.updateOne({ "_id": new Types.ObjectId(route.id), "routePoints.index": routePoint.index },
                        { $set: { "routePoints.$.landmarkID": routePoint.landmarkID, 
                        "routePoints.$.landmarkName": routePoint.landmarkName } });
                    log(`🔆🔆🔆 routePoint updated. 🍎🍎🍎🍎 sweet!: 💙 ${routePoint.landmarkName}`);
                    console.log(mRes);
                }

                res.status(200).json({
                    message: `${routePoints.length} route points updated for Landmarks`
                });
            } catch (err) {
                console.error(err);
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 updateLandmarkRoutePoints failed'
                    }
                )
            }
        });
        app.route("/findNearestRoutePoint").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /findNearestRoutePoint requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const routeID = req.body.routeID;
                const result = await Route.find({
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
                //// log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query: landmarks found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getLandmarks failed'
                    }
                )
            }
        });
    }

    public static async fixRoutes() {
        const list: any[] = await Route.find();
        let cnt = 0;
        for (const m of list) {
            if (m.associationDetails)
                m.associationID = m.associationDetails[0].associationID;
            m.associationName = m.associationDetails[0].associationName;
            await m.save();
            cnt++;
            log(`❇️❇️❇️ Route #${cnt} updated 🍎 ${m.associationName} 🍎 ${m.name}`);
        }
        return {
            message: `${cnt} routes have been updated`,
        }
    }
}

export default RouteController;