"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const util_1 = require("util");
const debug = process.env.DEBUG || 'false';
class MongooseDebugSetting {
    static setDebug() {
        if (debug == 'true') {
            mongoose_1.default.set('debug', true);
            util_1.log(`\n\n🧡🧡🧡 MongooseDebugSetting 👽👽👽 set for Mongoose, we are in 🍎 DEBUG 🍎 mode 🧡🧡🧡\n`);
        }
        else {
            mongoose_1.default.set('debug', false);
            util_1.log(`\n\n🧡🧡🧡 MongooseDebugSetting 👽👽👽 set for Mongoose, we are in  💙 💙 💙 PRODUCTION  💙 💙 💙 mode 🧡🧡🧡\n`);
        }
    }
}
exports.default = MongooseDebugSetting;
//# sourceMappingURL=mongoose_debug.js.map