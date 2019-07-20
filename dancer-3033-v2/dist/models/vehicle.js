"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const VehicleSchema = new mongoose_1.default.Schema({
    vehicleReg: { type: String, required: true, trim: true, unique: true },
    vehicleID: { type: String, required: true, trim: true },
    associationID: { type: String, required: true, trim: true },
    associationName: { type: String, required: true },
    ownerID: { type: String, required: false, trim: true },
    ownerName: { type: String, required: false },
    vehicleType: { type: Map, required: true },
    photos: { type: Array, required: true, default: [] },
    videos: { type: Array, required: true, default: [] },
    created: { type: String, required: true, default: new Date().toISOString() },
});
VehicleSchema.plugin(mongoose_unique_validator_1.default);
const Vehicle = mongoose_1.default.model('Vehicle', VehicleSchema);
exports.default = Vehicle;
//# sourceMappingURL=vehicle.js.map