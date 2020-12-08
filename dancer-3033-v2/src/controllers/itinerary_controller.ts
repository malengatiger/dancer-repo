import { Request, Response } from "express";
import {log} from '../log';
import uuid from 'uuid/v1';
import Itinerary from "../models/itinerary";

export class ItineraryController {

    public routes(app: any): void {
        console.log(
            `🏓    ItineraryController:  💙  setting up default ItineraryController ...`,
        );
        app.route("/addItinerary").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 addItinerary requested `;
            console.log(msg);

            try {
                const c: any = new Itinerary(req.body);
                c.itineraryID = uuid();
                c.created = new Date().toISOString();
                const result = await c.save();
                log(`🍎 🍎 Itinerary added to the database`);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: `🍎🍎🍎🍎 addItinerary failed: ${err}`
                    }
                )
            }
        });
        app.route("/deleteItinerary").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 deleteItinerary requested `;
            console.log(msg);

            try {
                const itinerary = await Itinerary.findOne({'itineraryID': req.body.itineraryID})
        
                const result = itinerary?.deleteOne;
                log(`🍎 🍎 Itinerary deleted from the database`);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: `🍎🍎🍎🍎 deleteItinerary failed: ${err}`
                    }
                )
            }
        });

        app.route("/getAssociationItineraries").post(async (req: Request, res: Response) => {
            try {
                const itineraries = await Itinerary.find({'associationID': req.body.associationID})
                res.status(200).json(itineraries);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: `🍎🍎🍎🍎 getAssociationItineraries failed: ${err}`
                    }
                )
            }
        });

        app.route("/findItinerariesByLocation").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 findItinerariesByLocation requested `;
            log(msg);

            try {
                const now = new Date().getTime();
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const result = await Itinerary.find({
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
                // log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 findItinerariesByLocation: elapsed time: 💙 ${end / 1000 - now / 1000} 💙 seconds for query`)
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: `🍎🍎🍎🍎 findItinerariesByLocation failed: ${err}`
                    }
                )
            }
        });
       
    }
}