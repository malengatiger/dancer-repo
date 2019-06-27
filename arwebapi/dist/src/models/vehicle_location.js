"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class VehicleLocation extends typegoose_1.Typegoose {
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], VehicleLocation.prototype, "date", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleLocation.prototype, "timestamp", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleLocation.prototype, "latitude", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleLocation.prototype, "longitude", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleLocation.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleLocation.prototype, "vehicle", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], VehicleLocation.prototype, "distance", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], VehicleLocation.prototype, "created", void 0);
exports.default = VehicleLocation;
//# sourceMappingURL=vehicle_location.js.map