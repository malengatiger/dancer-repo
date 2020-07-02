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
exports.NotificationsController = void 0;
const notifications_1 = __importDefault(require("../models/notifications"));
const log_1 = require("../log");
class NotificationsController {
    routes(app) {
        log_1.log(`🏓🏓🏓    Notifications Controller: 💙  setting up notifications messages ... `);
        /////////
        app.route("/addNotification").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /sendNotification requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const user = new notifications_1.default(req.body);
                user.created = new Date().toISOString();
                const result = yield user.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addMessage failed'
                });
            }
        }));
    }
}
exports.NotificationsController = NotificationsController;
;
//# sourceMappingURL=notifications_controller.js.map