import { AppExpressRoutes } from "./../routes/app_routes";
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
import express from "express";
const dotenv = require("dotenv");
dotenv.config();
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as admin from "firebase-admin";
import { Firestore, CollectionReference } from "@google-cloud/firestore";
import AftaRobotApp from "../app";
/*
BUILD AND DEPLOY VIA CLOUD RUN
gcloud builds submit --tag gcr.io/dancer-3303/arapi
gcloud beta run deploy --image gcr.io/dancer-3303/arapi --platform-managed

RESULT:
Service [bfnwebapi] revision [bfnwebapi-00003] has been deployed and is serving traffic at https://bfnwebapi-hn3wjaywza-uc.a.run.app

https://arapi-7amgwbyxjq-uc.a.run.app/getAssociations
*/

const http = require("http");
// const localConfig = require('./config/local.json');
const path = require("path");

export const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// require("./services/index")(app);
// require("./routers/index")(app, server);

app.use(function(req: Request, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With-Content-Type, Accept",
  );
  next();
});

console.log(`\n\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...\n\n`);
const sa1 = process.env.DANCER_CONFIG || "config 1 not found";
const sa2 = process.env.OLD_CONFIG || "config 2 not found";

const ssa1 = JSON.parse(sa1);
const ssa2 = JSON.parse(sa2);

const port = process.env.PORT || 8083;
server.listen(port, function() {
  console.info(
    `\n\n🔵 🔵 🔵  -- DancerWebAPI started and listening on 🧡 💛 http://localhost:${port} 🧡 💛 💦 💦 💦 💦`,
  );
  console.info(
    `🙄 🙄 🙄  -- Application name:  💕 💕 💕 💕  DancerWepAPI running at: 🧡 💛  ${new Date().toISOString() +
      "  🙄 🙄 🙄"}`,
  );
});

// tslint:disable-next-line: no-var-requires
// const serviceAccount1 = require("./../../ar.json");
// tslint:disable-next-line: no-var-requires
// const serviceAccount2 = require("./../../dancer.json");

console.log(`📌 📌 📌 📌 📌 📌 📌 📌  `);
console.log(ssa1);
console.log(`📌 📌 📌 📌 📌 📌 📌 📌 `);
console.log(ssa2);
console.log(`\n☘️ serviceAccounts listed ☘️ ok: 😍 😍 😍 ...\n\n`);
const appFrom = admin.initializeApp(
  {
    credential: admin.credential.cert(ssa1),
    databaseURL: "https://aftarobot2019-dev3.firebaseio.com",
  },
  "appFrom",
);
console.log(
  `🔑🔑🔑 appFrom = admin.initializeApp done: 😍 😍 😍 ... ${appFrom.name}`,
);
const appTo = admin.initializeApp(
  {
    credential: admin.credential.cert(ssa2),
    databaseURL: "https://dancer-3303.firebaseio.com",
  },
  "appTo",
);
console.log(
  `🔑🔑🔑 appTo = admin.initializeApp done: 😍 😍 😍 ... ${appTo.name}`,
);

export const fs1: Firestore = appFrom.firestore();
export const fs2: Firestore = appTo.firestore();
console.log(`\n\n💋💋💋  Server: -- firebase admin 1 initialized; 💦 
${appFrom.name} ❤️  from SDK_VERSION: ${
  admin.SDK_VERSION
}  😍 😍 😍 ${new Date().toUTCString()}`);
console.log(`\n\n💋💋💋  Server: -- firebase admin 2 initialized; 💦 
${appTo.name} ❤️  to SDK_VERSION: ${
  admin.SDK_VERSION
}  😍 😍 😍 ${new Date().toUTCString()}`);

async function getCollections() {
  console.log(
    `\n🌸🌸🌸  Getting list of collections from  🌸 Firestore ...\n`,
  );
  const colRef: CollectionReference[] = await fs1.listCollections();
  console.log(`\n\n💦 💦 💦 💦 collections in Firestore FROM database: \n\n`);
  colRef.forEach((m) => {
    console.log(
      `❤️ ❤️ ❤️   Firestore FROM collection:  💦 ${m.doc().path.split("/")[0]}`,
    );
  });
  console.log(`\n\n💦 💦 💦 💦 all FROM collections listed: \n\n`);
  const colRef2: CollectionReference[] = await fs2.listCollections();
  console.log(`\n\n💦 💦 💦 💦 collections in Firestore TO database: \n\n`);
  colRef2.forEach((m) => {
    console.log(
      `🌽 🌽 🌽   Firestore TO collection:  💦 ${m.doc().path.split("/")[0]}`,
    );
  });
  console.log(`\n\n💦 💦 💦 💦 all TO collections listed: \n\n`);
  // getRoutes();
}

getCollections();

const myApp = new AftaRobotApp();
console.log(`AftaRobot app has been created and stood up!`);

module.exports = server;
