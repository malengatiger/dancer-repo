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
const commuter_starting_helper_1 = require("../helpers/commuter_starting_helper");
const util_1 = __importDefault(require("../util"));
class CommuterStartingLandmarkExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    CommuterStartingLandmarkExpressRoutes:  💙  setting up CommuterStartingLandmark Express Route ...`);
        app
            .route("/addCommuterStartingLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  addCommuterStartingLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_starting_helper_1.CommuterStartingLandmarkHelper.addCommuterStartingLandmark(req.body.landmarkId, req.body.latitude, req.body.longitude, req.body.userId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterStartingLandmark failed");
            }
        }));
        app
            .route("/findCommuterStartingLandmarksByLocation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterStartingLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_starting_helper_1.CommuterStartingLandmarkHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterStartingLandmarksByLocation failed");
            }
        }));
        app
            .route("/findCommuterStartingLandmarksByLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterStartingLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_starting_helper_1.CommuterStartingLandmarkHelper.findByLandmark(req.body.landmarkId, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterStartingLandmarksByFromLandmark failed");
            }
        }));
        app
            .route("/findCommuterStartingLandmarksByUser")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findCommuterStartingLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_starting_helper_1.CommuterStartingLandmarkHelper.findByUser(req.body.userId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterStartingLandmarksByUser failed");
            }
        }));
        app
            .route("/findAllCommuterStartingLandmarks")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findAllCommuterStartingLandmarks route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_starting_helper_1.CommuterStartingLandmarkHelper.findAll(parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllCommuterStartingLandmarks failed");
            }
        }));
    }
}
exports.CommuterStartingLandmarkExpressRoutes = CommuterStartingLandmarkExpressRoutes;
//# sourceMappingURL=commuter_starting_routes.js.map