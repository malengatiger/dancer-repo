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
const migrator_1 = __importDefault(require("../migration/migrator"));
const util_1 = __importDefault(require("../util"));
class AppExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓🏓🏓🏓🏓    AppExpressRoutes:  💙  setting up default home routes ...`);
        app.route("/").get((req, res) => {
            const msg = `🏓🏓🏓  Hello World from Dancer   🌽🌽🌽 ${new Date().toISOString()} 🌽🌽🌽`;
            console.log(msg);
            res.status(200).json({
                message: msg,
            });
        });
        app.route("/ping").get((req, res) => {
            console.log(`\n\n💦  pinged!. 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log('GET /ping', JSON.stringify(req.headers, null, 2));
            res.status(200).json({
                message: `🏓🏓 ARWebAPI pinged !!! : 💙  ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            });
        });
        app.route("/startMigrator").post((req, res) => __awaiter(this, void 0, void 0, function* () {
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