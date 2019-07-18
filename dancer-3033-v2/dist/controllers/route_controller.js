"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = __importDefault(require("../models/route"));
const database_1 = __importDefault(require("../database"));
const log_1 = __importDefault(require("../log"));
const association_1 = __importDefault(require("../models/association"));
class RouteController {
    routes(app) {
        log_1.default(`🏓🏓🏓🏓🏓    RouteController: 💙  setting up default Route routes ... ${database_1.default}`);
        /////////
        app.route("/getRoutesByAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /getRoutesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const asses = yield association_1.default.find();
                log_1.default(asses);
                log_1.default(`💦 💦 💦 💦 💦 💦 associationID: ☘️☘️ ${req.body.associationID} ☘️☘️`);
                // const result = await Route.find({
                //     'associationDetails.associationID': req.body.associationID
                // });
                const result = yield route_1.default.find();
                log_1.default(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: ${end / 1000 - now / 1000} seconds for query`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getRoutes failed'
                });
            }
        }));
        app.route("/addRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const route = new route_1.default(req.body);
                const result = yield route.save();
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addRoute failed'
                });
            }
        }));
        app.route("/addCalculatedDistances").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addCalculatedDistances requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const route = yield route_1.default.findOne({ routeID: req.body.routeID });
                route.calculatedDistances = req.body.calculatedDistances;
                const result = yield route.save();
                log_1.default(`💙💙 Distances added to route. ${route.calculatedDistances.length} - 🧡💛 ${route.name}`);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCalculatedDistances failed'
                });
            }
        }));
        app.route("/addRoutePoints").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const route = yield route_1.default.findOne({ routeID: req.body.routeID });
                if (req.body.clear == true) {
                    route.routePoints = [];
                }
                req.body.routePoints.forEach((p) => {
                    route.routePoints.push(p);
                });
                const result = yield route.save();
                log_1.default(`💙💙 Points added to route. ${route.routePoints.length} - 🧡💛 ${route.name}`);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addRoutePoints failed'
                });
            }
        }));
        app.route("/updateRoutePoints").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /updateRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const routeID = req.body.routeID;
                const points = req.body.routePoints;
                const route = yield route_1.default.findOne({ routeID: routeID });
                if (!route) {
                    throw new Error('Route not found');
                }
                let cnt = 0;
                let cnt2 = 0;
                route.routePoints.forEach((p) => {
                    points.forEach((landmarkPoint) => {
                        cnt2++;
                        if (p.latitude === landmarkPoint.latitude && p.longitude === landmarkPoint.longitude) {
                            p = landmarkPoint;
                            cnt++;
                            log_1.default(`☘️ Updated this landmark point: 🧡 #${cnt} 🧡 normal point 🍎 #${cnt2} for ${route.name} 💙💙 `);
                        }
                    });
                });
                yield route.save();
                log_1.default(`💙💙 Points updated. ${cnt} ☘️☘️ for route: ${route.name} 🧡💛`);
                res.status(200).json(route);
            }
            catch (err) {
                console.error(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateRoutePoints failed'
                });
            }
        }));
    }
}
exports.RouteController = RouteController;
exports.default = RouteController;
//# sourceMappingURL=route_controller.js.map