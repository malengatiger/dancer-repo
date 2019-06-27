"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_routes_1 = require("./../routes/app_routes");
// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });
// require('appmetrics-dash').attach();
// require('appmetrics-prometheus').attach();
// const appName = require('./../../package').name;
const appName = "bfnwebapinode";
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const admin = tslib_1.__importStar(require("firebase-admin"));
const app_1 = tslib_1.__importDefault(require("../app"));
/*
BUILD AND DEPLOY VIA CLOUD RUN
gcloud builds submit --tag gcr.io/business-finance-dev/bfnwebapi
gcloud beta run deploy --image gcr.io/business-finance-dev/bfnwebapi

RESULT:
Service [bfnwebapi] revision [bfnwebapi-00003] has been deployed and is serving traffic at https://bfnwebapi-hn3wjaywza-uc.a.run.app
*/
const http = require("http");
const log4js = require("log4js");
// const localConfig = require('./config/local.json');
const path = require("path");
const logger = log4js.getLogger("BFNWepAPI");
logger.level = process.env.LOG_LEVEL || "info";
exports.app = express_1.default();
const server = http.createServer(exports.app);
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use(log4js.connectLogger(logger, { level: logger.level }));
// require("./services/index")(app);
// require("./routers/index")(app, server);
exports.app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With-Content-Type, Accept");
    next();
});
const port = process.env.PORT || 3003;
server.listen(port, function () {
    console.info(`\n\n🔵 🔵 🔵  -- DancerWebAPI started and listening on http://localhost:${port} 💦 💦 💦 💦`);
    console.info(`🙄 🙄 🙄  -- Application name:  💕 💕 💕 💕  DancerWepAPI running at: 💦 ${new Date().toISOString() +
        "  🙄 🙄 🙄"}`);
});
// tslint:disable-next-line: no-var-requires
const serviceAccount1 = require("./../../ar.json");
// tslint:disable-next-line: no-var-requires
const serviceAccount2 = require("./../../dancer.json");
console.log(`📌 📌 📌 📌 📌 📌 📌 📌  `);
console.log(serviceAccount1);
console.log(`📌 📌 📌 📌 📌 📌 📌 📌 `);
console.log(serviceAccount2);
console.log(`serviceAccount: 😍 😍 😍 ...`);
const appFrom = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount1),
    databaseURL: "https://aftarobot2019-dev3.firebaseio.com",
}, "appFrom");
console.log(`🔑🔑🔑 appFrom = admin.initializeApp done: 😍 😍 😍 ... ${appFrom.name}`);
const appTo = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount2),
    databaseURL: "https://dancer-3303.firebaseio.com",
}, "appTo");
console.log(`🔑🔑🔑 appTo = admin.initializeApp done: 😍 😍 😍 ... ${appTo.name}`);
exports.fs1 = appFrom.firestore();
exports.fs2 = appTo.firestore();
console.log(`\n\n💋  💋  💋  Migrator: -- firebase admin initialized; 💦 
${appFrom.name} ❤️  from SDK_VERSION: ${admin.SDK_VERSION}  😍 😍 😍 ${new Date().toUTCString()}`);
console.log(`\n\n💋  💋  💋  Migrator: -- firebase admin initialized; 💦 
${appTo.name} ❤️  to SDK_VERSION: ${admin.SDK_VERSION}  😍 😍 😍 ${new Date().toUTCString()}`);
function getCollections() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(`\n🌸  🌸  🌸 Getting list of collections from  🌸 Firestore ...\n`);
        const colRef = yield exports.fs1.listCollections();
        console.log(`\n\n💦 💦 💦 💦 collections in Firestore FROM database: \n\n`);
        colRef.forEach((m) => {
            console.log(`❤️ ❤️ ❤️   Firestore FROM collection:  💦 ${m.doc().path.split("/")[0]}`);
        });
        console.log(`\n\n💦 💦 💦 💦 all FROM collections listed: \n\n`);
        const colRef2 = yield exports.fs2.listCollections();
        console.log(`\n\n💦 💦 💦 💦 collections in Firestore TO database: \n\n`);
        colRef2.forEach((m) => {
            console.log(`🌽 🌽 🌽   Firestore TO collection:  💦 ${m.doc().path.split("/")[0]}`);
        });
        console.log(`\n\n💦 💦 💦 💦 all TO collections listed: \n\n`);
        getRoutes();
    });
}
function getRoutes() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(`m1 to be set up`);
        const m1 = new app_routes_1.AppExpressRoutes();
        m1.routes(exports.app);
        console.log(`m1 has  been set up`);
    });
}
getCollections();
const myApp = new app_1.default();
// app.get("/ping", async function(req: Request, res: Response) {
//   console.log(`🙄 🙄 🙄 🙄 🙄 --- 💦 ping 💦--- 🙄 🙄 🙄 🙄 🙄 `);
//   const date = new Date().toISOString();
//   const pingData = {
//     date: date,
//     from: req.url,
//     originalUrl: req.originalUrl
//   };
//   const ref = await fs2.collection("testPings").add(pingData);
//   console.log("🎉 🎉 🎉  ping record written to 💙 Firestore");
//   res.status(200).json({
//     message: " 💕 💕  💕 💕  BFNWebAPI pinged!  💙  💚  💛 💙  💚  💛",
//     result: `🔵  🔵  🔵  Everything\'s cool. 💦 💦 The path to BFN chaincode begins right here: 💛 ${date} 💦 💦`,
//     path: ref.path,
//     ping: pingData
//   });
// });
// //
// //
// app.use(function(req: Request, res: Response, next: NextFunction) {
//   res.sendFile(path.join(__dirname, "../../public", "404.html"));
// });
// app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
//   res.sendFile(path.join(__dirname, "../../public", "500.html"));
// });
module.exports = server;
//# sourceMappingURL=server.js.map