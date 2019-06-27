"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const geolib_1 = require("geolib");
const v1_1 = tslib_1.__importDefault(require("uuid/v1"));
const landmark_1 = tslib_1.__importDefault(require("../models/landmark"));
const route_1 = tslib_1.__importDefault(require("../models/route"));
class LandmarkHelper {
    static onLandmarkAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onLandmarkChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  landmark in stream:   🍀   🍀  ${event.fullDocument.landmarkName} 🍎  `);
        });
    }
    static addLandmarks(landmarks, routeID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findById(routeID);
            if (route) {
                console.log(`💦 💦  adding landmarks - 👽 route from mongo: 💦 💦 ${route.name}`);
            }
            const bulkWriteList = [];
            for (const m of landmarks) {
                if (m.latitude && m.longitude) {
                    const landmark = new landmarkModel({
                        landmarkName: m.landmarkName,
                        position: {
                            coordinates: [m.longitude, m.latitude],
                            type: "Point",
                        },
                        routes: [route],
                    });
                    bulkWriteList.push({
                        insertOne: {
                            document: landmark,
                        },
                    });
                }
                else {
                    console.warn(`\n\n👿👿👿👿👿👿👿👿👿👿👿👿👿 coordinates missing for ${m.landmarkName} 👿👿👿👿👿👿👿`);
                }
            }
            console.log(`\n\n🍀 🍀 🍀 🍀  ..... about to write batch: ${bulkWriteList.length} 🍀 🍀`);
            if (bulkWriteList.length === 0) {
                console.error(`👿👿👿👿👿👿👿 Ignoring empty batch ... 🍀  ciao!`);
                return;
            }
            try {
                const res = yield landmarkModel.bulkWrite(bulkWriteList);
                console.log(`\n\n🍀 🍀 🍀 🍀  Batched: ${landmarks.length}. inserted: 🍎  ${res.insertedCount} 🍎`);
                console.log(res);
            }
            catch (e) {
                console.error(`👿👿👿👿👿👿👿 Something fucked up! 👿👿👿👿👿👿👿👿\n`, e);
            }
        });
    }
    static addLandmark(landmarkName, latitude, longitude, routeIDs, routeDetails) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!latitude || !longitude) {
                throw new Error("Missing coordinates");
            }
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            console.log(`😍 😍 😍  about to add landmark: ${landmarkName}`);
            const landmarkID = v1_1.default();
            const landmark = new landmarkModel({
                landmarkID,
                landmarkName,
                latitude,
                longitude,
                position: {
                    coordinates: [longitude, latitude],
                    type: "Point",
                },
                routeDetails,
                routeIDs,
            });
            const m = yield landmark.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  Landmark added  🍎  ${landmarkName} \n\n`);
            return m;
        });
    }
    static addRoute(landmarkID, routeID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 addRoute to landmark; landmarkID: ${landmarkID} routeID: ${routeID} ....   🌀  🌀  🌀 `);
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeID);
            console.log(route);
            const mark = yield landmarkModel.findByLandmarkID(landmarkID);
            if (!mark.routes) {
                mark.routes = [];
            }
            if (!mark.routeDetails) {
                mark.routeDetails = [];
            }
            mark.routes.push(route.routeID);
            mark.routeDetails.push({
                routeID: route.routeID,
                routeName: route.name,
            });
        });
    }
    static findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 LandmarkHelper: findAll ....   🌀  🌀  🌀 `);
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const list = yield landmarkModel.find();
            console.log(` 🌀 LandmarkHelper: findAll .... found: ${list.length}   🌀  🌀  🌀 `);
            console.log(list);
            return list;
        });
    }
    static findByLocation(latitude, longitude, radiusInKM) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line: max-line-length
            console.log(`\n💦 💦  find landmarks ByLocation .... 🔆 lat: ${latitude}  🔆 lng: ${longitude} radiusInKM: ${radiusInKM}`);
            const start = new Date().getTime();
            const RADIUS = radiusInKM * 1000;
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const list = yield landmarkModel
                .find({
                position: {
                    $near: {
                        $geometry: {
                            coordinates: [longitude, latitude],
                            type: "Point",
                        },
                        $maxDistance: RADIUS,
                    },
                },
            })
                .catch((err) => {
                console.error(err);
            });
            const end = new Date().getTime();
            console.log(`\n🏓  🏓  landmarks found:   🌺 ${list.length}  elapsed: 💙  ${(end -
                start) /
                1000} seconds  💙 💚\n`);
            list.forEach((m) => {
                const route = m.routeDetails[0];
                console.log(`💙 💚  ${m.landmarkName}  🍎 ${route.name}  💛`);
            });
            console.log(`\n\n🌺  Calculated distances between landmarks   🌺 🌸 \n`);
            this.calculateDistances(list, latitude, longitude);
            console.log(list);
            console.log(`\n💙 💙 💙 landmarks found:  🌸  ${list.length}  elapsed: 💙  ${(end - start) / 1000} seconds  💙 💚 💛\n`);
            return list;
        });
    }
    static calculateDistances(landmarks, latitude, longitude) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const from = {
                latitude,
                longitude,
            };
            for (const m of landmarks) {
                const to = {
                    latitude: m.position.coordinates[1],
                    longitude: m.position.coordinates[0],
                };
                const dist = geolib_1.getDistance(from, to);
                const f = new Intl.NumberFormat("en-us", { maximumSignificantDigits: 3 }).format(dist / 1000);
                m.distance = f + " km (as the crow flies)";
                console.log(`🌸  ${f}  🍎  ${m.landmarkName}  🍀  ${m.routeDetails[0].name}`);
            }
        });
    }
}
exports.LandmarkHelper = LandmarkHelper;
//# sourceMappingURL=landmark_helper.js.map