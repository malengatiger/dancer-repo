"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = require("./log");
const listeners_1 = __importDefault(require("./helpers/listeners"));
const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(mongoConnectionString, {
    useNewUrlParser: true,
})
    .then((client) => {
    log_1.log(`\n🔆🔆🔆  Mongo connected ... 🔆 ${new Date()} `);
    // log(
    //   `\n🍎🍎  ${appName} :: database:  ☘️  Mongo Client version: 💙${client.version} 💙 model names: ${
    //     JSON.stringify(client.modelNames())
    //   }  ☘️  is OK   🍎🍎 `,
    // );
    // log(
    //   `🍎🍎🍎  MongoDB config ...${JSON.stringify(
    //     mongoose.connection.config,
    //   )}`,
    // );
    // MongooseDebugSetting.setDebug();
    // Messaging.init();
    listeners_1.default.listen(client);
    // console.log(`🍎🍎🍎  MongoDB collections available ...`);
    // console.log(mongoose.connection.collections);
})
    .catch((err) => {
    console.error(err);
});
class Database {
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = mongoose_1.default.connection.db;
            log_1.log(`Database returned: ${db.databaseName}`);
            return db;
        });
    }
}
exports.Database = Database;
exports.default = Database;
//# sourceMappingURL=database.js.map