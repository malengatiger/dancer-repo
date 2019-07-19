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
const geolib_1 = require("geolib");
const route_1 = __importDefault(require("../models/route"));
class LandmarkController {
    routes(app) {
        log_1.default(`🏓🏓🏓🏓🏓    LandmarkController: 💙  setting up default Landmark routes ... 🥦🥦🥦 ${database_1.default.name} 🥦🥦🥦`);
        /////////
        app.route("/addRouteToLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addRouteToLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const now = new Date().getTime();
                const routeID = req.body.routeID;
                const landmarkID = req.body.landmarkID;
                const route = yield route_1.default.findOne({
                    routeID: routeID
                });
                const landmark = yield landmark_1.default.findOne({
                    landmarkID: landmarkID
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
                log_1.default(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds. added route to landmark ${landmark.landmarkName}`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
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
                //const result = await Landmark.find();
                log_1.default(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                console.log(`\n\n🌺  Calculated distances between landmarks   🌺 🌸 \n`);
                LandmarkController.calculateDistances(result, latitude, longitude);
                console.log(`\n💙 💙 💙 landmarks found:  🌸  ${result.length}   💙 💚 💛\n`);
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
                log_1.default(`💦 💦 💦 💦 💦 💦 routeID: ☘️☘️ ${req.body.id} ☘️☘️`);
                const result = yield landmark_1.default.find({
                    'routeDetails.routeID': req.body.id
                });
                //const result = await Landmark.find();
                log_1.default(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
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
                const result0 = yield landmark.save();
                landmark.landmarkID = result0._id;
                const result = yield landmark.save();
                log_1.default(result);
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
    static calculateDistances(landmarks, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function* () {
            // use route points to calculate distance between landmarks ....
            const from = {
                latitude,
                longitude,
            };
            for (const m of landmarks) {
                const to = {
                    latitude: m.position.coordinates[1],
                    longitude: m.position.coordinates[0],
                };
                const dist = geolib_1.getDistance(from, to);
                const f = new Intl.NumberFormat("en-us", { maximumSignificantDigits: 3 }).format(dist / 1000);
                m.distance = f + " km (as the crow flies)";
                console.log(`🌸  ${f}  🍎  ${m.landmarkName}  🍀  ${m.routeDetails[0].name}`);
            }
        });
    }
}
exports.LandmarkController = LandmarkController;
exports.default = LandmarkController;
//# sourceMappingURL=landmark_controller.js.map