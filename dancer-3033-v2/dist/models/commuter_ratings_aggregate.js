"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterRatingsAggregateSchema = new mongoose_1.default.Schema({
    driver: { type: Number, required: true },
    rank: { type: Number, required: true },
    overall: { type: Number, required: true },
    vehicle: { type: Number, required: true },
    ratingsCount: { type: Number, required: true },
    ownerId: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    vehicleReg: { type: String, required: true, },
    vehicleId: { type: String, required: true, },
    createdAt: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterRatingsAggregate = mongoose_1.default.model('CommuterRatingsAggregate', CommuterRatingsAggregateSchema);
exports.default = CommuterRatingsAggregate;
//# sourceMappingURL=commuter_ratings_aggregate.js.map