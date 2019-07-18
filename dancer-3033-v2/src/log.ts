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

// module.exports = mlog

export default function log(msg: any) {
    // this function can be accessed from outside the module
    console.log(msg);
  }