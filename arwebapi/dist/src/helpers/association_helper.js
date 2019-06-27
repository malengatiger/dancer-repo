"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const v1_1 = tslib_1.__importDefault(require("uuid/v1"));
const association_1 = tslib_1.__importDefault(require("../models/association"));
class AssociationHelper {
    static addAssociation(associationName, email, cellphone, countryID, countryName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🌀  🌀  🌀  AssocHelper: addAssociation   🍀   ${associationName} -   🍀   ${cellphone}   🍀   ${email}\n`);
            console.log(
            // tslint:disable-next-line: max-line-length
            `\n👽 👽 👽 👽  AssocHelper: attempting MongoDB write using Typegoose  🍎  getModelForClass  .......... 👽 👽 👽\n`);
            const associationID = v1_1.default();
            const associationModel = new association_1.default().getModelForClass(association_1.default);
            const assocModel = new associationModel({
                associationID,
                associationName,
                cellphone,
                countryID,
                countryName,
                email,
            });
            const m = yield assocModel.save();
            console.log(`\n\n💙  💚  💛   AssocHelper: Yebo Gogo!!!! - MongoDB has saved ${associationName} !!!!!  💙  💚  💛`);
            const ass = yield associationModel.findByName("MongoDataX Taxi Association");
            console.log(`\n💛 💛 💛 💛  Association found in Mofo: 💚  ${ass}`);
            console.log(ass);
            console.log(`🏓  db: ${m.db.db.databaseName} 💛 💛 collection: ${m.collection.collectionName} 💙 💙  id: ${m.id}`);
            return m;
        });
    }
    static getAssociations() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getAssociations ....   🌀  🌀  🌀 `);
            const assocModel = new association_1.default().getModelForClass(association_1.default);
            const list = yield assocModel.find();
            console.log(list);
            return list;
        });
    }
    static onAssociationAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`onAssociationAdded event has occured .... 👽 👽 👽`);
            console.log(event);
            console.log(`operationType: 👽 👽 👽  ${event.operationType},   🍎 `);
        });
    }
}
exports.AssociationHelper = AssociationHelper;
//# sourceMappingURL=association_helper.js.map