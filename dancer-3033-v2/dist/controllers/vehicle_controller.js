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
const log_1 = __importDefault(require("../log"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const vehicle_location_1 = __importDefault(require("../models/vehicle_location"));
const vehicle_arrival_1 = __importDefault(require("../models/vehicle_arrival"));
const vehicle_departure_1 = __importDefault(require("../models/vehicle_departure"));
class VehicleController {
    routes(app) {
        console.log(`🏓🏓🏓🏓🏓    VehicleController:  💙  setting up default Vehicle routes ...`);
        app.route("/addVehicle").post((req, res) => {
            const msg = `🌽🌽🌽 addVehicle requested `;
            console.log(msg);
            try {
                const result = new vehicle_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicle failed'
                });
            }
        });
        app.route("/addVehicleArrival").post((req, res) => {
            const msg = `🌽🌽🌽 addVehicleArrival requested `;
            console.log(msg);
            try {
                const result = new vehicle_arrival_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicleArrival failed'
                });
            }
        });
        app.route("/addVehicleDeparture").post((req, res) => {
            const msg = `🌽🌽🌽 addVehicleDeparture requested `;
            console.log(msg);
            try {
                const result = new vehicle_departure_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicleDeparture failed'
                });
            }
        });
        app.route("/addVehicleLocation").post((req, res) => {
            const msg = `🌽🌽🌽 addVehicleLocation requested `;
            console.log(msg);
            try {
                const result = new vehicle_location_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicleLocation failed'
                });
            }
        });
        app.route("/addVehicleLog").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleLog requested `;
            console.log(msg);
            try {
                const vehicle = yield vehicle_1.default.findOne({ vehicleId: req.body.vehicleId });
                vehicle.vehicleLogs.push(req.body.vehicleLog);
                const result = yield vehicle.save();
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicleLog failed'
                });
            }
        }));
    }
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=vehicle_controller.js.map