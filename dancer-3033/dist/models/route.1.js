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
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("typegoose");
class Route extends typegoose_1.Typegoose {
    static findByName(name) {
        console.log("#####  🥦  🥦  🥦 Finding route(s) by name:  💦  💦  💦  :: 🥦 " + name);
        return this.findOne({ name });
        // coulf be list, routes can have same or similar names for each association
    }
    //
    static findByAssociationName(associationName) {
        console.log("#####  🥦  🥦  🥦 Finding route by associationName:  💦  💦  💦  :: 🥦 " +
            associationName);
        return this.findOne({ associationName });
    }
    //
    static findByAssociationID(associationID) {
        return this.findOne({ associationID });
    }
    //
    static findByRouteID(routeID) {
        return this.findOne({ routeID });
    }
    //
    updateColor(color) {
        this.color = color;
        this.save();
    }
    //
    addAssociation(associationID) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.getModelForClass(Route).findByAssociationID(associationID);
            if (!this.associationIDs) {
                this.associationIDs = [];
            }
            let isFound = false;
            if (route) {
                if (route.associationIDs) {
                    route.associationIDs.forEach((id) => {
                        if (id === associationID) {
                            isFound = true;
                        }
                    });
                }
            }
            if (!isFound) {
                this.associationIDs.push(associationID);
                this.save();
            }
            else {
                throw new Error("Association already in route list");
            }
        });
    }
}
__decorate([
    typegoose_1.prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Route.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true }),
    __metadata("design:type", String)
], Route.prototype, "routeID", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Route.prototype, "associationDetails", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Route.prototype, "associationIDs", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: "black" }),
    __metadata("design:type", String)
], Route.prototype, "color", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Route.prototype, "rawRoutePoints", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Route.prototype, "routePoints", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: [] }),
    __metadata("design:type", Array)
], Route.prototype, "calculatedDistances", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() }),
    __metadata("design:type", String)
], Route.prototype, "created", void 0);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Route.prototype, "updateColor", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Route.prototype, "addAssociation", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Route, "findByName", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Route, "findByAssociationName", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Route, "findByAssociationID", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Route, "findByRouteID", null);
exports.default = Route;
//# sourceMappingURL=route.1.js.map