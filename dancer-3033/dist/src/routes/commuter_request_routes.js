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
const commuter_request_helper_1 = require("./../helpers/commuter_request_helper");
const util_1 = __importDefault(require("../util"));
class CommuterRequestExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    CommuterRequestExpressRoutes:  💙  setting up default CommuterRequest Routes ...`);
        app.route("/addCommuterRequest").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  addCommuterRequest route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.addCommuterRequest(req.body);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterRequest failed");
            }
        }));
        app.route("/findCommuterRequestsByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByLocation failed");
            }
        }));
        app.route("/findCommuterRequestsByFromLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByFromLandmark(req.body.landmarkID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByFromLandmark failed");
            }
        }));
        app.route("/findCommuterRequestsByToLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByToLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByToLandmark(req.body.landmarkID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByToLandmark failed");
            }
        }));
        app.route("/findCommuterRequestsByRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByRoute route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByRoute(req.body.routeID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByRoute failed");
            }
        }));
        app.route("/findCommuterRequestsByUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByUser(req.body.user);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByUser failed");
            }
        }));
        app.route("/findAllCommuterRequests").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findAllCommuterRequests route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findAll(parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllCommuterRequests failed");
            }
        }));
    }
}
exports.CommuterRequestExpressRoutes = CommuterRequestExpressRoutes;
//# sourceMappingURL=commuter_request_routes.js.map