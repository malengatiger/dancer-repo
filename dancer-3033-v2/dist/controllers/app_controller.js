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
const log_1 = require("../log");
const qrcode_1 = __importDefault(require("../helpers/qrcode"));
class AppController {
    routes(app) {
        log_1.logBlue(`🏓🏓🏓    AppController:  💙 setting up / and /ping routes: ☘️ use to check if API is up ... ${app.name}`);
        app.route("/").get((req, res) => {
            const msg = `🧡💛🧡💛  Hello World from MizDancer 💙💙💙💙💙💙 Azure 🏓 DOCKER CONTAINER  is UP!  💙💙💙💙💙💙 🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
            log_1.logBlue(msg);
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/ping").get((req, res) => {
            log_1.logGreen(`\n\n💦 🧡💛🧡💛 Dancer has been pinged!! Azure 🏓 CONTAINER is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            log_1.logBlue(JSON.stringify(req.headers));
            res.status(200).json({
                message: `🧡💛🧡💛 MizDancer, aka AftaRobot Web API pinged! 💙💙💙💙💙💙 Azure 🏓 DOCKER CONTAINER is totally UP! 💙💙💙💙💙💙 ... and RUNNING!! 💙 ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            });
        });
        app.route("/generateQRCode").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.logGreen(`🧡💛🧡💛 generateQRCode requested`);
            console.log(req.body);
            var mRes = yield qrcode_1.default.generateQRCode(req.body.vehicleID);
            log_1.logGreen(`🧡💛🧡💛 generateQRCode completed, sending responses to caller: ${mRes.length}`);
            res.status(200).json(mRes);
        }));
    }
}
exports.AppController = AppController;
//# sourceMappingURL=app_controller.js.map