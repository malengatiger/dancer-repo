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
const landmark_helper_1 = require("../helpers/landmark_helper");
const util_1 = __importDefault(require("./util"));
class LandmarkExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓 🏓 🏓 🏓 🏓    LandmarkExpressRoutes: 💙  setting up default landmark related express routes ...`);
        app.route("/addLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield landmark_helper_1.LandmarkHelper.addLandmark(req.body.landmarkName, req.body.latitude, req.body.longitude, req.body.routeIDs, req.body.routeDetails);
                res.status(200).json({
                    message: `🏓  🏓  🏓  landmark: ${req.body.name} : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addLandmark failed");
            }
        }));
        app.route("/findLandmarksByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findLandmarksByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield landmark_helper_1.LandmarkHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM));
                res.status(200).json({
                    message: `🏓  🏓  🏓  findLandmarksByLocation: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findLandmarksByLocation failed");
            }
        }));
        app.route("/addLandmarkRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addLandmarkRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield landmark_helper_1.LandmarkHelper.addRoute(req.body.landmarkID, req.body.routeID);
                res.status(200).json({
                    message: `🏓  🏓  🏓  addLandmarkRoute: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addLandmarkRoute failed");
            }
        }));
        app.route("/getLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getLandmarks requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield landmark_helper_1.LandmarkHelper.findAll();
                res.status(200).json({
                    message: `🏓  🏓  🏓  getLandmarks: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getLandmarks failed");
            }
        }));
    }
}
exports.LandmarkExpressRoutes = LandmarkExpressRoutes;
//# sourceMappingURL=landmark_routes.js.map