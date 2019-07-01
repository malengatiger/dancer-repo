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
const vehicle_type_1 = __importDefault(require("./vehicle_type"));
class Vehicle extends typegoose_1.Typegoose {
    static findByOwnerID(ownerID) {
        return this.findOne({ ownerID });
    }
    static findByVehicleID(vehicleID) {
        return this.findOne({ vehicleID });
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
__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleReg", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleId", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "associationID", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "associationName", void 0);
__decorate([
    typegoose_1.prop({ trim: true, index: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "ownerID", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "ownerName", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", vehicle_type_1.default)
], Vehicle.prototype, "vehicleType", void 0);
__decorate([
    typegoose_1.prop({ default: [] }),
    __metadata("design:type", Array)
], Vehicle.prototype, "photos", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() }),
    __metadata("design:type", String)
], Vehicle.prototype, "created", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], Vehicle.prototype, "updateOwner", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Vehicle.prototype, "addPhoto", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_type_1.default]),
    __metadata("design:returntype", void 0)
], Vehicle.prototype, "updateType", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Vehicle.prototype, "getPhotos", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Vehicle, "findByOwnerID", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Vehicle, "findByVehicleID", null);
exports.default = Vehicle;
//# sourceMappingURL=vehicle.js.map