import { Request, Response } from "express";
import DispatchRecord from "../models/dispatch_record";
import log from '../log';

export class DispatchController {

  public routes(app: any): void {
    console.log(
      `🏓🏓🏓🏓🏓    DispatchController:  💙  setting up default Dispatch routes ...`,
    );
    app.route("/addDispatchRecord").post((req: Request, res: Response) => {
      const msg = `🌽🌽🌽 addDispatchRecord requested `;
      console.log(msg);

      try {
        const result = new DispatchRecord(req.body);
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 addDispatchRecord failed'
          }
        )
      }
    });
  }
}