import { getDistance } from "geolib";
import Moment from "moment";
import { BulkWriteOpResultObject } from "mongodb";
import * as mongoose from "mongoose";
import CommuterRequest from "../models/commuter_request";
import Route from "../models/route";

export class CommuterRequestHelper {
  public static async onCommuterRequestAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onCommuterRequestChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  CommuterRequest in stream:   🍀   🍀  ${
        event.fullDocument.CommuterRequestName
      } 🍎  `,
    );
  }

  public static async addCommuterRequest(
    request: any,
  ): Promise<any> {
    const commuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    console.log(`....... 😍 😍 😍  about to add CommuterRequest:  👽 👽 👽`);
    console.log(request);
    const commuterRequest = new commuterRequestModel({
      autoDetected: request.autoDetected,
      commuterLocation: request.commuterLocation,
      fromLandmarkId: request.fromLandmarkId,
      fromLandmarkName: request.fromLandmarkName,
      passengers: request.passengers,
      position: {
        coordinates: [request.commuterLocation.lng, request.commuterLocation.lat],
        type: "Point",
      },
      routeId: request.routeId,
      routeName: request.routeName,
      scanned: request.scanned,
      stringTime: request.stringTime,
      time: request.time,
      toLandmarkId: request.toLandmarkId,
      toLandmarkName: request.toLandmarkName,
      user: request.user,
      vehicleId: request.vehicleId,
    });
    const m = await commuterRequest.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRequest added  for: 🍎  ${commuterRequest.fromLandmarkName} \n\n`);
    console.log(commuterRequest);
    return m;
  }

  public static async findByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
    withinMinutes: number,
  ) {
    console.log(
// tslint:disable-next-line: max-line-length
      `\n💦 💦  find CommuterRequests ByLocation .... 🔆 lat: ${latitude}  🔆 lng: ${longitude} radiusInKM: ${radiusInKM}`,
    );
    const start = new Date().getTime();
    const time = Moment().subtract(withinMinutes, "minutes");
    const RADIUS = radiusInKM * 1000;
    const CommuterRequestModel = new CommuterRequest().getModelForClass(CommuterRequest);
    const list: any = await CommuterRequestModel
      .find({
        position: {
          $near: {
            $geometry: {
              coordinates: [longitude, latitude],
              type: "Point",
            },
            $maxDistance: RADIUS,
          },
        },
        stringTime: {$gt: time},
      })
      .catch((err) => {
        console.error(err);
      });
    const end = new Date().getTime();
    console.log(
      `\n🏓  🏓  CommuterRequests found:   🌺 ${
        list.length
      }  elapsed: 💙  ${(end - start) / 1000} seconds  💙 💚 💛\n`,
    );

    return list;
  }

}
