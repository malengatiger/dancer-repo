"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const geolib_1 = require("geolib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const v1_1 = tslib_1.__importDefault(require("uuid/v1"));
const city_1 = tslib_1.__importDefault(require("../models/city"));
const Country_1 = tslib_1.__importDefault(require("../models/Country"));
class CountryHelper {
    static onCountryAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`Country event has occured ....`);
            console.log(event);
            console.log(`operationType: 👽 👽 👽  ${event.operationType},  Country in stream:   🍀   🍀  ${event.fullDocument.name} 🍎
      _id: ${event.fullDocument._id} 🍎 `);
        });
    }
    static addCountry(name, countryCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n🌀  🌀  🌀  CountryHelper: addCountry   🍀   ${name}   🍀 \n`);
            if (!countryCode) {
                countryCode = "TBD";
            }
            if (name === "South Africa") {
                countryCode = "ZA";
            }
            const CountryModel = new Country_1.default().getModelForClass(Country_1.default);
            const countryID = v1_1.default();
            const u = new CountryModel({
                countryCode,
                countryID,
                name,
            });
            const m = yield u.save();
            return m;
        });
    }
    static getCountries() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(` 🌀 getCountries ....   🌀  🌀  🌀 `);
            const CountryModel = new Country_1.default().getModelForClass(Country_1.default);
            const list = yield CountryModel.find();
            return list;
        });
    }
}
exports.CountryHelper = CountryHelper;
// tslint:disable-next-line: max-classes-per-file
class CityHelper {
    static onCityAdded(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`City event has occured ....`);
            console.log(event);
            // tslint:disable-next-line: max-line-length
            console.log(`operationType: 👽 👽 👽  ${event.operationType},  City in stream:   🍀   🍀  ${event.fullDocument.name} 🍎  _id: ${event.fullDocument._id} 🍎 `);
        });
    }
    static addCity(name, provinceName, countryID, countryName, latitude, longitude) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cityModel = new city_1.default().getModelForClass(city_1.default);
            const position = {
                coordinates: [longitude, latitude],
                type: "Point",
            };
            const cityID = v1_1.default();
            const u = new cityModel({
                cityID,
                countryID,
                countryName,
                latitude,
                longitude,
                name,
                position,
                provinceName,
            });
            const m = yield u.save();
            console.log(`\n\n🌀  🌀  🌀  CityHelper: city added:   🍀   ${name} \n`);
            return m;
        });
    }
    static getCities(countryID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n🌀🌀🌀🌀  CountryHelper:  😡  getCities ....   🌀🌀🌀 `);
            const CityModel = new city_1.default().getModelForClass(city_1.default);
            const list = yield CityModel.find({ countryID });
            console.log(`😡  😡  😡  😡  😡  Done reading cities ....found:  ${list.length}`);
            return list;
        });
    }
    static findCitiesByLocation(latitude, longitude, radiusInKM) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n🌳 🌳 🌳  findCitiesByLocation: lat: ${latitude}  lng: ${longitude} 🌀 🌀 🌀`);
            const CityModel = new city_1.default().getModelForClass(city_1.default);
            const start = new Date().getTime();
            const RADIUS = radiusInKM * 1000;
            const mList = yield CityModel.find({
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
            const end = new Date().getTime();
            const elapsed = `${(end - start) / 1000} seconds elapsed`;
            console.log(`\n🍎 🍎 🍎 Cities found within: 🍎 ${radiusInKM *
                1000} metres:  🌳 🌳 🌳 ${mList.length} cities\n`);
            console.log(`🍎 🍎 🍎  geoQuery took:  ☘️  ${elapsed}  ☘️ \n`);
            let cnt = 0;
            mList.forEach((m) => {
                cnt++;
                console.log(`🍏  #${cnt} - ${m.name}  🔆  ${m.provinceName}  💙  ${m.countryName}`);
            });
            const d = moment_1.default().format("YYYY-MM-DDTHH:mm:ss");
            // tslint:disable-next-line: max-line-length
            console.log(`\n🍎 🍎 🍎 Done: radius: 🍎 ${radiusInKM * 1000} metres: 🌳 🌳 🌳 ${mList.length} cities. 💦 💦 💦 ${d}  \n\n`);
            const m = yield this.calculateDistances(mList, latitude, longitude);
            return m;
        });
    }
    static calculateDistances(cities, latitude, longitude) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const from = {
                latitude,
                longitude,
            };
            for (const m of cities) {
                const to = {
                    latitude: m.position.coordinates[1],
                    longitude: m.position.coordinates[0],
                };
                const dist = geolib_1.getDistance(from, to);
                const f = new Intl.NumberFormat("en-za", {
                    maximumSignificantDigits: 3,
                }).format(dist / 1000);
                m.distance = f + " km (as the crow flies)";
                console.log(`🌺  ${f} km 💛  ${m.name} 🍀 ${m.provinceName} 🌳 `);
            }
            console.log(`\n\n`);
            return cities;
        });
    }
}
exports.CityHelper = CityHelper;
//# sourceMappingURL=country_helper.js.map