"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const association_1 = __importDefault(require("../models/association"));
class AssociationHelper {
    static addAssociation(associationName, email, cellphone, countryID, countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const associationModel = new association_1.default().getModelForClass(association_1.default);
            const assocModel = new associationModel({
                associationName,
                cellphone,
                countryID,
                countryName,
                email,
            });
            const m = yield assocModel.save();
            m.associationId = m.id;
            yield m.save();
            console.log(`\n\n💙💚💛   AssocHelper: Yebo Gogo!!!! - MongoDB has saved ${associationName} !!!!!  💙💚💛`);
            console.log(m);
            return m;
        });
    }
    static getAssociations() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getAssociations ....   🌀  🌀  🌀 `);
            const assocModel = new association_1.default().getModelForClass(association_1.default);
            const list = yield assocModel.find();
            console.log(list);
            return list;
        });
    }
    static onAssociationAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`onAssociationAdded event has occured .... 👽 👽 👽`);
            console.log(event);
            console.log(`operationType: 👽 👽 👽  ${event.operationType},   🍎 `);
        });
    }
}
exports.AssociationHelper = AssociationHelper;
//# sourceMappingURL=association_helper.js.map