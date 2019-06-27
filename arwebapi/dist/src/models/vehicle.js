"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class Vehicle extends typegoose_1.Typegoose {
    static findByOwnerID(ownerID) {
        return this.findOne({ ownerID });
    }
    //
    updateOwner(ownerID, ownerName) {
        this.ownerID = ownerID;
        this.ownerName = ownerName;
        this.save();
    }
    addPhoto(url) {
        const photo = {
            created: new Date().toISOString(),
            url,
        };
        if (this.photos) {
            this.photos.push(photo);
        }
        this.save();
    }
    updateType(vehicleType) {
        this.vehicleType = vehicleType;
        this.save();
    }
    getPhotos() {
        return this.photos;
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], Vehicle.prototype, "vehicleReg", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], Vehicle.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], Vehicle.prototype, "associationID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], Vehicle.prototype, "associationName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true, index: true })
], Vehicle.prototype, "ownerID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], Vehicle.prototype, "ownerName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], Vehicle.prototype, "vehicleType", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ default: [] })
], Vehicle.prototype, "photos", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], Vehicle.prototype, "created", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Vehicle.prototype, "updateOwner", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Vehicle.prototype, "addPhoto", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Vehicle.prototype, "updateType", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Vehicle.prototype, "getPhotos", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Vehicle, "findByOwnerID", null);
exports.default = Vehicle;
//# sourceMappingURL=vehicle.js.map