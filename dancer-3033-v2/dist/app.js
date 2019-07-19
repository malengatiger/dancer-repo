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
const util_1 = require("util");
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
const port = process.env.PORT || 3000;
const dancer = process.env.DANCER_CONFIG || 'dancer config not found';
util_1.log(`🥦🥦🥦 dancer service account : 🥦🥦🥦 ${dancer}`);
server.listen(port, () => {
    console.info(`\n🔵🔵🔵  Dancer Web API started and listening on; 🧡💛 port: ${port} 🧡💛`);
});
const ar = new ar_1.default();
log_1.default(`🔆 🔆 Dancer Web API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);
log_1.default(`\n🔆 🔆 Dancer Web API has the following endpoints set up 🔆 🔆 🔆 🔆`);
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
log_1.default(`🥦🥦🥦 🥦🥦🥦 🥦🥦🥦 end of endpoints available; total endpoints: 💛 ${cnt}  💛 \n\n`);
module.exports = server;
//# sourceMappingURL=app.js.map