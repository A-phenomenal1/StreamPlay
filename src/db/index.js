const mongodb = require("mongodb");
const { mongoURI, databaseName } = require("../config/keys");

async function makeDb() {
  const MongoClient = mongodb.MongoClient;
  const url = mongoURI;
  const dbName = databaseName;
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = await client.db(dbName);
  db.makeId = makeIdFromString;
  return db;
}
function makeIdFromString(id) {
  return new mongodb.ObjectID(id);
}

const database = makeDb();
module.exports = database;
