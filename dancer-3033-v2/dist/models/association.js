"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Base definition
const AssociationSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, },
    cellphone: { type: String, required: true, },
    countryID: { type: String, required: true },
    countryName: { type: String, required: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const Association = mongoose_1.default.model('Association', AssociationSchema);
exports.default = Association;
//# sourceMappingURL=association.js.map