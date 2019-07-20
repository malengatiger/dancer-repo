//https://firebasestorage.googleapis.com/v0/b/dancer26983.appspot.com/o/config%2Fdancer.json?alt=media&token=070c055b-2097-480f-8430-a849c96c5b60
import * as admin from "firebase-admin";
import Landmark from "../models/landmark";
import log from '../log';

console.log(`\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...`);
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
                created: data.created,
                userID: data.userID,
                routeID: data.routeID,
                fromLandmarkID: data.fromLandmarkID,
                toLandmarkID: data.toLandmarkID,
            },
        };
        const topic = "commuterArrivalLandmark_" + data.fromLandmarkID;
        await appTo.messaging().sendToTopic(topic, payload, options);
        console.log(
            `😍 sendCommuterArrivalLandmark: message sent: 😍 ${
            data.fromLandmarkName
            } ${data.fromLandmarkID}`,
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
        await appTo.messaging().sendToTopic(topic, payload, options);
        console.log(
            `😍 sendDispatchRecord: message sent: 😍 ${data.landmarkID} ${
            data.dispatchedAt
            }`,
        );
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
            },
        };
        const topic1 = "users";
        const topic2 = "users_" + data.associationID;
        const con = `${topic1} in topics || ${topic2} in topics`;
        await appTo.messaging().sendToCondition(con, payload, options);
        console.log(
            `😍😍 sendUser: message sent: 😍😍 ${data.firstName} ${
            data.lastName
            } 👽👽👽`,
        );
    }

    public static async sendPanic(data: any): Promise<any> {
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
        const list: any[] = await Landmark.find({
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
        await appTo.messaging().sendToTopic(mTopic, payload, options);
        // send messages to routes and landmarks

        for (const landmark of list) {
            const topic1 = "panic_" + landmark.landmarkID;
            await appTo.messaging().sendToTopic(topic1, payload, options);
            console.log(
                `😍😍 sendPanic: message sent: 😍😍 ${data.type} ${
                data.created
                } 👽👽 landmark topic: ${topic1}👽`,
            );
            for (const routeID of landmark.routeIDs) {
                const routeTopic = "panic_" + routeID;
                await appTo.messaging().sendToTopic(routeTopic, payload, options);
                console.log(
                    `😍😍 sendPanic: message sent: 😍😍 ${data.type} ${
                    data.created
                    } 👽👽 route topic: ${routeTopic}👽`,
                );
            }
        }
    }
}

export default Messaging;
