"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const log_1 = require("./log");
const assoc_controller_1 = __importDefault(require("./controllers/assoc_controller"));
const route_controller_1 = __importDefault(require("./controllers/route_controller"));
const app_controller_1 = require("./controllers/app_controller");
const delete_1 = require("./controllers/delete");
const landmark_controller_1 = __importDefault(require("./controllers/landmark_controller"));
const user_controller_1 = __importDefault(require("./controllers/user_controller"));
const commuter_controller_1 = require("./controllers/commuter_controller");
const vehicle_controller_1 = require("./controllers/vehicle_controller");
const dispatch_controller_1 = require("./controllers/dispatch_controller");
const city_controller_1 = require("./controllers/city_controller");
const bg_controller_1 = require("./controllers/bg_controller");
const port = process.env.PORT || "8083";
class AftaRobotApp {
    constructor() {
        this.appController = new app_controller_1.AppController();
        this.deleteController = new delete_1.DeleteController();
        this.routeController = new assoc_controller_1.default();
        this.assocController = new route_controller_1.default();
        this.userController = new user_controller_1.default();
        this.landmarkController = new landmark_controller_1.default();
        this.commuterController = new commuter_controller_1.CommuterController();
        this.vehicleController = new vehicle_controller_1.VehicleController();
        this.dispatchController = new dispatch_controller_1.DispatchController();
        this.cityController = new city_controller_1.CityController();
        this.bgController = new bg_controller_1.BGController();
        // log(`🥦🥦🥦🥦  AftaRobotApp: Inside Dancer Web API constructor ...`);
        this.app = app_1.expressApp;
        this.port = port;
        this.initializeMiddleware();
        this.appController.routes(this.app);
        this.userController.routes(this.app);
        this.routeController.routes(this.app);
        this.assocController.routes(this.app);
        this.cityController.routes(this.app);
        this.landmarkController.routes(this.app);
        this.commuterController.routes(this.app);
        this.vehicleController.routes(this.app);
        this.dispatchController.routes(this.app);
        this.bgController.routes(this.app);
        this.deleteController.routes(this.app);
    }
    initializeMiddleware() {
        // console.log(`🥦🥦🥦🥦  AftaRobotApp: initializeMiddleware .... `);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors_1.default());
        log_1.log(`🥦🥦🥦 AftaRobotApp: initializeMiddleware: BodyParser, Cors initialized 🧡 OK 🧡.... \n`);
    }
}
exports.default = AftaRobotApp;
//# sourceMappingURL=ar.js.map