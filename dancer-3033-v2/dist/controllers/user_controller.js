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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const log_1 = require("../log");
const user_1 = __importDefault(require("../models/user"));
const uuid = require("uuid");
const user_helper_1 = __importDefault(require("../helpers/user_helper"));
class UserController {
    routes(app) {
        log_1.log(`🏓    UserController: 💙  setting up default User routes ... `);
        /////////
        app.route("/getUsers").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const users = yield user_1.default.find();
                res.status(200).json(users);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getUsers failed'
                });
            }
        }));
        app.route("/findUserByEmail").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /findUserByEmail requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const user = yield user_1.default.findOne({
                    email: req.body.email,
                });
                log_1.log(user);
                res.status(200).json(user);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findUserByEmail failed'
                });
            }
        }));
        app.route("/getUsersByAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getUsersByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const users = yield user_1.default.find({
                    associationID: req.body.associationID,
                });
                res.status(200).json(users);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getUsersByAssociation failed'
                });
            }
        }));
        app.route("/userLogin").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /userLogin requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const { email, password } = req.body;
                const user = yield user_1.default.findOne({ email: email });
                if (user) {
                    var hash = crypto_1.default.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
                    if (user.hash === hash) {
                        delete user.hash;
                        delete user.salt;
                        res.status(200).json(user);
                    }
                    else {
                        throw 'Wrong password';
                    }
                }
                else {
                    throw 'User not found';
                }
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 User login failed'
                });
            }
        }));
        app.route("/addUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /addUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const user = new user_1.default(req.body);
                if (!req.body.userID) {
                    user.userID = uuid();
                }
                user.created = new Date().toISOString();
                const result = yield user.save();
                console.log('😍😍😍😍 Successfully created new user on MongoDB:');
                //create user on firebase auth ....
                yield user_helper_1.default.addUser(user);
                res.status(200).json(result);
            }
            catch (err) {
                console.error('addUser failed', err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addUser failed'
                });
            }
        }));
        app.route("/updateUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /updateUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const userToUpdate = req.body;
                const user = yield user_1.default.findOne({ userID: req.body.userID });
                if (user) {
                    Object.assign(user, userToUpdate);
                    if (req.body.password != null) {
                        user.salt = crypto_1.default.randomBytes(16).toString('hex');
                        user.hash = crypto_1.default.pbkdf2Sync(req.body.password, user.salt, 10000, 512, 'sha512').toString('hex');
                    }
                    const result = yield user.save();
                    // log(result);
                    res.status(200).json(result);
                }
                else {
                    throw 'User not found';
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 updateUser failed'
                });
            }
        }));
        app.route("/deleteUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /deleteUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                yield user_1.default.deleteOne({ userID: req.body.userID });
                yield user_helper_1.default.deleteUser(req.body.userID);
                res.status(200).json({
                    message: `User deleted from both mongo & firebase auth: ${req.body.userID}`
                });
            }
            catch (err) {
                console.log(err, 'deleteUser failed');
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 deleteUser failed'
                });
            }
        }));
    }
}
exports.UserController = UserController;
exports.default = UserController;
//# sourceMappingURL=user_controller.js.map