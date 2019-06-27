"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const typegoose_1 = require("typegoose");
class CommuterRequest extends typegoose_1.Typegoose {
    //
    static findByUser(user) {
        return this.find({
            user,
        });
    }
    //
    static findByFromLandmarkId(landmarkId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            fromLandmarkId: landmarkId,
            createdAt: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByToLandmarkId(landmarkId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            toLandmarkId: landmarkId,
            createdAt: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findByRouteId(routeId, minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            routeId,
            createdAt: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findAll(minutes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cutOffDate = Moment.utc().subtract(minutes, "minutes");
            console.log(`💦 💦 findAll: minutes: ${minutes} cutoffDate: ${cutOffDate.toISOString()}`);
            const list = yield this.find({
                stringTime: { $gt: cutOffDate.toISOString() },
            });
            console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
            return list;
        });
    }
    //
    setCommuterRequestId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.commuterRequestId = this.id;
            yield this.save();
            console.log("commuterRequest commuterRequestId set to _Id");
        });
    }
    //
    updateScanned() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.scanned = true;
            yield this.save();
            console.log("commuterRequest scanned set to true");
        });
    }
    //
    updateAutoDetected() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.autoDetected = true;
            yield this.save();
            console.log("commuterRequest autoDetected set to true");
        });
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: false })
], CommuterRequest.prototype, "autoDetected", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: false })
], CommuterRequest.prototype, "scanned", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], CommuterRequest.prototype, "commuterLocation", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "fromLandmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "fromLandmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "toLandmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "toLandmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: 1 })
], CommuterRequest.prototype, "passengers", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "routeId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], CommuterRequest.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], CommuterRequest.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], CommuterRequest.prototype, "vehicleReg", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], CommuterRequest.prototype, "commuterRequestId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "routeName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterRequest.prototype, "user", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], CommuterRequest.prototype, "stringTime", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().getTime() })
], CommuterRequest.prototype, "time", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], CommuterRequest.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], CommuterRequest.prototype, "setCommuterRequestId", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], CommuterRequest.prototype, "updateScanned", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], CommuterRequest.prototype, "updateAutoDetected", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterRequest, "findByUser", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterRequest, "findByFromLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterRequest, "findByToLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterRequest, "findByRouteId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterRequest, "findAll", null);
exports.default = CommuterRequest;
//# sourceMappingURL=commuter_request.js.map