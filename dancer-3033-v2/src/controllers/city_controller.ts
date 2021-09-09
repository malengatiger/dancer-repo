import { Request, Response } from "express";
import City from "../models/city";
import Country from "../models/country";
import { log } from "../log";
import uuid from "uuid/v1";

export class CityController {
  public routes(app: any): void {
    console.log(
      `🏓    CityController:  💙  setting up default City routes ...`
    );
    app.route("/getCityByID").get(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCityByID requested `;
      console.log(msg);

      try {
        const c: any = await City.findOne({ cityID: req.query.cityID });
        res.status(200).json(c);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: ` 🍎 getCityByID failed: ${err}`,
        });
      }
    });
    app.route("/addCity").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCity requested `;
      console.log(msg);

      try {
        const c: any = new City(req.body);
        c.cityID = uuid();
        c.created = new Date().toISOString();
        const result = await c.save();
        console.log(`🥦 🥦 🥦 city added: ${JSON.stringify(result)}`);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: ` 🍎 addCity failed: ${err}`,
        });
      }
    });
    // app.route("/deleteCity").post(async (req: Request, res: Response) => {

    //     try {
    //         const c = City.findOne({cityID: req.body.cityID})
    //         const result = await c.delete();
    //         res.status(200).json(result);
    //     } catch (err) {
    //         res.status(400).json(
    //             {
    //                 error: err,
    //                 message: ` 🍎 deleteCity failed: ${err}`
    //             }
    //         )
    //     }
    // });
    app.route("/addCountry").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addCountry requested `;
      console.log(msg);

      try {
        const c: any = new Country(req.body);
        c.countryID = uuid();
        c.created = new Date().toISOString();
        const result = c.save();

        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎 addCountry failed",
        });
      }
    });

    app
      .route("/findCitiesByLocation")
      .post(async (req: Request, res: Response) => {
        const msg = `🌽🌽🌽 findCitiesByLocation requested ........................ `;
        log(msg);

        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const msg = `🌽🌽🌽  🍎 🍎 🍎 ... findCitiesByLocation: 🍎 latitude: ${latitude} 🍎 longitude: ${longitude} `;
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

          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query; found ${result.length} cities`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 findCitiesByLocation failed",
          });
        }
      });
    app
      .route("/findCitiesByLocationDate")
      .post(async (req: Request, res: Response) => {
        const msg = `🌽🌽🌽 findCitiesByLocationDate requested ........................ `;
        log(msg);

        try {
          const now = new Date().getTime();
          const latitude = parseFloat(req.body.latitude);
          const longitude = parseFloat(req.body.longitude);
          const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
          const date = req.body.date;
          const msg = `🌽🌽🌽  🍎 🍎 🍎 ... findCitiesByLocationDate: 🍎 latitude: ${latitude} 🍎 longitude: ${longitude} ${date}`;
          const result = await City.find({
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
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query; found ${result.length} cities`
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
            message: " 🍎 findCitiesByLocationDate failed",
          });
        }
      });
    app
      .route("/getCitiesByCountry")
      .post(async (req: Request, res: Response) => {
        const msg = `🌽🌽🌽 getCitiesByCountry requested `;
        log(msg);

        try {
          const now = new Date().getTime();
          const result = await City.find({ countryID: req.body.countryID });

          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙seconds for query`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCitiesByCountry failed",
          });
        }
      });
    app
      .route("/getCitiesAddedSince")
      .post(async (req: Request, res: Response) => {
        const msg = `🌽🌽🌽 getCitiesAddedSince requested `;
        log(msg);

        try {
          const now = new Date().getTime();
          const result = await City.find({ created: { $gt: req.body.date } });

          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCitiesByCountry failed",
          });
        }
      });
    app
      .route("/getCitiesByProvinceName")
      .post(async (req: Request, res: Response) => {
        const msg = `🌽🌽🌽 getCitiesByProvinceName requested `;
        log(msg);

        try {
          const now = new Date().getTime();
          const result = await City.find({
            provinceName: req.body.provinceName,
          });

          const end = new Date().getTime();
          log(
            `🔆🔆🔆 elapsed time: 💙 ${
              end / 1000 - now / 1000
            } 💙 seconds for query`
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({
            error: err,
            message: " 🍎 getCitiesByProvinceName failed",
          });
        }
      });
    app.route("/getCountries").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 getCountries requested `;
      log(msg);

      try {
        const now = new Date().getTime();
        const result = await Country.find();

        const end = new Date().getTime();
        log(
          `🔆🔆🔆 elapsed time: 💙 ${
            end / 1000 - now / 1000
          } 💙seconds for query`
        );
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎 getCountries failed",
        });
      }
    });
  }
}
