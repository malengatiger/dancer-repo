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
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
class RouteHelper {
    static onRouteAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onRouteChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  route in stream:  🍀  🍀  🍎 `);
        });
    }
    static addRoute(route) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeModel = new route_1.default().getModelForClass(route_1.default);
            const assModel = new association_1.default().getModelForClass(association_1.default);
            const list1 = [];
            const list2 = [];
            for (const id of route.associationIDs) {
                const ass = yield assModel.findByAssociationId(id);
                if (ass) {
                    list1.push(ass.associationId);
                    list2.push({
                        associationId: ass.associationId,
                        associationName: ass.associationName,
                    });
                }
            }
            if (!route.color) {
                route.color = "white";
            }
            const mRoute = new routeModel({
                associationDetails: list2,
                associationIDs: list1,
                color: route.color,
                name: route.name,
                routePoints: route.routePoints,
                rawRoutePoints: route.rawRoutePoints,
                calculatedDistances: route.calculatedDistances,
                routeID: route.routeID,
            });
            const m = yield mRoute.save();
            if (!route.routeID) {
                m.routeID = m.id;
                yield m.save();
            }
            console.log(`\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${route.name}  💙  💚  💛`);
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
}
exports.RouteHelper = RouteHelper;
//# sourceMappingURL=route_helper.js.map