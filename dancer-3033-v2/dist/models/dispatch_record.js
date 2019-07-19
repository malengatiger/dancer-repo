"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DispatchRecordSchema = new mongoose_1.default.Schema({
    dispatched: { type: Boolean, required: true, default: false },
    landmarkId: { type: String, required: true },
    marshalId: { type: String, required: true },
    marshalName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    position: { type: Map, required: true },
    landmarkName: { type: String, required: true, trim: true },
    routeName: { type: String, required: true },
    routeId: { type: String, required: true },
    countryName: { type: String, required: true },
    vehicleReg: { type: Number, required: true },
    vehicleId: { type: Number, required: true },
    vehicleType: { type: {}, required: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const DispatchRecord = mongoose_1.default.model('DispatchRecord', DispatchRecordSchema);
exports.default = DispatchRecord;
//# sourceMappingURL=dispatch_record.js.map