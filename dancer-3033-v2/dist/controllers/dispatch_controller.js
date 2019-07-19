"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dispatch_record_1 = __importDefault(require("../models/dispatch_record"));
const log_1 = __importDefault(require("../log"));
class DispatchController {
    routes(app) {
        console.log(`🏓🏓🏓🏓🏓    DispatchController:  💙  setting up default Dispatch routes ...`);
        app.route("/addDispatchRecord").post((req, res) => {
            const msg = `🌽🌽🌽 addDispatchRecord requested `;
            console.log(msg);
            try {
                const result = new dispatch_record_1.default(req.body);
                log_1.default(result);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({
                    error: err,
                    message: ' 🍎🍎🍎🍎 addDispatchRecord failed'
                });
            }
        });
    }
}
exports.DispatchController = DispatchController;
//# sourceMappingURL=dispatch_controller.js.map