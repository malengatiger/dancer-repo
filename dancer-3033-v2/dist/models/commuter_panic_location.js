"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommuterPanicLocationSchema = new mongoose_1.default.Schema({
    commuterPanicID: { type: String, required: true },
    position: { type: Map, required: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const CommuterPanicLocation = mongoose_1.default.model('CommuterPanicLocation', CommuterPanicLocationSchema);
exports.default = CommuterPanicLocation;
//# sourceMappingURL=commuter_panic_location.js.map