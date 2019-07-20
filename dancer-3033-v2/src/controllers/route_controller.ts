import { Request, Response } from "express";
import Route from "../models/route";
import db from '../database';
import log from '../log';
import Association from "../models/association";
import uuid = require("uuid");
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
                const now = new Date().getTime();
                // const asses = await Association.find();
                // log(asses);
                const assID = req.body.associationID.trim();
                log(`💦 💦 💦 💦 💦 💦 associationID: ☘️☘️ ${assID} ☘️☘️`)
                // const result = await Route.find({
                //     "associationDetails.associationID": assID,
                // });
                const result = await Route.find();
                //const result = await Landmark.find({
                //     'routeDetails.routeID': req.body.id
                // });
                log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: ${end / 1000 - now / 1000} seconds for query`)

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
                const result = await route.save();
                log(result);
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
                log(result);
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
                req.body.routePoints.forEach((p: any) => {
                    route.routePoints.push(p);
                });
                
                const result = await route.save();
                log(`💙💙 Points added to route. ${route.routePoints.length} - 🧡💛 ${route.name}`);
                log(result);
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
                log(result);
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
        app.route("/updateRoutePoints").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /updateRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const routeID = req.body.routeID;
                const points = req.body.routePoints;
                const route: any = await Route.findOne({ routeID: routeID });
                if (!route) {
                    throw new Error('Route not found');
                }
                let cnt = 0;
                let cnt2 = 0;
                route.routePoints.forEach((p: any) => {
                    points.forEach((landmarkPoint: any) => {
                        cnt2++;
                        if (p.latitude === landmarkPoint.latitude && p.longitude === landmarkPoint.longitude) {
                            p = landmarkPoint;
                            cnt++;
                            log(`☘️ Updated this landmark point: 🧡 #${cnt} 🧡 normal point 🍎 #${cnt2} for ${route.name} 💙💙 `);
                        }
                    });

                });


                await route.save();

                log(`💙💙 Points updated. ${cnt} ☘️☘️ for route: ${route.name} 🧡💛`);
                res.status(200).json(route);
            } catch (err) {
                console.error(err);
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 updateRoutePoints failed'
                    }
                )
            }
        });
    }
}

export default RouteController;