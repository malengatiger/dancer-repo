"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appName = "bfnwebapinode";
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const app_1 = __importDefault(require("../app"));
const http_1 = __importDefault(require("http"));
/*
BUILD AND DEPLOY VIA CLOUD RUN
gcloud builds submit --tag gcr.io/dancer-3303/arapi
gcloud beta run deploy --image gcr.io/dancer-3303/arapi --platform-managed

https://arapi-7amgwbyxjq-uc.a.run.app/getAssociations
1-929-270-4297
 PIN
918412   Get new PIN
Project ID & number
dancer-3303 (319923451575)

Phone number
1-929-270-4297 (standard international rates apply)

////////// ibm cloud
ibmcloud dev deploy

// update app
ibmcloud cf push
https://dancer-3033.eu-gb.cf.appdomain.cloud/ping

*/
exports.app = express_1.default();
const server = http_1.default.createServer(exports.app);
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With-Content-Type, Accept");
    next();
});
const port = process.env.PORT || 1337;
server.listen(port, () => {
    console.info(`\n🔵🔵🔵  DancerWebAPI started and listening on 🧡 💛  http://localhost:${port} 🧡 💛`);
    console.info(`💕 💕 💕 💕  DancerWepAPI running at: 🧡 💛  ${new Date().toISOString() +
        "  🙄 🙄 🙄"}`);
});
const myApp = new app_1.default();
console.log(`🔆 🔆 DancerWebAPI has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);
module.exports = server;
//# sourceMappingURL=server.js.map