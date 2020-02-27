"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const LandmarkSchema = new mongoose_1.default.Schema({
    landmarkName: { type: String, required: true, unique: true },
    position: { type: Map, required: true },
    routeDetails: { type: Array, required: true, default: [] },
    cities: { type: Array, required: true, default: [] },
    countryID: { type: String, required: false, },
    countryName: { type: String, required: false, },
    landmarkID: { type: String, required: true, },
    created: { type: String, required: true, default: new Date().toISOString() },
});
LandmarkSchema.plugin(mongoose_unique_validator_1.default);
LandmarkSchema.indexes().push({ position: '2dsphere' });
const Landmark = mongoose_1.default.model('Landmark', LandmarkSchema);
exports.default = Landmark;
//# sourceMappingURL=landmark.js.map