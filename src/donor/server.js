const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { MongoClient } = require('mongodb'); // Import MongoClient
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static("public"));

const blockchain = new Blockchain();

// MongoDB connection details
const uri = 'mongodb://localhost:27017'; // MongoDB connection string
const client = new MongoClient(uri);

// Database and collection names
const dbName = 'Transplant';
const donorCollectionName = 'Donor';

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

// Endpoint to fetch donor data from MongoDB
app.get("/getDonors", async (req, res) => {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(donorCollectionName);

    // Fetch all documents from the collection
    const donors = await collection.find({}).toArray();

    // Map the data to the correct format
    const formattedDonors = donors.map(donor => ({
      name: donor.name,
      age: donor.age,
      gender: donor.gender,
      bloodType: donor.bloodType,
      phone: donor.phone,
      email: donor.email,
      address: donor.address,
      medicalHistory: donor.medicalHistory,
      consent: donor.consent
    }));

    res.json(formattedDonors); // Send the formatted data as JSON
  } catch (error) {
    console.error('Error fetching donor data:', error);
    res.status(500).json({ message: 'Error fetching donor data', error });
  } finally {
    await client.close();
  }
});




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});