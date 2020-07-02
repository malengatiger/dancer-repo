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
exports.ChatController = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const log_1 = require("../log");
class ChatController {
    routes(app) {
        log_1.log(`🏓🏓🏓    ChatController: 💙  setting up messages for live chat ... `);
        /////////
        app.route("/getChatMessagesByAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /getMessagesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const messages = yield chat_1.default.find({
                    associationID: req.body.associationID,
                });
                res.status(200).json(messages);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getMessagesByAssociation failed'
                });
            }
        }));
        app.route("/sendChatMessage").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /sendMessage requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const user = new chat_1.default(req.body);
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
        app.route("/updateChatMessageRead").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.log(`\n\n💦  POST: /updateMessageRead requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const messageToUpdate = req.body;
                const message = yield chat_1.default.findOne({ associationID: req.body.associationID });
                if (message) {
                    Object.assign(message, messageToUpdate);
                    const result = yield message.save();
                    // log(result);
                    res.status(200).json(result);
                }
                else {
                    throw 'message not found';
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
exports.ChatController = ChatController;
exports.default = ChatController;
//# sourceMappingURL=chat_controller.js.map