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
const landmark_1 = __importDefault(require("../models/landmark"));
const database_1 = __importDefault(require("../database"));
const log_1 = __importDefault(require("../log"));
const route_1 = __importDefault(require("../models/route"));
const uuid = require("uuid");
const mongoose_1 = require("mongoose");
class LandmarkController {
    routes(app) {
        log_1.default(`🏓🏓🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${database_1.default.name} 🥦🥦🥦`);
        /////////
        app.route("/addRouteToLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addRouteToLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const routeID = req.body.routeID;
                const landmarkID = req.body.landmarkID;
                const routePoint = req.body.routePoint;
                const route = yield route_1.default.findOne({
                    routeID: routeID
                });
                console.log(route);
                console.log(`id from route:  💦 💦 ${route.id} 💦 💦`);
                const landmark = yield landmark_1.default.findOne({
                    landmarkID: landmarkID
                });
                landmark.routeDetails.forEach((element) => {
                    console.log(element);
                });
                let isFound = false;
                landmark.routeDetails.forEach((element) => {
                    if (element.routeID === routeID) {
                        isFound = true;
                    }
                });
                if (isFound) {
                    throw new Error('Route already listed in Landmark');
                }
                landmark.routeDetails.push({
                    routeID: routeID,
                    name: route.name,
                });
                const result = yield landmark.save();
                log_1.default(`🔆🔆🔆 💙 landmark ${landmark.landmarkName} updated. Will update route point ....`);
                // TODO - update routePount
                const mRes = yield route_1.default.updateOne({ "_id": new mongoose_1.Types.ObjectId(route.id), "routePoints.index": routePoint.index }, { $set: { "routePoints.$.landmarkID": landmark.landmarkID, "routePoints.$.landmarkName": landmark.landmarkName } });
                log_1.default(`🔆🔆🔆 routePoint updated. 🍎🍎🍎🍎 sweet!: 💙 `);
                console.log(mRes);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds. added route to landmark ${landmark.landmarkName}`);
                res.status(200).json(result);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({
                    error: err.message,
                    message: ' 🍎🍎🍎🍎 addRouteToLandmark failed'
                });
            }
        }));
        app.route("/findLandmarksByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /findLandmarksByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const result = yield landmark_1.default.find({
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
                //// log(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query: landmarks found: 🍎 ${result.length} 🍎`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getLandmarks failed'
                });
            }
        }));
        app.route("/getLandmarksByRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /getLandmarksByRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                log_1.default(`💦 💦 💦 💦 💦 💦 routeID: ☘️☘️ ${req.body.routeID} ☘️☘️`);
                const result = yield landmark_1.default.find({
                    'routeDetails.routeID': req.body.routeID
                });
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 getLandmarksByRoute: elapsed time: 💙 ${end / 1000 - now / 1000} 💙 seconds for query. found ${result.length} landmarks`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getLandmarks failed'
                });
            }
        }));
        app.route("/getLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /getLandmarks requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const result = yield landmark_1.default.find();
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 getLandmarks: elapsed time: 💙 ${end / 1000 - now / 1000} 💙 seconds for query. found ${result.length} landmarks`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getLandmarks failed'
                });
            }
        }));
        app.route("/addLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const landmark = new landmark_1.default(req.body);
                landmark.landmarkID = uuid();
                landmark.created = new Date().toISOString();
                const result = yield landmark.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addLandmark failed'
                });
            }
        }));
    }
}
exports.LandmarkController = LandmarkController;
exports.default = LandmarkController;
//# sourceMappingURL=landmark_controller.js.map