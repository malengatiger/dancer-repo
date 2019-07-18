"use strict";
// declare const mlog = {
//     info: function (info: string) { 
//         console.log('Info: ' + info);
//     },
//     warning:function (warning: string) { 
//         console.log('Warning: ' + warning);
//     },
//     error:function (error: string) { 
//         console.log('Error: ' + error);
//     }
// };
Object.defineProperty(exports, "__esModule", { value: true });
// module.exports = mlog
function log(msg) {
    // this function can be accessed from outside the module
    console.log(msg);
}
exports.default = log;
//# sourceMappingURL=log.js.map