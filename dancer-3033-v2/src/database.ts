import mongoose from "mongoose";
import { Db } from "mongodb";
import { log } from "./log";
import MongoListeners from "./helpers/listeners";
import MongooseDebugSetting from "./helpers/mongoose_debug";
import Messaging from "./helpers/messaging";
import Landmark from "./models/landmark";
import Association from "./models/association";

const password = process.env.MONGODB_PASSWORD || "xxxxx";
const user = process.env.MONGODB_USER || "xxxx";
const mongoSuffix = process.env.MONGO_SUFFIX || "xxxx";
const mongoConnectionString = `mongodb+srv://${user}:${password}${mongoSuffix}`;

log(`Check mongoConnectionString : ${mongoConnectionString}`);

mongoose.Promise = global.Promise;
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useUnifiedTopology", true);
mongoose.set("autoIndex", false);
mongoose
  .connect(mongoConnectionString, { maxPoolSize: 2000 })
  .then((client) => {
    console.log(
      `\n🔆🔆  Mongoose has connected MongoDB Atlas ... 🔆 ${new Date()} `
    );

    console.log(
      `\n🍎  Mongo Client version: 💙 ${
        client.version
      } 💙 model names: ${JSON.stringify(client.modelNames())}  🍎 `
    );
  
    // MongooseDebugSetting.setDebug();
    Messaging.init();
    // MongoListeners.listen(client);

    console.log(
      `🍎 🍎 🍎 MongoDB Atlas collections up and running! 🍎 ... waiting to be of service!!`
    );
    getAssociations();
  })
  .catch((err) => {
    console.error(err);
  });

export class Database {
  public static async get(): Promise<Db> {
    const db: Db = mongoose.connection.db;
    log(`Database returned: ${db.databaseName}`);
    return db;
  }
}
//
async function getAssociations() {
  try {
    console.log(`🍎 🍎 🍎 getAssociations - test MongoDB connection ... 🍎`);
    const asses: any[] = await Association.find();
    console.log(`🍎 🍎 🍎 getAssociations found 👽 ${asses.length} 👽 taxi associations on database `);
    let cnt = 1;
    asses.forEach((association) => {
      console.log(`Association #${cnt} 🍎 ${association.associationName} `);
      cnt++
    });
  } catch (err) {
    console.log(err);
  }
}

export default Database;
