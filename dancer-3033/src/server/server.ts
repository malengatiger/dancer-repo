import { AppExpressRoutes } from "./../routes/app_routes";

const appName = "bfnwebapinode";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import AftaRobotApp from "../app";
import http from "http";

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
    `💕 💕 💕 💕  DancerWepAPI running at: 🧡💛  ${new Date().toISOString() +
      "  🙄 🙄 🙄"}`,
  );
});

const myApp = new AftaRobotApp();
console.log(`🔆 🔆 DancerWebAPI has been created and stood up! 🔆 🔆 🍎🍎 ${new Date().toUTCString()} 🍎🍎`);

module.exports = server;
