import mongoose from "mongoose";
import { Db } from "mongodb";
import {log} from './log';
import MongoListeners from './helpers/listeners';
import MongooseDebugSetting from "./helpers/mongoose_debug";
import Messaging from "./helpers/messaging";

const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
log(mongoConnectionString);

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(mongoConnectionString, {maxPoolSize: 2000})
  .then((client) => {
   console.log(
      `\n🔆🔆  Mongoose has connected MongoDB Atlas ... 🔆 ${new Date()} `,
    );
    
    console.log(
      `\n🍎  Mongo Client version: 💙 ${client.version} 💙 model names: ${
        JSON.stringify(client.modelNames())
      }  🍎 `,
    );
    console.log(
      `🍎  MongoDB configuration ... \n 💙 ${JSON.stringify(
        mongoose.connection.config,
      )} 💙`,
    );

    MongooseDebugSetting.setDebug();
    Messaging.init();
    MongoListeners.listen(client);

    console.log(`🍎 🍎 🍎 MongoDB Atlas collections up and running! 🍎 ... waiting to be of service!!`);
    // console.log(mongoose.connection.collections.length);
    
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