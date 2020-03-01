"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QRRecordSchema = new mongoose_1.default.Schema({
    seatNumber: { type: Number, required: true },
    url: { type: String, required: true },
    vehicleReg: { type: String, required: true },
    vehicleID: { type: String, required: true },
    vehicleType: { type: {}, required: true },
    qrRecordID: { type: String, required: true },
    associationID: { type: String, required: true, trim: true, index: true },
    associationName: { type: String, required: true, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
QRRecordSchema.index({ associationD: 1 });
QRRecordSchema.index({ vehicleID: 1 });
const QRRecord = mongoose_1.default.model('QRRecord', QRRecordSchema);
exports.default = QRRecord;
//# sourceMappingURL=qrrecord.js.map