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
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = require("./log");
const mongoose_debug_1 = __importDefault(require("./helpers/mongoose_debug"));
const messaging_1 = __importDefault(require("./helpers/messaging"));
const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
/*
const mongoose = require("mongoose");
    const mongoDB = 'mongodb://localhost/playground';
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(mongoDB).then(() =>
    console.log("Connected to mongoDB..."))
    .catch(err => console.error(err.message));;
*/
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.set('useNewUrlParser', true);
mongoose_1.default.set('useUnifiedTopology', true);
mongoose_1.default
    .connect(mongoConnectionString)
    .then((client) => {
    log_1.log(`\n🔆🔆  Mongo connected ... 🔆 ${new Date()} `);
    log_1.log(`\n🍎🍎  Mongo Client version: 💙${client.version} 💙 model names: ${JSON.stringify(client.modelNames())}  ☘️  is OK   🍎🍎 `);
    log_1.log(`🍎🍎🍎  MongoDB config ...${JSON.stringify(mongoose_1.default.connection.config)}`);
    mongoose_debug_1.default.setDebug();
    messaging_1.default.init();
    //MongoListeners.listen(client);
    console.log(`🍎🍎🍎  MongoDB collections available ...`);
    console.log(mongoose_1.default.connection.collections);
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