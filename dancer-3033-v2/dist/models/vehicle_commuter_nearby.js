"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const VehicleCommuterNearbySchema = new mongoose_1.default.Schema({
    vehicleID: { type: String, required: true, trim: true, index: true },
    vehicleReg: { type: String, required: true, trim: true },
    userID: { type: String, required: true },
    date: { type: String, required: true, default: new Date().toISOString() },
    cellphone: { type: String, required: false },
    milliseconds: { type: Number, required: true, index: true, default: new Date().getTime() },
    position: { type: Map, required: true },
    created: { type: String, required: true, default: new Date().toISOString() }
});
VehicleCommuterNearbySchema.plugin(mongoose_unique_validator_1.default);
VehicleCommuterNearbySchema.indexes().push({ position: '2dsphere' });
VehicleCommuterNearbySchema.indexes().push({ vehicleID: 1 }, { unique: false });
VehicleCommuterNearbySchema.indexes().push({ milliseconds: 1 }, { unique: false });
const VehicleCommuterNearby = mongoose_1.default.model('VehicleCommuterNearby', VehicleCommuterNearbySchema);
exports.default = VehicleCommuterNearby;
//# sourceMappingURL=vehicle_commuter_nearby.js.map