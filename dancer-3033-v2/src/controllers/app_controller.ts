import { Request, Response } from "express";
import express = require("express");
import { logBlue, logGreen } from "../log";

export class AppController{

  public routes(app: express.Application): void {
    logBlue(
      `🏓🏓🏓    AppController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`,
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
    
  }
}