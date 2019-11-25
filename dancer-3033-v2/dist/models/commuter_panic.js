"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterPanicSchema = new mongoose_1.default.Schema({
    active: { type: Boolean, required: true, default: true },
    type: { type: String, required: true, enum: ['FollowMe', 'Accident', 'Breakdown', 'Traffic', 'Robbery', 'Rape', 'Construction', 'Passenger Emergency'], trim: true },
    vehicleID: { type: String, required: false, trim: true },
    vehicleReg: { type: String, required: false, trim: true },
    position: { type: Object, required: true },
    userID: { type: String, required: false, trim: true },
    commuterPanicID: { type: String, required: true, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
    updated: { type: String, required: true, default: new Date().toISOString() },
});
CommuterPanicSchema.index({ position: "2dsphere" });
const CommuterPanic = mongoose_1.default.model('CommuterPanic', CommuterPanicSchema);
exports.default = CommuterPanic;
//# sourceMappingURL=commuter_panic.js.map