"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteController = void 0;
const route_1 = __importDefault(require("../models/route"));
const landmark_1 = __importDefault(require("../models/landmark"));
const old_landmark_1 = __importDefault(require("../models/old_landmark"));
class DeleteController {
    routes(app) {
        console.log(`🏓    DeleteController:  💙 setting up temporary fix routes ${app.name}`);
        app.route("/deleteRoute").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 ........... deleteRoute requested `;
            console.log(msg);
            //"0f316750-8b19-11e9-815c-b1ada6043f84" "0edae2e0-8b19-11e9-815c-b1ada6043f84"
            try {
                const associationID = req.body.associationID;
                const routes = yield route_1.default.find({
                    associationID: "0edae2e0-8b19-11e9-815c-b1ada6043f84"
                });
                console.log(` 😍 😍 😍 routes found for assoc ${routes.length}`);
                routes.forEach((m) => __awaiter(this, void 0, void 0, function* () {
                    const routeID = m.routeID;
                    const landmarks = yield landmark_1.default.find({
                        'routeDetails.routeID': routeID
                    });
                    console.log(`🍎 🍎 🍎 landmarks found for route ${landmarks.length}`);
                    landmarks.forEach((m) => __awaiter(this, void 0, void 0, function* () {
                        //delete
                        console.log(`${m.id} - 🌽 ${m.landmarkName}`);
                        const landmark = new landmark_1.default(req.body);
                    }));
                }));
                res.status(200).send("We done deletin ...");
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 deleteRoute failed'
                });
            }
        }));
        app.route("/copyLandmarks").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 ........... copyLandmarks requested `;
            console.log(msg);
            //"0f316750-8b19-11e9-815c-b1ada6043f84" "0edae2e0-8b19-11e9-815c-b1ada6043f84"
            try {
                const landmarks = yield landmark_1.default.find();
                console.log(` 😍 😍 😍 routes found for assoc ${landmarks.length}`);
                landmarks.forEach((m) => __awaiter(this, void 0, void 0, function* () {
                    const landmarkID = m.landmarkID;
                    const landmark = new old_landmark_1.default(m);
                    landmark.save();
                    m.delete();
                    console.log(`🌿 🌿 Landmark ${m.landmarkName} 🌿 deleted and saved in old marks`);
                }));
                res.status(200).send("We done copying ...");
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 deleteRoute failed'
                });
            }
        }));
    }
}
exports.DeleteController = DeleteController;
//# sourceMappingURL=delete.js.map