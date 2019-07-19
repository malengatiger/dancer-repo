"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CitySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    provinceName: { type: String, required: true },
    countryID: { type: String, required: true },
    countryName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    position: { type: Map, required: true },
    userId: { type: String, required: true, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const City = mongoose_1.default.model('City', CitySchema);
exports.default = City;
//# sourceMappingURL=city.js.map