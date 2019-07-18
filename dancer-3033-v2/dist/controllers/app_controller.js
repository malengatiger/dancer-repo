"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppController {
    routes(app) {
        console.log(`🏓🏓🏓🏓🏓    AppRoutes:  💙  setting up default home routes ...`);
        app.route("/").get((req, res) => {
            const msg = `🏓🏓🏓  Hello World from Dancer, independence is coming!!! 💙 IBM Cloud is UP! 💙 GCP is UP!  💙 Azure is UP!   🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
            console.log(msg);
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/ping").get((req, res) => {
            console.log(`\n\n💦  Dancer has been pinged!! IBM Cloud is UP!💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log('GET /ping', JSON.stringify(req.headers, null, 2));
            res.status(200).json({
                message: `🏓🏓 Dancer, aka ARWebAPI pinged !!! 💙 IBM Cloud is UP! 💙 GCP is UP! 💙  Azure is UP! 💙 ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            });
        });
    }
}
exports.AppController = AppController;
//# sourceMappingURL=app_controller.js.map