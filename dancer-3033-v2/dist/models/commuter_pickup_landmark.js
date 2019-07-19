"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterPickupandmarkSchema = new mongoose_1.default.Schema({
    fromLandmarkId: { type: String, required: true },
    fromLandmarkName: { type: String, required: true },
    toLandmarkId: { type: String, required: true },
    toLandmarkName: { type: String, required: true },
    routeId: { type: String, required: true },
    routeName: { type: String, required: true },
    vehicleId: { type: String, required: true },
    vehicleReg: { type: String, required: true },
    commuterRequestId: { type: String, required: true },
    departureId: { type: String, required: true },
    position: { type: Map, required: true },
    userId: { type: String, required: true, trim: true },
    commuterArrivalLandmarkId: { type: String, required: true, },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterPickupLandmark = mongoose_1.default.model('CommuterPickupLandmark', CommuterPickupandmarkSchema);
exports.default = CommuterPickupLandmark;
//# sourceMappingURL=commuter_pickup_landmark.js.map