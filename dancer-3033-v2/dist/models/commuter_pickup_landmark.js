"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterPickupandmarkSchema = new mongoose_1.default.Schema({
    fromLandmarkID: { type: String, required: true },
    fromLandmarkName: { type: String, required: true },
    toLandmarkID: { type: String, required: true },
    toLandmarkName: { type: String, required: true },
    routeID: { type: String, required: true },
    routeName: { type: String, required: true },
    vehicleID: { type: String, required: true },
    vehicleReg: { type: String, required: true },
    commuterRequestID: { type: String, required: true },
    // departureID: {type: String, required: true},
    // position: {type: Map, required: true},
    userID: { type: String, required: true, trim: true },
    commuterPickupLandmarkID: { type: String, required: true, },
    associationD: { type: String, required: false, trim: true, index: true },
    associationName: { type: String, required: false, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterPickupLandmark = mongoose_1.default.model('CommuterPickupLandmark', CommuterPickupandmarkSchema);
exports.default = CommuterPickupLandmark;
//# sourceMappingURL=commuter_pickup_landmark.js.map