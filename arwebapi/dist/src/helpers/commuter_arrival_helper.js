"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const commuter_arrival_landmark_1 = tslib_1.__importDefault(require("../models/commuter_arrival_landmark"));
class CommuterArrivalLandmarkHelper {
    static onCommuterArrivalLandmarkAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterArrivalLandmarkChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterArrivalLandmark in stream:   🍀   🍀  ${event.fullDocument.CommuterArrivalLandmarkName} 🍎  `);
        });
    }
    static addCommuterArrivalLandmark(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            console.log(`....... 😍 😍 😍  about to add CommuterArrivalLandmark:  👽 👽 👽`);
            console.log(request);
            const commuterArrivalLandmark = new CommuterArrivalLandmarkModel({
                commuterRequestId: request.commuterRequestId,
                fromLandmarkId: request.fromLandmarkId,
                fromLandmarkName: request.fromLandmarkName,
                position: request.position,
                routeId: request.routeId,
                routeName: request.routeName,
                createdAt: new Date().toISOString(),
                toLandmarkId: request.toLandmarkId,
                toLandmarkName: request.toLandmarkName,
                userId: request.userId,
                vehicleId: request.vehicleId,
                vehicleReg: request.vehicleReg,
                departureId: request.departureId,
            });
            const m = yield commuterArrivalLandmark.save();
            m.commuterArrivalLandmarkId = m.id;
            yield m.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterArrivalLandmark added  for: 🍎  ${commuterArrivalLandmark.fromLandmarkName} \n\n`);
            console.log(commuter_arrival_landmark_1.default);
            return m;
        });
    }
    static findByLocation(latitude, longitude, radiusInKM, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const time = Moment.utc().subtract(minutes, "minutes");
            const RADIUS = radiusInKM * 1000;
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
            const coords = [latitude, longitude];
            const mm = yield CommuterArrivalLandmarkModel.find({
                createdAt: { $gt: time.toISOString() },
            }).where('position')
                .near({
                center: {
                    type: 'Point',
                    coordinates: coords,
                    spherical: true,
                    maxDistance: RADIUS,
                },
            }).exec().catch((reason) => {
                console.log(`ppfffffffft! fucked!`);
                console.error(reason);
                throw reason;
            });
            console.log(`☘️ ☘️ ☘️ Commuter Request search found  🍎  ${mm.length}  🍎 `);
            return mm;
        });
    }
    static findByFromLandmark(landmarkID, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByFromLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByToLandmark(landmarkID, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByToLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByRoute(routeID, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByRouteId(routeID, minutes);
            return list;
        });
    }
    static findByUser(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByUser(user);
            return list;
        });
    }
    static findAll(minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findAll(minutes);
            return list;
        });
    }
}
exports.CommuterArrivalLandmarkHelper = CommuterArrivalLandmarkHelper;
//# sourceMappingURL=commuter_arrival_helper.js.map