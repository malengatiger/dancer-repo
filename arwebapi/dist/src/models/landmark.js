"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class Landmark extends typegoose_1.Typegoose {
    static findByName(name) {
        console.log("#####  🥦  🥦  🥦 Finding landmark by name:  💦  💦  💦  :: 🥦 " + name);
        return this.findOne({ name });
        // could be list, routes can have same or similar names for each association
    }
    //
    static findByRouteName(routeName) {
        console.log("#####  🥦  🥦  🥦 Finding landmark by routeName:  💦  💦  💦  :: 🥦 " +
            routeName);
        return this.findOne({ routeName });
    }
    //
    static findByRouteID(routeID) {
        console.log("#####  🥦  🥦  🥦 Finding landmark by routeID:  💦  💦  💦  :: 🥦 " +
            routeID);
        return this.find({ routes: [routeID] });
    }
    //
    static findByLandmarkID(landmarkID) {
        console.log("#####  🥦  🥦  🥦 Finding landmark by landmarkID:  💦  💦  💦  : 🥦 " +
            landmarkID);
        return this.find({ landmarkID });
    }
    //
    updateLocation(id, latitude, longitude) {
        this.position = {
            coordinates: [longitude, latitude],
            type: "Point",
        };
        this.save();
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], Landmark.prototype, "landmarkName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], Landmark.prototype, "landmarkID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], Landmark.prototype, "latitude", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], Landmark.prototype, "longitude", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], Landmark.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: 0 })
], Landmark.prototype, "rankSequenceNumber", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: [] })
], Landmark.prototype, "routeIDs", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: [] })
], Landmark.prototype, "routeDetails", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], Landmark.prototype, "distance", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], Landmark.prototype, "created", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Landmark.prototype, "updateLocation", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Landmark, "findByName", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Landmark, "findByRouteName", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Landmark, "findByRouteID", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Landmark, "findByLandmarkID", null);
exports.default = Landmark;
//# sourceMappingURL=landmark.js.map