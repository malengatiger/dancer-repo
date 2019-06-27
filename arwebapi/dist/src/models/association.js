"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typegoose_1 = require("typegoose");
class Association extends typegoose_1.Typegoose {
    static findByName(name) {
        console.log("#####  🥦  🥦  🥦 Finding association by name:  💦  💦  💦  :: 🥦 " + name);
        return this.findOne({ name });
    }
    static findByAssociationID(associationID) {
        console.log("#####  🥦  🥦  🥦 Finding association by ID:  💦  💦  💦  :: 🥦 " + associationID);
        return this.findOne({ associationID });
    }
    updateEmail(email) {
        this.email = email;
        this.save();
    }
    updateCellphone(cellphone) {
        this.cellphone = cellphone;
        this.save();
    }
}
tslib_1.__decorate([
    typegoose_1.prop({ required: true, unique: true, trim: true })
], Association.prototype, "associationName", void 0);
tslib_1.__decorate([
    typegoose_1.prop()
], Association.prototype, "email", void 0);
tslib_1.__decorate([
    typegoose_1.prop()
], Association.prototype, "cellphone", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], Association.prototype, "countryID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, trim: true })
], Association.prototype, "associationID", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true })
], Association.prototype, "countryName", void 0);
tslib_1.__decorate([
    typegoose_1.prop({ required: true, default: new Date().toISOString() })
], Association.prototype, "created", void 0);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Association.prototype, "updateEmail", null);
tslib_1.__decorate([
    typegoose_1.instanceMethod
], Association.prototype, "updateCellphone", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Association, "findByName", null);
tslib_1.__decorate([
    typegoose_1.staticMethod
], Association, "findByAssociationID", null);
exports.default = Association;
//# sourceMappingURL=association.js.map