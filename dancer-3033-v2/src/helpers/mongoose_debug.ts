import mongoose from 'mongoose';
import { log } from 'util';
const debug = process.env.DEBUG || 'false';
class MongooseDebugSetting {
    
    static setDebug() {
        if (debug == 'true') {
            mongoose.set('debug', true)
            log(`\n\n🧡🧡🧡 MongooseDebugSetting 👽👽👽 set for Mongoose, we are in 🍎 DEBUG 🍎 mode 🧡🧡🧡\n`)
        } else {
            mongoose.set('debug', false)
            log(`\n\n🧡🧡🧡 MongooseDebugSetting 👽👽👽 set for Mongoose, we are in  💙 💙 💙 PRODUCTION  💙 💙 💙 mode 🧡🧡🧡\n`)
        }
    }
}
export default MongooseDebugSetting;