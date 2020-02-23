"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MarshalFenceDwellEventSchema = new mongoose_1.default.Schema({
    landmarkID: { type: String, required: true, trim: true },
    landmarkName: { type: String, required: true, trim: true },
    position: { type: Map, required: true, },
    userID: { type: String, required: false, },
    marshalFenceEventID: { type: String, required: true, },
    created: { type: String, required: true, default: new Date().toISOString() },
});
MarshalFenceDwellEventSchema.index({ position: "2dsphere" });
const MarshalFenceDwellEvent = mongoose_1.default.model('MarshalFenceDwellEvent', MarshalFenceDwellEventSchema);
exports.default = MarshalFenceDwellEvent;
//# sourceMappingURL=marshal_fence_dwell_event.js.map