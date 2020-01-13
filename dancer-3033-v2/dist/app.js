"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
// import AftaRobotApp from "../app";
const http_1 = __importDefault(require("http"));
const log_1 = __importDefault(require("./log"));
const ar_1 = __importDefault(require("./ar"));
const listEndpoints = require('express-list-endpoints');
exports.app = express_1.default();
const server = http_1.default.createServer(exports.app);
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With-Content-Type, Accept");
    next();
});
const port = process.env.PORT || 3003;
const dancer = process.env.DANCER_CONFIG || 'dancer config not found';
log_1.default(`🥦🥦🥦 Dancer Web(aka ARWeb) Firebase service account : 🥦🥦🥦 ${dancer} \n🥦🥦🥦🥦 end of service account 🥦🥦🥦🥦🥦🥦\n`);
server.listen(port, () => {
    log_1.default(`\n\n🔵🔵🔵  Dancer Web(aka ARWeb) API started and listening on port: 🧡💛 ${port}  🧡💛 ${new Date().toISOString()}  🍎🍎\n\n`);
});
const ar = new ar_1.default();
log_1.default(`\n🔆🔆 Dancer Web(aka ARWeb) API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);
log_1.default(`🔆🔆 Dancer Web(aka ARWeb) API has the following endpoints set up 🔆 🔆 🔆 🔆`);
const list = listEndpoints(exports.app);
const stringList = [];
list.forEach((m) => {
    stringList.push(m.path);
});
stringList.sort();
let cnt = 0;
stringList.forEach((m) => {
    cnt++;
    log_1.default(`🥦🥦🥦 🍎 #${cnt} 🍎 ${m}`);
});
log_1.default(`🥦🥦🥦 🥦🥦🥦 🥦🥦🥦 end of Dancer Web(aka ARWeb) endpoints available; total endpoints: 💛 ${cnt}  💛 \n\n`);
// mlog(`🥦🥦🥦 initializing SQLite ...`)
// mlog(`🔵🔵 SQLite  initialized  🔵🔵🔵🔵`)
module.exports = server;
//# sourceMappingURL=app.js.map