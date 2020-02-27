import { Request, Response } from "express";
import City from "../models/city";
import Country from "../models/country";
import {log} from '../log';
import uuid from 'uuid/v1';

export class CityController {

    public routes(app: any): void {
        console.log(
            `🏓🏓🏓    CityController:  💙  setting up default City routes ...`,
        );
        app.route("/addCity").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 addCity requested `;
            console.log(msg);

            try {
                const c: any = new City(req.body);
                c.cityID = uuid();
                c.created = new Date().toISOString();
                const result = await c.save();
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addCity failed'
                    }
                )
            }
        });
        app.route("/addCountry").post((req: Request, res: Response) => {
            const msg = `🌽🌽🌽 addCountry requested `;
            console.log(msg);

            try {
                const c: any = new Country(req.body);
                c.countryID = uuid();
                c.created = new Date().toISOString();
                const result = c.save();
                // log(result);
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 addCountry failed'
                    }
                )
            }
        });
        app.route("/findCitiesByLocation").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 findCitiesByLocation requested `;
            log(msg);

            try {
                const now = new Date().getTime();
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const result = await City.find({
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
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 findCitiesByLocation failed'
                    }
                )
            }
        });
        app.route("/getCitiesByCountry").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 getCitiesByCountry requested `;
            log(msg);

            try {
                const now = new Date().getTime();
                const result = await City.find({countryID: req.body.countryID });
                // log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getCitiesByCountry failed'
                    }
                )
            }
        });
        app.route("/getCitiesByProvinceName").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 getCitiesByProvinceName requested `;
            log(msg);

            try {
                const now = new Date().getTime();
                const result = await City.find({provinceName: req.body.provinceName });
                // log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getCitiesByProvinceName failed'
                    }
                )
            }
        });
        app.route("/getCountries").post(async (req: Request, res: Response) => {
            const msg = `🌽🌽🌽 getCountries requested `;
            log(msg);

            try {
                const now = new Date().getTime();
                const result = await Country.find();
                // log(result);
                const end = new Date().getTime();
                log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`)
                res.status(200).json(result);
            } catch (err) {
                res.status(400).json(
                    {
                        error: err,
                        message: ' 🍎🍎🍎🍎 getCountries failed'
                    }
                )
            }
        });
    }
}