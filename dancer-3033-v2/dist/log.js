"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logGreen = exports.logBlue = exports.log = void 0;
const chalk = require("chalk");
function log(msg) {
    console.log(msg);
}
exports.log = log;
function logBlue(msg) {
    console.log(chalk.blue(msg));
}
exports.logBlue = logBlue;
function logGreen(msg) {
    console.log(chalk.green(msg));
}
exports.logGreen = logGreen;
//# sourceMappingURL=log.js.map