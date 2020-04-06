"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
// import AftaRobotApp from "../app";
const http_1 = __importDefault(require("http"));
const log_1 = require("./log");
const ar_1 = __importDefault(require("./ar"));
const listEndpoints = require('express-list-endpoints');
exports.expressApp = express_1.default();
const server = http_1.default.createServer(exports.expressApp);
exports.expressApp.use(body_parser_1.default.json());
exports.expressApp.use(body_parser_1.default.urlencoded({ extended: false }));
exports.expressApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With-Content-Type, Accept");
    next();
});
exports.expressApp.use(cors_1.default);
log_1.log(`🥦🥦🥦 CORS set up for app: ${cors_1.default.name}`);
const port = process.env.PORT || 8081;
const dancer = process.env.DANCER_CONFIG || 'dancer config not found';
log_1.log(`🥦🥦🥦 Dancer Web(aka ARWeb) Firebase service account : 🥦🥦🥦 ${dancer === null ? 'No Firebase Service Account' : ' Firebase Service Account found'}  🥦🥦🥦`);
server.listen(port, () => {
    log_1.log(`\n🔵🔵🔵  Dancer Web(aka ARWeb) API started and listening on port: 🧡💛 ${port}  🧡💛 ${new Date().toISOString()}  🍎🍎\n`);
});
const ar = new ar_1.default();
log_1.log(`\n🔆🔆 Dancer Web(aka ARWeb) API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);
// log(`🔆🔆 Dancer Web(aka ARWeb) API has the following endpoints set up 🔆 🔆 🔆 🔆`);
const list = listEndpoints(exports.expressApp);
const stringList = [];
list.forEach((m) => {
    stringList.push(m.path);
});
stringList.sort();
let cnt = 0;
// stringList.forEach((m) => {
//   cnt++;
//   log(`🥦🥦🥦 🍎 #${cnt} 🍎 ${m}`);
// });
log_1.log(`🥦🥦 Dancer Web(aka ARWeb) endpoints available: 💛 ${list.length}  💛`);
// log(`🥦🥦🥦 initializing SQLite ...`)
// log(`🔵🔵 SQLite  initialized  🔵🔵🔵🔵`)
module.exports = server;
//# sourceMappingURL=app.js.map