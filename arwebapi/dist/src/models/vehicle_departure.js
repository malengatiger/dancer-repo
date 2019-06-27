"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const typegoose_1 = require("typegoose");
class VehicleDeparture extends typegoose_1.Typegoose {
    //
    static findByLandmarkId(landmarkId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            landmarkId,
            dateDeparted: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByRouteId(routeId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            routeId,
            dateDeparted: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByVehicleId(vehicleId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            vehicleId,
            dateDeparted: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    //
    static findAllByVehicleId(vehicleId) {
        return this.find({
            vehicleId,
        });
    }
    //
    static findAll(minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cutOffDate = Moment.utc().subtract(minutes, "minutes");
            console.log(`💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`);
            const list = yield this.find({
                dateDeparted: { $gt: cutOffDate.toISOString() },
            });
            console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
            return list;
        });
    }
    //
    setVehicleArrivalId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.vehicleDepartureId = this.id;
            yield this.save();
            console.log("vehicleDeparture: vehicleDepartureId set to _id");
        });
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleDeparture.prototype, "landmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleDeparture.prototype, "landmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleDeparture.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], VehicleDeparture.prototype, "vehicleReg", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], VehicleDeparture.prototype, "vehicleDepartureId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleDeparture.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleDeparture.prototype, "make", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleDeparture.prototype, "capacity", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleDeparture.prototype, "model", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], VehicleDeparture.prototype, "dateDeparted", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], VehicleDeparture.prototype, "setVehicleArrivalId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleDeparture, "findByLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleDeparture, "findByRouteId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleDeparture, "findByVehicleId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleDeparture, "findAllByVehicleId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleDeparture, "findAll", null);
exports.default = VehicleDeparture;
//# sourceMappingURL=vehicle_departure.js.map