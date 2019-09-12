"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VehicleLocationSchema = new mongoose_1.default.Schema({
    vehicleReg: { type: String, required: true, trim: true },
    vehicleID: { type: String, required: true, trim: true },
    position: { type: Map, required: true },
    vehicleType: { type: {}, required: true },
    associationID: { type: String, required: false, trim: true, index: true },
    associationName: { type: String, required: false, trim: true },
    created: { type: String, required: true, default: new Date().toISOString(), index: true },
});
const VehicleLocation = mongoose_1.default.model('VehicleLocation', VehicleLocationSchema);
exports.default = VehicleLocation;
//# sourceMappingURL=vehicle_location.js.map