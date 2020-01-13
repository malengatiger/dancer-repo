"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const path_1 = __importDefault(require("path"));
// ENVIRONMENT VARIABLES :
// PORT (optional, defaulted to 8080) : http port server will listen to
// DB_CONNECTION_URL (defaulted to "sqlite://db/background-geolocation.db") : connection url used to connect to a db
//    Currently, only postgresql & sqlite dialect are supported
//    Sample pattern for postgresql connection url : postgres://<username>:<password>@<hostname>:<port>/<dbname>
exports.default = new sequelize_1.default(process.env.DATABASE_URL || { dialect: 'sqlite', storage: path_1.default.resolve(__dirname, 'db', 'background-geolocation.db') });
//# sourceMappingURL=define-sequelize-db.js.map