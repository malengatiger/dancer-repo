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
const moment_1 = __importDefault(require("moment"));
const v1_1 = __importDefault(require("uuid/v1"));
const photo_1 = __importDefault(require("../models/photo"));
const position_1 = __importDefault(require("../models/position"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const vehicle_arrival_1 = __importDefault(require("../models/vehicle_arrival"));
const vehicle_departure_1 = __importDefault(require("../models/vehicle_departure"));
const vehicle_location_1 = __importDefault(require("../models/vehicle_location"));
const vehicle_type_1 = __importDefault(require("../models/vehicle_type"));
class VehicleHelper {
    static onVehicleAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`onVehicleAdded event has occured ....`);
            console.log(event);
            console.log(`operationType: 👽 👽 👽  ${event.operationType},  vehicle in stream:   🍀  🍎 `);
        });
    }
    static addVehicle(vehicleReg, associationID, associationName, ownerID, ownerName, vehicleTypeID, photos) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🌀🌀🌀  VehicleHelper: addVehicle  🍀  ${vehicleReg}  🍀   ${associationID}  🍀   ${associationName}\n`);
            const vehicleTypeModel = new vehicle_type_1.default().getModelForClass(vehicle_type_1.default);
            const type = yield vehicleTypeModel.getVehicleTypeByID(vehicleTypeID);
            if (!type) {
                const msg = "Vehicle Type not found";
                console.log(`👿👿👿👿 ${msg} 👿👿👿👿`);
                throw new Error(msg);
            }
            console.log(`\n🥦🥦🥦  VehicleType from Mongo ...  🍊  ${type.make} ${type.model}`);
            const vehicleModel = new vehicle_1.default().getModelForClass(vehicle_1.default);
            const list = [];
            if (photos) {
                for (const url of photos) {
                    const photo = new photo_1.default();
                    photo.url = url;
                    list.push(photo);
                }
            }
            const vehicleID = v1_1.default();
            const vehicle = new vehicleModel({
                associationID,
                associationName,
                ownerID,
                ownerName,
                photos: list,
                vehicleID,
                vehicleReg,
                vehicleType: type,
            });
            const m = yield vehicle.save();
            m.vehicleId = m.id;
            yield m.save();
            if (m && m.vehicleType) {
                console.log(`🍊 🍊  vehicle added:  🍊 ${m.vehicleReg} ${m.vehicleType.make} ${m.vehicleType.model}  🚗 🚗 `);
            }
            return m;
        });
    }
    static addVehicleArrival(vehicleReg, vehicleId, landmarkName, landmarkId, latitude, longitude, make, model, capacity) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🌀🌀🌀  VehicleHelper: addVehicleArrival  🍀  ${vehicleReg}  🍀   ${landmarkName}  🍀 \n`);
            const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
            const position = new position_1.default();
            position.type = "Point";
            position.coordinates = [longitude, latitude];
            const vehicleArrival = new vehicleArrivalModel({
                vehicleId,
                landmarkName,
                landmarkId,
                position,
                vehicleReg,
                dateArrived: new Date().toISOString(),
                make, model, capacity,
            });
            const m = yield vehicleArrival.save();
            m.vehicleArrivalId = m.id;
            yield m.save();
            console.log(`🍊 🍊  vehicleArrival added:  🍊 ${m.vehicleReg} ${m.landmarkName}  🚗 🚗 `);
            return m;
        });
    }
    static addVehicleDeparture(vehicleReg, vehicleId, landmarkName, landmarkId, latitude, longitude, make, model, capacity) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🌀🌀🌀  VehicleHelper: addVehicleDeparture  🍀  ${vehicleReg}  🍀   ${landmarkName}  🍀  \n`);
            const vehicleDepModel = new vehicle_departure_1.default().getModelForClass(vehicle_departure_1.default);
            const position = new position_1.default();
            position.type = "Point";
            position.coordinates = [longitude, latitude];
            const vehicleDeparture = new vehicleDepModel({
                vehicleId,
                landmarkName,
                landmarkId,
                position,
                vehicleReg,
                dateDeparted: new Date().toISOString(),
                make, model, capacity,
            });
            const m = yield vehicleDeparture.save();
            m.vehicleDepartureId = m.id;
            yield m.save();
            console.log(`🍊 🍊  vehicleDeparture added:  🍊 ${m.vehicleReg} ${m.landmarkName}  🚗 🚗 `);
            return m;
        });
    }
    static getVehicles() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getVehicles ....   🌀  🌀  🌀 `);
            const VehicleModel = new vehicle_1.default().getModelForClass(vehicle_1.default);
            const list = yield VehicleModel.find();
            return list;
        });
    }
    static addVehicleType(make, model, capacity, countryID, countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🌀 🌀  VehicleHelper: addVehicleType  🍀  ${make} ${model} capacity: ${capacity}\n`);
            const vehicleTypeID = v1_1.default();
            const vehicleTypeModel = new vehicle_type_1.default().getModelForClass(vehicle_type_1.default);
            const u = new vehicleTypeModel({
                capacity,
                countryID,
                countryName,
                make,
                model,
                vehicleTypeID,
            });
            const m = yield u.save();
            return m;
        });
    }
    static getVehicleTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🌀 getVehicleTypes ....   🌀 🌀 🌀 `);
            const vehicleModel = new vehicle_type_1.default().getModelForClass(vehicle_type_1.default);
            const list = yield vehicleModel.find();
            return list;
        });
    }
    static getVehiclesByOwner(ownerID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🌀 getVehiclesByOwner ....   🌀 🌀 🌀 `);
            const VehicleModel = new vehicle_1.default().getModelForClass(vehicle_1.default);
            const list = yield VehicleModel.find({ ownerID });
            return list;
        });
    }
    static getVehiclesByAssociation(associationID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🌀 getVehiclesByAssociation ....   🌀 🌀 🌀 `);
            const VehicleModel = new vehicle_1.default().getModelForClass(vehicle_1.default);
            const list = yield VehicleModel.find({ associationID });
            return list;
        });
    }
    static findVehiclesByLocation(latitude, longitude, minutes, radiusInKM) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${minutes}`);
            const cutOff = moment_1.default()
                .subtract(minutes, "minutes")
                .toISOString();
            const METERS = radiusInKM * 1000;
            const vehicleLocationModel = new vehicle_location_1.default().getModelForClass(vehicle_location_1.default);
            const list = yield vehicleLocationModel
                .find({
                created: { $gt: cutOff },
                position: {
                    $near: {
                        $geometry: {
                            coordinates: [longitude, latitude],
                            type: "Point",
                        },
                        $maxDistance: METERS,
                    },
                },
            })
                .catch((err) => {
                console.error(err);
            });
            console.log(`🏓  🏓  vehicleLocations found ${list.length}`);
            console.log(list);
            return list;
        });
    }
    ///////////
    static findVehicleArrivalsByLocation(latitude, longitude, minutes, radiusInKM) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${minutes}`);
            const cutOff = moment_1.default()
                .subtract(minutes, "minutes")
                .toISOString();
            const METERS = radiusInKM * 1000;
            const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
            const list = yield vehicleArrivalModel
                .find({
                dateArrived: { $gt: cutOff },
                position: {
                    $near: {
                        $geometry: {
                            coordinates: [longitude, latitude],
                            type: "Point",
                        },
                        $maxDistance: METERS,
                    },
                },
            })
                .catch((err) => {
                console.error(err);
            });
            console.log(`🏓  🏓  vehicleArrivals found ${list.length}`);
            return list;
        });
    }
    static findVehicleArrivalsByLandmark(landmarkId, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
            const list = yield vehicleArrivalModel.findByLandmarkId(landmarkId, minutes);
            console.log(`🏓  🏓  vehicleArrivalss found ${list.length}`);
            return list;
        });
    }
    static findVehicleArrivalsByVehicle(vehicleId, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
            const list = yield vehicleArrivalModel.findByVehicleId(vehicleId, minutes);
            console.log(`🏓  🏓  findVehicleArrivalsByVehicle found ${list.length}`);
            return list;
        });
    }
    static findAllVehicleArrivalsByVehicle(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
            const list = yield vehicleArrivalModel.findAllByVehicleId(vehicleId);
            console.log(`🏓  🏓  findAllVehicleArrivalsByVehicle found ${list.length}`);
            return list;
        });
    }
    static findAllVehicleArrivals(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleArrivalModel = new vehicle_arrival_1.default().getModelForClass(vehicle_arrival_1.default);
            const list = yield vehicleArrivalModel.findAll(minutes);
            console.log(`c  🏓  findAllVehicleArrivals found ${list.length}`);
            return list;
        });
    }
    /////////////
    static findVehicleDeparturesByLocation(latitude, longitude, minutes, radiusInKM) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`find vehicles: lat: ${latitude} lng: ${longitude} radius: ${radiusInKM} minutes: ${minutes}`);
            const cutOff = moment_1.default()
                .subtract(minutes, "minutes")
                .toISOString();
            const METERS = radiusInKM * 1000;
            const vehicleArrivalModel = new vehicle_departure_1.default().getModelForClass(vehicle_arrival_1.default);
            const list = yield vehicleArrivalModel
                .find({
                dateArrived: { $gt: cutOff },
                position: {
                    $near: {
                        $geometry: {
                            coordinates: [longitude, latitude],
                            type: "Point",
                        },
                        $maxDistance: METERS,
                    },
                },
            })
                .catch((err) => {
                console.error(err);
            });
            console.log(`🏓  🏓  vehicleArrivals found ${list.length}`);
            return list;
        });
    }
    static findVehicleDeparturesByLandmark(landmarkId, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDepModel = new vehicle_departure_1.default().getModelForClass(vehicle_departure_1.default);
            const list = yield vehicleDepModel.findByLandmarkId(landmarkId, minutes);
            console.log(`🏓  🏓  findVehicleDeparturesByLandmark found ${list.length}`);
            return list;
        });
    }
    static findVehicleDeparturesByVehicle(vehicleId, minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDepModel = new vehicle_departure_1.default().getModelForClass(vehicle_departure_1.default);
            const list = yield vehicleDepModel.findByVehicleId(vehicleId, minutes);
            console.log(`🏓  🏓  findVehicleArrivalsByVehicle found ${list.length}`);
            return list;
        });
    }
    static findAllVehicleDeparturesByVehicle(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDepModel = new vehicle_departure_1.default().getModelForClass(vehicle_departure_1.default);
            const list = yield vehicleDepModel.findAllByVehicleId(vehicleId);
            console.log(`🏓  🏓  findAllVehicleDeparturesByVehicle found ${list.length}`);
            return list;
        });
    }
    static findAllVehicleDepartures(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDepModel = new vehicle_departure_1.default().getModelForClass(vehicle_departure_1.default);
            const list = yield vehicleDepModel.findAll(minutes);
            console.log(`🏓  🏓  findAllVehicleDepartures found ${list.length}`);
            return list;
        });
    }
}
exports.VehicleHelper = VehicleHelper;
//# sourceMappingURL=vehicle_helper.js.map