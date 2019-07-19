import mongoose from "mongoose";
import { Db } from "mongodb";
import log from './log';
const port = process.env.PORT || "8083";
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
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
    
    // MongoListeners.listen(client);
    console.log(`🍎🍎🍎  MongoDB collections available ...`);
    console.log(mongoose.connection.collections);
  })
  .catch((err) => {
    console.error(err);
  });

export class Database {
    public get() {
        const db: Db = mongoose.connection.db;
        log(`Database returned: ${db.databaseName}`);
    }
}
export default Database;