"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class VehicleType extends typegoose_1.Typegoose {
    //
    static getVehicleTypeByID(vehicleTypeID) {
        console.log("#####  🥦  🥦  🥦 Finding vehicleType by ID:  💦  💦  💦  :: 🥦 " + vehicleTypeID);
        return this.findOne({ vehicleTypeID });
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleType.prototype, "vehicleTypeID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleType.prototype, "make", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleType.prototype, "model", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleType.prototype, "capacity", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleType.prototype, "countryID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleType.prototype, "countryName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], VehicleType.prototype, "created", void 0);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleType, "getVehicleTypeByID", null);
exports.default = VehicleType;
//# sourceMappingURL=vehicle_type.js.map