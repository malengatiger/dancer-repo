import { Request, Response } from "express";
import express = require("express");
import mlog from "../log"
import { appTo } from "../helpers/messaging";

export class BGController {

  public routes(app: express.Application): void {
    console.log(
      `🏓🏓🏓    BGController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`,
    );
    app.route("/locations").post((req: Request, res: Response) => {
      const msg = `🍏 BGController/locations: Adding background location: 💙💙💙💙💙💙 ${req.body}`;
      mlog(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('bgLocations').add(req.body)
          mlog('🍏 Background location added to  😍 Firestore')
        } else {
          mlog(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ')
        }
       
      } catch (e) {
        console.error('Firestore problem. may not be available')
      }
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/geofences").post((req: Request, res: Response) => {
      const msg = `🍎  BGController/geofences: Adding geofence action: 💙💙💙💙💙💙 ${req.body}`;
      mlog(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('geofences').add(req.body)
          mlog('🍎  Background geofence added to  😍 Firestore')
        } else {
          mlog(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ')
        }
       
      } catch (e) {
        console.error('Firestore problem. may not be available')
      }
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/heartbeats").post((req: Request, res: Response) => {
      const msg = `🧡 BGController/heartbeats: Adding heartbeat : 💙💙💙💙💙💙 ${req.body}`;
      mlog(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('heartbeats').add(req.body)
          mlog('🧡 Background heartbeat added to  😍 Firestore')
        } else {
          mlog(' 😍 😍 😍 Background heartbeat is null. 🥦🥦 ignore! ')
        }
       
      } catch (e) {
        console.error('Firestore problem. may not be available')
      }
      res.status(200).json({
        message: msg,
      });
    });

  }
}