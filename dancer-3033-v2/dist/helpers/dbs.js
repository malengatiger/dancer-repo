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
const database_1 = __importDefault(require("../database"));
const database2_1 = __importDefault(require("../database2"));
class DBS {
    static fixRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('................. fixRoutes');
            const routes = yield database_1.default.get();
            const routes2 = yield database2_1.default.get();
            console.log(routes);
            console.log(routes2);
        });
    }
}
exports.default = DBS;
//# sourceMappingURL=dbs.js.map