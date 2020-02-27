"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
const vehicle_1 = __importDefault(require("../models/vehicle"));
const vehicle_location_1 = __importDefault(require("../models/vehicle_location"));
const vehicle_arrival_1 = __importDefault(require("../models/vehicle_arrival"));
const vehicle_departure_1 = __importDefault(require("../models/vehicle_departure"));
const moment_1 = __importDefault(require("moment"));
const vehicle_type_1 = __importDefault(require("../models/vehicle_type"));
const uuid = require("uuid");
const vehicle_route_assignment_1 = __importDefault(require("../models/vehicle_route_assignment"));
const vehicle_commuter_nearby_1 = __importDefault(require("../models/vehicle_commuter_nearby"));
class VehicleController {
    routes(app) {
        console.log(`🏓🏓🏓    VehicleController:  💙  setting up default Vehicle routes ...`);
        app.route("/addVehicleCommuterNearby").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addVehicleCommuterNearby requested `;
            console.log(msg);
            console.log(req.body);
            try {
                const event = new vehicle_commuter_nearby_1.default(req.body);
                event.created = new Date().toISOString();
                const result = yield event.save();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicleCommuterNearby failed'
                });
            }
        }));
        app.route("/findVehiclesByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /findVehiclesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const minutes = parseInt(req.body.minutes);
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                log_1.log(`🔆🔆🔆 cutoff time: 💙 ${cutOff} 💙`);
                const result = yield vehicle_location_1.default.find({
                    created: { $gt: cutOff },
                    position: {
                        $near: {
                            $geometry: {
                                coordinates: [longitude, latitude],
                                type: "Point",
                            },
                            $maxDistance: RADIUS,
                        },
                    },
                });
                const end = new Date().getTime();
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for findVehiclesByLocation query. found 💙 ${result.length}`);
                res.status(200).json(result);
            }
            catch (err) {
                log_1.log(err);
                res.status(400).json({
                    error: err.message,
                    message: ' 🍎🍎🍎🍎 findVehiclesByLocation failed'
                });
            }
        }));
        app.route("/findVehicleArrivalsByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /findVehicleArrivalsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield vehicle_arrival_1.default.find({
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
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findVehicleArrivalsByLocation failed'
                });
            }
        }));
        app.route("/getVehicleArrivalsByLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getVehicleArrivalsByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const landmarkID = req.body.landmarkID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield vehicle_arrival_1.default.find({ landmarkID: landmarkID, created: { $gt: cutOff } });
                const end = new Date().getTime();
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query. arrivals found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getVehicleArrivalsByLandmark failed'
                });
            }
        }));
        app.route("/getVehicleArrivalsByVehicle").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getVehicleArrivalsByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const vehicleID = req.body.vehicleID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield vehicle_arrival_1.default.find({ vehicleID: vehicleID, created: { $gt: cutOff } });
                // log(result);
                const end = new Date().getTime();
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query. arrivals found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getVehicleArrivalsByVehicle failed'
                });
            }
        }));
        app.route("/getVehicleDeparturesByVehicle").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getVehicleDeparturesByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const vehicleID = req.body.vehicleID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield vehicle_departure_1.default.find({ vehicleID: vehicleID, created: { $gt: cutOff } });
                // log(result);
                const end = new Date().getTime();
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query. departures found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getVehicleDeparturesByVehicle failed'
                });
            }
        }));
        app.route("/getVehicleDeparturesByLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getVehicleDeparturesByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const landmarkID = req.body.landmarkID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield vehicle_departure_1.default.find({ landmarkID: landmarkID, created: { $gt: cutOff } });
                // log(result);
                const end = new Date().getTime();
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query: found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getVehicleArrivalsByLandmark failed'
                });
            }
        }));
        app.route("/findVehicleDeparturesByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /findVehicleDeparturesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const minutes = parseInt(req.body.minutes);
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield vehicle_departure_1.default.find({
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
                log_1.log(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query: found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findVehicleDeparturesByLocation failed'
                });
            }
        }));
        app.route("/addVehicle").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicle requested `;
            console.log(msg);
            try {
                const c = new vehicle_1.default(req.body);
                c.vehicleID = uuid();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addVehicle failed'
                });
            }
        }));
        app.route("/updateVehicleOwner").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 updateVehicleOwner requested `;
            console.log(msg);
            try {
                const c = vehicle_1.default.findOne({ vehicleID: req.body.vehicleID });
                if (!c) {
                    res.status(400).json({
                        message: '🍎🍎🍎🍎 updateVehicleOwner failed. Vehicle not found'
                    });
                }
                c.ownerID = req.body.ownerID;
                c.ownerName = req.body.ownerName;
                const result = yield c.save();
                // log(result);
                res.status(200).json({
                    message: 'vehicle owner updated'
                });
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 updateVehicleOwner failed'
                });
            }
        }));
        app.route("/addVehiclePhoto").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehiclePhoto requested `;
            console.log(msg);
            try {
                const c = vehicle_1.default.findOne({ vehicleID: req.body.vehicleID });
                if (!c) {
                    res.status(400).json({
                        message: '🍎🍎🍎🍎 addVehiclePhoto failed. Vehicle not found'
                    });
                }
                const photo = {
                    url: req.body.url,
                    comment: req.body.comment,
                    created: new Date().toISOString()
                };
                c.photos.push(photo);
                const result = yield c.save();
                // log(result);
                res.status(200).json({
                    message: `vehicle photo added. photos: 🍎 ${c.photos.length}`
                });
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehiclePhoto failed'
                });
            }
        }));
        app.route("/addVehicleVideo").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleVideo requested `;
            console.log(msg);
            try {
                const c = vehicle_1.default.findOne({ vehicleID: req.body.vehicleID });
                if (!c) {
                    res.status(400).json({
                        message: '🍎🍎🍎🍎 addVehicleVideo failed. Vehicle not found'
                    });
                }
                const video = {
                    url: req.body.url,
                    comment: req.body.comment,
                    created: new Date().toISOString()
                };
                c.videos.push(video);
                const result = yield c.save();
                // log(result);
                res.status(200).json({
                    message: `vehicle video added. videos: 🍎 ${c.photos.length}`
                });
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehicleVideo failed'
                });
            }
        }));
        app.route("/addVehicleArrival").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleArrival requested `;
            console.log(msg);
            try {
                const c = new vehicle_arrival_1.default(req.body);
                c.vehicleArrivalID = uuid();
                c.created = new Date().toISOString();
                const result = yield c.save();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehicleArrival failed'
                });
            }
        }));
        app.route("/addVehicleRouteAssignment").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleRouteAssignment requested `;
            console.log(msg);
            try {
                const c = new vehicle_route_assignment_1.default(req.body);
                c.routeAssignmentID = uuid();
                c.created = new Date().toISOString();
                const result = yield c.save();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehicleRouteAssignment failed'
                });
            }
        }));
        app.route("/addVehicleDeparture").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleDeparture requested `;
            console.log(msg);
            try {
                const c = new vehicle_departure_1.default(req.body);
                c.vehicleDepartureID = uuid();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehicleDeparture failed'
                });
            }
        }));
        app.route("/addVehicleLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleLocation requested `;
            console.log(msg);
            try {
                const c = new vehicle_location_1.default(req.body);
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehicleLocation failed'
                });
            }
        }));
        app.route("/addVehicleType").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addVehicleType requested `;
            console.log(msg);
            try {
                const vehicleType = new vehicle_type_1.default(req.body);
                vehicleType.vehicleTypeID = uuid();
                const result = yield vehicleType.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 addVehicleType failed'
                });
            }
        }));
        app.route("/getVehicleTypes").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getVehicleTypes requested `;
            console.log(msg);
            try {
                const result = yield vehicle_type_1.default.find();
                log_1.log(`🌽🌽🌽 getVehicleTypes  found: ${result.length}`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 getVehicleTypes failed'
                });
            }
        }));
        app.route("/getVehicles").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getVehicles requested `;
            console.log(msg);
            try {
                const result = yield vehicle_1.default.find();
                log_1.log(`🌽🌽🌽 getVehicles  found: ${result.length}`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 getVehicles failed'
                });
            }
        }));
        app.route("/getVehiclesByOwner").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getVehiclesByOwner requested `;
            console.log(msg);
            try {
                const result = yield vehicle_1.default.find({ ownerID: req.body.ownerID });
                log_1.log(`🌽🌽🌽 getVehiclesByOwner vehicles found: ${result.length}`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 getVehiclesByOwner failed'
                });
            }
        }));
        app.route("/getVehiclesByAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getVehiclesByAssociation requested `;
            console.log(msg);
            try {
                const result = yield vehicle_1.default.find({ associationID: req.body.associationID });
                log_1.log(`🌽🌽🌽 getVehiclesByAssociation vehicles found: ${result.length}`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 getVehiclesByAssociation failed'
                });
            }
        }));
        app.route("/getVehicleRoutesByAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getVehicleRoutesByAssociation requested `;
            console.log(msg);
            try {
                const days = parseInt(req.body.days);
                const cutOff = moment_1.default().subtract(days, "days").toISOString();
                const result = yield vehicle_route_assignment_1.default.find({ associationID: req.body.associationID,
                    created: { $gt: cutOff } });
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 getVehicleRoutesByAssociation failed'
                });
            }
        }));
        app.route("/getVehicleRoutesByVehicle").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getVehicleRoutesByVehicle requested `;
            console.log(msg);
            try {
                const result = yield vehicle_route_assignment_1.default.find({ vehicleID: req.body.vehicleID });
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: '🍎🍎🍎🍎 getVehicleRoutesByVehicle failed'
                });
            }
        }));
    }
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=vehicle_controller.js.map