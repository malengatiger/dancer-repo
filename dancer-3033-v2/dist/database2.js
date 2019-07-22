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
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = __importDefault(require("./log"));
const port = process.env.PORT || "8083";
const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const appName = "AR MongoDB API";
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/aftarobot?retryWrites=true`;
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(mongoConnectionString, {
    useNewUrlParser: true,
})
    .then((client) => {
    log_1.default(`\n🔆🔆🔆🔆🔆🔆  Database2: Mongo connected ... 🔆🔆🔆  💛  ${new Date()}  💛 💛`);
    log_1.default(`\n🍎🍎  ${appName} :: Database2::  ☘️  Mongo Client version: 💙${client.version} 💙 model names: ${JSON.stringify(client.modelNames())}  ☘️  is OK   🍎🍎 `);
    log_1.default(`🍎🍎🍎  Database2: MongoDB config ...${JSON.stringify(mongoose_1.default.connection.config)}`);
    //Messaging.init();
    //MongoListeners.listen(client);
    console.log(`🍎🍎🍎  Database2 MongoDB collections available ...`);
    console.log(mongoose_1.default.connection.collections);
})
    .catch((err) => {
    console.error(err);
});
class Database2 {
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = mongoose_1.default.connection.db;
            log_1.default(`Database2: returned: ${db.databaseName}`);
            return db;
        });
    }
}
exports.Database2 = Database2;
exports.default = Database2;
//# sourceMappingURL=database2.js.map