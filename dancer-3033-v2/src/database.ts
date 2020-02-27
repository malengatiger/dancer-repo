import mongoose, { Connection } from "mongoose";
import { Db } from "mongodb";
import {log} from './log';
import MongoListeners from './helpers/listeners';
import Messaging from "./helpers/messaging";
import MongooseDebugSetting from './helpers/mongoose_debug'
const port = process.env.PORT || "8083";
const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const appName = "AR MongoDB API";
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
mongoose.Promise = global.Promise;
mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
  })
  .then((client) => {
    log(
      `\n🔆🔆🔆🔆🔆🔆  Mongo connected ... 🔆🔆🔆  💛  ${new Date()}  💛 💛`,
    );
    log(
      `\n🍎🍎  ${appName} :: database:  ☘️  Mongo Client version: 💙${client.version} 💙 model names: ${
        JSON.stringify(client.modelNames())
      }  ☘️  is OK   🍎🍎 `,
    );
    log(
      `🍎🍎🍎  MongoDB config ...${JSON.stringify(
        mongoose.connection.config,
      )}`,
    );
    MongooseDebugSetting.setDebug();
    Messaging.init();
    MongoListeners.listen(client);
    console.log(`🍎🍎🍎  MongoDB collections available ...`);
    console.log(mongoose.connection.collections);
    
  })
  .catch((err) => {
    console.error(err);
  });
  

export class Database {
    public static async get() : Promise<Db>{
        const db: Db = mongoose.connection.db;
        log(`Database returned: ${db.databaseName}`);
        return db;
    }
}
export default Database;