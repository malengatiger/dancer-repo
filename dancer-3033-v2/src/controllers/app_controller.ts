import { Request, Response } from "express";
import express = require("express");
import { logBlue, logGreen } from "../log";
import QRCodeUtil from "../helpers/qrcode";
import { appTo } from "../helpers/messaging";
import { reset } from "chalk";

export class AppController {
  public routes(app: express.Application): void {
    logBlue(
      `🏓    AppController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`
    );
   
    app.use(async function myAuth(req: Request, res: Response, next) {
      
      // console.log("🌺 🌺 🌺 🌺 🌺 🌺 🌺 🌺 🌺 🌺 🌺 🌺 🌺 JWT authentication:  🍏 🍏 🍏 app.use : 🍏 perform authentication with token 🌺 🌺 🌺 🌺 ", new Date().toISOString());
      const authHeader = req.headers.authorization;
      console.log(`🌺 authenticating this url: ${req.url} 💛 ${new Date().toISOString()}`)
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const result = await appTo.auth().verifyIdToken(token, false);
          // console.log(
          //   `💛 💛 💛 result of verify: ${JSON.stringify(result)} `
          // );
          return next();
          
        } catch (err) {
          console.error(err);
          console.log(
            "👿 👿 👿 👿 invalid authorization header found. 👿 Forbidden! 👿 "
          );
          return next(`Just piss off! Fool!`)
        }
      } else {
        console.log(
          "👿 👿 👿 👿 No authorization header found. 👿 Forbidden! 👿 "
        );
        return next('You are truly fucked!')
      }
           
    });
    app.route("/").get((req: Request, res: Response) => {
      const msg = `🧡💛🧡💛  Hello World from MizDancer 💙💙💙💙💙💙 Azure 🏓 DOCKER CONTAINER  is UP!  💙💙💙💙💙💙 🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
      logBlue(msg);
      res.status(200).json({
        message: msg,
      });
    });


    app.route("/ping").get((req: Request, res: Response) => {
      logGreen(
        `\n\n💦 🧡💛🧡💛 Dancer has been pinged!! Azure 🏓 CONTAINER is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`
      );
      res.status(200).json({
        message: `🧡 💛 🧡 💛 MizDancer, aka AftaRobot Web API pinged! 💙 💙 💙 💙 💙 💙 TaxiYam Backend is totally UP! 💙 ... and RUNNING!! 💙  ${new Date().toISOString()}  💙 `,
      });
    });

    ///////////////////////////////////////////////////////////////
    async function verifyShit(req: Request, res: Response) {
      //get firebase admin here aftergetting the token
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const result = await appTo.auth().verifyIdToken(token, false);
          console.log(
            `💛 💛 💛 💛 💛 💛 result of verify: ${JSON.stringify(result)} `
          );
          return true;
        } catch (err) {
          console.error(err);
          console.log(
            "👿 👿 👿 👿 invalid authorization header found. 👿 Forbidden! 👿 "
          );
          return false;
        }
      } else {
        console.log(
          "👿 👿 👿 👿 No authorization header found. 👿 Forbidden! 👿 "
        );
        return false;
      }
    }
    async function verify(req: Request, res: Response) {
      //get firebase admin here aftergetting the token
      const authHeader = req.headers.authorization;
      console.log(`💛 💛 💛 💛 💛 💛 authHeader: ${authHeader} `);

      if (authHeader) {
        const token = authHeader.split(" ")[1];
        // console.log(
        //   `💛 💛 💛 💛 💛 💛 auth token: ${token} Use firebase sdk to verify this token`
        // );
        try {
          const result = await appTo.auth().verifyIdToken(token, false);
          console.log(
            `💛 💛 💛 💛 💛 💛 result of verify: ${JSON.stringify(result)} `
          );
          res.status(200)
          
        } catch (err) {
          console.error(err);
          console.log(
            "👿 👿 👿 👿 invalid authorization header found. 👿 Forbidden! 👿 "
          );
          res.status(401)
        }
      } else {
        console.log(
          "👿 👿 👿 👿 No authorization header found. 👿 Forbidden! 👿 "
        );
        res.status(401)
      }
    }

    ///////////////////////////////////////////////////////////////
    app.route("/generateQRCode").post(async (req: Request, res: Response) => {
      logGreen(`🧡💛🧡💛 generateQRCode requested`);
      console.log(req.body);
      var mRes = await QRCodeUtil.generateQRCode(req.body.vehicleID);
      logGreen(
        `🧡💛🧡💛 generateQRCode completed, sending responses to caller: ${mRes.length}`
      );
      res.status(200).json(mRes);
    });

    app.route("/momo").post(async (req: Request, res: Response) => {
      console.log(`🧡💛🧡💛 momo MTN Mobile Money Callback requested`);
      console.log(JSON.stringify(req));

      res
        .status(200)
        .send(
          `💛OK, MTN Mobile Money Callback: 💛body: ${JSON.stringify(req.body)}`
        );
    });
  }
}
