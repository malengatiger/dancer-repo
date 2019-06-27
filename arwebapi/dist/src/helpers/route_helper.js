"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const firebase_admin_1 = require("firebase-admin");
const v1_1 = tslib_1.__importDefault(require("uuid/v1"));
const association_1 = tslib_1.__importDefault(require("../models/association"));
const route_1 = tslib_1.__importDefault(require("../models/route"));
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
class RouteHelper {
    static onRouteAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onRouteChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  route in stream:  🍀  🍀  🍎 `);
        });
    }
    static deleteRoutePoints(routeID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`Deleting route points for routeID: ${routeID}`);
            const qs = yield firebase_admin_1.firestore().collection('newRoutes')
                .doc(routeID).collection('rawRoutePoints').get();
            yield deleteCollection(firebase_admin_1.firestore(), `newRoutes/${routeID}/rawRoutePoints`, 200);
            console.log(`${qs.docs.length} route points deleted from routeID: ${routeID}`);
            return 0;
            function deleteCollection(db, collectionPath, batchSize) {
                let collectionRef = db.collection(collectionPath);
                let query = collectionRef.orderBy('__name__').limit(batchSize);
                return new Promise((resolve, reject) => {
                    deleteQueryBatch(db, query, batchSize, resolve, reject);
                });
            }
            function deleteQueryBatch(db, query, batchSize, resolve, reject) {
                query.get()
                    .then((snapshot) => {
                    // When there are no documents left, we are done
                    if (snapshot.size == 0) {
                        console.log(` 💦 💦 💦 deleteQueryBatch done ❤️ ❤️ for routeID: ${routeID}`);
                        return 0;
                    }
                    // 
                    console.log(`deleteQueryBatch:  💦 💦 💦 Delete documents in a batch for routeID: ${routeID}`);
                    let batch = db.batch();
                    snapshot.docs.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    return batch.commit().then(() => {
                        return snapshot.size;
                    });
                }).then((numDeleted) => {
                    if (numDeleted === 0) {
                        resolve();
                        return;
                    }
                    // Recurse on the next process tick, to avoid
                    // exploding the stack.
                    process.nextTick(() => {
                        deleteQueryBatch(db, query, batchSize, resolve, reject);
                    });
                })
                    .catch(reject);
            }
        });
    }
    static addRoute(name, assocs, color) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const assModel = new association_1.default().getModelForClass(association_1.default);
            const list1 = [];
            const list2 = [];
            for (const id of assocs) {
                const ass = yield assModel.findByAssociationID(id);
                if (ass) {
                    list1.push(ass.associationID);
                    list2.push({
                        associationID: ass.associationID,
                        associationName: ass.associationName,
                    });
                }
            }
            if (!color) {
                color = "BLUE";
            }
            const routeID = v1_1.default();
            const route = new routeModel({
                associationDetails: list2,
                associationIDs: list1,
                color,
                name,
                routeID,
            });
            const m = yield route.save();
            console.log(`\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${name}  💙  💚  💛`);
            return m;
        });
    }
    static getRoutes() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getRoutes find all routes in Mongo ....   🌀  🌀  🌀 `);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const list = yield routeModel.find();
            return list;
        });
    }
}
exports.RouteHelper = RouteHelper;
//# sourceMappingURL=route_helper.js.map