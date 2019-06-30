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
// import polyline from 'google-polyline';
const association_helper_1 = require("../helpers/association_helper");
const route_helper_1 = require("../helpers/route_helper");
const vehicle_helper_1 = require("../helpers/vehicle_helper");
const commuter_request_helper_1 = require("./../helpers/commuter_request_helper");
const country_helper_1 = require("./../helpers/country_helper");
const position_1 = __importDefault(require("../models/position"));
const vehicle_arrival_1 = __importDefault(require("../models/vehicle_arrival"));
const vehicle_departure_1 = __importDefault(require("../models/vehicle_departure"));
const z = "\n";
console.log(`\n\n👺👺👺 🔑 Migrator: getting serviceAccount from json file  🔑🔑...`);
const server_1 = require("../server/server");
const route_point_1 = __importDefault(require("../models/route_point"));
const landmark_1 = __importDefault(require("../models/landmark"));
class Migrator {
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n......Migrator is starting up ... ❤️ ❤️ ❤️  ....\n`);
            const start = new Date().getTime();
            // await this.migrateCountries();
            // await this.migrateAssociations();
            // await this.migrateCities("5ced8952fc6e4ef1f1cfc7ae");
            // await this.migrateVehicleTypes();
            // await this.migrateVehicles();
            yield this.migrateRoutes();
            yield this.migrateLandmarks();
            // await this.encodePolyline();
            // await this.toDancer();
            // await this.landmarksToDancer();
            // await this.commuterRequestsToDancer();
            // await this.migrateCommuterRequests();
            // await this.migrateVehicleArrivals();
            // await this.migrateVehicleDepartures();
            // await this.migrateCommuterLandmarkArrivals();
            const end = new Date().getTime();
            console.log(`\n\n♻️ ♻️ ♻️ ♻️ ♻️ ♻️  Migrator has finished the job:  ❤️  ${(end -
                start) /
                1000} seconds elapsed\n\n`);
            return {
                migrator: `❤️️ ❤️ ❤️   Migrator has finished the job!  ❤️  ${(end -
                    start) /
                    1000} seconds elapsed  ❤️ ❤️ ❤️`,
                xdate: new Date(),
            };
        });
    }
    static commuterRequestsToDancer() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n\n🍎 🍎 migrating commuterRequests to Dancer ....  🍎 \n\n`);
            const qs1 = yield server_1.fs2.collection("commuterRequests").get();
            let cnt = 0;
            for (const doc of qs1.docs) {
                const id = doc.ref.id;
                const data = doc.data();
                if (data.fromLandmarkId && data.routeName && data.routeId) {
                    yield server_1.fs2
                        .collection("commuterRequests")
                        .doc(id)
                        .set(data);
                    cnt++;
                    console.log(`🧡🧡 commuterRequest #${cnt} added ${doc.data().stringTime}  🍎🍎 \n\n`);
                }
            }
            console.log(`\n\n🧡🧡🧡🧡🧡🧡 ${cnt} commuterRequests added:  🍎\n\n`);
        });
    }
    static landmarksToDancer() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n\n🍎 🍎 migrating landmarks to Dancer ....  🍎 \n\n`);
            const qs1 = yield server_1.fs2.collection("newLandmarks").get();
            let cnt = 0;
            for (const doc of qs1.docs) {
                const id = doc.data().landmarkID;
                yield server_1.fs2
                    .collection("newLandmarks")
                    .doc(id)
                    .set(doc.data());
                cnt++;
                console.log(`🧡🧡 landmark #${cnt} added ${doc.data().landmarkName}  🍎🍎 \n\n`);
            }
            console.log(`\n\n🧡🧡🧡🧡🧡🧡 ${cnt} landmarks added:  🍎\n\n`);
        });
    }
    static toDancer() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n\n🍎 🍎 migrating data to Dancer ....  🍎 \n\n`);
            const qs1 = yield server_1.fs2.collection("associations").get();
            for (const doc of qs1.docs) {
                const id = doc.data().associationID;
                yield server_1.fs2
                    .collection("associations")
                    .doc(id)
                    .set(doc.data());
                console.log(`🧡🧡 association added ${doc.data().associationName}  🍎🍎 \n\n`);
            }
            const qs2 = yield server_1.fs2.collection("newRoutes").get();
            for (const doc of qs2.docs) {
                const id = doc.data().routeID;
                yield server_1.fs2
                    .collection("newRoutes")
                    .doc(id)
                    .set(doc.data());
                let cnt = 0;
                let cnt2 = 0;
                const qs3 = yield doc.ref.collection("rawRoutePoints").get();
                for (const m of qs3.docs) {
                    yield server_1.fs2
                        .collection("newRoutes")
                        .doc(id)
                        .collection("rawRoutePoints")
                        .add(m.data());
                    cnt++;
                }
                const qs4 = yield doc.ref.collection("routePoints").get();
                for (const m of qs4.docs) {
                    yield server_1.fs2
                        .collection("newRoutes")
                        .doc(id)
                        .collection("routePoints")
                        .add(m.data());
                    cnt2++;
                }
                console.log(`rawRoutePoints added:  🍎 ${cnt} routePoints added:  🍎 ${cnt2}`);
                console.log(`🧡🧡 route added ${doc.data().name} 🧡🧡\n\n`);
            }
        });
    }
    static encodePolyline() {
        return __awaiter(this, void 0, void 0, function* () {
            const routeID = "-LgWJGYelWehA41IfbsS";
            const qs = yield server_1.fs2
                .collection("newRoutes")
                .doc(routeID)
                .collection("routePoints")
                .get();
            console.log(`....... Firestore routePoints found:  🍎 ${qs.docs.length}`);
            const points = [];
            let cnt = 0;
            for (const doc of qs.docs) {
                const data = doc.data();
                cnt++;
                points.push([data.latitude, data.longitude]);
            }
            // const encoded = polyline.encode(points);
            // console.log(
            //   `🌸  🌸  🌸  encoded polyline:  🍀 ${encoded}  🍀 length: ${
            //     encoded.length
            //   }`,
            // );
            console.log(`\n🔑 🔑 🔑   route points encoded:  🍀  ${cnt}  🍀`);
        });
    }
    static migrateCommuterRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating commuter requests to Mongo........................`);
            const qs = yield server_1.fs2.collection("commuterRequests").get();
            console.log(`\n\n....... Firestore commuterRequests found:  🍎 ${qs.docs.length}`);
            let cnt = 0;
            for (const doc of qs.docs) {
                const data = doc.data();
                const loc = data.commuterLocation;
                const point = new position_1.default();
                point.type = "Point";
                if (loc.lng && loc.lat) {
                    point.coordinates = [parseFloat(loc.lng), parseFloat(loc.lat)];
                    data.position = point;
                    console.log(`about to write ${JSON.stringify(data)}`);
                    const cr = yield commuter_request_helper_1.CommuterRequestHelper.addCommuterRequest(data);
                    cnt++;
                    console.log(`🍀 🍀 🍎 #${cnt} 🍎 commuter request migrated:  🍀 ${cr.stringTime}`);
                }
                else {
                    console.error("👿 👿 👿 fucked up! 👿 coordinates missing ");
                }
            }
            console.log(`\n🔑 🔑 🔑   commuterRequests migrated:  🍀  ${qs.docs.length}  🍀`);
        });
    }
    static migrateVehicleDepartures() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating migrateVehicleDepartures to Mongo........................`);
            const qs = yield server_1.fs2.collection("vehicleDepartures").get();
            console.log(`\n\n....... Firestore vehicleDepartures found:  🍎 ${qs.docs.length}`);
            let cnt = 0;
            for (const doc of qs.docs) {
                const docRef = yield server_1.fs2
                    .collection("newLandmarks")
                    .where('landmarkName', '==', doc.data().landmarkName)
                    .get();
                if (docRef.docs.length > 0) {
                    const mark = docRef.docs[0].data();
                    const position = new position_1.default();
                    position.type = "Point";
                    position.coordinates = [mark.longitude, mark.latitude];
                    const data = doc.data();
                    const veh = data.vehicle;
                    const departure = new vehicle_departure_1.default();
                    departure.capacity = veh.vehicleType.capacity;
                    departure.make = veh.vehicleType.make;
                    departure.model = veh.vehicleType.model;
                    const date = new Date(data.dateDeparted).toISOString();
                    departure.dateDeparted = date;
                    departure.landmarkId = data.landmarkID;
                    departure.landmarkName = data.landmarkName;
                    departure.vehicleId = veh.vehicleID;
                    departure.vehicleReg = veh.vehicleReg;
                    console.log(`about to write ${JSON.stringify(departure)}`);
                    const vehicleDepModel = new vehicle_departure_1.default().getModelForClass(vehicle_departure_1.default);
                    const vehicleDeparture = new vehicleDepModel({
                        vehicleId: departure.vehicleId,
                        landmarkName: departure.landmarkName,
                        landmarkId: departure.landmarkId,
                        position,
                        vehicleReg: departure.vehicleReg,
                        dateDeparted: departure.dateDeparted,
                        make: departure.make,
                        model: departure.model,
                        capacity: departure.capacity,
                        latitude: mark.latitude,
                        longitude: mark.longitude,
                    });
                    const m = yield vehicleDeparture.save();
                    m.vehicleDepartureId = m.id;
                    yield m.save();
                    cnt++;
                    console.log(`🍀 🍀 🍎 #${cnt} 🍎 vehicle departure migrated:  🍀 ${vehicleDeparture.vehicleReg} at ${vehicleDeparture.landmarkName}`);
                }
                else {
                    console.log(`landmark not found: ${doc.data().landmarkID} ${doc.data().landmarkName}`);
                }
            }
            console.log(`\n🔑 🔑 🔑   vehicle departures migrated:  🍀  ${cnt}  🍀`);
        });
    }
    // public static async migrateCommuterLandmarkArrivals(): Promise<any> {
    //   console.log(
    //     `\n\n🍎  Migrating migrateCommuterLandmarkArrivals to Mongo........................`,
    //   );
    //   const qs = await fs2.collection("commuterArrivalLandmark").get();
    //   console.log(
    //     `\n\n....... Firestore commuterArrivalLandmarks found:  🍎 ${qs.docs.length}`,
    //   );
    //   for (const doc of qs.docs) {
    //     const position = doc.data().position;
    //     const data = doc.data();
    //     const mPosition = new Position();
    //     mPosition.coordinates = [position.geopoint.longitude, position.geopoint.latitude];
    //     data.position = mPosition;
    //     const commuterArrivalLandmarkModel = new CommuterArrivalLandmark().getModelForClass(CommuterArrivalLandmark);
    //     console.log(`....... 😍 😍 😍  about to add CommuterArrivalLandmark:  👽 👽 👽`);
    //     const commuterArrivalLandmark = new commuterArrivalLandmarkModel({
    //     commuterRequestId: data.commuterRequestId,
    //     fromLandmarkId: data.fromLandmarkId,
    //     fromLandmarkName: data.fromLandmarkName,
    //     position: data.position,
    //     routeId: data.routeId,
    //     routeName: data.routeName,
    //     createdAt: moment().date(data.createdAt).toISOString(),
    //     toLandmarkId: data.toLandmarkId,
    //     toLandmarkName: data.toLandmarkName,
    //     userId: data.userId,
    //     vehicleId: data.vehicleId,
    //     vehicleReg: data.vehicleReg,
    //     departureId: data.departureId,
    //   });
    //     const m = await commuterArrivalLandmark.save();
    //     m.commuterArrivalLandmarkId = m.id;
    //     await m.save();
    //   }
    // }
    static migrateVehicleArrivals() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating migrateVehicleArrivals to Mongo........................`);
            const qs = yield server_1.fs2.collection("vehicleArrivals").get();
            console.log(`\n\n....... Firestore VehicleArrivals found:  🍎 ${qs.docs.length}`);
            let cnt = 0;
            for (const doc of qs.docs) {
                const docRef = yield server_1.fs2
                    .collection("newLandmarks")
                    .where('landmarkName', '==', doc.data().landmarkName)
                    .get();
                if (docRef.docs.length > 0) {
                    const mark = docRef.docs[0].data();
                    const position = new position_1.default();
                    position.type = "Point";
                    position.coordinates = [mark.longitude, mark.latitude];
                    const data = doc.data();
                    const veh = data.vehicle;
                    const arr = new vehicle_arrival_1.default();
                    arr.capacity = veh.vehicleType.capacity;
                    arr.make = veh.vehicleType.make;
                    arr.model = veh.vehicleType.model;
                    const date = new Date(data.dateArrived).toISOString();
                    arr.dateArrived = date;
                    arr.landmarkId = data.landmarkID;
                    arr.landmarkName = data.landmarkName;
                    arr.vehicleId = veh.vehicleID;
                    arr.vehicleReg = veh.vehicleReg;
                    console.log(`about to write ${JSON.stringify(arr)}`);
                    const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
                    const vehicleArrival = new vehicleArrivalModel({
                        vehicleId: arr.vehicleId,
                        landmarkName: arr.landmarkName,
                        landmarkId: arr.landmarkId,
                        position,
                        vehicleReg: arr.vehicleReg,
                        dateArrived: arr.dateArrived,
                        make: arr.make, model: arr.model, capacity: arr.capacity,
                        latitude: mark.latitude,
                        longitude: mark.longitude,
                    });
                    const m = yield vehicleArrival.save();
                    m.vehicleArrivalId = m.id;
                    yield m.save();
                    cnt++;
                    console.log(`🍀 🍀 🍎 #${cnt} 🍎 vehicle arrival migrated:  🍀 ${arr.vehicleReg} at  ${arr.landmarkName}`);
                }
                else {
                    console.log(`landmark not found: ${doc.data().landmarkID} ${doc.data().landmarkName}`);
                }
            }
            console.log(`\n🔑 🔑 🔑   vehicle arrivals migrated:  🍀  ${cnt}  🍀`);
        });
    }
    static migrateCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating countries ........................`);
            const qs = yield server_1.fs2.collection("countries").get();
            console.log(`....... Firestore countries found:  🍎 ${qs.docs.length}`);
            for (const doc of qs.docs) {
                const data = doc.data();
                console.log(data);
                const country = yield country_helper_1.CountryHelper.addCountry(data.name, data.countryCode);
                this.countries.push(country);
                console.log(country);
            }
            console.log(`\n🔑 🔑 🔑   countries migrated: ${this.countries.length}`);
            for (const c of this.countries) {
                if (c.name === "South Africa") {
                    console.log(c);
                    yield this.migrateCities(c.countryID);
                }
            }
        });
    }
    static migrateCities(countryID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎 🍎 🍎  Migrating cities, 🍎 countryID: ${countryID} ....... 🍎 🍎 🍎 `);
            // const start = new Date().getTime();
            // // tslint:disable-next-line: forin
            // let cnt = 0;
            // // tslint:disable-next-line: forin
            // for (const m in citiesJson) {
            //   const city: any = citiesJson[m];
            //   const x = await CityHelper.addCity(
            //     city.name,
            //     city.provinceName,
            //     countryID,
            //     "South Africa",
            //     city.latitude,
            //     city.longitude,
            //   );
            //   cnt++;
            //   console.log(
            //     `🌳 🌳 🌳  city #${cnt}  added to Mongo: 🍎 id: ${x.countryID}  🍎 ${
            //       city.name
            //     }  💛  ${city.provinceName}  📍 📍 ${city.latitude}  📍  ${
            //       city.longitude
            //     }`,
            //   );
            // }
            // const end = new Date().getTime();
            // console.log(
            //   `\n\n💛 💛 💛 💛 💛 💛   Cities migrated: ${end -
            //     start / 1000} seconds elapsed`,
            // );
        });
    }
    static migrateAssociations() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating associations .............`);
            const qs = yield server_1.fs2.collection("associations").get();
            console.log(`associations found:  🍎  ${qs.docs.length}`);
            const countryID = "75758d10-8b0b-11e9-af98-9b65797ec338";
            const countryName = "South Africa";
            let cnt = 0;
            for (const doc of qs.docs) {
                const data = doc.data();
                console.log(data);
                yield association_helper_1.AssociationHelper.addAssociation(data.associationName, "info@association.com", data.phone, countryID, countryName);
                cnt++;
            }
            console.log(`\n🎸  🎸  🎸  associations added to Mongo: 🎀 ${cnt}`);
        });
    }
    static migrateVehicles() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating vehicles ............. 🍎🍎🍎`);
            const qs = yield server_1.fs2.collection("vehicles").get();
            console.log(`🍎  Firestore vehicles found:  🍎  ${qs.docs.length}`);
            // get assocs from mongo
            const assocs = yield association_helper_1.AssociationHelper.getAssociations();
            console.log(`👽 👽 ${assocs.length} Associations from Mongo`);
            const vehicleTypeID = "45f2d1f0-8b1b-11e9-8cde-f7926ecb6f9c";
            let cnt = 0;
            for (const doc of qs.docs) {
                const vehicle = doc.data();
                for (const association of assocs) {
                    if (association.associationName === vehicle.associationName) {
                        yield vehicle_helper_1.VehicleHelper.addVehicle(vehicle.vehicleReg, association.associationID, association.associationName, '', vehicle.ownerName, vehicleTypeID, []);
                        cnt++;
                        console.log(` 🧡 🧡  vehicle #${cnt} added`);
                    }
                }
            }
            console.log(`\n🎸  🎸  🎸  vehicles migrated to Mongo: 🎀 ${cnt} \n\n`);
        });
    }
    static migrateVehicleTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating vehicleTypess .............`);
            const qs = yield server_1.fs2.collection("vehicleTypes").get();
            console.log(`vehicleTypes found:  🍎  ${qs.docs.length}`);
            const countryID = "75758d10-8b0b-11e9-af98-9b65797ec338";
            const countryName = "South Africa";
            let cnt = 0;
            for (const doc of qs.docs) {
                const data = doc.data();
                console.log(data);
                yield vehicle_helper_1.VehicleHelper.addVehicleType(data.make, data.model, data.capacity, countryID, countryName);
                cnt++;
            }
            console.log(`\n🎸  🎸  🎸  vehicleTypes added to Mongo: 🎀 ${cnt}`);
        });
    }
    static migrateRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🍎  Migrating routes ............. 🍎🍎🍎\n\n`);
            const s = new Date().getTime();
            const routesQuerySnap = yield server_1.fs2
                .collection("newRoutes")
                .get();
            console.log(`🍎  Firestore routes found:  🍎  ${routesQuerySnap.docs.length}`);
            // get assocs from mongo
            const assocs = yield association_helper_1.AssociationHelper.getAssociations();
            console.log(`\n\nmigrateRoutes: 👽 👽 👽 👽 👽 👽 👽 👽  ${assocs.length} Associations from Mongo 💛 💛\n\n`);
            let cnt = 0;
            for (const doc of routesQuerySnap.docs) {
                const route = doc.data();
                for (const association of assocs) {
                    if (route.associationNames) {
                        if (this.isAssociationFound(route.associationNames, association.associationName)) {
                            yield this.processRoute(route, association, cnt);
                            cnt++;
                        }
                    }
                    else {
                        if (route.associationName === association.associationName) {
                            yield this.processRoute(route, association, cnt);
                            cnt++;
                        }
                    }
                }
            }
            const e = new Date().getTime();
            const elapsed = `\n🎁 🎁 🎁  Migration took ${(e - s) /
                100} elapsed seconds 🎁 🎁 🎁`;
            console.log(`\n🎸  🎸  🎸  routes migrated to Mongo: 🎀  \n`);
            console.log(`\n🎸  🎸  🎸  landmarks migrated to Mongo: 🎀  \n\n`);
            console.log(elapsed);
        });
    }
    static processRoute(route, association, cnt) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💛💛💛  ... about to call: RouteHelper.addRoute(): 🎀 ${route.name}`);
            // get route points into Mongo
            const qs = yield server_1.fs2.collection('newRoutes').doc(route.routeID).collection('routePoints').get();
            route.routePoints = [];
            for (const doc of qs.docs) {
                const point = doc.data();
                const mPoint = new route_point_1.default();
                mPoint.routeId = route.routeID;
                mPoint.latitude = point.latitude;
                mPoint.longitude = point.longitude;
                const pos = {
                    type: 'Point',
                    coordinates: [point.longitude, point.latitude],
                };
                mPoint.position = pos;
                route.routePoints.push(mPoint);
            }
            const qs2 = yield server_1.fs2.collection('newRoutes').doc(route.routeID).collection('rawRoutePoints').get();
            route.rawRoutePoints = [];
            for (const doc of qs2.docs) {
                const point = doc.data();
                const mPoint = new route_point_1.default();
                mPoint.routeId = route.routeID;
                mPoint.latitude = point.latitude;
                mPoint.longitude = point.longitude;
                route.rawRoutePoints.push(mPoint);
            }
            console.log(`💛 routePoints: ${qs.docs.length}  💛  rawRoutePoints ${qs2.docs.length}`);
            route.associationIDs = [association.associationID];
            const mRoute = yield route_helper_1.RouteHelper.addRoute(route);
            cnt++;
            console.log(`\n💛💛💛  Migrator: route #${cnt} added  💛 ${mRoute.name}, will do the  landmarks ...\n`);
            // get all route landmarks by name and migrate
            console.log(mRoute);
        });
    }
    static isAssociationFound(associations, associationID) {
        let isFound = false;
        associations.forEach((ass) => {
            if (ass === associationID) {
                isFound = true;
            }
        });
        return isFound;
    }
    static isRouteFound(routeNames, name) {
        let isFound = false;
        routeNames.forEach((routeDetail) => {
            if (routeDetail.name === name) {
                isFound = true;
            }
        });
        return isFound;
    }
    static migrateLandmarks() {
        return __awaiter(this, void 0, void 0, function* () {
            const landmarkModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const landmarksQuerySnapshot = yield server_1.fs2.collection('newLandmarks').get();
            console.log(`😍 😍 😍  about to add landmarks: ${landmarksQuerySnapshot.docs.length}`);
            for (const mdoc of landmarksQuerySnapshot.docs) {
                const data = mdoc.data();
                const landmark = new landmarkModel({
                    landmarkID: data.landmarkID,
                    landmarkName: data.landmarkName,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    position: {
                        coordinates: [data.longitude, data.latitude],
                        type: "Point",
                    },
                    routeDetails: data.routeNames,
                    routeIDs: data.routeIDs,
                    cities: data.cities,
                });
                const m = yield landmark.save();
                console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  Landmark added  🍎  ${m.landmarkName} \n\n`);
            }
            return null;
        });
    }
}
Migrator.countries = [];
exports.default = Migrator;
//# sourceMappingURL=migrator.js.map