"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const define_sequelize_db_1 = __importDefault(require("./define-sequelize-db"));
const LocationModel = define_sequelize_db_1.default.define('locations', {
    id: { type: sequelize_1.default.INTEGER, autoIncrement: true, primaryKey: true },
    company_token: { type: sequelize_1.default.TEXT },
    uuid: { type: sequelize_1.default.TEXT },
    device_id: { type: sequelize_1.default.TEXT },
    device_model: { type: sequelize_1.default.TEXT },
    latitude: { type: sequelize_1.default.DOUBLE },
    longitude: { type: sequelize_1.default.DOUBLE },
    accuracy: { type: sequelize_1.default.INTEGER },
    altitude: { type: sequelize_1.default.REAL },
    speed: { type: sequelize_1.default.REAL },
    heading: { type: sequelize_1.default.REAL },
    odometer: { type: sequelize_1.default.REAL },
    event: { type: sequelize_1.default.TEXT },
    activity_type: { type: sequelize_1.default.TEXT },
    activity_confidence: { type: sequelize_1.default.INTEGER },
    battery_level: { type: sequelize_1.default.REAL },
    battery_is_charging: { type: sequelize_1.default.BOOLEAN },
    is_moving: { type: sequelize_1.default.BOOLEAN },
    geofence: { type: sequelize_1.default.TEXT },
    provider: { type: sequelize_1.default.TEXT },
    extras: { type: sequelize_1.default.TEXT },
    recorded_at: { type: sequelize_1.default.DATE },
    created_at: { type: sequelize_1.default.DATE },
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['recorded_at'],
        },
        {
            fields: ['company_token'],
        },
        {
            fields: ['device_id'],
        },
        {
            fields: ['company_token', 'device_id', 'recorded_at'],
        },
    ],
});
exports.default = LocationModel;
//# sourceMappingURL=LocationModel.js.map