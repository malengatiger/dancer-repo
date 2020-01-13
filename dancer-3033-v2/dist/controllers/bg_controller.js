"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../log"));
const messaging_1 = require("../helpers/messaging");
class BGController {
    routes(app) {
        console.log(`🏓🏓🏓    BGController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`);
        app.route("/locations").post((req, res) => {
            const msg = `🍏 BGController/locations: Adding background location: 💙💙💙💙💙💙 ${req.body}`;
            log_1.default(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('bgLocations').add(req.body);
                    log_1.default('🍏 Background location added to  😍 Firestore');
                }
                else {
                    log_1.default(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ');
                }
            }
            catch (e) {
                console.error('Firestore problem. may not be available');
            }
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/geofences").post((req, res) => {
            const msg = `🍎  BGController/geofences: Adding geofence action: 💙💙💙💙💙💙 ${req.body}`;
            log_1.default(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('geofences').add(req.body);
                    log_1.default('🍎  Background geofence added to  😍 Firestore');
                }
                else {
                    log_1.default(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ');
                }
            }
            catch (e) {
                console.error('Firestore problem. may not be available');
            }
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/heartbeats").post((req, res) => {
            const msg = `🧡 BGController/heartbeats: Adding heartbeat : 💙💙💙💙💙💙 ${req.body}`;
            log_1.default(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('heartbeats').add(req.body);
                    log_1.default('🧡 Background heartbeat added to  😍 Firestore');
                }
                else {
                    log_1.default(' 😍 😍 😍 Background heartbeat is null. 🥦🥦 ignore! ');
                }
            }
            catch (e) {
                console.error('Firestore problem. may not be available');
            }
            res.status(200).json({
                message: msg,
            });
        });
    }
}
exports.BGController = BGController;
//# sourceMappingURL=bg_controller.js.map