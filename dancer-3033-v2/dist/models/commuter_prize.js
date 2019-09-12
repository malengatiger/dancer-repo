"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('debug', true);
const CommuterPrizeSchema = new mongoose_1.default.Schema({
    network: { type: String, required: true },
    cellPhone: { type: String, required: true },
    userID: { type: String, required: false },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterPrize = mongoose_1.default.model('CommuterPrize', CommuterPrizeSchema);
exports.default = CommuterPrize;
//# sourceMappingURL=commuter_prize.js.map