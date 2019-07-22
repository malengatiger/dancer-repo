"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterRatingSchema = new mongoose_1.default.Schema({
    commuterRequestID: { type: String, required: true, trim: true },
    rating: { type: Map, required: true },
    userID: { type: String, required: true },
    commuterRatingID: { type: String, required: true },
    position: { type: Map, required: true },
    associationD: { type: String, required: false, trim: true },
    associationName: { type: String, required: false, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterRating = mongoose_1.default.model('CommuterRating', CommuterRatingSchema);
exports.default = CommuterRating;
//# sourceMappingURL=commuter_rating.js.map