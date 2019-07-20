"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//https://firebasestorage.googleapis.com/v0/b/dancer26983.appspot.com/o/config%2Fdancer.json?alt=media&token=070c055b-2097-480f-8430-a849c96c5b60
const admin = __importStar(require("firebase-admin"));
const landmark_1 = __importDefault(require("../models/landmark"));
console.log(`\n\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...\n\n`);
const sa1 = process.env.DANCER_CONFIG || "config 1 not found";
const ssa1 = JSON.parse(sa1);
console.log(`\n☘️ serviceAccounts listed ☘️ ok: 😍 😍 😍 ...\n\n`);
const appTo = admin.initializeApp({
    credential: admin.credential.cert(ssa1),
    databaseURL: "https://dancer-3303.firebaseio.com",
}, "appTo");
console.log(`🔑🔑🔑 appTo = admin.initializeApp done: 😍 😍 😍 ... ${appTo.name}`);
class Messaging {
    static sendCommuterArrivalLandmark(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Commuter Arrival",
                    body: data.createdAt,
                },
                data: {
                    createdAt: data.createdAt,
                    userId: data.userId,
                    routeId: data.routeId,
                    fromLandmarkId: data.fromLandmarkId,
                    toLandmarkId: data.toLandmarkId,
                },
            };
            const topic = "commuterArrivalLandmark_" + data.fromLandmarkId;
            yield appTo.messaging().sendToTopic(topic, payload, options);
            console.log(`😍 sendCommuterArrivalLandmark: message sent: 😍 ${data.fromLandmarkName} ${data.fromLandmarkId}`);
        });
    }
    static sendDispatchRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Dispatch Record",
                    body: data.dispatchedAt,
                },
                data: {
                    dispatchedAt: data.dispatchedAt,
                    userId: data.userId,
                    routeId: data.routeId,
                    landmarkId: data.landmarkId,
                    vehicleId: data.vehicleId,
                    vehicleReg: data.vehicleReg,
                },
            };
            const topic = "sendDispatchRecord_" + data.landmarkId;
            yield appTo.messaging().sendToTopic(topic, payload, options);
            console.log(`😍 sendDispatchRecord: message sent: 😍 ${data.landmarkId} ${data.dispatchedAt}`);
        });
    }
    static sendUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "User Added",
                    body: data.firstName + " " + data.lastName + " created:" + data.created,
                },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    associationID: data.associationID,
                    email: data.email,
                },
            };
            const topic1 = "users";
            const topic2 = "users_" + data.associationID;
            const con = `${topic1} in topics || ${topic2} in topics`;
            yield appTo.messaging().sendToCondition(con, payload, options);
            console.log(`😍😍 sendUser: message sent: 😍😍 ${data.firstName} ${data.lastName} 👽👽👽`);
        });
    }
    static sendPanic(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "high",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Commuter Panic",
                    body: data.type + " " + data.createdAt + " userId:" + data.userId,
                },
                data: {
                    type: data.type,
                    createdAt: data.createdAt,
                    userId: data.userId,
                    vehicleId: data.vehicleId,
                    vehicleReg: data.vehicleReg,
                    active: data.active,
                    locations: data.locations,
                },
            };
            // todo - find nearest landmarks to find routes - send panic to routes found
            const list = yield landmark_1.default.find({
                position: {
                    $near: {
                        $geometry: {
                            coordinates: [data.longitude, data.latitude],
                            type: "Point",
                        },
                        $maxDistance: 5000,
                    },
                },
            });
            console.log(`landmarks found near panic: ${list.length}`);
            const mTopic = "panic";
            yield appTo.messaging().sendToTopic(mTopic, payload, options);
            // send messages to routes and landmarks
            for (const landmark of list) {
                const topic1 = "panic_" + landmark.landmarkID;
                yield appTo.messaging().sendToTopic(topic1, payload, options);
                console.log(`😍😍 sendPanic: message sent: 😍😍 ${data.type} ${data.createdAt} 👽👽 landmark topic: ${topic1}👽`);
                for (const routeId of landmark.routeIDs) {
                    const routeTopic = "panic_" + routeId;
                    yield appTo.messaging().sendToTopic(routeTopic, payload, options);
                    console.log(`😍😍 sendPanic: message sent: 😍😍 ${data.type} ${data.createdAt} 👽👽 route topic: ${routeTopic}👽`);
                }
            }
        });
    }
}
exports.default = Messaging;
//# sourceMappingURL=messaging.js.map