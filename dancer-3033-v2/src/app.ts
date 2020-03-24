import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
// import AftaRobotApp from "../app";
import http from "http";
import { log } from './log';
import AftaRobotApp from './ar';
const listEndpoints = require('express-list-endpoints')

export const app: Application = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With-Content-Type, Accept",
  );
  next();
});

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
const list: any[] = listEndpoints(app);
const stringList: string[] = [];
list.forEach((m) => {
  stringList.push(m.path);
});
stringList.sort();
let cnt = 0;
// stringList.forEach((m) => {
//   cnt++;
//   log(`🥦🥦🥦 🍎 #${cnt} 🍎 ${m}`);
// });

log(`🥦🥦 Dancer Web(aka ARWeb) endpoints available: 💛 ${list.length}  💛`);
// log(`🥦🥦🥦 initializing SQLite ...`)

// log(`🔵🔵 SQLite  initialized  🔵🔵🔵🔵`)

module.exports = server;