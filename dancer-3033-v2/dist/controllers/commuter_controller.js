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
const v1_1 = __importDefault(require("uuid/v1"));
const user_1 = __importDefault(require("../models/user"));
const commuter_panic_location_1 = __importDefault(require("../models/commuter_panic_location"));
const safety_network_buddy_1 = __importDefault(require("../models/safety_network_buddy"));
const commuter_prize_1 = __importDefault(require("../models/commuter_prize"));
const commuter_incentive_type_1 = __importDefault(require("../models/commuter_incentive_type"));
const commuter_incentive_1 = __importDefault(require("../models/commuter_incentive"));
class CommuterController {
    routes(app) {
        console.log(`🏓🏓🏓    CommuterController:  💙  setting up default Commuter routes ...`);
        app.route("/addCommuterRequest").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽 POST 🌽🌽 addCommuterRequest requested `;
            console.log(msg);
            try {
                const comm = new commuter_request_1.default(req.body);
                comm.commuterRequestID = v1_1.default();
                comm.created = new Date().toISOString();
                comm.scanned = false;
                const result = yield comm.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRequest failed'
                });
            }
        }));
        app.route("/updateCommuterRequestScanned").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽 POST 🌽🌽 updateCommuterRequestScanned requested `;
            console.log(msg);
            try {
                const commuterRequestID = req.body.commuterRequestID;
                const commReq = yield commuter_request_1.default.findOne({ commuterRequestID: commuterRequestID });
                if (!commReq) {
                    throw new Error('CommuterRequest not found');
                }
                commReq.scanned = req.body.scanned;
                commReq.associationID = req.body.associationID;
                commReq.associationName = req.body.associationName;
                commReq.vehicleID = req.body.vehicleID;
                commReq.vehicleReg = req.body.vehicleReg;
                const result = yield commReq.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateCommuterRequestScanned failed'
                });
            }
        }));
        app.route("/updateCommuterRequestVehicle").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽 POST 🌽🌽 updateCommuterRequestVehicle requested `;
            console.log(msg);
            try {
                const commuterRequestID = req.body.commuterRequestID;
                const commReq = yield commuter_request_1.default.findOne({ commuterRequestID: commuterRequestID });
                if (!commReq) {
                    throw new Error('CommuterRequest not found');
                }
                commReq.associationID = req.body.associationID;
                commReq.associationName = req.body.associationName;
                commReq.vehicleID = req.body.vehicleID;
                commReq.vehicleReg = req.body.vehicleReg;
                const result = yield commReq.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateCommuterRequestVehicle failed'
                });
            }
        }));
        app.route("/updateCommuterRequestAutoDetected").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽 POST 🌽🌽 updateCommuterRequestAutoDetected requested `;
            console.log(msg);
            try {
                const commuterRequestID = req.body.commuterRequestID;
                const commReq = yield commuter_request_1.default.findOne({ commuterRequestID: commuterRequestID });
                if (!commReq) {
                    throw new Error('CommuterRequest not found');
                }
                commReq.autoDetected = req.body.autoDetected;
                commReq.associationID = req.body.associationID;
                commReq.associationName = req.body.associationName;
                commReq.vehicleID = req.body.vehicleID;
                commReq.vehicleReg = req.body.vehicleReg;
                const result = yield commReq.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateCommuterRequestAutoDetected failed'
                });
            }
        }));
        app.route("/addCommuterRatingsAggregate").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽 POST 🌽🌽 addCommuterRatingsAggregate requested `;
            console.log(msg);
            try {
                const c = new commuter_ratings_aggregate_1.default(req.body);
                c.commuterRatingsAggregateID = v1_1.default();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRatingsAggregate failed'
                });
            }
        }));
        app.route("/addCommuterArrivalLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽 POST 🌽🌽 addCommuterArrivalLandmark requested `;
            console.log(msg);
            try {
                const c = new commuter_arrival_landmark_1.default(req.body);
                c.commuterArrivalLandmarkID = v1_1.default();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                log_1.default(err);
                res.status(400).json({
                    error: JSON.stringify(err),
                    message: ' 🍎🍎🍎🍎 addCommuterArrivalLandmark failed'
                });
            }
        }));
        app.route("/addCommuterPickupLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterPickupLandmark requested `;
            console.log(msg);
            try {
                const c = new commuter_pickup_landmark_1.default(req.body);
                c.commuterPickupLandmarkID = v1_1.default();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterPickupLandmark failed'
                });
            }
        }));
        app.route("/getCommuterPickupLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterPickupLandmarks requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const landmarkID = req.body.landmarkID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_pickup_landmark_1.default.find({
                    fromLandmarkID: landmarkID,
                    created: { $gt: cutOff }
                });
                // log(result);
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
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterArrivalLandmarks requested `;
            console.log(msg);
            log_1.default(req.body);
            try {
                const minutes = parseInt(req.body.minutes);
                const landmarkID = req.body.landmarkID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_arrival_landmark_1.default.find({
                    fromLandmarkID: landmarkID,
                    created: { $gt: cutOff }
                });
                // log(result);
                res.status(200).json(result);
                log_1.default(`\n\n 🍎🍎🍎🍎 getCommuterArrivalLandmarks: found : 🍎🍎🍎🍎 ${result.length} 🍎🍎🍎🍎\n\n`);
            }
            catch (err) {
                log_1.default(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterArrivalLandmarks failed'
                });
            }
        }));
        app.route("/getCommuterStartingLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterStartingLandmarks requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const landmarkID = parseInt(req.body.landmarkID);
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_starting_landmark_1.default.find({
                    landmarkID: landmarkID,
                    created: { $gt: cutOff }
                });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterStartingLandmarks failed'
                });
            }
        }));
        app.route("/addCommuterStartingLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterStartingLandmark requested `;
            console.log(msg);
            try {
                const c = new commuter_starting_landmark_1.default(Object.assign({}, req.body, { position: JSON.parse(req.body.position) }));
                c.commuterStartingLandmarkID = v1_1.default();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json({
                    result
                });
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterStartingLandmark failed'
                });
            }
        }));
        app.route("/addCommuterArrivalLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterArrivalLandmark requested `;
            console.log(msg);
            try {
                const c = new commuter_arrival_landmark_1.default(req.body);
                c.commuterArrivalLandmarkID = v1_1.default();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterArrivalLandmark failed'
                });
            }
        }));
        app.route("/addCommuterRating").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterRating requested `;
            console.log(msg);
            try {
                const commuterRequest = yield commuter_request_1.default.findOne({
                    userID: req.body.userID
                });
                if (commuterRequest != null) {
                    const c = new commuter_rating_1.default(Object.assign({}, req.body, { commuterRequestID: commuterRequest._id }));
                    c.commuterRatingID = v1_1.default();
                    c.created = new Date().toISOString();
                    const result = yield c.save();
                    // log(result);
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json({
                        err: 'Commuter request not found'
                    });
                }
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRating failed'
                });
            }
        }));
        app.route("/addSafetyNetworkBuddy").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addSafetyNetworkBuddy requested `;
            console.log(msg);
            try {
                const buddy = new safety_network_buddy_1.default(req.body);
                const result = yield buddy.save();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addSafetyNetworkBuddy failed'
                });
            }
        }));
        app.route("/commuterClaimPrize").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 commuterClaimPrize requested `;
            console.log(msg);
            try {
                const prize = new commuter_prize_1.default(req.body);
                const result = yield prize.save();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 commuterClaimPrize failed'
                });
            }
        }));
        app.route("/getIncentiveTypeByAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getIncentiveTypeByAssociation requested `;
            console.log(msg);
            try {
                const incentiveType = yield commuter_incentive_type_1.default.findOne({
                    associationID: req.body.associationID
                });
                // log(result);
                res.status(200).json(incentiveType);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getIncentiveTypeByAssociation failed'
                });
            }
        }));
        app.route("/addCommuterIncentiveType").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterIncentiveType requested `;
            console.log(msg);
            try {
                const incentiveType = new commuter_incentive_type_1.default(req.body);
                const result = yield incentiveType.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterIncentiveType failed'
                });
            }
        }));
        app.route("/addCommuterIncentive").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterIncentive requested `;
            console.log(msg);
            try {
                const incentiveType = yield commuter_incentive_type_1.default.findById(req.body.incentiveTypeID);
                if (incentiveType === null) {
                    throw {
                        message: 'Incentive type not found'
                    };
                }
                const user = yield user_1.default.findOne({ userID: req.body.userID });
                if (user === null) {
                    throw {
                        message: 'User type not found'
                    };
                }
                const incentive = new commuter_incentive_1.default(Object.assign({}, req.body, { incentive: incentiveType, user: user }));
                const result = yield incentive.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterIncentive failed'
                });
            }
        }));
        app.route("/findSafetyNetworkBuddiesByUserID").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 findSafetyNetworkBuddiesByUserID requested `;
            console.log(msg);
            try {
                const buddies = yield safety_network_buddy_1.default.find({ userID: req.body.userID });
                res.status(200).json(buddies);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findSafetyNetworkBuddiesByUserID failed'
                });
            }
        }));
        app.route("/addCommuterPanicLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterPanicLocation requested `;
            console.log(msg);
            try {
                const commuterPanic = yield commuter_panic_1.default.findById(req.body.commuterPanicID);
                if (commuterPanic) {
                    const panicData = {
                        position: {
                            type: 'Points',
                            coordinates: [
                                req.body.longitude,
                                req.body.latitude
                            ]
                        },
                        commuterPanicID: req.body.commuterPanicID
                    };
                    const panic = new commuter_panic_location_1.default(panicData);
                    panic.created = new Date().toISOString();
                    const result = yield panic.save();
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json({
                        message: 'Commuter Panic not found'
                    });
                }
                // log(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterPanicLocation failed'
                });
            }
        }));
        app.route("/addCommuterPanic").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 addCommuterPanic requested `;
            console.log(msg);
            try {
                const panic = new commuter_panic_1.default(req.body);
                const result = yield panic.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterPanic failed'
                });
            }
        }));
        app.route("/getCommuterPanicsByUserID").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterPanicsByUserID requested `;
            console.log(msg);
            try {
                const panics = yield commuter_panic_1.default.find({ userID: req.body.userID });
                // log(result);
                res.status(200).json(panics);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterPanicsByUserID failed'
                });
            }
        }));
        app.route("/getPanicLocations").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getPanicLocations requested `;
            console.log(msg);
            try {
                const panics = yield commuter_panic_location_1.default.find({ commuterPanicID: req.body.commuterPanicID });
                // log(result);
                res.status(200).json(panics);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getPanicLocations failed'
                });
            }
        }));
        app.route("/getCommuterRequestsByUserID").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByFromLandmark requested `;
            console.log(msg);
            try {
                const uid = req.body.firebaseUID;
                const result = (yield user_1.default.find({ userID: uid })).reverse();
                if (result == null) {
                    res.status(400).json({
                        error: 'User not found',
                        message: 'User not found'
                    });
                }
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterRequestsByUserID failed'
                });
            }
        }));
        app.route("/getCommuterRequestsByID").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByID requested `;
            console.log(msg);
            try {
                const id = req.body.commuterRequestID;
                const result = yield commuter_request_1.default.findById(id);
                if (result == null) {
                    res.status(400).json({
                        error: 'Commuter request not found',
                        message: 'Commuter request not found'
                    });
                }
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterRequestsByID failed'
                });
            }
        }));
        app.route("/getCommuterRequestsByFromLandmark").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByFromLandmark requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const fromLandmarkID = req.body.fromLandmarkID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_request_1.default.find({ fromLandmarkID: fromLandmarkID, created: { $gt: cutOff }, });
                // log(result);
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
            const msg = `\n\n🌽 POST 🌽🌽 getCommuterRequestsByToLandmark requested `;
            console.log(msg);
            try {
                const minutes = parseInt(req.body.minutes);
                const toLandmarkID = req.body.toLandmarkID;
                const cutOff = moment_1.default().subtract(minutes, "minutes").toISOString();
                const result = yield commuter_request_1.default.find({ toLandmarkID: toLandmarkID, created: { $gt: cutOff }, });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCommuterRequestsByToLandmark failed'
                });
            }
        }));
        app.route("/findCommuterRequestsByUserID").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 findCommuterRequestsByUserID requested `;
            console.log(msg);
            try {
                const uid = req.body.UID;
                const result = (yield commuter_request_1.default.find({ userID: uid })).reverse();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findCommuterRequestsByUserID failed'
                });
            }
        }));
        app.route("/findCommuterRequestsByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `\n\n🌽 POST 🌽🌽 findCommuterRequestsByLocation requested `;
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
                    },
                    createdAt: { $gt: cutOff }
                });
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findCommuterRequestsByLocation failed'
                });
            }
        }));
    }
}
exports.CommuterController = CommuterController;
//# sourceMappingURL=commuter_controller.js.map