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
const LocationModel_1 = __importDefault(require("../database/LocationModel"));
const sequelize_1 = require("sequelize");
const filterByCompany = !!process.env.SHARED_DASHBOARD;
const adminCompanyToken = process.env.ADMIN_TOKEN;
function getCompanyTokens(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!filterByCompany) {
            return [
                {
                    company_token: 'bogus',
                },
            ];
        }
        const isAdmin = params.company_token === adminCompanyToken && adminCompanyToken;
        const whereConditions = isAdmin ? {} : { company_token: params.company_token };
        const result = yield LocationModel_1.default.findAll({
            where: whereConditions,
            attributes: ['company_token'],
            group: ['company_token'],
            order: sequelize_1.literal('min(created_at) desc'),
        });
        return result;
    });
}
exports.getCompanyTokens = getCompanyTokens;
//# sourceMappingURL=CompanyToken.js.map