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
const landmark_1 = __importDefault(require("../models/landmark"));
const route_1 = __importDefault(require("../models/route"));
const position_1 = __importDefault(require("../models/position"));
class CommuterRequestHelper {
    static onCommuterRequestAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterRequestChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterRequest in stream:   🍀  🍎  `);
        });
    }
    static addCommuterRequest(fromLandmarkId, routeId, toLandmarkId, passengers, userId, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterRequestModel = new commuter_request_1.default().getModelForClass(commuter_request_1.default);
            const fromModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const from = yield fromModel.findByLandmarkID(fromLandmarkId);
            const toModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const to = yield toModel.findByLandmarkID(toLandmarkId);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId);
            const pos = new position_1.default();
            pos.coordinates = [longitude, latitude];
            if (from && to && route) {
                const commuterRequest = new commuterRequestModel({
                    autoDetected: false,
                    fromLandmarkId,
                    fromLandmarkName: from.landmarkName,
                    passengers,
                    position: pos,
                    routeId,
                    routeName: route.name,
                    scanned: false,
                    stringTime: new Date().toISOString(),
                    time: new Date().getTime(),
                    toLandmarkId,
                    toLandmarkName: to.landmarkName,
                    userId,
                });
                const m = yield commuterRequest.save();
                m.commuterRequestId = m.id;
                yield m.save();
                console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRequest added  for: 🍎  ${commuterRequest.fromLandmarkName} \n\n`);
                console.log(commuterRequest);
                return m;
            }
            else {
                throw new Error('Missing or ivalid input data');
            }
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