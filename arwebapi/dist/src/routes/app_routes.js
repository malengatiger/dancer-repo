"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const migrator_1 = tslib_1.__importDefault(require("../migration/migrator"));
const util_1 = tslib_1.__importDefault(require("./util"));
class AppExpressRoutes {
    constructor() {
        console.log(`\n\n🏓🏓🏓🏓🏓    AppExpressRoutes:  💙  in constructor ...`);
    }
    routes(app) {
        console.log(`\n\n🏓🏓🏓🏓🏓    AppExpressRoutes:  💙  setting up default home routes ...`);
        app.route("/").get((req, res) => {
            const msg = `🏓  🏓  🏓  home route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/ping").get((req, res) => {
            console.log(`\n\n💦  pinged!. 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log('Does this color shit work?');
            console.log('GET /ping', JSON.stringify(req.headers, null, 2));
            res.status(200).json({
                message: `🏓  🏓 pinged : 💙  ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            });
        });
        app.route("/startMigrator").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  /startMigrator!. 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield migrator_1.default.start();
                res.status(200).json({
                    message: `🏓  🏓  startMigrator : 💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (e) {
                util_1.default.sendError(res, e, "StartMigrator failed");
            }
        }));
    }
}
exports.AppExpressRoutes = AppExpressRoutes;
//# sourceMappingURL=app_routes.js.map