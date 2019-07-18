"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RouteSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    associationDetails: { type: Array, required: true, default: [] },
    color: { type: String, required: true, default: 'white' },
    created: { type: String, required: true, default: new Date().toISOString() },
    rawRoutePoints: { type: Array, required: true, default: [] },
    routePoints: { type: Array, required: true, default: [] },
    calculatedDistances: { type: Array, required: true, default: [] },
});
const Route = mongoose_1.default.model('Route', RouteSchema);
exports.default = Route;
//# sourceMappingURL=route.js.map