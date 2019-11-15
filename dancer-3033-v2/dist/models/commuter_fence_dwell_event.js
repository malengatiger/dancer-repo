"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterFenceDwellEventSchema = new mongoose_1.default.Schema({
    landmarkID: { type: String, required: true, trim: true },
    landmarkName: { type: String, required: true, trim: true },
    position: { type: Map, required: true },
    userID: { type: String, required: false, },
    commuterFenceEventID: { type: String, required: true, },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterFenceDwellEvent = mongoose_1.default.model('CommuterFenceDwellEvent', CommuterFenceDwellEventSchema);
exports.default = CommuterFenceDwellEvent;
//# sourceMappingURL=commuter_fence_dwell_event.js.map