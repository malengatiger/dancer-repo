import { Request, Response } from "express";
import express = require("express");

export class AppController{

  public routes(app: express.Application): void {
    console.log(
      `🏓🏓🏓    AppController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`,
    );
    app.route("/").get((req: Request, res: Response) => {
      const msg = `🧡💛🧡💛  Hello World from MizDancer 💙💙💙💙💙💙 Azure 🏓 CONTAINER  is UP!  💙💙💙💙💙💙 🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
      console.log(msg);
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/ping").get((req: Request, res: Response) => {
      console.log(
        `\n\n💦 🧡💛🧡💛 Dancer has been pinged!! Azure 🏓 CONTAINER is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log('GET /ping', JSON.stringify(req.headers, null, 2));
      res.status(200).json({
        message: `🧡💛🧡💛 MizDancer, aka AftaRobot Web API pinged! 💙💙💙💙💙💙 Azure 🏓 CONTAINER is totally UP! 💙💙💙💙💙💙 ... and RUNNING!! 💙 ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
      });
    });
    
  }
}