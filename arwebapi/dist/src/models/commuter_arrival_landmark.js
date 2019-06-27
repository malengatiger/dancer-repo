"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Moment = tslib_1.__importStar(require("moment"));
const typegoose_1 = require("typegoose");
class CommuterArrivalLandmark extends typegoose_1.Typegoose {
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
                createdAt: { $gt: cutOffDate.toISOString() },
            });
            console.log(`\n🏓  ${list.length} requests found in Mongo\n\n`);
            return list;
        });
    }
    //
    setCommuterArrivalLandmarkId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.commuterArrivalLandmarkId = this.id;
            yield this.save();
            console.log("setCommuterArrivalLandmark: setCommuterArrivalLandmarkId set to _Id");
        });
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "fromLandmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "fromLandmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "toLandmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "toLandmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "routeId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "vehicleReg", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], CommuterArrivalLandmark.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "commuterRequestId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "routeName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "departureId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], CommuterArrivalLandmark.prototype, "userId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], CommuterArrivalLandmark.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], CommuterArrivalLandmark.prototype, "commuterArrivalLandmarkId", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], CommuterArrivalLandmark.prototype, "setCommuterArrivalLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterArrivalLandmark, "findByUser", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterArrivalLandmark, "findByFromLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterArrivalLandmark, "findByToLandmarkId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterArrivalLandmark, "findByRouteId", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], CommuterArrivalLandmark, "findAll", null);
exports.default = CommuterArrivalLandmark;
//# sourceMappingURL=commuter_arrival_landmark.js.map