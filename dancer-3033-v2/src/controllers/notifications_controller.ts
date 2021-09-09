import { Request, Response } from "express";
import crypto from "crypto";
import db from "../database";
import uuid = require("uuid");
import NotificationsObject from "../models/notifications";
import { log } from "../log";

export class NotificationsController {
  public routes(app: any): void {
    log(
      `🏓    Notifications Controller: 💙  setting up notifications messages ... `
    );
    /////////

    app.route("/addNotification").post(async (req: Request, res: Response) => {
      log(
        `\n\n💦  POST: /addNotification requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      console.log(req.body);
      try {
        const user: any = new NotificationsObject(req.body);
        user.created = new Date().toISOString();
        const result = await user.save();
        log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({
          error: err,
          message: " 🍎 addNotification failed",
        });
      }
    });
  }
}
