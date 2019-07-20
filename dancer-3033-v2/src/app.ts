import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
// import AftaRobotApp from "../app";
import http from "http";
import mlog from './log';
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

const port = process.env.PORT || 3003;
const dancer = process.env.DANCER_CONFIG || 'dancer config not found';
mlog(`🥦🥦🥦 dancer service account : 🥦🥦🥦 ${dancer} \n🥦🥦🥦🥦 end of service account 🥦🥦🥦🥦🥦🥦\n`);
server.listen(port, () => {
  console.info(
    `\n🔵🔵🔵  Dancer Web API started and listening on port: 🧡💛 ${port}  🧡💛`,
  );

});
const ar = new AftaRobotApp();
mlog(`\n🔆🔆 Dancer Web API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);
mlog(`🔆🔆 Dancer Web API has the following endpoints set up 🔆 🔆 🔆 🔆`);
const list: any[] = listEndpoints(app);
const stringList: string[] = [];
list.forEach((m) => {
  stringList.push(m.path);
});
stringList.sort();
let cnt = 0;
stringList.forEach((m) => {
  cnt++;
  mlog(`🥦🥦🥦 🍎 #${cnt} 🍎 ${m}`);
});

mlog(`🥦🥦🥦 🥦🥦🥦 🥦🥦🥦 end of endpoints available; total endpoints: 💛 ${cnt}  💛 \n\n`);

module.exports = server;