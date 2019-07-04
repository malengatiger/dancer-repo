"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const position_1 = __importDefault(require("./position"));
class RoutePoint {
    constructor() {
        this.position = new position_1.default();
        this.latitude = 0.0;
        this.longitude = 0.0;
        this.routeId = '';
        this.index = 0;
        this.landmarkId = '';
        this.landmarkName = '';
        this.created = new Date().toISOString();
    }
}
exports.default = RoutePoint;
//# sourceMappingURL=route_point.js.map