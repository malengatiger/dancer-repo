"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("typegoose");
const position_1 = __importDefault(require("./position"));
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
__decorate([
    typegoose_1.prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Landmark.prototype, "landmarkName", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true }),
    __metadata("design:type", String)
], Landmark.prototype, "landmarkID", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], Landmark.prototype, "latitude", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], Landmark.prototype, "longitude", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", position_1.default)
], Landmark.prototype, "position", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Landmark.prototype, "rankSequenceNumber", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Landmark.prototype, "routeIDs", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Landmark.prototype, "routeDetails", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], Landmark.prototype, "distance", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() }),
    __metadata("design:type", String)
], Landmark.prototype, "created", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], Landmark.prototype, "updateLocation", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Landmark, "findByName", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Landmark, "findByRouteName", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Landmark, "findByRouteID", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Landmark, "findByLandmarkID", null);
exports.default = Landmark;
//# sourceMappingURL=landmark.js.map