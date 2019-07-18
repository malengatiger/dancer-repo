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
const route_helper_1 = require("../helpers/route_helper");
const util_1 = __importDefault(require("../util"));
class RouteExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    RouteExpressRoutes: 💙  setting up default route routes ...`);
        /////////
        app.route("/addRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /routes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield route_helper_1.RouteHelper.addRoute(req.body.name, req.body.color, req.body.associationID);
                res.status(200).json(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "addRoute failed");
            }
        }));
        /////////
        app.route("/getRoutes").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getRoutes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield route_helper_1.RouteHelper.getRoutes();
                console.log(result);
                res.status(200).json(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "getRoutes failed");
            }
        }));
        /////////
        app
            .route("/addRoutePoints")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = route_helper_1.RouteHelper.addRoutePoints(req.body.routeId, req.body.routePoints, req.body.clear);
                res.send(200).send(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "addRoutePoints failed");
            }
        }));
        ///////
        app
            .route("/addRawRoutePoints")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addRawRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = route_helper_1.RouteHelper.addRawRoutePoints(req.body.routeId, req.body.routePoints, req.body.clear);
                res.send(200).send(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "addRawRoutePoints failed");
            }
        }));
        /////////
        app
            .route("/updateRoute")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /updateRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = route_helper_1.RouteHelper.updateRoute(req.body.routeId, req.body.name, req.body.color);
                res.send(200).send(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "updateRoute failed");
            }
        }));
        app
            .route("/updateRoutePoint")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /updateRoutePoint requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = route_helper_1.RouteHelper.updateRoutePoint(req.body.routeId, req.body.created, req.body.landmarkId);
                res.send(200).send(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "updateRoutePoint failed");
            }
        }));
        app
            .route("/findRoutePointsByLocation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findRoutePointsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = route_helper_1.RouteHelper.findRoutePointsByLocation(req.body.routeId, parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM));
                res.send(200).send(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "findRoutePointsByLocation failed");
            }
        }));
        //
        app.route("/getRoutesByAssociation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getRoutesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = route_helper_1.RouteHelper.getRoutesByAssociation(req.body.associationID);
                res.send(200).send(result);
            }
            catch (err) {
                util_1.default.sendError(res, err, "getRoutesByAssociation failed");
            }
        }));
    }
}
exports.RouteExpressRoutes = RouteExpressRoutes;
//# sourceMappingURL=route_routes.js.map