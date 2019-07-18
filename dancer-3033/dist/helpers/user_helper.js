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
const messaging_1 = __importDefault(require("../server/messaging"));
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
class UserHelper {
    static onUserAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onUserChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  user in stream:  🍀  🍀  🍎 `);
            if (event.operationType === 'insert') {
                const user = new user_1.default();
                const data = event.fullDocument;
                if (data) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.email = data.email;
                    user.cellphone = data.cellphone;
                    user.associationID = data.associationID;
                    yield messaging_1.default.sendUser(user);
                }
            }
        });
    }
    static addUser(firstName, lastName, email, cellphone, userType, associationID, countryID, gender, fcmToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = new user_1.default().getModelForClass(user_1.default);
            const mUser = new userModel({
                firstName,
                lastName,
                email,
                cellphone,
                userType,
                associationID,
                countryID, gender, fcmToken,
            });
            if (associationID) {
                const assModel = new association_1.default().getModelForClass(association_1.default);
                const ass = yield assModel.findByAssociationId(associationID);
                if (ass) {
                    mUser.associationID = associationID;
                    mUser.associationName = ass.associationName;
                }
                else {
                    throw new Error(`Invalid association: ${associationID}`);
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
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getUserByEmail find user ....   c  🌀  🌀 `);
            const userModel = new user_1.default().getModelForClass(user_1.default);
            const user = yield userModel.find({ email: email });
            return user;
        });
    }
}
exports.UserHelper = UserHelper;
//# sourceMappingURL=user_helper.js.map