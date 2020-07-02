"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BGController = void 0;
const messaging_1 = require("../helpers/messaging");
const log_1 = require("../log");
class BGController {
    routes(app) {
        console.log(`🏓    BGController:  💙 setting up background locations caching ... ${app.name}`);
        app.route("/locations").post((req, res) => {
            const msg = `🍏 BGController/locations: Adding background location: 💙💙💙💙💙💙 ${req.body}`;
            log_1.log(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('locations').add(req.body);
                    log_1.log('🍏 Background location added to  😍 Firestore');
                }
                else {
                    log_1.log(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ');
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
            log_1.log(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('geofences').add(req.body);
                    log_1.log('🍎  Background geofence added to  😍 Firestore');
                }
                else {
                    log_1.log(' 😍 😍 😍 Background location is null. 🥦🥦 ignore! ');
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
            log_1.log(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('heartbeats').add(req.body);
                    log_1.log('🧡 Background heartbeat added to  😍 Firestore');
                }
                else {
                    log_1.log(' 😍 😍 😍 Background heartbeat is null. 🥦🥦 ignore! ');
                }
            }
            catch (e) {
                console.error('Firestore problem. may not be available');
            }
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/activityChanges").post((req, res) => {
            const msg = `🧡 BGController/activityChanges: Adding activityChanges : 💙💙💙💙💙💙 ${req.body}`;
            log_1.log(msg);
            try {
                if (req.body) {
                    let firestore = messaging_1.appTo.firestore();
                    firestore.collection('activityChanges').add(req.body);
                    log_1.log('🧡 Background activityChanges added to  😍 Firestore');
                }
                else {
                    log_1.log(' 😍 😍 😍 Background activityChanges is null. 🥦🥦 ignore! ');
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