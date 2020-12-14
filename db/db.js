const uri = process.env.URI;
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri, { useUnifiedTopology: true });
let database;

async function connectDb(){
    await client.connect();
    // Establish and verify connection
    database = await client.db("BookStore");
    console.log('Db connected!');
}

console.log('RUNNING DB...');

connectDb();

const db = () => database;

module.exports.db = db;