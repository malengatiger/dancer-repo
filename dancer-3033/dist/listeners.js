"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commuter_panic_helper_1 = require("./helpers/commuter_panic_helper");
const commuter_request_helper_1 = require("./helpers/commuter_request_helper");
const dispatch_record_helper_1 = require("./helpers/dispatch_record_helper");
const commuter_arrival_helper_1 = require("./helpers/commuter_arrival_helper");
const constants_1 = __importDefault(require("./helpers/constants"));
const association_helper_1 = require("./helpers/association_helper");
const landmark_helper_1 = require("./helpers/landmark_helper");
const route_helper_1 = require("./helpers/route_helper");
const user_helper_1 = require("./helpers/user_helper");
class MongoListeners {
    static listen(client) {
        console.log(`\n🔆🔆🔆  MongoListeners: 🧡🧡🧡  listening to changes in collections ... 👽 👽 👽\n`);
        const users = client.connection.collection(constants_1.default.USERS);
        const associations = client.connection.collection(constants_1.default.ASSOCIATIONS);
        const routes = client.connection.collection(constants_1.default.ROUTES);
        const landmarks = client.connection.collection(constants_1.default.LANDMARKS);
        const commuterArrivalLandmarks = client.connection.collection(constants_1.default.COMMUTER_ARRIVAL_LANDMARKS);
        const commuterRequests = client.connection.collection(constants_1.default.COMMUTER_REQUESTS);
        const dispatchRecords = client.connection.collection(constants_1.default.DISPATCH_RECORDS);
        const panics = client.connection.collection(constants_1.default.COMMUTER_PANICS);
        //
        const assocStream = associations.watch();
        const routeStream = routes.watch();
        const landmarkStream = landmarks.watch();
        const commuterArrivalStream = commuterArrivalLandmarks.watch();
        const commuterRequestsStream = commuterRequests.watch();
        const dispatchRecordsStream = dispatchRecords.watch();
        const usersStream = users.watch({ fullDocument: 'updateLookup' });
        const panicStream = panics.watch({ fullDocument: 'updateLookup' });
        panicStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  panicStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            console.log(event);
            commuter_panic_helper_1.CommuterPanicHelper.onCommuterPanicChanged(event);
        });
        //
        usersStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            console.log(event);
            user_helper_1.UserHelper.onUserAdded(event);
        });
        //
        assocStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            console.log(event);
            association_helper_1.AssociationHelper.onAssociationAdded(event);
        });
        //
        routeStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            route_helper_1.RouteHelper.onRouteAdded(event);
        });
        //
        landmarkStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  landmarkStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            landmark_helper_1.LandmarkHelper.onLandmarkAdded(event);
        });
        //
        commuterArrivalStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  commuterArrivalStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            commuter_arrival_helper_1.CommuterArrivalLandmarkHelper.onCommuterArrivalLandmarkAdded(event);
        });
        //
        commuterRequestsStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            commuter_request_helper_1.CommuterRequestHelper.onCommuterRequestAdded(event);
        });
        //
        dispatchRecordsStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  dispatchRecordsStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            dispatch_record_helper_1.DispatchRecordHelper.onDispatchRecordAdded(event);
        });
    }
}
exports.default = MongoListeners;
//# sourceMappingURL=listeners.js.map