import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://cbottcher:Champa2004@clara.tk5a4x6.mongodb.net/";

const client = new MongoClient(connectionString);

let conn;
try {
  // Try
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("travelsaver");

export default db;
