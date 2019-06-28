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
const commuter_pickup_landmark_1 = __importDefault(require("../models/commuter_pickup_landmark"));
class CommuterPickupLandmarkHelper {
    static onCommuterPickupLandmarkAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterPickupLandmarkChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterPickupLandmark in stream:   🍀   🍀  ${event.fullDocument.CommuterPickupLandmarkName} 🍎  `);
        });
    }
    static addCommuterPickupLandmark(commuterRequestId, fromLandmarkId, toLandmarkId, fromLandmarkName, toLandmarkName, latitude, longitude, vehicleId, vehicleReg, userId, routeId, routeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            const position = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            const cplModel = new commuterPickupLandmarkModel({
                commuterRequestId,
                fromLandmarkId,
                fromLandmarkName,
                position,
                routeId,
                routeName,
                createdAt: new Date().toISOString(),
                toLandmarkId,
                toLandmarkName,
                userId,
                vehicleId,
                vehicleReg,
            });
            const m = yield cplModel.save();
            m.commuterPickupLandmarkId = m.id;
            yield m.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPickupLandmark added  for: 🍎  ${cplModel.fromLandmarkName} \n\n`);
            console.log(m);
            return m;
        });
    }
    static findByLocation(latitude, longitude, radiusInKM, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = Moment.utc().subtract(minutes, "minutes");
            const RADIUS = radiusInKM * 1000;
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
            const coords = [latitude, longitude];
            const mm = yield commuterPickupLandmarkModel.find({
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
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            const list = yield commuterPickupLandmarkModel.findByFromLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByToLandmark(landmarkID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            const list = yield commuterPickupLandmarkModel.findByToLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByRoute(routeID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            const list = yield commuterPickupLandmarkModel.findByRouteId(routeID, minutes);
            return list;
        });
    }
    static findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            const list = yield commuterPickupLandmarkModel.findByUser(userId);
            return list;
        });
    }
    static findAll(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPickupLandmarkModel = new commuter_pickup_landmark_1.default().getModelForClass(commuter_pickup_landmark_1.default);
            const list = yield commuterPickupLandmarkModel.findAll(minutes);
            return list;
        });
    }
}
exports.CommuterPickupLandmarkHelper = CommuterPickupLandmarkHelper;
//# sourceMappingURL=commuter_pickup_helper.js.map