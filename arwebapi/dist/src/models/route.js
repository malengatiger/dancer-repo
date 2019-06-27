"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], Route.prototype, "name", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], Route.prototype, "routeID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: [] })
], Route.prototype, "associationDetails", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: [] })
], Route.prototype, "associationIDs", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: "black" })
], Route.prototype, "color", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: [] })
], Route.prototype, "rawRoutePoints", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: [] })
], Route.prototype, "routePoints", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], Route.prototype, "created", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Route.prototype, "updateColor", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Route.prototype, "addAssociation", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Route, "findByName", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Route, "findByAssociationName", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Route, "findByAssociationID", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Route, "findByRouteID", null);
exports.default = Route;
//# sourceMappingURL=route.js.map