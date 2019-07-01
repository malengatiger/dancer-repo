"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = __importStar(require("moment"));
const dispatch_record_1 = __importDefault(require("../models/dispatch_record"));
const landmark_1 = __importDefault(require("../models/landmark"));
const route_1 = __importDefault(require("../models/route"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
class DispatchRecordHelper {
    static onDispatchRecordAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onDispatchRecordAddedEvent: operationType: 👽 👽 👽  ${event.operationType},  DispatchRecord in stream:   🍀 🍎  `);
        });
    }
    static addDispatchRecord(landmarkId, vehicleId, routeId, marshalId, passengers) {
        return __awaiter(this, void 0, void 0, function* () {
            const dispatchRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const landmark = yield landmarkModel.findByLandmarkID(landmarkId);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId);
            const vehicleModel = new vehicle_1.default().getModelForClass(vehicle_1.default);
            const vehicle = yield vehicleModel.findByVehicleID(vehicleId);
            if (landmark && route && vehicle) {
                const dispRecord = new dispatchRecordModel({
                    dispatched: true,
                    landmarkId,
                    landmarkName: landmark.landmarkName,
                    passengers,
                    position: {
                        coordinates: [landmark.longitude, landmark.latitude],
                        type: "Point",
                    },
                    routeId,
                    routeName: route.name,
                    vehicleId,
                    vehicleReg: vehicle.vehicleReg,
                    vehicleType: vehicle.vehicleType,
                    dispatchedAt: new Date().toISOString(),
                    marshalId,
                    marshalName: "tbd",
                });
                const m = yield dispRecord.save();
                m.setDispatchRecordId = m.id;
                yield m.save();
                console.log(`\n👽 👽 👽  DispatchRecord added  for: 🍎  ${dispRecord.landmarkName} \n\n`);
                console.log(dispRecord);
                return m;
            }
            else {
                throw new Error('Input data incomplete');
            }
        });
    }
    static findByLocation(latitude, longitude, radiusInKM, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByRoute(routeID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByRouteId(routeID, minutes);
            return list;
        });
    }
    static findByMarshal(marshalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByMarshal(marshalId);
            return list;
        });
    }
    static findByVehicleId(vehicleId, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findByVehicleId(vehicleId, minutes);
            return list;
        });
    }
    static findAllByVehicleId(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findAllByVehicleId(vehicleId);
            return list;
        });
    }
    static findAll(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const DispRecordModel = new dispatch_record_1.default().getModelForClass(dispatch_record_1.default);
            const list = yield DispRecordModel.findAll(minutes);
            return list;
        });
    }
}
exports.DispatchRecordHelper = DispatchRecordHelper;
//# sourceMappingURL=dispatch_record_helper.js.map