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
const log_1 = __importDefault(require("../log"));
console.log(`\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...`);
const sa1 = process.env.DANCER_CONFIG || 'NOTFOUND';
let appTo;
if (sa1 === 'NOTFOUND') {
    log_1.default('Dancer config not found');
    getDancerConfigFile();
}
else {
    const ssa1 = JSON.parse(sa1);
    log_1.default(`☘️ serviceAccounts listed ☘️ ok: 😍 😍 😍 ...`);
    appTo = admin.initializeApp({
        credential: admin.credential.cert(ssa1),
        databaseURL: "https://dancer-3303.firebaseio.com",
    }, "appTo");
    log_1.default(`🔑🔑🔑 appTo = Firebase Admin SDK initialized: 😍 😍 😍 ... version: ${admin.SDK_VERSION}\n`);
}
function getDancerConfigFile() {
    log_1.default('🍎🍎 Try to get Dancer 🍎 config file ...');
}
class Messaging {
    static init() {
        log_1.default(`😍 😍 😍 initializing Messaging ... 😍 fake call to test environment variables config`);
    }
    static sendCommuterArrivalLandmark(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Commuter Arrival",
                    body: data.created,
                },
                data: {
                    created: data.created,
                    userID: data.userID,
                    routeID: data.routeID,
                    fromLandmarkID: data.fromLandmarkID,
                    toLandmarkID: data.toLandmarkID,
                },
            };
            const topic = "commuterArrivalLandmark_" + data.fromLandmarkID;
            yield appTo.messaging().sendToTopic(topic, payload, options);
            console.log(`😍 sendCommuterArrivalLandmark: message sent: 😍 ${data.fromLandmarkName} ${data.fromLandmarkID}`);
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
                    userID: data.userID,
                    routeID: data.routeID,
                    landmarkID: data.landmarkID,
                    vehicleID: data.vehicleID,
                    vehicleReg: data.vehicleReg,
                },
            };
            const topic = "sendDispatchRecord_" + data.landmarkID;
            yield appTo.messaging().sendToTopic(topic, payload, options);
            console.log(`😍 sendDispatchRecord: message sent: 😍 ${data.landmarkID} ${data.dispatchedAt}`);
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
                    body: data.type + " " + data.created + " userID:" + data.userID,
                },
                data: {
                    type: data.type,
                    created: data.created,
                    userID: data.userID,
                    vehicleID: data.vehicleID,
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
                console.log(`😍😍 sendPanic: message sent: 😍😍 ${data.type} ${data.created} 👽👽 landmark topic: ${topic1}👽`);
                for (const routeID of landmark.routeIDs) {
                    const routeTopic = "panic_" + routeID;
                    yield appTo.messaging().sendToTopic(routeTopic, payload, options);
                    console.log(`😍😍 sendPanic: message sent: 😍😍 ${data.type} ${data.created} 👽👽 route topic: ${routeTopic}👽`);
                }
            }
        });
    }
}
exports.default = Messaging;
//# sourceMappingURL=messaging.js.map