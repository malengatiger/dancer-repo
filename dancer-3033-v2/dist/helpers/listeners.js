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
        const associations = client.connection.collection(constants_1.default.ASSOCIATIONS);
        const routes = client.connection.collection(constants_1.default.ROUTES);
        const landmarks = client.connection.collection(constants_1.default.LANDMARKS);
        const commuterArrivalLandmarks = client.connection.collection(constants_1.default.COMMUTER_ARRIVAL_LANDMARKS);
        const commuterRequests = client.connection.collection(constants_1.default.COMMUTER_REQUESTS);
        const dispatchRecords = client.connection.collection(constants_1.default.DISPATCH_RECORDS);
        const panics = client.connection.collection(constants_1.default.COMMUTER_PANICS);
        const vehicleArrivals = client.connection.collection(constants_1.default.VEHICLE_ARRIVALS);
        const vehicleDepartures = client.connection.collection(constants_1.default.VEHICLE_DEPARTURES);
        const commuterPickups = client.connection.collection(constants_1.default.COMMUTER_PICKUP_LANDMARKS);
        //
        const assocStream = associations.watch();
        const routeStream = routes.watch();
        const landmarkStream = landmarks.watch();
        const commuterArrivalStream = commuterArrivalLandmarks.watch({ fullDocument: 'updateLookup' });
        const commuterRequestsStream = commuterRequests.watch({ fullDocument: 'updateLookup' });
        const dispatchRecordsStream = dispatchRecords.watch({ fullDocument: 'updateLookup' });
        const usersStream = users.watch({ fullDocument: 'updateLookup' });
        const panicStream = panics.watch({ fullDocument: 'updateLookup' });
        const vehicleArrivalsStream = vehicleArrivals.watch({ fullDocument: 'updateLookup' });
        const vehicleDeparturesStream = vehicleDepartures.watch({ fullDocument: 'updateLookup' });
        const commuterPickupsStream = commuterPickups.watch({ fullDocument: 'updateLookup' });
        //
        vehicleArrivalsStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  vehicleArrivalsStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            log_1.default(event);
            messaging_1.default.sendVehicleArrival(event.fullDocument);
        });
        //
        vehicleDeparturesStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  vehicleDeparturesStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            log_1.default(event);
            messaging_1.default.sendVehicleDeparture(event.fullDocument);
        });
        //
        commuterPickupsStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  commuterPickupsStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            log_1.default(event);
            messaging_1.default.sendCommuterPickupLandmark(event.fullDocument);
        });
        //
        panicStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            log_1.default(event);
            messaging_1.default.sendCommuterPanic(event.fullDocument);
        });
        //
        usersStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            log_1.default(event);
            messaging_1.default.sendUser(event.fullDocument);
        });
        //
        assocStream.on("change", (event) => {
            log_1.default(`\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            log_1.default(event);
            // AssociationHelper.onAssociationAdded(event);
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