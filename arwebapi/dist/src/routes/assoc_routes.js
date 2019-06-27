"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const association_helper_1 = require("../helpers/association_helper");
const util_1 = tslib_1.__importDefault(require("./util"));
class AssociationExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓🏓🏓🏓🏓    AssociationExpressRoutes:  💙  setting up default assoc route ...`);
        app.route("/addAssociation").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /associations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const result = yield association_helper_1.AssociationHelper.addAssociation(req.body.name, req.body.email, req.body.cellphone, req.body.countryID, req.body.countryName);
                console.log("about to return result from Helper ............");
                res.status(200).json({
                    message: `🏓  🏓  🏓  association: ${req.body.name} : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "addAssociation failed");
            }
        }));
        app.route("/getAssociations").post((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`\n\n💦  POST: /getAssociations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            try {
                const result = yield association_helper_1.AssociationHelper.getAssociations();
                res.status(200).json({
                    message: `🏓  🏓  🏓  getAssociations OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
                    result,
                });
            }
            catch (err) {
                util_1.default.sendError(res, err, "getAssociations failed");
            }
        }));
    }
}
exports.AssociationExpressRoutes = AssociationExpressRoutes;
exports.default = AssociationExpressRoutes;
//# sourceMappingURL=assoc_routes.js.map