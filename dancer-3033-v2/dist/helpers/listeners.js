"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../helpers/constants"));
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
            //CommuterPanicHelper.onCommuterPanicChanged(event);
        });
        //
        usersStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  usersStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            console.log(event);
            // UserHelper.onUserAdded(event);
        });
        //
        assocStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  assocStream onChange fired!  🍎  🔆🔆🔆🔆 ${event}`);
            console.log(event);
            // AssociationHelper.onAssociationAdded(event);
        });
        //
        routeStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  routeStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            // RouteHelper.onRouteAdded(event);
        });
        //
        landmarkStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  landmarkStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            // LandmarkHelper.onLandmarkAdded(event);
        });
        //
        commuterArrivalStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  commuterArrivalStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            // CommuterArrivalLandmarkHelper.onCommuterArrivalLandmarkAdded(event);
        });
        //
        commuterRequestsStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  commuterRequestsStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            // CommuterRequestHelper.onCommuterRequestAdded(event);
        });
        //
        dispatchRecordsStream.on("change", (event) => {
            console.log(`\n🔆🔆🔆🔆   🍎  dispatchRecordsStream onChange fired!  🍎  🔆🔆🔆🔆 `);
            // DispatchRecordHelper.onDispatchRecordAdded(event);
        });
    }
    static onUserAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onUserChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  user in stream:  🍀  🍀  🍎 `);
            if (event.operationType === 'insert') {
                const data = event.fullDocument;
            }
        });
    }
}
exports.default = MongoListeners;
//# sourceMappingURL=listeners.js.map