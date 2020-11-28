
import * as admin from "firebase-admin";
import Landmark from "../models/landmark";
import {log} from '../log';
import Constants from "./constants";
import RouteDistanceEstimation from "../models/route_distance";
// const StringBuffer = require("stringbuffer");

log(`\n☘️ ☘️ ☘️ Loading service accounts from ☘️ .env ☘️  ...`);
const sa1 = process.env.DANCER_CONFIG || 'NOTFOUND';
const ssa1 = JSON.parse(sa1);
// log(`☘️ serviceAccounts listed ☘️ ok: 😍 😍 😍 ...`);
export const appTo: admin.app.App = admin.initializeApp(
    {
        credential: admin.credential.cert(ssa1),
        databaseURL: "https://taxiyam-2021.firebaseio.com",
        storageBucket: "taxiyam-2021.appspot.com",
    },
    "appTo",
);
log(
    `🔑🔑🔑 appTo = Firebase Admin SDK initialized: 😍 😍 😍 ... version: ${admin.SDK_VERSION}  \n`,
);

const fba: admin.messaging.Messaging = appTo.messaging();
log(`😍 😍 😍 FCM Messaging initialized. app: ${fba.app.name} `);
appTo.firestore().collection('associations').get().then((snapshot) => {
   snapshot.docs.forEach((doc) => {
    log(`Association: 🥦🥦 ${doc.data}`)
   })
})
class Messaging {
    public static init() {
        log(`😍 😍 😍 initializing Messaging ... 😍 fake call (really?) to test environment variables config`);
    }
    public static async sendVehicleCommuterNearby(data: any, ): Promise<any> {
        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Nearby",
                body: data.date,
            },
            data: {
                commuterNearby: JSON.stringify(data)
            },
        };
        const topic = Constants.VEHICLE_COMMUTER_NEARBY + '_' + data.vehicleID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendVehicleCommuterNearby: FCM message sent: 😍 ${
            data.vehicleReg
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
    }
    public static async sendRouteDistanceEstimation(data: any, ): Promise<any> {
        const m = new RouteDistanceEstimation(data);

        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Route Distance Estimation",
                body: data.vehicle.vehicleReg,
            },
            data: {
                id: m.id,
                created: data.created,
                routeID: data.routeID,
                vehicleReg: data.vehicle.vehicleReg,
                vehicleID: data.vehicle.vehicleID,
                distancesCalculated: data.dynamicDistances === null? '0' : `${data.dynamicDistances.length}`
            },
        };
        const topic = Constants.ROUTE_DISTANCE_ESTIMATION + '_' + data.routeID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendRouteDistanceEstimation: FCM message sent: 😍 ${
            data.vehicle.vehicleReg
            } topic: ${topic} : payload data: 🍎🍎 ${JSON.stringify(payload)} 🍎🍎`,
        );
    }
    public static async sendNotification(data: any, ): Promise<any> {
        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "notifications",
                body: data.associationName,
         },
         data: {
            type: Constants.NOTIFICATIONS,
            associationName: data.associationName,
            message: data.message,
            created: data.created,
            landmarkID: data.landmarkID,
            platforms: data.platform,
            email: data.email
        },
    };
    const topic = Constants.NOTIFICATIONS + '_' + data.landmarkID;
    const result = await fba.sendToTopic(topic, payload, options);
    log(
        `😍 sendNotification: FCM message sent: 😍 ${
        data.landmarkID
        } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
    );
    console.log(payload.data);
} 
public static async sendChat(
    data: any,
): Promise<any> {
    const options: any = {
        priority: "normal",
        timeToLive: 60 * 60,
    };
    const payload: any = {
        notification: {
            title: "chat support",
            body: data.assocUserID + ' at ' + data.adminUserID,
        },
        data: {
            associaionID: data.associationID,
            associationName: data.associationName,
            email: data.email,
            assocUserID: data.assocUserID,
            adminUserID: data.adminUserID,
            fullName: data.fullName,
            message: data.message,
            messageType: data.messageType,
            opened: data.opened,
            created: data.created
        },
    };
    const topic = Constants.CHAT + '_' + data.associationName;
    const result = await fba.sendToTopic(topic, payload, options);
    log(
        `😍 sendChat: FCM message sent: 😍 ${
        data.associationName
        } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
    );
    console.log(payload.data);
}

public static async sendVehicleAdded(data: any, ): Promise<any> {
    const options: any = {
        priority: "high",
        timeToLive: 60 * 60,
    };
    const payload: any = {
        notification: {
            title: "Vehicle Added",
            body: data.vehicleReg + ' at ' + data.landmarkName,
        },
        data: {
            type: Constants.VEHICLES,
            vehicleID: data.vehicleID,
            vehicleReg: data.vehicleReg,
        },
    };
    const topic = Constants.VEHICLES + '_' + data.associationID;
    const result = await fba.sendToTopic(topic, payload, options);
    log(
        `😍 sendVehicleAdded: FCM message sent: 😍 ${
        data.vehicleReg
        } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
    );
    console.log(payload.data);

}
    public static async sendVehicleArrival(data: any, ): Promise<any> {
        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Vehicle Arrival",
                body: data.vehicleReg + ' at ' + data.landmarkName,
            },
            data: {
                type: Constants.VEHICLE_ARRIVALS,
                vehicleArrivalID: data.vehicleArrivalID,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                vehicleID: data.vehicleID,
                vehicleReg: data.vehicleReg,
                created: data.created
            },
        };
        const topic = Constants.VEHICLE_ARRIVALS + '_' + data.landmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendVehicleArrival: FCM message sent: 😍 ${
            data.landmarkName
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
        console.log(payload.data);

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
                type: Constants.ROUTES,
                routeID: data.routeID,
                name: data.name,
                created: data.created
            },
        };
        const topic = Constants.ROUTES;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendRoute: FCM message sent: 😍 ${
            data.name
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
        fba
    }

    public static async sendFenceDwellEvent(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Landmark Dwell Event",
                body: `${data.landmarkName} at ${data.created}`,
            },
            data: {
                type: Constants.COMMUTER_FENCE_DWELL_EVENTS,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                userID: data.userID,
                created: data.created
            },
        };
        const topic = Constants.COMMUTER_FENCE_DWELL_EVENTS + '_' + data.landmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendFenceDwellEvent: FCM message sent: 😍 ${
            data.name
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
        fba
    }
    public static async sendFenceExitEvent(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Commuter Landmark Exit Event",
                body: `${data.landmarkName} at ${data.created}`,
            },
            data: {
                type: Constants.COMMUTER_FENCE_EXIT_EVENTS,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                userID: data.userID,
                created: data.created
            },
        };
        const topic = Constants.COMMUTER_FENCE_EXIT_EVENTS + '_' + data.landmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendFenceExitEvent: FCM message sent: 😍 ${
            data.name
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
        fba
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
                type: Constants.LANDMARKS,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                created: data.created
            },
        };
        const topic = Constants.LANDMARKS;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendLandmark: FCM message sent: 😍 ${
            data.landmarkName
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
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
                type: Constants.VEHICLE_DEPARTURES,
                vehicleDepartureID: data.vehicleDepartureID,
                landmarkID: data.landmarkID,
                landmarkName: data.landmarkName,
                vehicleID: data.vehicleID,
                vehicleReg: data.vehicleReg,
                created: data.created
            },
        };
        const topic = Constants.VEHICLE_DEPARTURES + '_' + data.landmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendVehicleDeparture: FCM message sent: 😍 ${
            data.landmarkName
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
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
                type: Constants.COMMUTER_PICKUP_LANDMARKS,
                commuterPickupLandmarkID: data.commuterPickupLandmarkID,
                fromLandmarkID: data.fromLandmarkID,
                fromLandmarkName: data.fromLandmarkName,
                toLandmarkID: data.toLandmarkID,
                toLandmarkName: data.toLandmarkName,
                routeName: data.routeName,
                routeID: data.routeID,
                vehicleID: data.vehicleID,
                vehicleReg: data.vehicleReg,
               // departureID: data.departureID,
                created: data.created
            },
        };
        const topic = Constants.COMMUTER_PICKUP_LANDMARKS + '_' + data.fromLandmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendCommuterPickupLandmark: FCM message sent: 😍 ☘️☘️☘️ ${
            data.fromLandmarkName
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
    }
    public static async sendCommuterRequest(
        data: any,
    ): Promise<any> {
        console.log(`Check below to see isWallet value... should be fucking true; why???`);
        
        console.log(data);
        
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
                type: Constants.COMMUTER_REQUESTS,
                commuterRequestID: data.commuterRequestID,
                fromLandmarkID: data.fromLandmarkID,
                fromLandmarkName: data.fromLandmarkName,
                toLandmarkID: data.toLandmarkID,
                toLandmarkName: data.toLandmarkName,
                routeName: data.routeName,
                routeID: data.routeID,
                scanned: data.scanned == true? 'true' : 'false',
                autoDetected: data.autoDetected === true ? 'true' : 'false',
                isWallet: data.isWallet === true ? 'true' : 'false',
                passengers: `${data.passengers}`,
                stringTime: data.stringTime,
                associationD: data.associationD? data.associationD: '',
                associationName: data.associationName? data.associationName:'',
                vehicleID: data.vehicleID? data.vehicleID: '',
                vehicleReg: data.vehicleReg? data.vehicleReg: '',
                created: data.created
            },
        };
        
        console.log(payload);
        
        const topic = Constants.COMMUTER_REQUESTS + '_' + data.fromLandmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendCommuterRequest: FCM message sent: 😍 ${
            data.fromLandmarkName
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
    }
    public static async sendPayment(
        data: any,
    ): Promise<any> {
        const options: any = {
            priority: "normal",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Payment",
                body: `${data.amount}`,
            },
            data: {
                type: Constants.PAYMENTS,
                commuterID: data.commuterID,
                driverID: data.driverID,
                marshalID: data.marshalID,
                routeID: data.routeID,
                toLandmarkName: data.toLandmarkName,
                routeName: data.routeName,
                vehicleID: data.vehicleID,
                passengers: `${data.passengers}`,
                amount: `${data.amount}`,
                vehicleReg: data.vehicleReg,
                ownerID: data.ownerID,
                discounted: data.discounted,
                associationD: data.associationD,
                associationName: data.associationName,
                created: data.created
            },
        };
        if (data.driverID) {
            const topic = Constants.PAYMENTS + '_' + data.driverID;
            const result = await fba.sendToTopic(topic, payload, options);
            log(
                `😍 sendPayment: FCM message sent to Driver: 😍topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
            );
        }
        if (data.ownerID) {
            const topic = Constants.PAYMENTS + '_' + data.ownerID;
            const result = await fba.sendToTopic(topic, payload, options);
            log(
                `😍 sendPayment: FCM message sent to Owner: 😍topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
            );
        }
        if (data.marshalID) {
            const topic = Constants.PAYMENTS + '_' + data.marshalID;
            const result = await fba.sendToTopic(topic, payload, options);
            log(
                `😍 sendPayment: FCM message sent to Marshal: 😍topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
            );
        }
      
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
                type: Constants.COMMUTER_ARRIVAL_LANDMARKS,
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
        log(`userID: ${data.userID}`)
        log(body);
        const topic = Constants.COMMUTER_ARRIVAL_LANDMARKS + '_' + data.fromLandmarkID;
        const result = await fba.sendToTopic(topic, payload, options);
        log(
            `😍 sendCommuterArrivalLandmark: FCM message sent: 😍 ☘️☘️☘️ ${
            data.fromLandmarkName
            } topic: ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
    }
    public static async sendDispatchRecord(data: any): Promise<any> {
        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        const payload: any = {
            notification: {
                title: "Dispatch Record",
                body: data.created,
            },
            data: {
                type: Constants.DISPATCH_RECORDS,
                dispatched: JSON.stringify(data)
            },
        };
        const result: any[] = await Landmark.find({
            'routeDetails.routeID': data.routeID
        });
        log(`☘️☘️☘️send dispatch record to all ${result.length} landmarks in route: 🍎${data.routeID} 🍎 ${data.routeName}`);
        let cnt = 0;
        for (const m of result) {
            const topic = Constants.DISPATCH_RECORDS + '_' + m.landmarkID;
            const result = await fba.sendToTopic(topic, payload, options);
            cnt++;
            log(
                `😍 sendDispatchRecord: FCM message #${cnt} sent: 😍 ${data.landmarkID} ${
                data.created
                } topic: 🍎 ${topic} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎 🍎`,
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
                body: JSON.stringify(data),
            },
            data: {
                type: Constants.USERS,
                user: JSON.stringify(data)
            },
        };
        const topic1 = Constants.USERS;
        const result = await fba.sendToTopic(topic1, payload, options);
        log(
            `😍😍 sendUser: FCM message sent: 😍😍 ${data.firstName} ${
            data.lastName
            } 👽👽👽 ${topic1} : result: 🍎🍎 ${JSON.stringify(result)} 🍎🍎`,
        );
    }
    public static async sendCommuterPanic(data: any): Promise<any> {
        const options: any = {
            priority: "high",
            timeToLive: 60 * 60,
        };
        log('Sending commute panic message')
        console.log(data.commuterPanicID);
        const longitude = '' + data.position.coordinates[0];
        const latitude = '' + data.position.coordinates[1];

        // todo - find nearest landmarks to find routes - send panic to landmarks found

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
        // Define a condition which will send to devices which are subscribed
        // to either the Google stock or the tech industry topics.
        const payload: any = {
            notification: {
                title: "AftaRobot Panic Message",
                body: data.type + " " + data.created,
            },
            data: {
                type: Constants.COMMUTER_PANICS,
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
                const topic1 = Constants.COMMUTER_PANICS + '_' + landmark.landmarkID;
                const result = await fba.sendToTopic(topic1,payload, options); 
                cnt++;
                console.log(`🍎🍎🍎🍎🍎 FCM Panic message #${cnt} sent to  💙 ${landmark.landmarkName} :  💙💙 topic: 🔆 ${topic1} 🔆`);
              

            }
        }
        console.log(`🍎🍎🍎🍎🍎  💛 FCM Panic messages sent:  💛 ${cnt}  💛 `);
    }
}

export default Messaging;
