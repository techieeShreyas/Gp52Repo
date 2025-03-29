const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const client = new MongoClient(uri);

// Database and collection names
var dbName = 'Transplant';
var donorcollectionName = 'Donor';
var receivercollectionName = 'Receiver';

async function connectToMongoDB() {
  try {
    await client.connect();
    // console.log('Connected to MongoDB');
    const db = client.db(dbName);
    return db.collection(donorcollectionName);
    // if(name == donor){
    //   return db.collection(donorcollectionName);
    // }
    // else{
    //   return db.collection(receivercollectionName);
    // }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;