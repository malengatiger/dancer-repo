import { CommuterStartingLandmarkExpressRoutes } from './routes/commuter_starting_routes';
import { CommuterPanicExpressRoutes } from './routes/commuter_panic_routes';
import { CommuterRatingExpressRoutes } from './routes/commuter_rating_routes';
import { CommuterPickupLandmarkExpressRoutes } from './routes/commuter_pickup_routes';
import { CommuterArrivalLandmarkExpressRoutes } from "./routes/commuter_arrival_routes";
import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { AppExpressRoutes } from "./routes/app_routes";
import { DispatchRecordExpressRoutes } from "./routes/dispatch_record_routes";
import { LandmarkExpressRoutes } from "./routes/landmark_routes";
import { VehicleExpressRoutes } from "./routes/vehicle_routes";
const port = process.env.PORT || "8083";
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
import MongoListeners from "./listeners";
import AssociationExpressRoutes from "./routes/assoc_routes";
import { CommuterRequestExpressRoutes } from "./routes/commuter_request_routes";
import { CountryExpressRoutes } from "./routes/country_routes";
import { RouteExpressRoutes } from "./routes/route_routes";

console.log(
  `\n🧡 💛   AftaRobot MongoDB API ... ☘️  starting  ☘️  ${new Date().toISOString()}   🧡 💛\n`,
);
mongoose
  .connect(mongoConnection, {
    useNewUrlParser: true,
  })
  .then((client) => {
    console.log(
      `\n🔆🔆🔆🔆🔆🔆  Mongo connected ... 🔆🔆🔆  💛  ${new Date()}  💛 💛`,
    );
    console.log(
      `\n🍎🍎  ${appName} :: database:  ☘️  client version: ${
        client.version
      }  ☘️  is OK   🍎🍎 `,
    );
    console.log(
      `🍎🍎🍎  MongoDB config ...${JSON.stringify(
        mongoose.connection.config,
      )}`,
    );
    
    MongoListeners.listen(client);
    console.log(`🍎🍎🍎  MongoDB collections listened to ...`);
    console.log(mongoose.connection.collections);
  })
  .catch((err) => {
    console.error(err);
  });
//
import { app } from "./server/server";
import UserExpressRoutes from './routes/user_routes';
import { MongoClient } from 'mongodb';

class AftaRobotApp {
  public app: express.Application;
  public port: string;
  public commuterRoutes: CommuterRequestExpressRoutes = new CommuterRequestExpressRoutes();
  public landmarkRoutes: LandmarkExpressRoutes = new LandmarkExpressRoutes();
  public routeRoutes: RouteExpressRoutes = new RouteExpressRoutes();
  public associationRoutes: AssociationExpressRoutes = new AssociationExpressRoutes();
  public appRoutes: AppExpressRoutes = new AppExpressRoutes();
  public vehicleRoutes: VehicleExpressRoutes = new VehicleExpressRoutes();
  public countryRoutes: CountryExpressRoutes = new CountryExpressRoutes();
  public userRoutes: UserExpressRoutes = new UserExpressRoutes();
  public commuterPickupRoutes: CommuterPickupLandmarkExpressRoutes = new CommuterPickupLandmarkExpressRoutes();

  public commuterSatrtingRoutes: CommuterStartingLandmarkExpressRoutes = new CommuterStartingLandmarkExpressRoutes();
  public commuterPanicRoutes: CommuterPanicExpressRoutes = new CommuterPanicExpressRoutes();
  public dispatchRoutes: DispatchRecordExpressRoutes = new DispatchRecordExpressRoutes();
  public commuterArrivalRoutes: DispatchRecordExpressRoutes = new DispatchRecordExpressRoutes();
  public commuterRequestRoutes: CommuterArrivalLandmarkExpressRoutes = new CommuterArrivalLandmarkExpressRoutes();
  public commuterRatingRoutes: CommuterRatingExpressRoutes = new CommuterRatingExpressRoutes();
  
  constructor() {
    console.log(`\n🦀 🦀  🥦 Inside DancerWebAPI constructor ...`);
    this.app = app;
    this.port = port;
    this.initializeMiddleware();
    this.landmarkRoutes.routes(this.app);
    this.routeRoutes.routes(this.app);
    this.associationRoutes.routes(this.app);
    this.appRoutes.routes(this.app);
    this.vehicleRoutes.routes(this.app);
    this.countryRoutes.routes(this.app);
    this.commuterRequestRoutes.routes(this.app);
    this.dispatchRoutes.routes(this.app);
    this.commuterArrivalRoutes.routes(this.app);
    this.commuterRoutes.routes(this.app);
    this.commuterPickupRoutes.routes(this.app);
    this.commuterRatingRoutes.routes(this.app);
    this.userRoutes.routes(this.app);
    this.commuterPanicRoutes.routes(this.app);
    this.commuterSatrtingRoutes.routes(this.app);

    console.log(
      `\n🦀 🦀  🥦  DancerWebAPI constructor : 🥦🥦🥦 Completed setting up express routes `,
    );
  }

  private initializeMiddleware() {
    console.log(`\n🥦 🥦  initializeMiddleware .... `);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    console.log(`\n🥦 🥦  bodyParser, cors initialized OK .... 🥦 🥦`);
  }
}

export default AftaRobotApp;
