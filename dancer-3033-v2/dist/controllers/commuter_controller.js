"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commuter_request_1 = __importDefault(require("../models/commuter_request"));
const log_1 = __importDefault(require("../log"));
const commuter_arrival_landmark_1 = __importDefault(require("../models/commuter_arrival_landmark"));
const commuter_pickup_landmark_1 = __importDefault(require("../models/commuter_pickup_landmark"));
const commuter_starting_landmark_1 = __importDefault(require("../models/commuter_starting_landmark"));
const commuter_rating_1 = __importDefault(require("../models/commuter_rating"));
const commuter_panic_1 = __importDefault(require("../models/commuter_panic"));
class CommuterController {
    routes(app) {
        console.log(`🏓🏓🏓🏓🏓    CommuterController:  💙  setting up default Commuter routes ...`);
        app.route("/addCommuterRequest").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterRequest requested `;
            console.log(msg);
            try {
                const result = new commuter_request_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterRequest failed'
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
        app.route("/addCommuterPanic").post((req, res) => {
            const msg = `🌽🌽🌽 addCommuterPanic requested `;
            console.log(msg);
            try {
                const result = new commuter_panic_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCommuterPanic failed'
                });
            }
        });
    }
}
exports.CommuterController = CommuterController;
//# sourceMappingURL=commuter_controller.js.map