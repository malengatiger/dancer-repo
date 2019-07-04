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
const commuter_arrival_landmark_1 = __importDefault(require("../models/commuter_arrival_landmark"));
const position_1 = __importDefault(require("../models/position"));
const landmark_1 = __importDefault(require("../models/landmark"));
const route_1 = __importDefault(require("../models/route"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const messaging_1 = __importDefault(require("../server/messaging"));
class CommuterArrivalLandmarkHelper {
    static onCommuterArrivalLandmarkAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 c onCommuterArrivalLandmarkChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterArrivalLandmark in stream:   🍀  🍎  `);
            console.log(event);
            const data = new commuter_arrival_landmark_1.default();
            data.commuterArrivalLandmarkId = event.fullDocument;
            yield messaging_1.default.sendCommuterArrivalLandmark(data);
        });
    }
    static addCommuterArrivalLandmark(commuterRequestId, fromLandmarkId, routeId, toLandmarkId, vehicleId, departureId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const fromModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const from = yield fromModel.findByLandmarkID(fromLandmarkId);
            const toModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const to = yield toModel.findByLandmarkID(toLandmarkId);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId);
            const vehModel = new vehicle_1.default().getModelForClass(vehicle_1.default);
            const veh = yield vehModel.findByVehicleID(vehicleId);
            if (from && to && route && veh) {
                const position = new position_1.default();
                position.coordinates = [from.longitude, from.latitude];
                const commuterArrivalLandmark = new CommuterArrivalLandmarkModel({
                    commuterRequestId,
                    fromLandmarkId,
                    fromLandmarkName: from.landmarkName,
                    position,
                    routeId,
                    routeName: route.name,
                    createdAt: new Date().toISOString(),
                    toLandmarkId,
                    toLandmarkName: to.landmarkName,
                    userId,
                    vehicleId,
                    vehicleReg: veh.vehicleReg,
                    departureId,
                });
                const m = yield commuterArrivalLandmark.save();
                m.commuterArrivalLandmarkId = m.id;
                yield m.save();
                console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterArrivalLandmark added  for: 🍎  ${commuterArrivalLandmark.fromLandmarkName} \n\n`);
                console.log(commuter_arrival_landmark_1.default);
                return m;
            }
            else {
                throw new Error('Missing input data');
            }
        });
    }
    static findByLocation(latitude, longitude, radiusInKM, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByFromLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByToLandmark(landmarkID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByToLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByRoute(routeID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByRouteId(routeID, minutes);
            return list;
        });
    }
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByUserId(userId);
            return list;
        });
    }
    static findAll(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findAll(minutes);
            return list;
        });
    }
}
exports.CommuterArrivalLandmarkHelper = CommuterArrivalLandmarkHelper;
//# sourceMappingURL=commuter_arrival_helper.js.map