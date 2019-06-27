"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const typegoose_1 = require("typegoose");
class VehicleArrival extends typegoose_1.Typegoose {
    //
    static findByLandmarkId(landmarkId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            landmarkId,
            dateArrived: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByRouteId(routeId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            routeId,
            dateArrived: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByVehicleId(vehicleId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            vehicleId,
            dateArrived: { $gt: cutOffDate.toISOString() },
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
                dispatchedAt: { $gt: cutOffDate.toISOString() },
            });
            console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
            return list;
        });
    }
    //
    setVehicleArrivalId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.vehicleArrivalId = this.id;
            yield this.save();
            console.log("vehicleArrival vehicleArrivalId set to _id");
        });
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: false })
], VehicleArrival.prototype, "dispatched", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleArrival.prototype, "landmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleArrival.prototype, "landmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleArrival.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleArrival.prototype, "vehicleReg", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleArrival.prototype, "make", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], VehicleArrival.prototype, "capacity", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleArrival.prototype, "model", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], VehicleArrival.prototype, "vehicleArrivalId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], VehicleArrival.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], VehicleArrival.prototype, "dateArrived", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], VehicleArrival.prototype, "setVehicleArrivalId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleArrival, "findByLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleArrival, "findByRouteId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleArrival, "findByVehicleId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleArrival, "findAllByVehicleId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], VehicleArrival, "findAll", null);
exports.default = VehicleArrival;
//# sourceMappingURL=vehicle_arrival.js.map