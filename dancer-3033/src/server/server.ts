import { AppExpressRoutes } from "./../routes/app_routes";

const appName = "bfnwebapinode";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import AftaRobotApp from "../app";
import http from "http";
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

const port = process.env.PORT || 1337;
server.listen(port, () => {
  console.info(
    `\n🔵🔵🔵  DancerWebAPI started and listening on 🧡 💛  http://localhost:${port} 🧡 💛`,
  );
  console.info(
    `💕 💕 💕 💕  DancerWepAPI running at: 🧡 💛  ${new Date().toISOString() +
      "  🙄 🙄 🙄"}`,
  );
});

const myApp = new AftaRobotApp();
console.log(`🔆 🔆 DancerWebAPI has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);

module.exports = server;
