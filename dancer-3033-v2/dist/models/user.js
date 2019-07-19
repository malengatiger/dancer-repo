"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    fcmToken: { type: String, required: false },
    cellphone: { type: String, required: true },
    userId: { type: String, required: false },
    associationID: { type: String, required: false },
    associationName: { type: String, required: false },
    userType: { type: String, required: true, },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map