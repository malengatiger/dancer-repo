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
const define_sequelize_db_1 = __importDefault(require("./define-sequelize-db"));
const LocationModel_1 = __importDefault(require("./LocationModel"));
/**
 * Init / create location table
 */
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mlog(`🔵🔵 initializing database for background location ...`);
            yield define_sequelize_db_1.default.authenticate();
            mlog(`🔵🔵 database for background location initialized 🍎`);
        }
        catch (err) {
            console.log('Unable to connect to the database:', err);
        }
        try {
            yield LocationModel_1.default.sync({ alter: true });
            mlog(`🔵🔵 LocationModel.sync executed with alter: true 🍎🍎🍎🍎`);
        }
        catch (err) {
            console.log('Unable to sync database:', err);
        }
    });
}
exports.default = initializeDatabase;
//# sourceMappingURL=initializeDatabase.js.map