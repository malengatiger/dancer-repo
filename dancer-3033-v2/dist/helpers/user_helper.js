"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const messaging_1 = require("../helpers/messaging");
class UserHelper {
    static addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //create user on firebase auth ....
            yield messaging_1.appTo.auth().createUser({
                uid: user.userID,
                email: user.email,
                password: user.password ? user.password : 'changeThisPassword',
                displayName: user.firstName + ' ' + user.lastName,
            })
                .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('😍😍😍😍 Successfully created new Firebase auth user:', userRecord.displayName);
            })
                .catch(function (error) {
                console.error('😈😈😈Error creating new Firebase auth user:', error);
            });
        });
    }
    static deleteUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield messaging_1.appTo.auth().deleteUser(userID);
            console.log('😍😍😍😍🍎 Successfully deleted Firebase auth user: 🍎', userID);
        });
    }
}
exports.default = UserHelper;
//# sourceMappingURL=user_helper.js.map