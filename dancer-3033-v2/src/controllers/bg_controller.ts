import { Request, Response } from "express";
import express = require("express");
import { appTo } from "../helpers/messaging";
import {log } from "../log";
export class BGController {

  public routes(app: express.Application): void {
    console.log(
      `🏓🏓🏓    BGController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`,
    );
    app.route("/locations").post((req: Request, res: Response) => {
      const msg = `🍏 BGController/locations: Adding background location: 💙💙💙💙💙💙 ${req.body}`;
      log(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('locations').add(req.body)
          log('🍏 Background location added to  😍 Firestore')
        } else {
          log(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ')
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
      log(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('geofences').add(req.body)
          log('🍎  Background geofence added to  😍 Firestore')
        } else {
          log(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ')
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
      log(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('heartbeats').add(req.body)
          log('🧡 Background heartbeat added to  😍 Firestore')
        } else {
          log(' 😍 😍 😍 Background heartbeat is null. 🥦🥦 ignore! ')
        }
       
      } catch (e) {
        console.error('Firestore problem. may not be available')
      }
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/activityChanges").post((req: Request, res: Response) => {
      const msg = `🧡 BGController/activityChanges: Adding activityChanges : 💙💙💙💙💙💙 ${req.body}`;
      log(msg);
      try {
        if (req.body) {
          let firestore = appTo.firestore()
          firestore.collection('activityChanges').add(req.body)
          log('🧡 Background activityChanges added to  😍 Firestore')
        } else {
          log(' 😍 😍 😍 Background activityChanges is null. 🥦🥦 ignore! ')
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