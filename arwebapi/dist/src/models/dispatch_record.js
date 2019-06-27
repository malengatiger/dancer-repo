"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const typegoose_1 = require("typegoose");
class DispatchRecord extends typegoose_1.Typegoose {
    //
    static findByMarshal(marshalId) {
        return this.find({
            marshalId,
        });
    }
    //
    static findByLandmarkId(landmarkId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            landmarkId,
            dispatchedAt: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByRouteId(routeId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            routeId,
            dispatchedAt: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByVehicleId(vehicleId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            vehicleId,
            dispatchedAt: { $gt: cutOffDate.toISOString() },
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
    setDispatchRecordId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.dispatchRecordId = this.id;
            yield this.save();
            console.log("DispatchRecord dispatchRecordId set to _id");
        });
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: false })
], DispatchRecord.prototype, "dispatched", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], DispatchRecord.prototype, "landmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], DispatchRecord.prototype, "landmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], DispatchRecord.prototype, "routeId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], DispatchRecord.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], DispatchRecord.prototype, "routeName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], DispatchRecord.prototype, "vehicleReg", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], DispatchRecord.prototype, "dispatchRecordId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], DispatchRecord.prototype, "marshalId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], DispatchRecord.prototype, "passengers", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], DispatchRecord.prototype, "dispatchedAt", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], DispatchRecord.prototype, "setDispatchRecordId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], DispatchRecord, "findByMarshal", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], DispatchRecord, "findByLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], DispatchRecord, "findByRouteId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], DispatchRecord, "findByVehicleId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], DispatchRecord, "findAllByVehicleId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], DispatchRecord, "findAll", null);
exports.default = DispatchRecord;
//# sourceMappingURL=dispatch_record.js.map