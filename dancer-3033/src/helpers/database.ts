const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const MongoClient = require('mongodb').MongoClient;
const mongoConnectionString = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
const client = new MongoClient(mongoConnectionString, { useNewUrlParser: true });
client.connect((err: any) => {
  console.log('are we connected ????');
  const collection: any = client.db("monitordb").collection("routes");
  console.log(`🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦 ${collection}`);
  // perform actions on the collection object
  //client.close();
});
let mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'fcc-Mail';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(mongoConnectionString)
       .then(() => {
         console.log('🌀🌀🌀🌀🌀🌀🌀Database connection successful')
       })
       .catch((err: any) => {
         console.error(' 🍎🍎 🍎🍎 🍎🍎 Database connection error')
         console.error(err);
       })
  }
}

module.exports = new Database()