"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../helpers/constants"));
const messaging_1 = __importDefault(require("./messaging"));
const log_1 = __importDefault(require("../log"));
class MongoListeners {
    static listen(client) {
        log_1.default(`\n🔆🔆🔆  MongoListeners: 🧡🧡🧡  listening to changes in collections ... 👽👽👽\n`);
        const users = client.connection.collection(constants_1.default.USERS);
        const userFenceEvents = client.connection.collection(constants_1.default.COMMUTER_FENCE_EVENTS);
        const associations = client.connection.collection(constants_1.default.ASSOCIATIONS);
        const routes = client.connection.collection(constants_1.default.ROUTES);
        const landmarks = client.connection.collection(constants_1.default.LANDMARKS);
        const dispatchRecords = client.connection.collection(constants_1.default.DISPATCH_RECORDS);
        const panics = client.connection.collection(constants_1.default.COMMUTER_PANICS);
        const vehicleArrivals = client.connection.collection(constants_1.default.VEHICLE_ARRIVALS);
        const vehicleDepartures = client.connection.collection(constants_1.default.VEHICLE_DEPARTURES);
        const commuterPickups = client.connection.collection(constants_1.default.COMMUTER_PICKUP_LANDMARKS);
        const commuterArrivalLandmarks = client.connection.collection(constants_1.default.COMMUTER_ARRIVAL_LANDMARKS);
        const commuterRequests = client.connection.collection(constants_1.default.COMMUTER_REQUESTS);
        const commuterDwellEvents = client.connection.collection(constants_1.default.COMMUTER_FENCE_DWELL_EVENTS);
        const commuterExitEvents = client.connection.collection(constants_1.default.COMMUTER_FENCE_EXIT_EVENTS);
        const payments = client.connection.collection(constants_1.default.PAYMENTS);
        //
        const paymentStream = payments.watch({ fullDocument: 'updateLookup' });
        const assocStream = associations.watch({ fullDocument: 'updateLookup' });
        const routeStream = routes.watch({ fullDocument: 'updateLookup' });
        const landmarkStream = landmarks.watch({ fullDocument: 'updateLookup' });
        const dwellStream = commuterDwellEvents.watch({ fullDocument: 'updateLookup' });
        const exitStream = commuterExitEvents.watch({ fullDocument: 'updateLookup' });
        const commuterArrivalStream = commuterArrivalLandmarks.watch({ fullDocument: 'updateLookup' });
        const commuterRequestsStream = commuterRequests.watch({ fullDocument: 'updateLookup' });
        const commuterPickupsStream = commuterPickups.watch({ fullDocument: 'updateLookup' });
        const dispatchRecordsStream = dispatchRecords.watch({ fullDocument: 'updateLookup' });
        const usersStream = users.watch({ fullDocument: 'updateLookup' });
        const panicStream = panics.watch({ fullDocument: 'updateLookup' });
        const vehicleArrivalsStream = vehicleArrivals.watch({ fullDocument: 'updateLookup' });
        const vehicleDeparturesStream = vehicleDepartures.watch({ fullDocument: 'updateLookup' });
        dwellStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  dwellStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendFenceDwellEvent(event.fullDocument);
        });
        //
        paymentStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  paymentStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendPayment(event.fullDocument);
        });
        //
        exitStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  exitStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendFenceExitEvent(event.fullDocument);
        });
        //
        vehicleArrivalsStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  vehicleArrivalsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendVehicleArrival(event.fullDocument);
        });
        //
        vehicleDeparturesStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  vehicleDeparturesStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendVehicleDeparture(event.fullDocument);
        });
        //
        commuterPickupsStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  commuterPickupsStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendCommuterPickupLandmark(event.fullDocument);
        });
        //
        panicStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendCommuterPanic(event.fullDocument);
        });
        //
        usersStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            messaging_1.default.sendUser(event.fullDocument);
        });
        //
        assocStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 id: ${JSON.stringify(event._id)}`);
            log_1.default(event);
            // Messaging.se
        });
        //
        routeStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            messaging_1.default.sendRoute(event.fullDocument);
        });
        //
        landmarkStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  landmarkStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            messaging_1.default.sendLandmark(event.fullDocument);
        });
        //
        commuterArrivalStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  commuterArrivalStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            messaging_1.default.sendCommuterArrivalLandmark(event.fullDocument);
        });
        //
        commuterRequestsStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            messaging_1.default.sendCommuterRequest(event.fullDocument);
        });
        //
        dispatchRecordsStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  dispatchRecordsStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            messaging_1.default.sendDispatchRecord(event.fullDocument);
        });
    }
}
exports.default = MongoListeners;
//# sourceMappingURL=listeners.js.map