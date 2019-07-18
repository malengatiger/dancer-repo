import { Request, Response } from "express";
import Landmark from "../models/landmark";
import db from '../database';
import log from '../log';
import { getDistance } from "geolib";
import Route from "../models/route";
import { ObjectId } from "bson";
export class LandmarkController {
    public routes(app: any): void {
        log(
            `🏓🏓🏓🏓🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${db.name} 🥦🥦🥦`,
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

                const route: any = await Route.findOne({
                    routeID: routeID
                });
                const landmark: any = await Landmark.findOne({
                    landmarkID: landmarkID
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
                log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds. added route to landmark ${landmark.landmarkName}`)
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
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
                //const result = await Landmark.find();
                log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
                console.log(
                    `\n\n🌺  Calculated distances between landmarks   🌺 🌸 \n`,
                );
                LandmarkController.calculateDistances(result, latitude, longitude);
                console.log(
                    `\n💙 💙 💙 landmarks found:  🌸  ${
                    result.length
                    }   💙 💚 💛\n`,
                );
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

                log(`💦 💦 💦 💦 💦 💦 routeID: ☘️☘️ ${req.body.id} ☘️☘️`)
                const result = await Landmark.find({
                    'routeDetails.routeID': req.body.id
                });
                //const result = await Landmark.find();
                log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)

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
                const result = await landmark.save();
                log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addLandmark failed'
                    }
                )
            }
        });

    }
    public static async calculateDistances(
        landmarks: any[],
        latitude: number,
        longitude: number,
    ) {
        // use route points to calculate distance between landmarks ....
        const from = {
            latitude,
            longitude,
        };

        for (const m of landmarks) {
            const to = {
                latitude: m.position.coordinates[1],
                longitude: m.position.coordinates[0],
            };
            const dist = getDistance(from, to);
            const f = new Intl.NumberFormat("en-us", { maximumSignificantDigits: 3 }).format(dist / 1000);
            m.distance = f + " km (as the crow flies)";
            console.log(
                `🌸  ${f}  🍎  ${m.landmarkName}  🍀  ${
                m.routeDetails[0].name
                }`,
            );
        }
    }
}

export default LandmarkController;