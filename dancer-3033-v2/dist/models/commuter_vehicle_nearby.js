"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const CommuterVehicleNearbySchema = new mongoose_1.default.Schema({
    vehicleID: { type: String, required: true, trim: true, index: true },
    vehicleReg: { type: String, required: true, trim: true },
    userID: { type: String, required: true },
    date: { type: String, required: true, default: new Date().toISOString() },
    cellphone: { type: String, required: false },
    milliseconds: { type: Number, required: true, index: true, default: new Date().getTime() },
    position: { type: Map, required: true },
    created: { type: String, required: true, default: new Date().toISOString() }
});
CommuterVehicleNearbySchema.plugin(mongoose_unique_validator_1.default);
CommuterVehicleNearbySchema.indexes().push({ position: '2dsphere' });
CommuterVehicleNearbySchema.indexes().push({ vehicleID: 1 }, { unique: false });
CommuterVehicleNearbySchema.indexes().push({ milliseconds: 1 }, { unique: false });
const CommuterVehicleNearby = mongoose_1.default.model('CommuterVehicleNearby', CommuterVehicleNearbySchema);
exports.default = CommuterVehicleNearby;
//# sourceMappingURL=commuter_vehicle_nearby.js.map