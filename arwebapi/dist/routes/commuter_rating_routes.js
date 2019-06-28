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
const commuter_rating_helper_1 = require("../helpers/commuter_rating_helper");
const util_1 = __importDefault(require("../util"));
class CommuterRatingExpressRoutes {
    routes(app) {
        console.log(`\n\n🏓🏓🏓🏓🏓    CommuterRatingExpressRoutes:  💙  setting up default CommuterRating Routes ...`);
        app.route("/addCommuterRating").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓🏓🏓  addCommuterRating route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_rating_helper_1.CommuterRatingHelper.addCommuterRating(req.body.commuterRequestId, req.body.rating, req.body.userId);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "addCommuterRating failed");
            }
        }));
        app.route("/findCommuterRatingsByUser").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findCommuterRatingsByUser route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_rating_helper_1.CommuterRatingHelper.findByUser(req.body.user);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findCommuterRatingsByUser failed");
            }
        }));
        app.route("/findAllCommuterRatings").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const msg = `🏓  🏓  🏓  findAllCommuterRatings route picked   🌽 ${new Date().toISOString()}`;
            console.log(msg);
            try {
                const result = yield commuter_rating_helper_1.CommuterRatingHelper.findAll(req.body.minutes);
                res.status(200).json(result);
            }
            catch (e) {
                util_1.default.sendError(res, e, "findAllCommuterRatings failed");
            }
        }));
    }
}
exports.CommuterRatingExpressRoutes = CommuterRatingExpressRoutes;
//# sourceMappingURL=commuter_rating_routes.js.map