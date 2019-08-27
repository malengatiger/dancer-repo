"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    fcmToken: { type: String, required: false },
    cellphone: { type: String, required: true },
    userID: { type: String, required: true },
    associationID: { type: String, required: false },
    associationName: { type: String, required: false },
    userType: { type: String, required: true, enum: ['Staff', 'Administrator', 'Owner', 'Driver', 'Marshal', 'Patroller', 'Commuter'], },
    created: { type: String, required: true, default: new Date().toISOString() },
    firebaseUID: { type: String, required: true }
});
UserSchema.plugin(mongoose_unique_validator_1.default);
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map