import { Request, Response } from "express";
import express = require("express");
import { logBlue, logGreen } from "../log";
import QRCodeUtil from "../helpers/qrcode";

export class AppController{

  public routes(app: express.Application): void {
    logBlue(
      `🏓    AppController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`,
    );
    app.route("/").get((req: Request, res: Response) => {
      const msg = `🧡💛🧡💛  Hello World from MizDancer 💙💙💙💙💙💙 Azure 🏓 DOCKER CONTAINER  is UP!  💙💙💙💙💙💙 🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
      logBlue(msg);
      res.status(200).json({
        message: msg,
      });
    });

    app.route("/ping").get((req: Request, res: Response) => {
      logGreen(
        `\n\n💦 🧡💛🧡💛 Dancer has been pinged!! Azure 🏓 CONTAINER is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      logBlue(JSON.stringify(req.headers));
      res.status(200).json({
        message: `🧡💛🧡💛 MizDancer, aka AftaRobot Web API pinged! 💙💙💙💙💙💙 Azure 🏓 DOCKER CONTAINER is totally UP! 💙💙💙💙💙💙 ... and RUNNING!! 💙 ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
      });
    });

    app.route("/generateQRCode").post(async (req: Request, res: Response) => {
      logGreen(
        `🧡💛🧡💛 generateQRCode requested`,
      );
      console.log(req.body);
      var mRes = await QRCodeUtil.generateQRCode(req.body.vehicleID)
      logGreen(
        `🧡💛🧡💛 generateQRCode completed, sending responses to caller: ${mRes.length}`,
      );
      res.status(200).json(mRes);
    });
    
    app.route("/momo").post(async (req: Request, res: Response) => {
      console.log(
        `🧡💛🧡💛 momo MTN Mobile Money Callback requested`,
      );
      console.log(JSON.stringify(req));
  
      res.status(200).send(`💛OK, MTN Mobile Money Callback: 💛body: ${JSON.stringify(req.body)}`);
    });
    
    
  }
}