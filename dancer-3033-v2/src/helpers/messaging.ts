
import * as admin from "firebase-admin";
import Landmark from "../models/landmark";
import log from '../log';
import Constants from "./constants";
log(`\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...`);
const sa1 = process.env.DANCER_CONFIG || 'NOTFOUND';
let appTo: any;
if (sa1 === 'NOTFOUND') {
    log('Dancer config not found');
    getDancerConfigFile();
} else {
    const ssa1 = JSON.parse(sa1);
    log(`☘️ serviceAccounts listed ☘️ ok: 😍 😍 😍 ...`);
    appTo = admin.initializeApp(
        {
            credential: admin.credential.cert(ssa1),
            databaseURL: "https://dancer-3303.firebaseio.com",
        },
        "appTo",
    );
    log(
        `🔑🔑🔑 appTo = Firebase Admin SDK initialized: 😍 😍 😍 ... version: ${admin.SDK_VERSION}\n`,
    );
}

function getDancerConfigFile() {
    log('🍎🍎 Try to get Dancer 🍎 config file ...');
}

class Messaging {
    public static init() {
        log(`😍 😍 😍 initializing Messaging ... 😍 fake call to test environment variables config`);
    }
    public static async sendVehicleArrival(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Vehicle Arrival",
                body: data.vehicleReg + ' at ' + data.landmarkName,
            },
            data: {
                vehicleArrivalID: data.vehicleArrivalID,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                vehicleID: data.vehicleID,
                vehicleReg: data.vehicleReg,
                created: data.created
            },
        };
        const topic = Constants.VEHICLE_ARRIVALS + '_' + data.landmarkID;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendVehicleArrival: FCM message sent: 😍 ${
            data.landmarkName
            } topic: ${topic}`,
        );
    }
    public static async sendRoute(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Route Added",
                body: data.name,
            },
            data: {
                routeID: data.routeID,
                name: data.name,
                created: data.created
            },
        };
        const topic = Constants.ROUTES;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendRoute: FCM message sent: 😍 ${
            data.name
            } topic: ${topic}`,
        );
    }
    public static async sendLandmark(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Landmark Added",
                body: data.landmarkName,
            },
            data: {
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                created: data.created
            },
        };
        const topic = Constants.LANDMARKS;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendLandmark: FCM message sent: 😍 ${
            data.landmarkName
            } topic: ${topic}`,
        );
    }
    public static async sendVehicleDeparture(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Vehicle Departure",
                body: data.vehicleReg + ' at ' + data.landmarkName,
            },
            data: {
                vehicleDepartureID: data.vehicleDepartureID,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                vehicleID: data.vehicleID,
                vehicleReg: data.vehicleReg,
                created: data.created
            },
        };
        const topic = Constants.VEHICLE_DEPARTURES + '_' + data.landmarkID;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendVehicleDeparture: FCM message sent: 😍 ${
            data.landmarkName
            } topic: ${topic}`,
        );
    }
    public static async sendCommuterPickupLandmark(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Pickup",
                body: data.fromLandmarkName,
            },
            data: {
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
        const topic = Constants.COMMUTER_PICKUP_LANDMARKS + '_' + data.fromLandmarkID;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendCommuterPickupLandmark: FCM message sent: 😍 ☘️☘️☘️ ${
            data.fromLandmarkName
            } topic: ${topic}`,
        );
    }
    public static async sendCommuterRequest(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Request",
                body: data.fromLandmarkName,
            },
            data: {
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
        const topic = Constants.COMMUTER_REQUESTS + '_' + data.fromLandmarkID;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendCommuterRequest: FCM message sent: 😍 ${
            data.fromLandmarkName
            } topic: ${topic}`,
        );
    }
    public static async sendCommuterArrivalLandmark(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Arrival",
                body: data.created,
            },
            data: {
                commuterArrivalLandmarkID: data.commuterArrivalLandmarkID,
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
        const body = data.fullDocument;
        log(data);
        const topic = Constants.COMMUTER_ARRIVAL_LANDMARKS + '_' + data.fromLandmarkID;
        await appTo.messaging().sendToTopic(topic, payload, options);
        log(
            `😍 sendCommuterArrivalLandmark: FCM message sent: 😍 ☘️☘️☘️ ${
            data.fromLandmarkName
            } topic: ${topic}`,
        );
    }
    public static async sendDispatchRecord(data: any): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Dispatch Record",
                body: data.created,
            },
            data: {
                dispatched: data.dispatched ? 'true' : 'false',
                landmarkID: data.landmarkID,
                marshalID: data.marshalID,
                marshalName: data.marshalID,
                landmarkName: data.landmarkName,
                routeName: data.routeName,
                routeID: data.routeID,
                vehicleReg: data.vehicleReg,
                vehicleID: data.vehicleID,
                vehicleType: data.vehicleType,
                ownerID: data.ownerID,
                passengers: `${data.passengers}`,
                dispatchRecordID: data.dispatchRecordID,
                created: data.created
            },
        };
        const result: any[] = await Landmark.find({
            'routeDetails.routeID': data.routeID
        });
        log(`☘️☘️☘️send dispatch record to all ${result.length} landmarks in route: 🍎${data.routeID} 🍎 ${data.routeName}`);
        let cnt = 0;
        for (const m of result) {
            const topic = Constants.DISPATCH_RECORDS + '_' + m.landmarkID;
            await appTo.messaging().sendToTopic(topic, payload, options);
            cnt++;
            log(
                `😍 sendDispatchRecord: FCM message #${cnt} sent: 😍 ${data.landmarkID} ${
                data.created
                } topic: 🍎 ${topic} 🍎`,
            );
        }
        
    }
    public static async sendUser(data: any): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "User Added",
                body: data.firstName + " " + data.lastName + " created:" + data.created,
            },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                associationID: data.associationID,
                email: data.email,
                created: data.created
            },
        };
        const topic1 = "users";
        const topic2 = Constants.USERS + '_' + data.associationID;
        const con = `${topic1} in topics || ${topic2} in topics`;
        await appTo.messaging().sendToCondition(con, payload, options);
        log(
            `😍😍 sendUser: FCM message sent: 😍😍 ${data.firstName} ${
            data.lastName
            } 👽👽👽`,
        );
    }
    public static async sendCommuterPanic(data: any): Promise<any> {
        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Panic",
                body: data.type + " " + data.created + " userID:" + data.userID,
            },
            data: {
                active: data.active ? 'true' : 'false',
                type: data.type,
                userID: data.userID,
                vehicleReg: data.vehicleReg ? data.vehicleReg : '',
                vehicleID: data.vehicleID ? data.vehicleID : '',
                commuterPanicID: data.commuterPanicID,
                created: data.created
            },
        };
        // todo - find nearest landmarks to find routes - send panic to landmarks found

        const longitude = data.position.coordinates[0];
        const latitude = data.position.coordinates[1];
        const list: any[] = await Landmark.find({
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
        log(`☘️☘️☘️landmarks found near panic: ☘️ ${list.length}`);
        const mTopic = Constants.COMMUTER_PANICS;
        await appTo.messaging().sendToTopic(mTopic, payload, options);
        log(
            `😍😍 sendPanic: FCM message sent: 😍😍 ${data.type} ${
            data.created
            } 👽👽 topic: 🍎 ${mTopic} 👽`,
        );
        // send messages to nearbylandmarks

        let cnt = 0;
        for (const landmark of list) {
            if (landmark.landmarkID) {
                const topic1 = Constants.COMMUTER_PANICS + '_' + landmark.landmarkID;
                await appTo.messaging().sendToTopic(topic1, payload, options);
                cnt++;
                log(
                    `😍😍 sendPanic: FCM message sent: 😍😍 ${data.type} ${
                    data.created
                    } 👽👽 nearby #${cnt} landmark topic: 🍎 ${topic1} 🍎 👽👽`,
                );
            }
        }
    }
}

export default Messaging;
