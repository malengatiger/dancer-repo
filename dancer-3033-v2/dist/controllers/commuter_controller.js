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
const commuter_request_1 = __importDefault(require("../models/commuter_request"));
const log_1 = __importDefault(require("../log"));
const moment_1 = __importDefault(require("moment"));
const commuter_arrival_landmark_1 = __importDefault(require("../models/commuter_arrival_landmark"));
const commuter_pickup_landmark_1 = __importDefault(require("../models/commuter_pickup_landmark"));
const commuter_starting_landmark_1 = __importDefault(require("../models/commuter_starting_landmark"));
const commuter_rating_1 = __importDefault(require("../models/commuter_rating"));
const commuter_panic_1 = __importDefault(require("../models/commuter_panic"));
const commuter_ratings_aggregate_1 = __importDefault(require("../models/commuter_ratings_aggregate"));
class CommuterController {
    //CommuterRatingsAggregate
    routes(app) {
        console.log(`🏓🏓🏓🏓🏓    CommuterController:  💙  setting up default Commuter routes ...`);
        app.route("/addCommuterRequest").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addCommuterRequest requested `;
            console.log(msg);
            try {
                const comm = new commuter_request_1.default(req.body);
                const result0 = yield comm.save();
                comm.commuterRequestId = result0._id;
                const result = yield comm.save();
                log_1.default(result);
                res.status(200).json(result0);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRequest failed'
                });
            }
        }));
        app.route("/updateCommuterRequestScanned").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 updateCommuterRequestScanned requested `;
            console.log(msg);
            try {
                const commuterRequestId = req.body.commuterRequestId;
                const commReq = yield commuter_request_1.default.findOne({ commuterRequestId: commuterRequestId });
                if (!commReq) {
                    throw new Error('CommuterRequest not found');
                }
                commReq.scanned = req.body.scanned;
                const result = yield commReq.save();
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateCommuterRequestScanned failed'
                });
            }
        }));
        app.route("/updateCommuterRequestAutoDetected").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 updateCommuterRequestAutoDetected requested `;
            console.log(msg);
            try {
                const commuterRequestId = req.body.commuterRequestId;
                const commReq = yield commuter_request_1.default.findOne({ commuterRequestId: commuterRequestId });
                if (!commReq) {
                    throw new Error('CommuterRequest not found');
                }
                commReq.autoDetected = req.body.autoDetected;
                const result = yield commReq.save();
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateCommuterRequestAutoDetected failed'
                });
            }
        }));
        app.route("/addCommuterRatingsAggregate").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterRatingsAggregate requested `;
            console.log(msg);
            try {
                const result = new commuter_ratings_aggregate_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRatingsAggregate failed'
                });
            }
        });
        app.route("/addCommuterArrivalLandmark").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterArrivalLandmark requested `;
            console.log(msg);
            try {
                const result = new commuter_arrival_landmark_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterArrivalLandmark failed'
                });
            }
        });
        app.route("/addCommuterPickupLandmark").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterPickupLandmark requested `;
            console.log(msg);
            try {
                const result = new commuter_pickup_landmark_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterPickupLandmark failed'
                });
            }
        });
        app.route("/getCommuterPickupLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCommuterPickupLandmarks requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const landmarkId = req.body.landmarkId;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = commuter_pickup_landmark_1.default.find({
                    fromLandmarkId: landmarkId,
                    created: { $gt: cutOff }
                });
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterPickupLandmarks failed'
                });
            }
        }));
        app.route("/getCommuterArrivalLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCommuterArrivalLandmarks requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const landmarkId = req.body.landmarkId;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = commuter_arrival_landmark_1.default.find({
                    fromLandmarkId: landmarkId,
                    created: { $gt: cutOff }
                });
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterArrivalLandmarks failed'
                });
            }
        }));
        app.route("/getCommuterStartingLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCommuterStartingLandmarks requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const landmarkId = parseInt(req.body.landmarkId);
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = commuter_starting_landmark_1.default.find({
                    landmarkId: landmarkId,
                    created: { $gt: cutOff }
                });
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterStartingLandmarks failed'
                });
            }
        }));
        app.route("/addCommuterStartingLandmark").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterStartingLandmark requested `;
            console.log(msg);
            try {
                const result = new commuter_starting_landmark_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterStartingLandmark failed'
                });
            }
        });
        app.route("/addCommuterRating").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterRating requested `;
            console.log(msg);
            try {
                const result = new commuter_rating_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRating failed'
                });
            }
        });
        app.route("/addCommuterPanic").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addCommuterPanic requested `;
            console.log(msg);
            try {
                const panic = new commuter_panic_1.default(req.body);
                const result0 = yield panic.save();
                panic.commuterPanicId = result0._id;
                const result = yield panic.save();
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterPanic failed'
                });
            }
        }));
        app.route("/getCommuterRequestsByFromLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCommuterRequestsByFromLandmark requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const fromLandmarkId = parseInt(req.body.fromLandmarkId);
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_request_1.default.find({ fromLandmarkId: fromLandmarkId, created: { $gt: cutOff }, });
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterRequestsByFromLandmark failed'
                });
            }
        }));
        app.route("/getCommuterRequestsByToLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCommuterRequestsByToLandmark requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const toLandmarkId = req.body.toLandmarkId;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_request_1.default.find({ toLandmarkId: toLandmarkId, created: { $gt: cutOff }, });
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterRequestsByToLandmark failed'
                });
            }
        }));
        app.route("/getCommuterRequestsByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCommuterRequestsByLocation requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_request_1.default.find({
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
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterRequestsByLocation failed'
                });
            }
        }));
    }
}
exports.CommuterController = CommuterController;
//# sourceMappingURL=commuter_controller.js.map