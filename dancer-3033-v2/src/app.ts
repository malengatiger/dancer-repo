import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";

import http from "http";
import { log } from './log';
import AftaRobotApp from './ar';
const listEndpoints = require('express-list-endpoints')

export const expressApp: Application = express();
const server = http.createServer(expressApp);

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

expressApp.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With-Content-Type, Accept",
  );
  next();
});

expressApp.use(cors());
log(`🥦🥦🥦 CORS set up for app: ${cors().name}`);
const router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('😍 😍 😍 😍 😍 😍 Time: ', new Date().toISOString())
  next()
})

const port = process.env.PORT || 8081;
const dancer = process.env.DANCER_CONFIG || 'dancer config not found';
log(`🥦🥦🥦 Dancer Web(aka ARWeb) Firebase service account : 🥦🥦🥦 ${dancer === null? 'No Firebase Service Account':' Firebase Service Account found'}  🥦🥦🥦`);
server.listen(port, () => {
  log(
    `\n🔵🔵🔵  Dancer Web(aka ARWeb) API started and listening on port: 🧡💛 ${port}  🧡💛 ${new Date().toISOString()}  🍎🍎\n`,
  );

});
const ar = new AftaRobotApp();
log(`\n🔆🔆 Dancer Web(aka ARWeb) API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);
// log(`🔆🔆 Dancer Web(aka ARWeb) API has the following endpoints set up 🔆 🔆 🔆 🔆`);
const list: any[] = listEndpoints(expressApp);
const stringList: string[] = [];
list.forEach((m) => {
  stringList.push(m.path);
});
stringList.sort();
let cnt = 0;
stringList.forEach((m) => {
  cnt++;
  log(`🥦🥦🥦 🍎 #${cnt} 🍎 ${m}`);
});

log(`🥦🥦 Dancer Web(aka ARWeb) endpoints available: 💛 ${list.length}  💛`);

module.exports = server;