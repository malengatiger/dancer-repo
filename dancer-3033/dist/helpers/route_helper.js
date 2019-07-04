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
const association_1 = __importDefault(require("../models/association"));
const route_1 = __importDefault(require("../models/route"));
const landmark_1 = __importDefault(require("../models/landmark"));
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
class RouteHelper {
    static onRouteAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onRouteChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  route in stream:  🍀  🍀  🍎 `);
        });
    }
    static addRoute(name, color, associationID) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const assModel = new association_1.default().getModelForClass(association_1.default);
            const list1 = [];
            const list2 = [];
            const ass = yield assModel.findByAssociationId(associationID).exec();
            if (ass) {
                list1.push(ass.associationId);
                list2.push({
                    associationId: ass.associationId,
                    associationName: ass.associationName,
                });
            }
            if (!color) {
                color = "white";
            }
            const mRoute = new routeModel({
                associationDetails: list2,
                associationIDs: list1,
                color,
                name,
                routePoints: [],
                rawRoutePoints: [],
                calculatedDistances: [],
            });
            const m = yield mRoute.save();
            m.routeID = m.id;
            yield m.save();
            console.log(`\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${name}  💙  💚  💛`);
            return m;
        });
    }
    static getRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getRoutes find all routes in Mongo ....   c  🌀  🌀 `);
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const list = yield routeModel.find();
            return list;
        });
    }
    static addRoutePoints(routeId, routePoints, clear) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId).exec();
            if (!route) {
                throw new Error(`${routeId} route not found`);
            }
            if (clear) {
                route.routePoints = [];
            }
            for (const p of routePoints) {
                route.routePoints.push(p);
            }
            yield route.save();
            const msg = `${routePoints.length} route points added to route  ${route.name}`;
            console.log(`💛💛 ${msg}`);
            return {
                message: msg,
            };
        });
    }
    static addRawRoutePoints(routeId, routePoints, clear) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId).exec();
            if (!route) {
                throw new Error(`${routeId} route not found`);
            }
            if (clear) {
                route.rawRoutePoints = [];
            }
            for (const p of routePoints) {
                route.rawRoutePoints.push(p);
            }
            yield route.save();
            const msg = `${routePoints.length} route points added to route  ${route.name}`;
            console.log(`💛💛 ${msg}`);
            return {
                message: msg,
            };
        });
    }
    static updateRoute(routeId, name, color) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId).exec();
            if (!route) {
                throw new Error(`${routeId} route not found`);
            }
            route.name = name;
            route.color = color;
            yield route.save();
            const msg = `💛💛 Route ${route.name} updated`;
            console.log(msg);
            return {
                message: msg,
            };
        });
    }
    static updateRoutePoint(routeId, created, landmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const route = yield routeModel.findByRouteID(routeId).exec();
            if (!route) {
                throw new Error(`${routeId} route not found`);
            }
            let found = false;
            const markModel = new landmark_1.default().getModelForClass(landmark_1.default);
            const mark = yield markModel.findByLandmarkID(landmarkId).exec();
            if (mark) {
                for (const p of route.routePoints) {
                    if (p.created === created) {
                        p.landmarkId = landmarkId;
                        p.landmarkName = mark.landmarkName;
                        yield mark.save();
                        const msg = `💛💛 Route ${route.name} updated`;
                        console.log(msg);
                        found = true;
                        return {
                            message: msg,
                        };
                    }
                }
                if (!found) {
                    const msg = `🦀 Route Point ${created} not found`;
                    throw new Error(msg);
                }
            }
            else {
                const msg = `🦀 Landmark ${landmarkId} not found`;
                throw new Error(msg);
            }
        });
    }
    static findRoutePointsByLocation(routeId, latitude, longitude, radiusInKM) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const RADIUS = radiusInKM * 1000;
            const route = yield routeModel.find({
                "routePoints.position": {
                    $near: {
                        $geometry: {
                            coordinates: [longitude, latitude],
                            type: "Point",
                        },
                        $maxDistance: RADIUS,
                    },
                },
            });
            if (!route) {
                throw new Error(`${routeId} route points not found`);
            }
        });
    }
}
exports.RouteHelper = RouteHelper;
//# sourceMappingURL=route_helper.js.map