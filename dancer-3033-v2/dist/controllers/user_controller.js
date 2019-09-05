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
const crypto_1 = __importDefault(require("crypto"));
const log_1 = __importDefault(require("../log"));
const user_1 = __importDefault(require("../models/user"));
const uuid = require("uuid");
const notification_1 = __importDefault(require("../models/notification"));
const userTypes = ['Staff', 'Owner', 'Administrator', 'Driver', 'Marshal', 'Patroller'];
class UserController {
    routes(app) {
        log_1.default(`🏓🏓🏓    UserController: 💙  setting up default User routes ... `);
        /////////
        app.route("/getUsers").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /getUsers requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
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
            log_1.default(`\n\n💦  POST: /findUserByEmail requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const user = yield user_1.default.findOne({
                    email: req.body.email,
                });
                log_1.default(user);
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
            log_1.default(`\n\n💦  POST: /getUsersByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
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
        app.route("/notifications").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notification_1.default.find();
                res.status(200).json(notifications);
            }
            catch (err) {
                res.status(400).json(err);
            }
        }));
        app.route("/addNotification").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = new notification_1.default(req.body);
                const result = yield notification.save();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json(err);
            }
        }));
        app.route("/userLogin").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /userLogin requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
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
            log_1.default(`\n\n💦  POST: /addUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const user = new user_1.default(req.body);
                if (req.body.userID) {
                    user.userID = req.body.userID;
                }
                else {
                    user.userID = uuid();
                }
                // user.firebaseUID = req.body.firebaseUID;
                user.created = new Date().toISOString();
                const result = yield user.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addUser failed'
                });
            }
        }));
        app.route("/updateUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /updateUser requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
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
    }
}
exports.UserController = UserController;
exports.default = UserController;
//# sourceMappingURL=user_controller.js.map