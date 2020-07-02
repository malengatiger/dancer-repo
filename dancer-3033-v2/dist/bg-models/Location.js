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
exports.deleteLocations = exports.createLocation = exports.getLatestLocation = exports.getLocations = exports.getStats = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const LocationModel_1 = __importDefault(require("../database/LocationModel"));
const sequelize_2 = require("sequelize");
const Op = sequelize_1.default.Op;
const filterByCompany = !!process.env.SHARED_DASHBOARD;
function hydrate(record) {
    if (record.geofence) {
        record.geofence = JSON.parse(record.geofence);
    }
    if (record.provider) {
        record.provider = JSON.parse(record.provider);
    }
    if (record.extras) {
        record.extras = JSON.parse(record.extras);
    }
    return record;
}
function getStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const minDate = yield LocationModel_1.default.min('created_at');
        const maxDate = yield LocationModel_1.default.max('created_at');
        const total = yield LocationModel_1.default.count();
        return {
            minDate,
            maxDate,
            total,
        };
    });
}
exports.getStats = getStats;
function getLocations(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var whereConditions = {};
        if (params.start_date && params.end_date) {
            whereConditions.recorded_at = { [Op.between]: [new Date(params.start_date), new Date(params.end_date)] };
        }
        whereConditions.device_id = params.device_id || '';
        if (filterByCompany) {
            whereConditions.company_token = params.company_token;
        }
        const rows = yield LocationModel_1.default.findAll({
            where: whereConditions,
            order: sequelize_2.literal('recorded_at DESC'),
            limit: params.limit
        });
        const locations = rows.map(hydrate);
        return locations;
    });
}
exports.getLocations = getLocations;
function getLatestLocation(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var whereConditions = {
            device_id: params.device_id,
        };
        if (filterByCompany) {
            whereConditions.company_token = params.company_token;
        }
        const row = yield LocationModel_1.default.findOne({
            where: whereConditions,
            order: sequelize_2.literal('recorded_at DESC'),
        });
        const result = row ? hydrate(row) : null;
        return result;
    });
}
exports.getLatestLocation = getLatestLocation;
function createLocation(params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`🏈 🏈 🏈 🏈 🏈 createLocation params: ${params} :  ${new Date().toISOString()}`);
        if (!params) {
            return;
        }
        if (Array.isArray(params)) {
            for (let location of params) {
                yield createLocation(location);
            }
            return;
        }
        const location = params.location;
        const device = params.device || { model: 'UNKNOWN' };
        // Considering we're always working with locations array
        const locations = location.length ? location : [location];
        for (let location of locations) {
            const coords = location.coords;
            const battery = location.battery || { level: null, is_charging: null };
            const activity = location.activity || { type: null, confidence: null };
            const geofence = location.geofence ? JSON.stringify(location.geofence) : null;
            const provider = location.provider ? JSON.stringify(location.provider) : null;
            const extras = location.extras ? JSON.stringify(location.extras) : null;
            const now = new Date();
            const uuid = device.framework ? device.framework + '-' + device.uuid : device.uuid;
            const model = device.framework ? device.model + ' (' + device.framework + ')' : device.model;
            yield LocationModel_1.default.create({
                uuid: location.uuid,
                company_token: params.company_token || null,
                device_id: uuid,
                device_model: model,
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: parseInt(coords.accuracy, 10),
                altitude: coords.altitude,
                speed: coords.speed,
                heading: coords.heading,
                odometer: location.odometer,
                event: location.event,
                activity_type: activity.type,
                activity_confidence: activity.confidence,
                battery_level: battery.level,
                battery_is_charging: battery.is_charging,
                is_moving: location.is_moving,
                geofence: geofence,
                provider: provider,
                extras: extras,
                recorded_at: location.timestamp,
                created_at: now,
            });
        }
    });
}
exports.createLocation = createLocation;
function deleteLocations(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var whereConditions = {};
        if (params && params.deviceId) {
            whereConditions.device_id = params.deviceId;
        }
        if (params && params.start_date && params.end_date) {
            whereConditions.recorded_at = { $between: [params.start_date, params.end_date] };
        }
        if (filterByCompany) {
            whereConditions.company_token = params.company_token;
        }
        if (!Object.keys(whereConditions).length) {
            throw new Error('Missing some location deletion constraints');
        }
        yield LocationModel_1.default.destroy({ where: whereConditions });
    });
}
exports.deleteLocations = deleteLocations;
//# sourceMappingURL=Location.js.map