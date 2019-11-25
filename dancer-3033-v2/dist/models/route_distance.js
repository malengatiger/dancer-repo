"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/*
 String routeID, routeName, nearestLandmark;
  List<DynamicDistance> dynamicDistances;
  double distanceToNearestLandmark;
  String created;
*/
const RouteDistanceEstimationSchema = new mongoose_1.default.Schema({
    routeID: { type: String, required: true },
    routeName: { type: String, required: true },
    nearestLandmark: { type: String, required: true, trim: true },
    distanceToNearestLandmark: { type: Number, required: true },
    vehicle: { type: Object, required: true },
    dynamicDistances: { type: Array, required: true, default: [] },
    created: { type: String, required: true, default: new Date().toISOString() },
});
const RouteDistanceEstimation = mongoose_1.default.model('RouteDistanceEstimation', RouteDistanceEstimationSchema);
exports.default = RouteDistanceEstimation;
//# sourceMappingURL=route_distance.js.map