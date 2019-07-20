"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const AssociationSchema = new mongoose_1.default.Schema({
    associationName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    cellphone: { type: String, required: true, unique: true },
    countryID: { type: String, required: true },
    countryName: { type: String, required: true },
    associationID: { type: String, required: true, index: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
AssociationSchema.index({ countryID: 1, associationName: 1 }, { unique: true });
AssociationSchema.plugin(mongoose_unique_validator_1.default);
const Association = mongoose_1.default.model('Association', AssociationSchema);
exports.default = Association;
//# sourceMappingURL=association.js.map