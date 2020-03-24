import { Request, Response } from "express";
import express = require("express");
import Route from "../models/route";
import Landmark from "../models/landmark";
import OldLandmark from "../models/old_landmark";

export class DeleteController {

  public routes(app: express.Application): void {
    console.log(
      `🏓    DeleteController:  💙 setting up temporary fix routes ${app.name}`,
    );
    app.route("/deleteRoute").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 ........... deleteRoute requested `;
      console.log(msg);
      //"0f316750-8b19-11e9-815c-b1ada6043f84" "0edae2e0-8b19-11e9-815c-b1ada6043f84"

      try {
        const associationID: string = req.body.associationID;
        const routes: any = await Route.find({
          associationID: "0edae2e0-8b19-11e9-815c-b1ada6043f84"
        })
        console.log(` 😍 😍 😍 routes found for assoc ${routes.length}`);
        routes.forEach(async (m: any) => {
          const routeID = m.routeID
          const landmarks = await Landmark.find({
            'routeDetails.routeID': routeID
          });
          console.log(`🍎 🍎 🍎 landmarks found for route ${landmarks.length}`);
          
          landmarks.forEach(async (m: any) => {
            //delete
            console.log(`${m.id} - 🌽 ${m.landmarkName}`);
            const landmark: any = new Landmark(req.body);
            
          });
        });
       
        res.status(200).send("We done deletin ...");
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 deleteRoute failed'
          }
        )
      }
    });
    app.route("/copyLandmarks").post(async (req: Request, res: Response) => {
      const msg = `🌽🌽🌽 ........... copyLandmarks requested `;
      console.log(msg);
      //"0f316750-8b19-11e9-815c-b1ada6043f84" "0edae2e0-8b19-11e9-815c-b1ada6043f84"
      try {
        const landmarks: any = await Landmark.find()
        console.log(` 😍 😍 😍 routes found for assoc ${landmarks.length}`);
        landmarks.forEach(async (m: any) => {
          const landmarkID = m.landmarkID
          const landmark: any = new OldLandmark(m);
          landmark.save()
          m.delete()
          console.log(`🌿 🌿 Landmark ${m.landmarkName} 🌿 deleted and saved in old marks`);
          
        })
        res.status(200).send("We done copying ...");
      } catch (err) {
        res.status(400).json(
          {
            error: err,
            message: ' 🍎🍎🍎🍎 deleteRoute failed'
          }
        )
      }
    });

  }
}