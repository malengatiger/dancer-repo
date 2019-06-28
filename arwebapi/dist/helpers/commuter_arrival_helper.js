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
class CommuterArrivalLandmarkHelper {
    static onCommuterArrivalLandmarkAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterArrivalLandmarkChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterArrivalLandmark in stream:   🍀  🍎  `);
        });
    }
    static addCommuterArrivalLandmark(request) {
        return __awaiter(this, void 0, void 0, function* () {
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
    static findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterArrivalLandmarkModel = new commuter_arrival_landmark_1.default().getModelForClass(commuter_arrival_landmark_1.default);
            const list = yield CommuterArrivalLandmarkModel.findByUser(user);
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