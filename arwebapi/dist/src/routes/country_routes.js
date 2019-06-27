"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const country_helper_1 = require("../helpers/country_helper");
const util_1 = tslib_1.__importDefault(require("./util"));
class CountryExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓 🏓 🏓 🏓 🏓    CountryExpressRoutes: 💙  setting up default Country related express routes ...`);
        app.route("/addCountry").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /addCountry requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield country_helper_1.CountryHelper.addCountry(req.body.name, req.body.countryCode);
                res.status(200).json({
                    message: `🏓  🏓  🏓  addCountry: ${req.body.CountryReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addCountry failed");
            }
        }));
        app.route("/getCountries").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getCountries requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield country_helper_1.CountryHelper.getCountries();
                res.status(200).json({
                    message: `🏓  🏓  🏓  getCountries: ${result.length} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getCountries failed");
            }
        }));
        app.route("/getCountryCities").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getCountryCities requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield country_helper_1.CityHelper.getCities(req.body.countryID);
                res.status(200).json({
                    message: `🏓  🏓 getCountryCities:  found: ${result.length}: ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: "👿👿👿👿👿👿 getCountryCities failed",
                });
            }
        }));
        //
        app
            .route("/findCitiesByLocation")
            .post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /findCitiesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}  💦`);
            try {
                const result = yield country_helper_1.CityHelper.findCitiesByLocation(parseFloat(req.body.latitude), parseFloat(req.body.longitude), parseFloat(req.body.radiusInKM));
                res.status(200).json({
                    message: `🏓  🏓  findCitiesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "findCitiesByLocation failed");
            }
        }));
    }
}
exports.CountryExpressRoutes = CountryExpressRoutes;
// mongo "mongodb+srv://ar001-1xhdt.mongodb.net/ardb" --username aubs
//# sourceMappingURL=country_routes.js.map