"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VehicleDepartureSchema = new mongoose_1.default.Schema({
    vehicleReg: { type: String, required: true, trim: true },
    vehicleID: { type: String, required: true, trim: true },
    vehicleDepartureID: { type: String, required: true, trim: true },
    landmarkID: { type: String, required: true, trim: true },
    landmarkName: { type: String, required: true },
    position: { type: Map, required: true },
    vehicleType: { type: {}, required: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const VehicleDeparture = mongoose_1.default.model('VehicleDeparture', VehicleDepartureSchema);
exports.default = VehicleDeparture;
//# sourceMappingURL=vehicle_departure.js.map