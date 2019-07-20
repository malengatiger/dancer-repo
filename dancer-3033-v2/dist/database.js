"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = __importDefault(require("./log"));
const listeners_1 = __importDefault(require("./helpers/listeners"));
const messaging_1 = __importDefault(require("./helpers/messaging"));
const port = process.env.PORT || "8083";
const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const appName = "AR MongoDB API";
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(mongoConnectionString, {
    useNewUrlParser: true,
})
    .then((client) => {
    log_1.default(`\n🔆🔆🔆🔆🔆🔆  Mongo connected ... 🔆🔆🔆  💛  ${new Date()}  💛 💛`);
    log_1.default(`\n🍎🍎  ${appName} :: database:  ☘️  Mongo Client version: 💙${client.version} 💙 model names: ${JSON.stringify(client.modelNames())}  ☘️  is OK   🍎🍎 `);
    log_1.default(`🍎🍎🍎  MongoDB config ...${JSON.stringify(mongoose_1.default.connection.config)}`);
    messaging_1.default.init();
    listeners_1.default.listen(client);
    console.log(`🍎🍎🍎  MongoDB collections available ...`);
    console.log(mongoose_1.default.connection.collections);
})
    .catch((err) => {
    console.error(err);
});
class Database {
    get() {
        const db = mongoose_1.default.connection.db;
        log_1.default(`Database returned: ${db.databaseName}`);
    }
}
exports.Database = Database;
exports.default = Database;
//# sourceMappingURL=database.js.map