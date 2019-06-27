"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class Country extends typegoose_1.Typegoose {
    static findByName(name) {
        console.log("#####  🥦  🥦  🥦 Finding route(s) by name:  💦  💦  💦  :: 🥦 " + name);
        return this.findOne({ name });
        // coulf be list, routes can have same or similar names for each association
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true, unique: true })
], Country.prototype, "name", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: "ZA" })
], Country.prototype, "countryCode", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, unique: true, index: true, trim: true })
], Country.prototype, "countryID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], Country.prototype, "created", void 0);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Country, "findByName", null);
exports.default = Country;
//# sourceMappingURL=Country.js.map