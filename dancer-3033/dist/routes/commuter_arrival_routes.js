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
const commuter_arrival_helper_1 = require("../helpers/commuter_arrival_helper");
const util_1 = __importDefault(require("../util"));
class CommuterArrivalLandmarkExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    CommuterArrivalLandmarkExpressRoutes:  💙  setting up default home routes ...`);
        app
            .route("/addCommuterArrivalLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  addCommuterArrivalLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.addCommuterArrivalLandmark(req.body.commuterRequestId, req.body.fromLandmarkId, req.body.routeId, req.body.toLandmarkId, req.body.vehicleId, req.body.departureId, req.body.userId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterArrivalLandmark failed");
            }
        }));
        app
            .route("/findCommuterArrivalLandmarksByLocation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByLocation failed");
            }
        }));
        app
            .route("/findCommuterArrivalLandmarksByFromLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByFromLandmark(req.body.landmarkID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByFromLandmark failed");
            }
        }));
        app
            .route("/findCommuterArrivalLandmarksByToLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByToLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByToLandmark(req.body.landmarkID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByToLandmark failed");
            }
        }));
        app
            .route("/findCommuterArrivalLandmarksByRoute")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByRoute route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByRoute(req.body.routeID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByRoute failed");
            }
        }));
        app
            .route("/findCommuterArrivalLandmarksByUser")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterArrivalLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByUser(req.body.user);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByUser failed");
            }
        }));
        app
            .route("/findAllCommuterArrivalLandmarks")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findAllCommuterArrivalLandmarks route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findAll(parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllCommuterArrivalLandmarks failed");
            }
        }));
    }
}
exports.CommuterArrivalLandmarkExpressRoutes = CommuterArrivalLandmarkExpressRoutes;
//# sourceMappingURL=commuter_arrival_routes.js.map