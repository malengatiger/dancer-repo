import { app } from "./app";
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import l from './log';
import RouteController from './controllers/assoc_controller';
import AssociationController from './controllers/route_controller';
import { AppController } from "./controllers/app_controller";
import LandmarkController from "./controllers/landmark_controller";
import UserController from "./controllers/user_controller";
import { CommuterController } from "./controllers/commuter_controller";
import { VehicleController } from "./controllers/vehicle_controller";
import { DispatchController } from "./controllers/dispatch_controller";
const port = process.env.PORT || "8083";

class AftaRobotApp {
    public app: express.Application;
    public port: string;
    public routeController: RouteController = new RouteController();
    public assocController: AssociationController = new AssociationController();
    public appController: AppController = new AppController();
    public landmarkController: LandmarkController = new LandmarkController();
    public userController: UserController = new UserController();
    public commuterController: CommuterController = new CommuterController();
    public vehicleController: VehicleController = new VehicleController();
    public dispatchController: DispatchController = new DispatchController();

    constructor() {
        l(`🥦🥦🥦🥦  AftaRobotApp: Inside Dancer Web API constructor ...`);
        this.app = app;
        this.port = port;
        this.initializeMiddleware();
        this.routeController.routes(this.app);
        this.assocController.routes(this.app);
        this.appController.routes(this.app);
        this.landmarkController.routes(this.app);
        this.userController.routes(this.app);
        this.commuterController.routes(this.app);
        this.vehicleController.routes(this.app);
        this.dispatchController.routes(this.app);
    }
    private initializeMiddleware() {
        console.log(`🥦🥦🥦🥦  AftaRobotApp: initializeMiddleware .... `);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
        l(`🥦🥦🥦🥦  AftaRobotApp: BodyParser, Cors initialized OK .... 🧡💛🧡💛. Routes below:`);
        l(app.routes);
    }
}
export default AftaRobotApp;