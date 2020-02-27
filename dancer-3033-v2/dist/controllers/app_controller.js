"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../log");
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
    }
}
exports.AppController = AppController;
//# sourceMappingURL=app_controller.js.map