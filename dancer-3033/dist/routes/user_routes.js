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
const user_helper_1 = require("../helpers/user_helper");
const util_1 = __importDefault(require("../util"));
class UserExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    UserExpressRoutes:  💙  setting up default User Routes ...`);
        app.route("/addUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /Users requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield user_helper_1.UserHelper.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.cellphone, req.body.userType, req.body.associationId);
                console.log("about to return result from Helper ............");
                res.status(200).json({
                    message: `🏓  🏓  🏓  User: ${req.body.firstName} : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addUser failed");
            }
        }));
        app.route("/getAllUsers").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getAllUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield user_helper_1.UserHelper.getAllUsers();
                res.status(200).json({
                    message: `🏓  🏓  🏓  getAllUsers OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getAllUsers failed");
            }
        }));
        app
            .route("/getUsersByAssociation")
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getUsersByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield user_helper_1.UserHelper.getUsersByAssociation(req.body.associationId);
                res.status(200).json({
                    message: `🏓  🏓  🏓  getUsersByAssociation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getUsersByAssociation failed");
            }
        }));
        app.route("/getUserById").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getUserById requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield user_helper_1.UserHelper.getUserById(req.body.userId);
                res.status(200).json({
                    message: `🏓  🏓  🏓  getUserById OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getUserById failed");
            }
        }));
    }
}
exports.UserExpressRoutes = UserExpressRoutes;
exports.default = UserExpressRoutes;
//# sourceMappingURL=user_routes.js.map