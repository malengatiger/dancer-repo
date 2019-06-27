"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class City extends typegoose_1.Typegoose {
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], City.prototype, "name", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], City.prototype, "provinceName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], City.prototype, "countryID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], City.prototype, "cityID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ trim: true })
], City.prototype, "distance", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, index: true, trim: true })
], City.prototype, "countryName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], City.prototype, "latitude", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], City.prototype, "longitude", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], City.prototype, "position", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], City.prototype, "created", void 0);
exports.default = City;
//# sourceMappingURL=city.js.map