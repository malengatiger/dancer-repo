"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VehicleRouteAssignmentSchema = new mongoose_1.default.Schema({
    associationID: { type: String, required: true, trim: true },
    vehicleID: { type: String, required: true, trim: true },
    vehicleReg: { type: String, required: true, trim: true },
    routeID: { type: String, required: true, trim: true },
    routeName: { type: String, required: false, trim: true },
    routeAssignmentID: { type: String, required: true, trim: true },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const VehicleRouteAssignment = mongoose_1.default.model('VehicleRouteAssignment', VehicleRouteAssignmentSchema);
exports.default = VehicleRouteAssignment;
//# sourceMappingURL=vehicle_route_assignment.js.map