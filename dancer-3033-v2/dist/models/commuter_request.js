"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterRequestSchema = new mongoose_1.default.Schema({
    fromLandmarkID: { type: String, required: true, trim: true },
    fromLandmarkName: { type: String, required: true, trim: true },
    toLandmarkID: { type: String, required: true, trim: true },
    toLandmarkName: { type: String, required: true, trim: true },
    routeID: { type: String, required: true, trim: true },
    routeName: { type: String, required: true, trim: true },
    vehicleID: { type: String, required: false, trim: true },
    vehicleReg: { type: String, required: false, trim: true },
    commuterRequestID: { type: String, required: true },
    passengers: { type: Number, required: true, default: 1 },
    position: { type: Map, required: true },
    userID: { type: String, required: true, trim: true },
    stringTime: { type: String, required: false },
    time: { type: Number, required: true },
    scanned: { type: Boolean, required: true, default: false },
    autoDetected: { type: Boolean, required: true, default: false },
    associationD: { type: String, required: false, trim: true, index: true },
    associationName: { type: String, required: false, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
CommuterRequestSchema.index({ position: "2dsphere" });
const CommuterRequest = mongoose_1.default.model('CommuterRequest', CommuterRequestSchema);
exports.default = CommuterRequest;
//# sourceMappingURL=commuter_request.js.map