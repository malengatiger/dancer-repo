"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    associationName: { type: String, required: true },
    landmarks: { type: Array, required: true },
    message: { type: String, required: true },
    messageDate: { type: String, default: new Date().toISOString() },
    platforms: { type: Array, required: true },
    userEmail: { type: String, required: true },
});
const Notification = mongoose_1.default.model('Notification', NotificationSchema);
exports.default = Notification;
//# sourceMappingURL=notification.js.map