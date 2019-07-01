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
const commuter_panic_helper_1 = require("../helpers/commuter_panic_helper");
const util_1 = __importDefault(require("../util"));
class CommuterPanicExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    CommuterPanicExpressRoutes:  💙  setting up CommuterPanic Express Routes  ...`);
        app.route("/addCommuterPanic").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  addCommuterPanic route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.addCommuterPanic(req.body.active, req.body.type, req.body.userId, parseFloat(req.body.latitude), parseFloat(req.body.longitude), req.body.vehicleId, req.body.vehicleReg);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterPanic failed");
            }
        }));
        app.route("/addCommuterPanicLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  addCommuterPanicLocation route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.addCommuterPanicLocation(req.body.commuterPanicId, parseFloat(req.body.latitude), parseFloat(req.body.longitude));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterPanicLocation failed");
            }
        }));
        app.route("/updateCommuterPanicActive").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  updateCommuterPanicActive route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.updateCommuterPanicActive(req.body.active, req.body.commuterPanicId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "updateCommuterPanicActive failed");
            }
        }));
        app.route("/findByUserId").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findByUserId route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.findByUserId(req.body.userID);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findByUserId failed");
            }
        }));
        app.route("/findByPanicId").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findByPanicId route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.findByPanicId(req.body.commuterPanicId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findByPanicId failed");
            }
        }));
        app.route("/findAllPanicsWithinMinutes").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findAllPanicsWithinMinutes route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.findAllPanicsWithinMinutes(parseInt(req.body.minutes));
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllPanicsWithinMinutes failed");
            }
        }));
        app.route("/findAllPanics").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  findAllPanics route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_panic_helper_1.CommuterPanicHelper.findAllPanics();
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllPanics failed");
            }
        }));
    }
}
exports.CommuterPanicExpressRoutes = CommuterPanicExpressRoutes;
//# sourceMappingURL=commuter_panic_routes.js.map