"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Vehicle_helper_1 = require("../helpers/Vehicle_helper");
const util_1 = tslib_1.__importDefault(require("./util"));
class VehicleExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓🏓🏓🏓🏓    VehicleExpressRoutes: 💙  setting up default Vehicle related express routes ...`);
        app.route("/addVehicle").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.addVehicle(req.body.vehicleReg, req.body.associationID, req.body.associationName, req.body.ownerID, req.body.ownerName, req.body.vehicleTypeID, req.body.photos);
                res.status(200).json({
                    message: `🏓  🏓  🏓  addVehicle: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addVehicle failed");
            }
        }));
        app.route("/addVehicleArrival").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addVehicleArrival requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.addVehicleArrival(req.body.vehicleReg, req.body.vehicleId, req.body.landmarkName, req.body.landmarkId, req.body.latitude, req.body.longitude, req.body.make, req.body.model, parseInt(req.body.capacity));
                res.status(200).json({
                    message: `🏓  🏓  🏓  addVehicleArrival: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addVehicleArrival failed");
            }
        }));
        app.route("/addVehicleDeparture").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addVehicleDeparture requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.addVehicleDeparture(req.body.vehicleReg, req.body.vehicleId, req.body.landmarkName, req.body.landmarkId, req.body.latitude, req.body.longitude, req.body.make, req.body.model, parseInt(req.body.capacity));
                res.status(200).json({
                    message: `🏓  🏓  🏓  addVehicleDeparture: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addVehicleDeparture failed");
            }
        }));
        app.route("/addVehicleType").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addVehicleType requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.addVehicleType(req.body.make, req.body.model, req.body.capacity, req.body.countryID, req.body.countryName);
                res.status(200).json({
                    message: `🏓  🏓  addVehicleType: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addVehicleType failed");
            }
        }));
        //
        app.route("/findVehiclesByLocation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getVehiclesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehiclesByLocation(req.body.latitude, req.body.longitude, req.body.withinMinutes, req.body.radiusInKM);
                res.status(200).json({
                    message: `🏓  🏓  🏓  getVehiclesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehiclesByLocation failed");
            }
        }));
        app.route("/getVehiclesByAssociation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getVehiclesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.getVehiclesByAssociation(req.body.associationID);
                res.status(200).json({
                    message: `🏓  🏓  🏓  addVehicle: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getVehiclesByAssociation failed");
            }
        }));
        app.route("/getVehiclesByOwner").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getVehiclesByOwner requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.getVehiclesByOwner(req.body.ownerID);
                res.status(200).json({
                    message: `🏓  🏓 getVehiclesByOwner: ${req.body.ownerID} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getVehiclesByOwner failed");
            }
        }));
        app.route("/getAllVehicles").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getAllVehicles requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.getVehicles();
                res.status(200).json({
                    message: `🏓  🏓 getAllVehicles OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getAllVehicles failed");
            }
        }));
        app.route("/findVehicleArrivalsByLocation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findVehicleArrivalsByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehicleArrivalsByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseInt(req.body.minutes), parseFloat(req.body.radiusInKM));
                res.status(200).json({
                    message: `🏓  🏓 findVehicleArrivalsByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehicleArrivalsByLocation failed");
            }
        }));
        app.route("/findVehicleDeparturesByLocation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findVehicleDeparturesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehicleDeparturesByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseInt(req.body.minutes), parseFloat(req.body.radiusInKM));
                res.status(200).json({
                    message: `🏓  🏓 findVehicleDeparturesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehicleDeparturesByLocation failed");
            }
        }));
        app.route("/findVehicleArrivalsByLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findVehicleArrivalsByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehicleArrivalsByLandmark(req.body.landmarkId, parseInt(req.body.minutes));
                res.status(200).json({
                    message: `🏓  🏓 findVehicleArrivalsByLandmark OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehicleArrivalsByLandmark failed");
            }
        }));
        app.route("/findVehicleDeparturesByLandmark").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findVehicleDeparturesByLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehicleDeparturesByLandmark(req.body.landmarkId, parseInt(req.body.minutes));
                res.status(200).json({
                    message: `🏓  🏓 findVehicleDeparturesByLandmark OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehicleDeparturesByLandmark failed");
            }
        }));
        app.route("/findVehicleArrivalsByVehicle").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findVehicleArrivalsByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehicleArrivalsByVehicle(req.body.vehicleId, parseInt(req.body.minutes));
                res.status(200).json({
                    message: `🏓  🏓 findVehicleArrivalsByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehicleArrivalsByVehicle failed");
            }
        }));
        app.route("/findVehicleDeparturesByVehicle").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findVehicleDeparturesByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findVehicleDeparturesByVehicle(req.body.vehicleId, parseInt(req.body.minutes));
                res.status(200).json({
                    message: `🏓  🏓 findVehicleDeparturesByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findVehicleDeparturesByVehicle failed");
            }
        }));
        app.route("/findAllVehicleArrivalsByVehicle").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findAllVehicleArrivalsByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findAllVehicleArrivalsByVehicle(req.body.vehicleId);
                res.status(200).json({
                    message: `🏓  🏓 findAllVehicleArrivalsByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findAllVehicleArrivalsByVehicle failed");
            }
        }));
        app.route("/findAllVehicleDeparturesByVehicle").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findAllVehicleDeparturesByVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findAllVehicleDeparturesByVehicle(req.body.vehicleId);
                res.status(200).json({
                    message: `🏓  🏓 findAllVehicleDeparturesByVehicle OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findAllVehicleDeparturesByVehicle failed");
            }
        }));
        app.route("/findAllVehicleArrivals").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findAllVehicleArrivals requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findAllVehicleArrivals(parseInt(req.body.minutes));
                res.status(200).json({
                    message: `🏓  🏓 findAllVehicleArrivals OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findAllVehicleArrivals failed");
            }
        }));
        app.route("/findAllVehicleDepartures").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findAllVehicleDepartures requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield Vehicle_helper_1.VehicleHelper.findAllVehicleDepartures(parseInt(req.body.minutes));
                res.status(200).json({
                    message: `🏓  🏓 findAllVehicleDepartures OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findAllVehicleDepartures failed");
            }
        }));
    }
}
exports.VehicleExpressRoutes = VehicleExpressRoutes;
//# sourceMappingURL=vehicle_routes.js.map