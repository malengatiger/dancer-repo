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
const user_1 = __importDefault(require("../models/user"));
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
class UserHelper {
    static onUserAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onUserChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  user in stream:  🍀  🍀  🍎 `);
        });
    }
    static addUser(firstName, lastName, email, cellphone, userType, associationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = new user_1.default().getModelForClass(user_1.default);
            const mUser = new userModel({
                firstName,
                lastName,
                email,
                cellphone,
                userType,
                associationId,
            });
            if (associationId) {
                const assModel = new association_1.default().getModelForClass(association_1.default);
                const ass = yield assModel.findByAssociationID(associationId);
                if (ass) {
                    mUser.associationId = associationId;
                    mUser.associationName = ass.associationName;
                }
                else {
                    throw new Error("Invalid association");
                }
            }
            const m = yield mUser.save();
            m.userID = m.id;
            yield m.save();
            console.log(`\n\n💙 💚 💛  UserHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${mUser}  💙  💚  💛`);
            return m;
        });
    }
    static getUsersByAssociation(associationId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getUsers find all users in association ....   c  🌀  🌀 `);
            const userModel = new user_1.default().getModelForClass(user_1.default);
            const list = yield userModel.findByAssociationID(associationId);
            return list;
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getUsers find all users in Mongo ....   c  🌀  🌀 `);
            const userModel = new user_1.default().getModelForClass(user_1.default);
            const list = yield userModel.find();
            return list;
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getUsers find user ....   c  🌀  🌀 `);
            const userModel = new user_1.default().getModelForClass(user_1.default);
            const user = yield userModel.findByUserID(userId);
            return user;
        });
    }
}
exports.UserHelper = UserHelper;
//# sourceMappingURL=user_helper.js.map