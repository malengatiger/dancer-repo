"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterIncentiveTypeSchema = new mongoose_1.default.Schema({
    associationID: { type: String, required: true, trim: true },
    currency: { type: String, required: true, trim: true },
    endingDate: { type: String, required: true, trim: true },
    expiryPeriodInDays: { type: String, required: true, trim: true },
    numberOfRatings: { type: String, required: true, trim: true },
    prizeValue: { type: String, required: true, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterIncentiveType = mongoose_1.default.model('CommuterIncentiveType', CommuterIncentiveTypeSchema);
exports.default = CommuterIncentiveType;
//# sourceMappingURL=commuter_incentive_type.js.map