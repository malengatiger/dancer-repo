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
const dispatch_record_helper_1 = require("../helpers/dispatch_record_helper");
const util_1 = __importDefault(require("../util"));
class DispatchRecordExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    DispatchRecordExpressRoutes:  💙  setting up default DispatchRecord Routes routes ...`);
        app
            .route("/addDispatchRecord")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  addDispatchRecord route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.addDispatchRecord(req.body.landmarkId, req.body.vehicleId, req.body.routeId, req.body.marshalId, parseInt(req.body.passengers));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addDispatchRecord failed");
            }
        }));
        app
            .route("/findDispatchRecordsByLocation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findDispatchRecordsByLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM), parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findDispatchRecordsByLocation failed");
            }
        }));
        app
            .route("/findDispatchRecordsByVehicle")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findDispatchRecordsByVehicle route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findByVehicleId(req.body.vehicleId, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findDispatchRecordsByVehicle failed");
            }
        }));
        app
            .route("/findAllDispatchRecordsByVehicle")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findDispatchRecordsByVehicle route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findAllByVehicleId(req.body.vehicleId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findDispatchRecordsByVehicle failed");
            }
        }));
        app
            .route("/findDispatchRecordsByLandmark")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findDispatchRecordsByFromLandmark route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findByLandmark(req.body.landmarkID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findDispatchRecordsByFromLandmark failed");
            }
        }));
        app
            .route("/findDispatchRecordsByRoute")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findDispatchRecordsByRoute route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findByRoute(req.body.routeID, parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findDispatchRecordsByRoute failed");
            }
        }));
        app
            .route("/findDispatchRecordsByMarshal")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findDispatchRecordsByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findByMarshal(req.body.marshalId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findDispatchRecordsByMarshal failed");
            }
        }));
        app
            .route("/findAllDispatchRecords")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findAllDispatchRecords route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield dispatch_record_helper_1.DispatchRecordHelper.findAll(parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllDispatchRecords failed");
            }
        }));
    }
}
exports.DispatchRecordExpressRoutes = DispatchRecordExpressRoutes;
//# sourceMappingURL=dispatch_record_routes.js.map