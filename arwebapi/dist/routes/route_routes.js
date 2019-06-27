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
const util_1 = __importDefault(require("./util"));
class RouteExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓 🏓 🏓 🏓 🏓    RouteExpressRoutes: 💙  setting up default route routes ...`);
        /////////
        app.route("/addRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /routes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield route_helper_1.RouteHelper.addRoute(req.body.name, req.body.associations, req.body.color);
                console.log("about to return result from Helper ............");
                res.status(200).json({
                    message: `🏓  🏓  route: ${req.body.name} :
            🏓  ${req.body.associationName}: 🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addRoute failed");
            }
        }));
        /////////
        app.route("/deleteRoutePoints").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /deleteRoutePoints requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield route_helper_1.RouteHelper.deleteRoutePoints(req.body.routeID);
                res.status(200).json({
                    message: `🏓  🏓  route: ${req.body.routeID} points deleted :
           🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "deleteRoutePoints failed");
            }
        }));
        /////////
        app.route("/getRoutes").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getRoutes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield route_helper_1.RouteHelper.getRoutes();
                console.log("\n................ about to return result from Helper ............");
                console.log(result);
                res.status(200).json({
                    message: `🏓  🏓  getRoutes OK :: 🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getRoutes failed");
            }
        }));
    }
}
exports.RouteExpressRoutes = RouteExpressRoutes;
//# sourceMappingURL=route_routes.js.map