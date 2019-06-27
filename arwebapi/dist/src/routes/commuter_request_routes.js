"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commuter_request_helper_1 = require("./../helpers/commuter_request_helper");
const util_1 = tslib_1.__importDefault(require("./util"));
class CommuterRequestExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓 🏓 🏓 🏓 🏓    CommuterRequestExpressRoutes:  💙  setting up default home routes ...`);
        app.route("/addCommuterRequest").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        app.route("/findCommuterRequestsByLocation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), 
                // tslint:disable-next-line: radix
                parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByLocation failed");
            }
        }));
        app.route("/findCommuterRequestsByFromLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByFromLandmark(req.body.landmarkID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByFromLandmark failed");
            }
        }));
        app.route("/findCommuterRequestsByToLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByToLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByToLandmark(req.body.landmarkID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByToLandmark failed");
            }
        }));
        app.route("/findCommuterRequestsByRoute").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRequestsByRoute route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findByRoute(req.body.routeID, req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRequestsByRoute failed");
            }
        }));
        app.route("/findCommuterRequestsByUser").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        app.route("/findAllCommuterRequests").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findAllCommuterRequests route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_request_helper_1.CommuterRequestHelper.findAll(req.body.minutes);
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