"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commuter_arrival_helper_1 = require("../helpers/commuter_arrival_helper");
const util_1 = tslib_1.__importDefault(require("./util"));
class CommuterArrivalLandmarkExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓🏓🏓🏓🏓    CommuterArrivalLandmarkExpressRoutes:  💙  setting up default home routes ...`);
        app.route("/addCommuterArrivalLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  addCommuterArrivalLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.addCommuterArrivalLandmark(req.body);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterArrivalLandmark failed");
            }
        }));
        app.route("/findCommuterArrivalLandmarksByLocation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterArrivalLandmarksByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByLocation failed");
            }
        }));
        app.route("/findCommuterArrivalLandmarksByFromLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterArrivalLandmarksByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByFromLandmark(req.body.landmarkID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByFromLandmark failed");
            }
        }));
        app.route("/findCommuterArrivalLandmarksByToLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterArrivalLandmarksByToLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByToLandmark(req.body.landmarkID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByToLandmark failed");
            }
        }));
        app.route("/findCommuterArrivalLandmarksByRoute").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterArrivalLandmarksByRoute route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByRoute(req.body.routeID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByRoute failed");
            }
        }));
        app.route("/findCommuterArrivalLandmarksByUser").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterArrivalLandmarksByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findByUser(req.body.user);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterArrivalLandmarksByUser failed");
            }
        }));
        app.route("/findAllCommuterArrivalLandmarks").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findAllCommuterArrivalLandmarks route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.findAll(req.body.minutes);
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