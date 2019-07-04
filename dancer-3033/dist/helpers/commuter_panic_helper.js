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
const commuter_panic_1 = __importDefault(require("../models/commuter_panic"));
const position_1 = __importDefault(require("../models/position"));
const messaging_1 = __importDefault(require("../server/messaging"));
class CommuterPanicHelper {
    static onCommuterPanicChanged(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterPanicChangeEvent: operationType: 👽 👽 👽  ${event.operationType},  CommuterPanic in stream:   🍀  🍎  `);
            const data = event.fullDocument;
            yield messaging_1.default.sendPanic(data);
        });
    }
    static addCommuterPanic(active, type, userId, latitude, longitude, vehicleId, vehicleReg) {
        return __awaiter(this, void 0, void 0, function* () {
            const pos = new position_1.default();
            pos.coordinates = [longitude, latitude];
            const commuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const commuterPanic = new commuterPanicModel({
                active,
                type,
                userId,
                latitude,
                longitude,
                vehicleId,
                vehicleReg,
                locations: [pos],
            });
            const m = yield commuterPanic.save();
            m.commuterPanicId = m.id;
            yield m.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPanic added  for: 🍎  ${m.userId} \n\n`);
            console.log(m);
            return m;
        });
    }
    static addCommuterPanicLocation(commuterPanicId, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const panic = yield commuterPanicModel.findByPanicId(commuterPanicId);
            if (panic) {
                if (!panic.locations) {
                    panic.locations = [];
                }
                const pos = new position_1.default();
                pos.coordinates = [longitude, latitude];
                panic.locations.push(pos);
            }
            else {
                throw new Error('Original panic record not found');
            }
            const m = yield panic.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPanic location added  for: 🍎  ${m.userId} \n\n`);
            console.log(m);
            return m;
        });
    }
    static updateCommuterPanicActive(active, commuterPanicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const panic = yield commuterPanicModel.findByPanicId(commuterPanicId);
            if (panic) {
                panic.active = active;
            }
            else {
                throw new Error('Original panic record not found');
            }
            const m = yield panic.save();
            m.commuterPanicId = m.id;
            yield m.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterPanic active updated  for: 🍎  ${m.userId} \n\n`);
            return m;
        });
    }
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const list = yield CommuterPanicModel.findByUserId(userId);
            return list;
        });
    }
    static findByPanicId(commuterPanicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const panic = yield CommuterPanicModel.findByPanicId(commuterPanicId);
            return panic;
        });
    }
    static findAllPanicsWithinMinutes(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const list = yield CommuterPanicModel.findAllPanicsWithinMinutes(minutes);
            return list;
        });
    }
    static findAllPanics() {
        return __awaiter(this, void 0, void 0, function* () {
            const CommuterPanicModel = new commuter_panic_1.default().getModelForClass(commuter_panic_1.default);
            const list = yield CommuterPanicModel.findAllPanics();
            return list;
        });
    }
}
exports.CommuterPanicHelper = CommuterPanicHelper;
//# sourceMappingURL=commuter_panic_helper.js.map