import { Request, Response } from "express";
import Util from "../util";

export class AppExpressRoutes {

  public routes(app: any): void {
    console.log(
      `\n🏓🏓🏓🏓🏓    AppExpressRoutes:  💙  setting up default home routes ...`,
    );
    app.route("/").get((req: Request, res: Response) => {
      const msg = `🏓🏓🏓  Hello World from Dancer, independence is coming!!!  IBM Cloud is UP! 🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
      console.log(msg);
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/ping").get((req: Request, res: Response) => {
      console.log(
        `\n\n💦  Dancer has been pinged!! IBM Cloud is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log('GET /ping', JSON.stringify(req.headers, null, 2));
      res.status(200).json({
        message: `🏓🏓 Dancer, aka ARWebAPI pinged !!! : 💙  ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
      });
    });
    
  }
}
