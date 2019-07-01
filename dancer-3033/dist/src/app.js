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
const commuter_rating_routes_1 = require("./routes/commuter_rating_routes");
const commuter_pickup_routes_1 = require("./routes/commuter_pickup_routes");
const commuter_arrival_routes_1 = require("./routes/commuter_arrival_routes");
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_routes_1 = require("./routes/app_routes");
const dispatch_record_routes_1 = require("./routes/dispatch_record_routes");
const landmark_routes_1 = require("./routes/landmark_routes");
const vehicle_routes_1 = require("./routes/vehicle_routes");
const port = process.env.PORT || "8083";
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
const listeners_1 = __importDefault(require("./listeners"));
const assoc_routes_1 = __importDefault(require("./routes/assoc_routes"));
const commuter_request_routes_1 = require("./routes/commuter_request_routes");
const country_routes_1 = require("./routes/country_routes");
const route_routes_1 = require("./routes/route_routes");
console.log(`\n🧡 💛   AftaRobot MongoDB API ... ☘️  starting  ☘️  ${new Date().toISOString()}   🧡 💛\n`);
mongoose_1.default
    .connect(mongoConnection, {
    useNewUrlParser: true,
})
    .then((client) => {
    console.log(`\n🔆🔆🔆🔆🔆🔆  Mongo connected ... 🔆🔆🔆  💛  ${new Date()}  💛 💛`);
    console.log(`\n🍎🍎  ${appName} :: database:  ☘️  client version: ${client.version}  ☘️  is OK   🍎🍎 `);
    console.log(`🍎🍎🍎  MongoDB config ...${JSON.stringify(mongoose_1.default.connection.config)}`);
    listeners_1.default.listen(client);
    console.log(`🍎🍎🍎  MongoDB collections listened to ...`);
    console.log(mongoose_1.default.connection.collections);
})
    .catch((err) => {
    console.error(err);
});
//
const server_1 = require("./server/server");
const user_routes_1 = __importDefault(require("./routes/user_routes"));
class AftaRobotApp {
    constructor() {
        this.commuterRoutes = new commuter_request_routes_1.CommuterRequestExpressRoutes();
        this.landmarkRoutes = new landmark_routes_1.LandmarkExpressRoutes();
        this.routeRoutes = new route_routes_1.RouteExpressRoutes();
        this.associationRoutes = new assoc_routes_1.default();
        this.appRoutes = new app_routes_1.AppExpressRoutes();
        this.vehicleRoutes = new vehicle_routes_1.VehicleExpressRoutes();
        this.countryRoutes = new country_routes_1.CountryExpressRoutes();
        this.userRoutes = new user_routes_1.default();
        this.commuterPickupRoutes = new commuter_pickup_routes_1.CommuterPickupLandmarkExpressRoutes();
        this.dispatchRoutes = new dispatch_record_routes_1.DispatchRecordExpressRoutes();
        this.commuterArrivalRoutes = new dispatch_record_routes_1.DispatchRecordExpressRoutes();
        this.commuterRequestRoutes = new commuter_arrival_routes_1.CommuterArrivalLandmarkExpressRoutes();
        this.commuterRatingRoutes = new commuter_rating_routes_1.CommuterRatingExpressRoutes();
        console.log(`\n🦀 🦀  🥦 Inside DancerWebAPI constructor ...`);
        this.app = server_1.app;
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
        console.log(`\n🦀 🦀  🥦  DancerWebAPI constructor : 🥦🥦🥦 Completed setting up express routes `);
    }
    initializeMiddleware() {
        console.log(`\n🥦 🥦  initializeMiddleware .... `);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors_1.default());
        console.log(`\n🥦 🥦  bodyParser, cors initialized OK .... 🥦 🥦`);
    }
}
exports.default = AftaRobotApp;
//# sourceMappingURL=app.js.map