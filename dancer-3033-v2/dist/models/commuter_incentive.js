"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterIncentiveSchema = new mongoose_1.default.Schema({
    incentiveTypeID: { type: String, required: true, trim: true },
    userID: { type: String, required: true, trim: true },
    user: { type: Object, required: true, trim: true },
    incentive: { type: Object, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    network: { type: String, required: true, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterIncentive = mongoose_1.default.model('CommuterIncentive', CommuterIncentiveSchema);
exports.default = CommuterIncentive;
//# sourceMappingURL=commuter_incentive.js.map