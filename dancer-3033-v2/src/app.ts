import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
var responseTime = require("response-time");

import http from "http";
import { log } from "./log";
import AftaRobotApp from "./ar";
const listEndpoints = require("express-list-endpoints");

export const expressApp: Application = express();
const server = http.createServer(expressApp);

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

expressApp.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With-Content-Type, Accept"
  );

  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  if (req.get("host")) {
    console.log(`💙 ... request URL received: 💙 ${fullUrl} 💙`);
    // console.log(`💙 response header: 💙 ${res.header.arguments()} 💙`);
  }
  next();
});

expressApp.use(responseTime());
expressApp.use(cors());
log(`🥦🥦🥦 CORS set up for app: ${cors().name}`);
const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("😍 😍 😍 😍 😍 😍 Time: ", new Date().toISOString());
  next();
});

const port = process.env.PORT || 8081;
const dancer = process.env.DANCER_CONFIG || "dancer config not found";
log(
  `🥦🥦🥦 Dancer Web(aka ARWeb) Firebase service account : 🥦🥦🥦 ${
    dancer === null
      ? "No Firebase Service Account"
      : " Firebase Service Account found"
  }  🥦🥦🥦`
);
server.listen(port, () => {
  log(
    `\n🔵🔵🔵  Dancer Web(aka ARWeb) API started and listening on port: 🧡💛 ${port}  🧡💛 ${new Date().toISOString()}  🍎🍎\n`
  );
});

mongoose.set("useCreateIndex", true);
log(`🥦🥦🥦 Mongoose useCreateIndex has been set`);

const ar = new AftaRobotApp();
log(
  `\n🔆🔆 Dancer Web(aka ARWeb) API has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`
);
log(
  `🔆🔆 Dancer Web(aka ARWeb) API has the following endpoints set up 🔆 🔆 🔆 🔆`
);

const authenticate: any = (
  req: { headers: { authorization: any }; user: any },
  res: { sendStatus: (arg0: number) => void },
  next: () => void
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    // jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
    //     if (err) {
    //         return res.sendStatus(403);
    //     }

    //     req.user = user;
    //     next();
    // });
  } else {
    res.sendStatus(401);
  }
};

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
