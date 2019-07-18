"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static sendError(res, err, message) {
        console.log(`\n\n 🍎🍎 ERROR 🍔 ERROR 🍔 ERROR 🍔 ERROR 🍔 ERROR 🍔 ERROR : 🍎🍎 SENDING: ${message}`);
        console.error(err);
        res.status(400).json({
            error: err,
            message,
        });
        return;
    }
}
exports.default = Util;
//# sourceMappingURL=util.js.map