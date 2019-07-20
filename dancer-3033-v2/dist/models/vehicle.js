"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VehicleSchema = new mongoose_1.default.Schema({
    vehicleReg: { type: String, required: true, trim: true },
    vehicleID: { type: String, required: true, trim: true },
    associationID: { type: String, required: true, trim: true },
    associationName: { type: String, required: true },
    ownerID: { type: String, required: false, trim: true },
    ownerName: { type: String, required: false },
    vehicleType: { type: {}, required: true },
    photos: { type: Array, required: true, default: [] },
    videos: { type: Array, required: true, default: [] },
    vehicleLogs: { type: Array, required: true, default: [] },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const Vehicle = mongoose_1.default.model('Vehicle', VehicleSchema);
exports.default = Vehicle;
//# sourceMappingURL=vehicle.js.map