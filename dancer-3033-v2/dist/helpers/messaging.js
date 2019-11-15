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
const admin = __importStar(require("firebase-admin"));
const landmark_1 = __importDefault(require("../models/landmark"));
const log_1 = __importDefault(require("../log"));
const constants_1 = __importDefault(require("./constants"));
const StringBuffer = require("stringbuffer");
// create a string buffer that simply concatenates strings
log_1.default(`\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...`);
const sa1 = process.env.DANCER_CONFIG || 'NOTFOUND';
const ssa1 = JSON.parse(sa1);
log_1.default(`☘️ serviceAccounts listed ☘️ ok: 😍 😍 😍 ...`);
const appTo = admin.initializeApp({
    credential: admin.credential.cert(ssa1),
    databaseURL: "https://dancer26983.firebaseio.com",
}, "appTo");
log_1.default(`🔑🔑🔑 appTo = Firebase Admin SDK initialized: 😍 😍 😍 ... version: ${admin.SDK_VERSION}\n`);
const fba = appTo.messaging();
log_1.default(`😍 😍 😍 FCM Messaging app: ${fba.app}`);
class Messaging {
    static init() {
        log_1.default(`😍 😍 😍 initializing Messaging ... 😍 fake call to test environment variables config`);
    }
    static sendRouteDistanceEstimation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "high",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Route Distance Estimation",
                    body: data.vehicle.vehicleReg,
                },
                data: {
                    estimation: JSON.stringify(data)
                },
            };
            const topic = constants_1.default.ROUTE_DISTANCE_ESTIMATION + '_' + data.routeID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendRouteDistanceEstimation: FCM message sent: 😍 ${data.vehicle.vehicleReg} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
    }
    static sendVehicleArrival(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "high",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Vehicle Arrival",
                    body: data.vehicleReg + ' at ' + data.landmarkName,
                },
                data: {
                    type: constants_1.default.VEHICLE_ARRIVALS,
                    vehicleArrivalID: data.vehicleArrivalID,
                    landmarkID: data.landmarkID,
                    landmarkName: data.landmarkName,
                    vehicleID: data.vehicleID,
                    vehicleReg: data.vehicleReg,
                    created: data.created
                },
            };
            const topic = constants_1.default.VEHICLE_ARRIVALS + '_' + data.landmarkID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendVehicleArrival: FCM message sent: 😍 ${data.landmarkName} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
    }
    static sendRoute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Route Added",
                    body: data.name,
                },
                data: {
                    type: constants_1.default.ROUTES,
                    routeID: data.routeID,
                    name: data.name,
                    created: data.created
                },
            };
            const topic = constants_1.default.ROUTES;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendRoute: FCM message sent: 😍 ${data.name} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
            fba;
        });
    }
    static sendUserFenceEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Commuter Landmark Event",
                    body: `${data.landmarkName} at ${data.created}`,
                },
                data: {
                    type: constants_1.default.COMMUTER_FENCE_EVENTS,
                    landmarkID: data.landmarkID,
                    landmarkName: data.landmarkName,
                    created: data.created
                },
            };
            const topic = constants_1.default.COMMUTER_FENCE_EVENTS + '_' + data.landmarkID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendRoute: FCM message sent: 😍 ${data.name} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
            fba;
        });
    }
    static sendLandmark(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Landmark Added",
                    body: data.landmarkName,
                },
                data: {
                    type: constants_1.default.LANDMARKS,
                    landmarkID: data.landmarkID,
                    landmarkName: data.landmarkName,
                    created: data.created
                },
            };
            const topic = constants_1.default.LANDMARKS;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendLandmark: FCM message sent: 😍 ${data.landmarkName} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
    }
    static sendVehicleDeparture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Vehicle Departure",
                    body: data.vehicleReg + ' at ' + data.landmarkName,
                },
                data: {
                    type: constants_1.default.VEHICLE_DEPARTURES,
                    vehicleDepartureID: data.vehicleDepartureID,
                    landmarkID: data.landmarkID,
                    landmarkName: data.landmarkName,
                    vehicleID: data.vehicleID,
                    vehicleReg: data.vehicleReg,
                    created: data.created
                },
            };
            const topic = constants_1.default.VEHICLE_DEPARTURES + '_' + data.landmarkID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendVehicleDeparture: FCM message sent: 😍 ${data.landmarkName} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
    }
    static sendCommuterPickupLandmark(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Commuter Pickup",
                    body: data.fromLandmarkName,
                },
                data: {
                    type: constants_1.default.COMMUTER_PICKUP_LANDMARKS,
                    commuterPickupLandmarkID: data.commuterPickupLandmarkID,
                    fromLandmarkID: data.fromLandmarkID,
                    fromLandmarkName: data.fromLandmarkName,
                    toLandmarkID: data.toLandmarkID,
                    toLandmarkName: data.toLandmarkName,
                    routeName: data.routeName,
                    routeID: data.routeID,
                    vehicleID: data.vehicleID,
                    vehicleReg: data.vehicleReg,
                    departureID: data.departureID,
                    created: data.created
                },
            };
            const topic = constants_1.default.COMMUTER_PICKUP_LANDMARKS + '_' + data.fromLandmarkID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendCommuterPickupLandmark: FCM message sent: 😍 ☘️☘️☘️ ${data.fromLandmarkName} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
    }
    static sendCommuterRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "normal",
                timeToLive: 60 * 60,
            };
            const payload = {
                notification: {
                    title: "Commuter Request",
                    body: data.fromLandmarkName,
                },
                data: {
                    type: constants_1.default.COMMUTER_REQUESTS,
                    commuterRequestID: data.commuterRequestID,
                    fromLandmarkID: data.fromLandmarkID,
                    fromLandmarkName: data.fromLandmarkName,
                    toLandmarkID: data.toLandmarkID,
                    toLandmarkName: data.toLandmarkName,
                    routeName: data.routeName,
                    routeID: data.routeID,
                    scanned: data.scanned ? 'true' : 'false',
                    autoDetected: data.autoDetected ? 'true' : 'false',
                    passengers: `${data.passengers}`,
                    stringTime: data.stringTime,
                    created: data.created
                },
            };
            const topic = constants_1.default.COMMUTER_REQUESTS + '_' + data.fromLandmarkID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendCommuterRequest: FCM message sent: 😍 ${data.fromLandmarkName} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
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
                    type: constants_1.default.COMMUTER_ARRIVAL_LANDMARKS,
                    commuterArrivalLandmarkID: data.commuterArrivalLandmarkID,
                    fromLandmarkID: data.fromLandmarkID,
                    fromLandmarkName: data.fromLandmarkName,
                    toLandmarkID: data.toLandmarkID,
                    toLandmarkName: data.toLandmarkName,
                    created: data.created,
                    userID: data.userID
                },
            };
            const body = data.fullDocument;
            log_1.default(`userID: ${data.userID}`);
            log_1.default(body);
            const topic = constants_1.default.COMMUTER_ARRIVAL_LANDMARKS + '_' + data.fromLandmarkID;
            const result = yield fba.sendToTopic(topic, payload, options);
            log_1.default(`😍 sendCommuterArrivalLandmark: FCM message sent: 😍 ☘️☘️☘️ ${data.fromLandmarkName} topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
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
                    body: data.created,
                },
                data: {
                    type: constants_1.default.DISPATCH_RECORDS,
                    dispatched: data.dispatched ? 'true' : 'false',
                    landmarkID: data.landmarkID,
                    marshalID: data.marshalID,
                    marshalName: data.marshalID,
                    landmarkName: data.landmarkName,
                    routeName: data.routeName,
                    routeID: data.routeID,
                    vehicleReg: data.vehicleReg,
                    vehicleID: data.vehicleID,
                    vehicleType: JSON.stringify(data.vehicleType),
                    ownerID: data.ownerID,
                    passengers: `${data.passengers}`,
                    dispatchRecordID: data.dispatchRecordID,
                    created: data.created
                },
            };
            const result = yield landmark_1.default.find({
                'routeDetails.routeID': data.routeID
            });
            log_1.default(`☘️☘️☘️send dispatch record to all ${result.length} landmarks in route: 🍎${data.routeID} 🍎 ${data.routeName}`);
            let cnt = 0;
            for (const m of result) {
                const topic = constants_1.default.DISPATCH_RECORDS + '_' + m.landmarkID;
                const result = yield fba.sendToTopic(topic, payload, options);
                cnt++;
                log_1.default(`😍 sendDispatchRecord: FCM message #${cnt} sent: 😍 ${data.landmarkID} ${data.created} topic: 🍎 ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎 🍎`);
            }
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
                    type: constants_1.default.USERS,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    created: data.created
                },
            };
            const topic1 = "users";
            const topic2 = constants_1.default.USERS;
            const con = `${topic1} in topics || ${topic2} in topics`;
            const result = yield fba.sendToCondition(con, payload, options);
            log_1.default(`😍😍 sendUser: FCM message sent: 😍😍 ${data.firstName} ${data.lastName} 👽👽👽 ${topic1} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`);
        });
    }
    static sendCommuterPanic(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                priority: "high",
                timeToLive: 60 * 60,
            };
            log_1.default('Sending commute panic message');
            console.log(data.commuterPanicID);
            const longitude = '' + data.position.coordinates[0];
            const latitude = '' + data.position.coordinates[1];
            // todo - find nearest landmarks to find routes - send panic to landmarks found
            const list = yield landmark_1.default.find({
                position: {
                    $near: {
                        $geometry: {
                            coordinates: [longitude, latitude],
                            type: "Point",
                        },
                        $maxDistance: 5000,
                    },
                },
            });
            log_1.default(`☘️☘️☘️landmarks found near panic: ☘️ ${list.length}`);
            // Define a condition which will send to devices which are subscribed
            // to either the Google stock or the tech industry topics.
            const payload = {
                notification: {
                    title: "AftaRobot Panic Message",
                    body: data.type + " " + data.created,
                },
                data: {
                    type: constants_1.default.COMMUTER_PANICS,
                    active: data.active ? 'true' : 'false',
                    panicType: data.type,
                    userID: data.userID == null ? '' : data.userID,
                    vehicleReg: data.vehicleReg ? data.vehicleReg : '',
                    vehicleID: data.vehicleID ? data.vehicleID : '',
                    commuterPanicID: data.commuterPanicID,
                    latitude: latitude, longitude: longitude,
                    created: data.created
                },
            };
            let cnt = 0;
            for (const landmark of list) {
                if (landmark.landmarkID) {
                    const topic1 = constants_1.default.COMMUTER_PANICS + '_' + landmark.landmarkID;
                    const result = yield fba.sendToTopic(topic1, payload, options);
                    cnt++;
                    console.log(`🍎🍎🍎🍎🍎 FCM Panic message #${cnt} sent to  💙 ${landmark.landmarkName} :  💙💙 topic: 🔆 ${topic1} 🔆`);
                }
            }
            console.log(`🍎🍎🍎🍎🍎  💛 FCM Panic messages sent:  💛 ${cnt}  💛 `);
        });
    }
}
exports.default = Messaging;
//# sourceMappingURL=messaging.js.map