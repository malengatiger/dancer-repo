"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('debug', true);
const SafetyNetworkBuddySchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cellPhone: { type: String, required: true },
    relationship: { type: String, required: true, enum: ['Mother', 'Father', 'Son', 'Daughter', 'Aunt', 'Uncle', 'Cousin', 'Gran Dad', 'Gran Mother', 'Niece', 'Nephew', 'Friend', 'Colleague', 'Wife', 'Husband', 'Spouse', 'Brother', 'Sister'] },
    userID: { type: String, required: false },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const SafetyNetworkBuddy = mongoose_1.default.model('SafetyNetworkBuddy', SafetyNetworkBuddySchema);
exports.default = SafetyNetworkBuddy;
//# sourceMappingURL=safety_network_buddy.js.map