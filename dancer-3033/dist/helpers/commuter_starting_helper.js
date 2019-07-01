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
const commuter_starting_landmark_1 = __importDefault(require("../models/commuter_starting_landmark"));
const position_1 = __importDefault(require("../models/position"));
const landmark_1 = __importDefault(require("../models/landmark"));
class CommuterStartingLandmarkHelper {
    static onCommuterStartingLandmarkAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterStartingLandmarkChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterStartingLandmark in stream:   🍀  🍎  `);
        });
    }
    static addCommuterStartingLandmark(landmarkId, latitude, longitude, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterStartingLandmarkModel = new commuter_starting_landmark_1.default().getModelForClass(commuter_starting_landmark_1.default);
            const fromModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const from = yield fromModel.findByLandmarkID(landmarkId);
            if (from) {
                const position = new position_1.default();
                position.coordinates = [longitude, latitude];
                const commuterStartingLandmark = new CommuterStartingLandmarkModel({
                    landmarkId,
                    position,
                    userId,
                    landmarkName: from.landmarkName,
                });
                const m = yield commuterStartingLandmark.save();
                console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterStartingLandmark added  for: 🍎  ${commuterStartingLandmark.userId} \n\n`);
                console.log(m);
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
            const CommuterStartingLandmarkModel = new commuter_starting_landmark_1.default().getModelForClass(commuter_starting_landmark_1.default);
            console.log(`about to search coords: 🔆 ${latitude} ${longitude}  🌽  radiusInKM: ${radiusInKM}  ❤️ minutes: ${minutes} cutoff: ${time.toISOString()}`);
            const coords = [latitude, longitude];
            const mm = yield CommuterStartingLandmarkModel.find({
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
    static findByLandmark(landmarkID, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterStartingLandmarkModel = new commuter_starting_landmark_1.default().getModelForClass(commuter_starting_landmark_1.default);
            const list = yield CommuterStartingLandmarkModel.findByLandmarkId(landmarkID, minutes);
            return list;
        });
    }
    static findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterStartingLandmarkModel = new commuter_starting_landmark_1.default().getModelForClass(commuter_starting_landmark_1.default);
            const list = yield CommuterStartingLandmarkModel.findByUserId(userId);
            return list;
        });
    }
    static findAll(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterStartingLandmarkModel = new commuter_starting_landmark_1.default().getModelForClass(commuter_starting_landmark_1.default);
            const list = yield CommuterStartingLandmarkModel.findAll(minutes);
            return list;
        });
    }
}
exports.CommuterStartingLandmarkHelper = CommuterStartingLandmarkHelper;
//# sourceMappingURL=commuter_starting_helper.js.map