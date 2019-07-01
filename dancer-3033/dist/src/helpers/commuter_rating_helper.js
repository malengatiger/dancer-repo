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
const commuter_rating_1 = __importDefault(require("../models/commuter_rating"));
class CommuterRatingHelper {
    static onCommuterRatingAdded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`\n👽 👽 👽 onCommuterRatingChangeEvent: operationType: 👽 👽 👽  ${event.operationType}, 🍎  `);
        });
    }
    static addCommuterRating(commuterRequestId, rating, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterRatingModel = new commuter_rating_1.default().getModelForClass(commuter_rating_1.default);
            const mRating = new commuterRatingModel({
                commuterRequestId,
                rating,
                userId,
            });
            const m = yield mRating.save();
            console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  CommuterRating added  for: 🍎  ${mRating.userId} \n\n`);
            console.log(mRating);
            return m;
        });
    }
    static findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterRatingModel = new commuter_rating_1.default().getModelForClass(commuter_rating_1.default);
            const list = yield commuterRatingModel.findByUser(user);
            return list;
        });
    }
    static findAll(minutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const commuterRatingModel = new commuter_rating_1.default().getModelForClass(commuter_rating_1.default);
            const list = yield commuterRatingModel.findAll(minutes);
            return list;
        });
    }
}
exports.CommuterRatingHelper = CommuterRatingHelper;
//# sourceMappingURL=commuter_rating_helper.js.map