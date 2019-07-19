"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VehicleTypeSchema = new mongoose_1.default.Schema({
    make: { type: String, required: true, trim: true },
    modelType: { type: String, required: true },
    capacity: { type: Number, required: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const VehicleType = mongoose_1.default.model('VehicleType', VehicleTypeSchema);
exports.default = VehicleType;
//# sourceMappingURL=vehicle_type.js.map