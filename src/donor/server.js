const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const mongoose = require('mongoose');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static("public"));

const blockchain = new Blockchain();

// Endpoint to add data to the blockchain
app.post("/addData", async (req, res) => {
  const { data } = req.body;
  await blockchain.addBlock(data);
  res.json({ message: "Data added to the blockchain!" });
});

// Endpoint to view the blockchain
app.get("/donorchain", async (req, res) => {
  res.json(blockchain.chain);
});

app.get("/receiverchain", async (req, res) => {
  res.json(blockchain.chain);
});

async function fetchDonors() {
  const uri = 'mongodb://localhost:27017/Connection_Practice'; // MongoDB connection string
  const client = new MongoClient(uri);

  try {
      await client.connect();
      const database = client.db('Transplant'); // Database name
      const collection = database.collection('Donor'); // Collection name

      // Fetch all documents from the collection
      const donors = await collection.find({}).toArray();
      console.log(donors);
  } finally {
      await client.close();
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
