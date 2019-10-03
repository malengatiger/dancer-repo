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
const dispatch_record_1 = __importDefault(require("../models/dispatch_record"));
const log_1 = __importDefault(require("../log"));
const moment_1 = __importDefault(require("moment"));
const uuid = require("uuid");
class DispatchController {
    routes(app) {
        console.log(`🏓🏓🏓    DispatchController:  💙  setting up default Dispatch routes ...`);
        app.route("/addDispatchRecord").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addDispatchRecord requested `;
            console.log(msg);
            console.log(req.body);
            try {
                const c = new dispatch_record_1.default(req.body);
                c.dispatchRecordID = uuid();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addDispatchRecord failed'
                });
            }
        }));
        app.route("/findDispatchRecordsByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 findDispatchRecordsByLocation requested `;
            log_1.default(msg);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield dispatch_record_1.default.find({
                    position: {
                        $near: {
                            $geometry: {
                                coordinates: [longitude, latitude],
                                type: "Point",
                            },
                            $maxDistance: RADIUS,
                        },
                        created: { $gt: cutOff },
                    },
                });
                // log(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                res.status(200).json(result);
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findDispatchRecordsByLocation failed'
                });
            }
        }));
        app.route("/getDispatchRecordsByVehicle").post((req, res) => {
            const msg = `🌽🌽🌽 getDispatchRecordsByVehicle requested `;
            console.log(msg);
            try {
                const days = req.body.days;
                const cutOff = moment_1.default().subtract(days, "days").toISOString();
                const result = dispatch_record_1.default.find({ vehicleID: req.body.vehicleID, created: { $gt: cutOff }, });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getDispatchRecordsByVehicle failed'
                });
            }
        });
        app.route("/getDispatchRecordsByLandmark").post((req, res) => {
            const msg = `🌽🌽🌽 getDispatchRecordsByLandmark requested `;
            console.log(msg);
            try {
                const days = req.body.days;
                const cutOff = moment_1.default().subtract(days, "days").toISOString();
                const result = dispatch_record_1.default.find({ landmarkID: req.body.landmarkID, created: { $gt: cutOff }, });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getDispatchRecordsByLandmark failed'
                });
            }
        });
        app.route("/getDispatchRecordsByRoute").post((req, res) => {
            const msg = `🌽🌽🌽 getDispatchRecordsByRoute requested `;
            console.log(msg);
            try {
                const days = req.body.days;
                const cutOff = moment_1.default().subtract(days, "days").toISOString();
                const result = dispatch_record_1.default.find({ routeID: req.body.routeID, created: { $gt: cutOff }, });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getDispatchRecordsByRoute failed'
                });
            }
        });
        app.route("/getDispatchRecordsByOwner").post((req, res) => {
            const msg = `🌽🌽🌽 getDispatchRecordsByOwner requested `;
            console.log(msg);
            try {
                const days = req.body.days;
                const cutOff = moment_1.default().subtract(days, "days").toISOString();
                const result = dispatch_record_1.default.find({ ownerID: req.body.ownerID, created: { $gt: cutOff }, });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getDispatchRecordsByVehicle failed'
                });
            }
        });
    }
}
exports.DispatchController = DispatchController;
//# sourceMappingURL=dispatch_controller.js.map