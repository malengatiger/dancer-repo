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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = __importStar(require("moment"));
const typegoose_1 = require("typegoose");
const position_1 = __importDefault(require("./position"));
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            this.dispatchRecordId = this.id;
            yield this.save();
            console.log("DispatchRecord dispatchRecordId set to _id");
        });
    }
}
__decorate([
    typegoose_1.prop({ required: true, default: false }),
    __metadata("design:type", Boolean)
], DispatchRecord.prototype, "dispatched", void 0);
__decorate([
    typegoose_1.prop({ required: true, trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "landmarkId", void 0);
__decorate([
    typegoose_1.prop({ required: true, trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "landmarkName", void 0);
__decorate([
    typegoose_1.prop({ required: true, trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "routeId", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", position_1.default)
], DispatchRecord.prototype, "position", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "routeName", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "vehicleReg", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "dispatchRecordId", void 0);
__decorate([
    typegoose_1.prop({ required: true, trim: true }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "marshalId", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], DispatchRecord.prototype, "passengers", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() }),
    __metadata("design:type", String)
], DispatchRecord.prototype, "dispatchedAt", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DispatchRecord.prototype, "setDispatchRecordId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispatchRecord, "findByMarshal", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DispatchRecord, "findByLandmarkId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DispatchRecord, "findByRouteId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DispatchRecord, "findByVehicleId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispatchRecord, "findAllByVehicleId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DispatchRecord, "findAll", null);
exports.default = DispatchRecord;
//# sourceMappingURL=dispatch_record.js.map