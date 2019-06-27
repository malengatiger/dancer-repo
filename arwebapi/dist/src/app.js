"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commuter_arrival_routes_1 = require("./routes/commuter_arrival_routes");
const bodyParser = tslib_1.__importStar(require("body-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const app_routes_1 = require("./routes/app_routes");
const dispatch_record_routes_1 = require("./routes/dispatch_record_routes");
const landmark_routes_1 = require("./routes/landmark_routes");
const vehicle_routes_1 = require("./routes/vehicle_routes");
const port = process.env.PORT || "8080";
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
const listeners_1 = tslib_1.__importDefault(require("./listeners"));
const assoc_routes_1 = tslib_1.__importDefault(require("./routes/assoc_routes"));
const commuter_request_routes_1 = require("./routes/commuter_request_routes");
const country_routes_1 = require("./routes/country_routes");
const route_routes_1 = require("./routes/route_routes");
console.log(`\n\n\n🧡 💛   AftaRobot MongoDB API ... ☘️  starting  ☘️  ${new Date().toISOString()}   🧡 💛\n`);
mongoose_1.default
    .connect(mongoConnection, {
    useNewUrlParser: true,
})
    .then((client) => {
    console.log(`\n🔆 🔆 🔆 🔆 🔆 🔆  Mongo connected ... 🔆 🔆 🔆  💛  ${new Date()}  💛 💛`);
    console.log(`\n🍎  🍎  ${appName} :: database:  ☘️  client version: ${client.version}  ☘️  is OK   🍎  🍎 `);
    console.log(`\n🍎  🍎  🍎  🍎  MongoDB config ...${JSON.stringify(mongoose_1.default.connection.config)}`);
    console.log(`\n🍎  🍎  🍎  🍎  MongoDB collections ...`);
    console.log(mongoose_1.default.connection.collections);
    listeners_1.default.listen(client);
})
    .catch((err) => {
    console.error(err);
});
//
const app = express_1.default();
const http_1 = tslib_1.__importDefault(require("http"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.info(`\n\n🔵 🔵 🔵  -- ARAPI started and listening on http://localhost:${port} 💦 💦 💦 💦`);
    console.info(`🙄 🙄 🙄  -- Application name:  💕 💕 💕 💕  ARAPI running at: 💦 ${new Date().toISOString() +
        "  🙄 🙄 🙄"}`);
});
class AftaRobotApp {
    constructor() {
        this.commuterRoutes = new commuter_request_routes_1.CommuterRequestExpressRoutes();
        this.landmarkRoutes = new landmark_routes_1.LandmarkExpressRoutes();
        this.routeRoutes = new route_routes_1.RouteExpressRoutes();
        this.associationRoutes = new assoc_routes_1.default();
        this.appRoutes = new app_routes_1.AppExpressRoutes();
        this.vehicleRoutes = new vehicle_routes_1.VehicleExpressRoutes();
        this.countryRoutes = new country_routes_1.CountryExpressRoutes();
        this.dispatchRoutes = new dispatch_record_routes_1.DispatchRecordExpressRoutes();
        this.commuterArrivalRoutes = new dispatch_record_routes_1.DispatchRecordExpressRoutes();
        this.commuterRequestRoutes = new commuter_arrival_routes_1.CommuterArrivalLandmarkExpressRoutes();
        console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   Inside AftaRobotApp constructor `);
        this.app = app;
        this.port = port;
        this.initializeMiddlewares();
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
        console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   🥦 AftaRobotApp constructor : 🥦🥦🥦 Completed: `);
    }
    // public listen() {
    //   this.app.listen(this.port, () => {
    //     console.log(
    //       `\n\n🥦 🥦 🥦 🥦   ---   AR MongoDB API listening on port 🥦  💦  ${
    //         this.port
    //       }  💦`,
    //     );
    //   });
    // }
    initializeMiddlewares() {
        console.log(`\n🥦 🥦  initializeMiddleware .... `);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors_1.default());
        console.log(`\n🥦 🥦  bodyParser, cors initialized OK .... 🥦 🥦`);
    }
}
exports.default = AftaRobotApp;
//# sourceMappingURL=app.js.map