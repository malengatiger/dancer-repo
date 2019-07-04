import { Request, Response } from "express";
import { CityHelper, CountryHelper } from "../helpers/country_helper";
import Util from "../util";

export class CountryExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    CountryExpressRoutes: 💙  setting up default Country related express routes ...`,
    );

    app.route("/addCountry").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addCountry requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await CountryHelper.addCountry(
          req.body.name,
          req.body.countryCode,
        );
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "addCountry failed");
      }
    });

    app.route("/getCountries").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getCountries requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await CountryHelper.getCountries();
        res.status(200).json(result);
      } catch (err) {
        Util.sendError(res, err, "getCountries failed");
      }
    });

    app.route("/getCountryCities").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getCountryCities requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await CityHelper.getCities(req.body.countryID);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: "👿👿👿👿👿👿 getCountryCities failed",
        });
      }
    });
    //
    app
      .route("/findCitiesByLocation")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findCitiesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}  💦`,
        );
        console.log(req.body);
        try {
          const result = await CityHelper.findCitiesByLocation(
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseFloat(req.body.radiusInKM),
          );
          res.status(200).json(result);
        } catch (err) {
          Util.sendError(res, err, "findCitiesByLocation failed");
        }
      });
  }
}

// mongo "mongodb+srv://ar001-1xhdt.mongodb.net/ardb" --username aubs
