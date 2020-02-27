import { Request, Response } from "express";
import Landmark from "../models/landmark";
import db from '../database';
import {log} from '../log';
import Route from "../models/route";
import uuid = require("uuid");
import { ObjectID } from "bson";
import { Types } from "mongoose";
import chalk = require('chalk')
export class LandmarkController {
    public routes(app: any): void {
        log(
            `🏓🏓🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${db.name} 🥦🥦🥦`,
        );
        /////////
        app.route("/addRouteToLandmark").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addRouteToLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const routeID = req.body.routeID;
                const landmarkID = req.body.landmarkID;
                const routePoint = req.body.routePoint

                const route: any = await Route.findOne({
                    routeID: routeID
                });
                console.log(route);
                console.log(`id from route:  💦 💦 ${route.id} 💦 💦`)
                const landmark: any = await Landmark.findOne({
                    landmarkID: landmarkID
                });
                landmark.routeDetails.forEach((element: any) => {
                   console.log(element)
                });
                let isFound: boolean = false;
                landmark.routeDetails.forEach((element: any) => {
                    if (element.routeID === routeID) {
                        isFound = true;
                    }
                });
                if (isFound) {
                    throw new Error('Route already listed in Landmark');
                }
                landmark.routeDetails.push({
                    routeID: routeID,
                    name: route.name,
                })
                const result = await landmark.save();
                log(`🔆🔆🔆 💙 landmark ${landmark.landmarkName} updated. Will update route point ....`)
                // TODO - update routePount
                const mRes = await Route.updateOne({"_id": new Types.ObjectId(route.id), "routePoints.index": routePoint.index},
                {$set: {"routePoints.$.landmarkID": landmark.landmarkID, "routePoints.$.landmarkName": landmark.landmarkName}});
                log(`🔆🔆🔆 routePoint updated. 🍎🍎🍎🍎 sweet!: 💙 `);
                console.log(mRes);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds. added route to landmark ${landmark.landmarkName}`)
                res.status(200).json(result);
            } catch (err) {
                console.log(err);
                res.status(400).json(
                    {
                        error: err.message,
                        message: ' 🍎🍎🍎🍎 addRouteToLandmark failed'
                    }
                )
            }
        });
        app.route("/findLandmarksByLocation").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /findLandmarksByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
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
        app.route("/getLandmarksByRoute").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getLandmarksByRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const now = new Date().getTime();

                log(`💦 💦 💦 💦 💦 💦 routeID: ☘️☘️ ${req.body.routeID} ☘️☘️`)
                const result = await Landmark.find({
                    'routeDetails.routeID': req.body.routeID
                });
                const end = new Date().getTime();
                log(`🔆🔆🔆 getLandmarksByRoute: elapsed time: 💙 ${end / 1000 - now / 1000} 💙 seconds for query. found ${result.length} landmarks`)

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
        app.route("/getLandmarks").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /getLandmarks requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const result = await Landmark.find();
                const end = new Date().getTime();
                log(`🔆🔆🔆 getLandmarks: elapsed time: 💙 ${end / 1000 - now / 1000} 💙 seconds for query. found ${result.length} landmarks`)

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
        app.route("/addLandmark").post(async (req: Request, res: Response) => {
            log(
                `\n\n💦  POST: /addLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
            );
            console.log(req.body);
            try {
                const landmark: any = new Landmark(req.body);
                landmark.landmarkID = uuid();
                landmark.created = new Date().toISOString();
            
                const result = await landmark.save();
                log(`🍀️️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️️🍀️landmark saved ${landmark.landmarkName}`)
                
                res.status(200).json(result);
            } catch (err) {
                console.error(err)
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addLandmark failed'
                    }
                )
            }
        });

    }
}

export default LandmarkController;