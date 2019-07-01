"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppExpressRoutes {
    routes(app) {
        console.log(`\n🏓🏓🏓🏓🏓    AppExpressRoutes:  💙  setting up default home routes ...`);
        app.route("/").get((req, res) => {
            const msg = `🏓🏓🏓  Hello World from Dancer, independence is coming!!!   🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
            console.log(msg);
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/ping").get((req, res) => {
            console.log(`\n\n💦  Dancer has been pinged!! 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log('GET /ping', JSON.stringify(req.headers, null, 2));
            res.status(200).json({
                message: `🏓🏓 Dancer, aka ARWebAPI pinged !!! : 💙  ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            });
        });
    }
}
exports.AppExpressRoutes = AppExpressRoutes;
//# sourceMappingURL=app_routes.js.map