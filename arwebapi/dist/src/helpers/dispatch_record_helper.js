"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const dispatch_record_1 = tslib_1.__importDefault(require("../models/dispatch_record"));
class DispatchRecordHelper {
    static onDispatchRecordAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onDispatchRecordAddedEvent: operationType: 👽 👽 👽  ${event.operationType},  DispatchRecord in stream:   🍀   🍀  ${event.fullDocument.CommuterRequestName} 🍎  `);
        });
    }
    static addDispatchRecord(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const dispatchRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            console.log(`....... 😍 😍 😍  about to add DispatchRecord:  👽 👽 👽`);
            console.log(request);
            const dispRecord = new dispatchRecordModel({
                dispatched: request.dispatched,
                landmarkId: request.landmarkId,
                landmarkName: request.landmarkName,
                passengers: request.passengers,
                position: {
                    coordinates: [request.longitude, request.latitude],
                    type: "Point",
                },
                routeId: request.routeId,
                routeName: request.routeName,
                vehicleId: request.vehicleId,
                vehicleReg: request.vehicleReg,
                dispatchedAt: new Date().toISOString(),
                marshalId: request.marshalId,
                marshalName: request.marshalName,
            });
            const m = yield dispRecord.save();
            m.setDispatchRecordId = m.id;
            yield m.save();
            console.log(`\n👽 👽 👽  DispatchRecord added  for: 🍎  ${dispRecord.landmarkName} \n\n`);
            console.log(dispRecord);
            return m;
        });
    }
    static findByLocation(latitude, longitude, radiusInKM, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const time = Moment.utc().subtract(minutes, "minutes");
            const RADIUS = radiusInKM * 1000;
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
            const coords = [latitude, longitude];
            const mm = yield DispRecordModel.find({
                dispatchedAt: { $gt: time.toISOString() },
            })
                .where("position")
                .near({
                center: {
                    type: "Point",
                    coordinates: coords,
                    spherical: true,
                    maxDistance: RADIUS,
                },
            })
                .exec()
                .catch((reason) => {
                console.log(`ppfffffffft! fucked!`);
                console.error(reason);
                throw reason;
            });
            console.log(`☘️ ☘️ ☘️ DispatchRecord search found  🍎  ${mm.length}  🍎 `);
            return mm;
        });
    }
    static findByLandmark(landmarkID, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByRoute(routeID, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByRouteId(routeID, minutes);
            return list;
        });
    }
    static findByMarshal(marshalId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByMarshal(marshalId);
            return list;
        });
    }
    static findByVehicleId(vehicleId, minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByVehicleId(vehicleId, minutes);
            return list;
        });
    }
    static findAllByVehicleId(vehicleId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findAllByVehicleId(vehicleId);
            return list;
        });
    }
    static findAll(minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findAll(minutes);
            return list;
        });
    }
}
exports.DispatchRecordHelper = DispatchRecordHelper;
//# sourceMappingURL=dispatch_record_helper.js.map