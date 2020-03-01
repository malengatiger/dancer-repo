"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RouteFareSchema = new mongoose_1.default.Schema({
    routeName: { type: String, required: true },
    routeID: { type: String, required: true },
    associationID: { type: String, required: true, trim: true },
    associationName: { type: String, required: true, trim: true },
    fare: { type: Number, required: true },
    landmarkFares: { type: Array, required: true, default: [] },
    created: { type: String, required: true, default: new Date().toISOString() },
});
RouteFareSchema.index({ associationID: 1 });
RouteFareSchema.index({ routeID: 1 });
const RouteFare = mongoose_1.default.model('RouteFare', RouteFareSchema);
exports.default = RouteFare;
//# sourceMappingURL=route_fare.js.map