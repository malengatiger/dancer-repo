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
const city_1 = __importDefault(require("../models/city"));
const country_1 = __importDefault(require("../models/country"));
const log_1 = __importDefault(require("../log"));
const v1_1 = __importDefault(require("uuid/v1"));
class CityController {
    routes(app) {
        console.log(`🏓🏓🏓    CityController:  💙  setting up default City routes ...`);
        app.route("/addCity").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 addCity requested `;
            console.log(msg);
            try {
                const c = new city_1.default(req.body);
                c.cityID = v1_1.default();
                c.created = new Date().toISOString();
                const result = yield c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCity failed'
                });
            }
        }));
        app.route("/addCountry").post((req, res) => {
            const msg = `🌽🌽🌽 addCountry requested `;
            console.log(msg);
            try {
                const c = new country_1.default(req.body);
                c.countryID = v1_1.default();
                c.created = new Date().toISOString();
                const result = c.save();
                // log(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addCountry failed'
                });
            }
        });
        app.route("/findCitiesByLocation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 findCitiesByLocation requested `;
            log_1.default(msg);
            try {
                const now = new Date().getTime();
                const latitude = parseFloat(req.body.latitude);
                const longitude = parseFloat(req.body.longitude);
                const RADIUS = parseFloat(req.body.radiusInKM) * 1000;
                const result = yield city_1.default.find({
                    position: {
                        $near: {
                            $geometry: {
                                coordinates: [longitude, latitude],
                                type: "Point",
                            },
                            $maxDistance: RADIUS,
                        },
                    },
                });
                // log(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 findCitiesByLocation failed'
                });
            }
        }));
        app.route("/getCitiesByCountry").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCitiesByCountry requested `;
            log_1.default(msg);
            try {
                const now = new Date().getTime();
                const result = yield city_1.default.find({ countryID: req.body.countryID });
                // log(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCitiesByCountry failed'
                });
            }
        }));
        app.route("/getCitiesByProvinceName").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCitiesByProvinceName requested `;
            log_1.default(msg);
            try {
                const now = new Date().getTime();
                const result = yield city_1.default.find({ provinceName: req.body.provinceName });
                // log(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCitiesByProvinceName failed'
                });
            }
        }));
        app.route("/getCountries").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🌽🌽🌽 getCountries requested `;
            log_1.default(msg);
            try {
                const now = new Date().getTime();
                const result = yield country_1.default.find();
                // log(result);
                const end = new Date().getTime();
                log_1.default(`🔆🔆🔆 elapsed time: 💙 ${end / 1000 - now / 1000} 💙seconds for query`);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getCountries failed'
                });
            }
        }));
    }
}
exports.CityController = CityController;
//# sourceMappingURL=city_controller.js.map