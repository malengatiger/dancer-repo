import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
// import AftaRobotApp from "../app";
import http from "http";
import mlog from './log';
import AftaRobotApp from './ar';
import { log } from "util";

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

const port = process.env.PORT || 3000;
const dancer = process.env.DANCER_CONFIG || 'dancer config not found';
log(`🥦🥦🥦 dancer service account : 🥦🥦🥦 ${dancer}`);
server.listen(port, () => {
  console.info(
    `\n🔵🔵🔵  Dancer Web API started and listening on; 🧡💛 port: ${port} 🧡💛`,
  );

});
const ar = new AftaRobotApp();
mlog(`🔆 🔆 Dancer Web API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);


module.exports = server;