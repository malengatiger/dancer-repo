import { Request, Response } from "express";

export class AppController{

  public routes(app: any): void {
    console.log(
      `🏓🏓🏓    AppController:  💙  setting up / and /ping routes: ☘️ use to check if API is up ...`,
    );
    app.route("/").get((req: Request, res: Response) => {
      const msg = `🏓🏓  Hello World from Dancer 💙 💙 Azure is UP!   🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
      console.log(msg);
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/ping").get((req: Request, res: Response) => {
      console.log(
        `\n\n💦  Dancer has been pinged!! Azure is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log('GET /ping', JSON.stringify(req.headers, null, 2));
      res.status(200).json({
        message: `🏓🏓 Dancer, aka AftaRobot Web API pinged !!! 💙💙  Azure is UP! 💙 ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
      });
    });
    
  }
}