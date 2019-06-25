import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import {  AppExpressRoutes } from "./routes/app_routes";
import { LandmarkExpressRoutes } from "./routes/landmark_routes";
import { VehicleExpressRoutes } from "./routes/vehicle_routes";
const mPort = process.env.PORT || 3000;
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
import MongoListeners from "./listeners";
import AssociationExpressRoutes from "./routes/assoc_routes";
import { CountryExpressRoutes } from "./routes/country_routes";
import { RouteExpressRoutes } from "./routes/route_routes";

console.log(`\n\n\n🧡 💛   AftaRobot MongoDB API ... ☘️  starting  ☘️  ${new Date().toISOString()}   🧡 💛\n`);
mongoose
  .connect(mongoConnection, {
    useNewUrlParser: true,
  })
  .then((client) => {
    console.log(`\n🔆 🔆 🔆 🔆 🔆 🔆  Mongo connected ... 🔆 🔆 🔆  💛  ${new Date()}  💛 💛`);
    console.log(`\n🍎  🍎  ${appName} :: database:  ☘️  client version: ${client.version}  ☘️  is OK   🍎  🍎 `);
    console.log(`\n🍎  🍎  🍎  🍎  MongoDB config ...${JSON.stringify(mongoose.connection.config)}`);
    console.log(`\n🍎  🍎  🍎  🍎  MongoDB collections ...`);
    console.log(mongoose.connection.collections);
    MongoListeners.listen(client);
  })
  .catch((err) => {
    console.error(err);
  });
//
class AftaRobotApp {
  public app: express.Application;
  public port: number;
  public landmarkRoutes: LandmarkExpressRoutes = new LandmarkExpressRoutes();
  public routeRoutes: RouteExpressRoutes = new RouteExpressRoutes();
  public associationRoutes: AssociationExpressRoutes = new AssociationExpressRoutes();
  public appRoutes: AppExpressRoutes = new AppExpressRoutes();
  public vehicleRoutes: VehicleExpressRoutes = new VehicleExpressRoutes();
  public countryRoutes: CountryExpressRoutes = new CountryExpressRoutes();

  constructor() {
    console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   Inside AftaRobotApp constructor `);
    this.app = express();
    this.port = 5000;
    this.initializeMiddlewares();
    this.landmarkRoutes.routes(this.app);
    this.routeRoutes.routes(this.app);
    this.associationRoutes.routes(this.app);
    this.appRoutes.routes(this.app);
    this.vehicleRoutes.routes(this.app);
    this.countryRoutes.routes(this.app);
    console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   🥦 AftaRobotApp constructor : 🥦🥦🥦 Completed: `);

  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `\n\n🥦 🥦 🥦 🥦   ---   AR MongoDB API listening on port 🥦  💦  ${
          this.port
        }  💦`,
      );
    });
  }

  private initializeMiddlewares() {
    console.log(`\n🥦 🥦  initializeMiddleware .... `);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    console.log(`\n🥦 🥦  bodyParser, cors initialized OK .... 🥦 🥦`);
  }
}

export default AftaRobotApp;
