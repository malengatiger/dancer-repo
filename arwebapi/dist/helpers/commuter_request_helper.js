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
const commuter_request_1 = __importDefault(require("../models/commuter_request"));
class CommuterRequestHelper {
    static onCommuterRequestAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterRequestChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterRequest in stream:   🍀   🍀  ${event.fullDocument.CommuterRequestName} 🍎  `);
        });
    }
    static addCommuterRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            console.log(`....... 😍 😍 😍  about to add CommuterRequest:  👽 👽 👽`);
            console.log(request);
            const commuterRequest = new commuterRequestModel({
                autoDetected: request.autoDetected,
                commuterLocation: request.commuterLocation,
                fromLandmarkId: request.fromLandmarkId,
                fromLandmarkName: request.fromLandmarkName,
                passengers: request.passengers,
                position: {
                    coordinates: [request.commuterLocation.lng, request.commuterLocation.lat],
                    type: "Point",
                },
                routeId: request.routeId,
                routeName: request.routeName,
                scanned: request.scanned,
                stringTime: new Date().toISOString(),
                time: new Date().getTime(),
                toLandmarkId: request.toLandmarkId,
                toLandmarkName: request.toLandmarkName,
                user: request.user,
                vehicleId: request.vehicleId,
                vehicleReg: request.vehicleReg,
            });
            const m = yield commuterRequest.save();
            m.commuterRequestId = m.id;
            yield m.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRequest added  for: 🍎  ${commuterRequest.fromLandmarkName} \n\n`);
            console.log(commuterRequest);
            return m;
        });
    }
    static findByLocation(latitude, longitude, radiusInKM, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = Moment.utc().subtract(minutes, "minutes");
            const RADIUS = radiusInKM * 1000;
            const CommuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
            const coords = [latitude, longitude];
            const mm = yield CommuterRequestModel.find({
                stringTime: { $gt: time.toISOString() },
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
            const CommuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            const list = yield CommuterRequestModel.findByFromLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByToLandmark(landmarkID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            const list = yield CommuterRequestModel.findByToLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByRoute(routeID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            const list = yield CommuterRequestModel.findByRouteId(routeID, minutes);
            return list;
        });
    }
    static findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            const list = yield CommuterRequestModel.findByUser(user);
            return list;
        });
    }
    static findAll(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            const list = yield CommuterRequestModel.findAll(minutes);
            return list;
        });
    }
}
exports.CommuterRequestHelper = CommuterRequestHelper;
//# sourceMappingURL=commuter_request_helper.js.map