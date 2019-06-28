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
const commuter_pickup_helper_1 = require("../helpers/commuter_pickup_helper");
const util_1 = __importDefault(require("../util"));
class CommuterPickupLandmarkExpressRoutes {
    routes(app) {
        console.log(`\n\n🔆🔆🔆🔆🔆    CommuterPickupLandmarkExpressRoutes:  💙  setting up default home routes ...`);
        app
            .route("/addCommuterPickupLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  addCommuterPickupLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.addCommuterPickupLandmark(req.body.commuterRequestId, req.body.fromLandmarkId, req.body.toLandmarkId, req.body.fromLandmarkName, req.body.toLandmarkName, req.body.latitude, req.body.longitude, req.body.vehicleId, req.body.vehicleReg, req.body.userId, req.body.routeId, req.body.routeName);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterPickupLandmark failed");
            }
        }));
        app
            .route("/findCommuterPickupLandmarksByLocation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterPickupLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterPickupLandmarksByLocation failed");
            }
        }));
        app
            .route("/findCommuterPickupLandmarksByFromLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓  findCommuterPickupLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.findByFromLandmark(req.body.landmarkID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterPickupLandmarksByFromLandmark failed");
            }
        }));
        app
            .route("/findCommuterPickupLandmarksByToLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterPickupLandmarksByToLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.findByToLandmark(req.body.landmarkID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterPickupLandmarksByToLandmark failed");
            }
        }));
        app
            .route("/findCommuterPickupLandmarksByRoute")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterPickupLandmarksByRoute route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.findByRoute(req.body.routeID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterPickupLandmarksByRoute failed");
            }
        }));
        app
            .route("/findCommuterPickupLandmarksByUser")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterPickupLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.findByUser(req.body.user);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterPickupLandmarksByUser failed");
            }
        }));
        app
            .route("/findAllCommuterPickupLandmarks")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findAllCommuterPickupLandmarks route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_pickup_helper_1.CommuterPickupLandmarkHelper.findAll(req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllCommuterPickupLandmarks failed");
            }
        }));
    }
}
exports.CommuterPickupLandmarkExpressRoutes = CommuterPickupLandmarkExpressRoutes;
//# sourceMappingURL=commuter_pickup_routes.js.map