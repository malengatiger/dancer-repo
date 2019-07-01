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
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = __importStar(require("moment"));
const typegoose_1 = require("typegoose");
var PanicType;
(function (PanicType) {
    PanicType["Accident"] = "Accident";
    PanicType["FollowMe"] = "FollowMe";
    PanicType["Robbery"] = "Robbery";
    PanicType["Traffic"] = "Traffic";
    PanicType["Rape"] = "Rape";
    PanicType["Breakdown"] = "Breakdown";
    PanicType["Unrest"] = "Unrest";
})(PanicType || (PanicType = {}));
class CommuterPanic extends typegoose_1.Typegoose {
    //
    static findByUserId(userId) {
        return this.find({
            userId,
        });
    }
    //
    static findByPanicId(commuterPanicId) {
        return this.findOne({
            commuterPanicId,
        });
    }
    //
    static findAllPanicsWithinMinutes(minutes) {
        const cutOffDate = Moment.utc().subtract(minutes, "minutes");
        return this.find({
            createdAt: { $gt: cutOffDate.toISOString() },
        });
    }
    //
    static findAllPanics() {
        return this.find();
    }
    //
    setCommuterPanicId() {
        return __awaiter(this, void 0, void 0, function* () {
            this.commuterPanicId = this.id;
            yield this.save();
            console.log("CommuterPanic CommuterPanicId set to _Id");
        });
    }
}
__decorate([
    typegoose_1.prop({ required: true, default: false }),
    __metadata("design:type", Boolean)
], CommuterPanic.prototype, "active", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: false }),
    __metadata("design:type", String)
], CommuterPanic.prototype, "type", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], CommuterPanic.prototype, "userId", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], CommuterPanic.prototype, "locations", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], CommuterPanic.prototype, "vehicleId", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], CommuterPanic.prototype, "vehicleReg", void 0);
__decorate([
    typegoose_1.prop({ trim: true }),
    __metadata("design:type", String)
], CommuterPanic.prototype, "commuterPanicId", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() }),
    __metadata("design:type", String)
], CommuterPanic.prototype, "createdAt", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommuterPanic.prototype, "setCommuterPanicId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommuterPanic, "findByUserId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommuterPanic, "findByPanicId", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommuterPanic, "findAllPanicsWithinMinutes", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommuterPanic, "findAllPanics", null);
exports.default = CommuterPanic;
//# sourceMappingURL=commuter_panic.js.map