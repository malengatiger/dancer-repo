"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../log"));
const association_1 = __importDefault(require("../models/association"));
class AssociationController {
    routes(app) {
        log_1.default(`🏓🏓🏓🏓🏓    AssociationController: 💙  setting up default Association routes ... `);
        /////////
        app.route("/getAssociations").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /getAssociations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const asses = yield association_1.default.find();
                res.status(200).json(asses);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 getRoutes failed'
                });
            }
        }));
        app.route("/addAssociation").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            log_1.default(`\n\n💦  POST: /addAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`);
            console.log(req.body);
            try {
                const association = new association_1.default(req.body);
                const result0 = yield association.save();
                association.associationID = result0._id;
                const result = yield association.save();
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addAssociation failed'
                });
            }
        }));
    }
}
exports.AssociationController = AssociationController;
exports.default = AssociationController;
//# sourceMappingURL=assoc_controller.js.map