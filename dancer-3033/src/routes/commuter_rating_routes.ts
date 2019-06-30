import { Request, Response } from "express";
import { CommuterRatingHelper } from '../helpers/commuter_rating_helper';
import Util from "../util";

export class CommuterRatingExpressRoutes {
  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    CommuterRatingExpressRoutes:  💙  setting up default CommuterRating Routes ...`,
    );
    app.route("/addCommuterRating").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  addCommuterRating route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRatingHelper.addCommuterRating(
          req.body.commuterRequestId,
          req.body.rating,
          req.body.userId);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "addCommuterRating failed");
      }
    });

    app.route("/findCommuterRatingsByUser").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findCommuterRatingsByUser route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRatingHelper.findByUser(
          req.body.user);
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findCommuterRatingsByUser failed");
      }
    });

    app.route("/findAllCommuterRatings").post(async (req: Request, res: Response) => {
      const msg = `🏓🏓🏓  findAllCommuterRatings route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      try {
        const result = await CommuterRatingHelper.findAll(
          parseInt(req.body.minutes));
        res.status(200).json(result);
      } catch (e) {
        Util.sendError(res, e, "findAllCommuterRatings failed");
      }
    });
  }
}
