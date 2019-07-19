"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CountrySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    countryID: { type: String, required: false },
    countryCode: { type: String, required: true, default: 'ZA' },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const Country = mongoose_1.default.model('Country', CountrySchema);
exports.default = Country;
//# sourceMappingURL=country.js.map